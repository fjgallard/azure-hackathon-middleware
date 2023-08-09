import { 
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory, 
    createBotFrameworkAuthenticationFromConfiguration 
} from "botbuilder";
import { sendPrompt } from "./functions/sendPrompt";
import { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import path from "path";

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require("express");
const app = express();
const cors = require('cors');

// This bot's main dialog.
const { EchoBot } = require('./bot');

let config!: Configuration;

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(config, credentialsFactory);

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
const onTurnErrorHandler = async (context: any, error: any) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton CloudAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the main dialog.
const myBot = new EchoBot();

app.use(cors());

app.get("/", (req: any, res: any) => {
    // res.sendFile(__dirname + "/index.html");
    res.send('home');
});

app.get("/status", (request: any, res: any) => {
    const status = {
       "Status": "Running",
    };
    
    res.send(status);
});

app.post("/completions", async (req: any, res: any) => {
    // return generateTextQueryVector(req?.prompt);
    const result = await sendPrompt(req.prompt);
    res.send({ result: result });
});

app.on('upgrade', async (req: any, socket: any, head: any) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);

    // Set onTurnError for the CloudAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    await streamingAdapter.process(req, socket, head, (context) => myBot.run(context));
});

app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});
