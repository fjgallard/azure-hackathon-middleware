import { generateTextQueryVector } from "./functions/textSearch";

const express = require("express");
const app = express();
const cors = require('cors');

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

app.post("/generate-query-vector", async (req: any, res: any) => {
    // return generateTextQueryVector(req?.prompt);
    res.send({ result: 'it worked' });
});

app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});