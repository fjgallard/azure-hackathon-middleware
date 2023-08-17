
import { sendPrompt } from "./functions/sendPrompt";
import { SendMessage } from "./functions/sendMessage";
import { Request } from "express";

import bodyParser from "body-parser";
import path from "path";

const dotenv = require('dotenv');

const express = require("express");
const app = express();
const cors = require('cors');

const ENV_FILE = path.join(__dirname, '../.env');
dotenv.config({ path: ENV_FILE });

const sendMessage = new SendMessage();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req: any, res: any) => {
    res.sendFile(path.resolve(__dirname, "../index.html"));
    
    // res.send('home');
});

app.get("/status", (request: any, res: any) => {
    const status = {
       "Status": "Running",
    };
    
    res.send(status);
});

app.post("/completion", async (req: Request, res: any) => {
    const result = await sendMessage.sendMessage(req.body.prompt);
    res.send({ result: result });
});

app.post("/completions", async (req: any, res: any) => {
    // return generateTextQueryVector(req?.prompt);
    const result = await sendPrompt(req.prompt);
    res.send({ result: result });
});


app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});
