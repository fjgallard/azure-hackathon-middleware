import { ActivityHandler, MessageFactory } from "botbuilder";
import { OpenAI } from 'langchain'
import { Calculator, Tool } from 'langchain/tools';
import { BingSerpAPI } from "./tools/BingSerpAPI";
import { DadJokeAPI } from "./tools/DadJokeAPI";
import { PetFinderAPI } from "./tools/FindPetsAPI";
import { IFTTTWebhook } from "./tools/IFTTTPWebhook";

import { AgentExecutor, initializeAgentExecutor } from 'langchain/agents';


export class EchoBot extends ActivityHandler {
    model: OpenAI;
    tools: Tool[];
    executor!: AgentExecutor;

    constructor() {
        super();

        this.model = new OpenAI({ temperature: 0.9 });
        this.tools = [
            // new BingSerpAPI(), 
            new Calculator(), 
            new DadJokeAPI(),
            new PetFinderAPI(),
            /** new IFTTTWebhook(
                `https://maker.ifttt.com/trigger/spotify/json/with/key/${process.env.IFTTTKey}`, 
                'Spotify', 
                'Play a song on Spotity.') **/
        ];

        this.onMessage(async (context, next) => {

            try {
                if (!this.executor) {

                    this.executor = await initializeAgentExecutor(
                        this.tools,
                        this.model,
                        "zero-shot-react-description"
                    );
                    console.log("Loaded agent.");
                }
    
                const input = context.activity.text;
    
                const execResponse = await this.executor.call({input});
    
                const replyText = execResponse.output;

                // Print the log property of each action in intermediateSteps.
                // This is useful for debugging.
                execResponse.intermediateSteps.forEach((step: any) => {
                    console.log("--------------------");
                    console.log(step.action.log);
                    console.log(`Observation: ${step.observation}`);
                });

                await context.sendActivity(MessageFactory.text(replyText, replyText));
                
            }
            catch (err) {
                console.log(err);
                throw err;
            }
           
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded || [];
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    
}