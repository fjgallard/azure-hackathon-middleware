import { MessageFactory } from "botbuilder";
import { OpenAI } from "langchain";
import { AgentExecutor, initializeAgentExecutor } from "langchain/agents";
import { Calculator, Tool } from "langchain/tools";
import { DadJokeAPI } from "../tools/DadJokeAPI";
import { PetFinderAPI } from "../tools/FindPetsAPI";

export class SendMessage {
    model: OpenAI;
    tools: Tool[];
    executor!: AgentExecutor;

    constructor() {
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
    }

    async sendMessage(input: string): Promise<string> {
        try {
            if (!this.executor) {
    
                this.executor = await initializeAgentExecutor(
                    this.tools,
                    this.model,
                    "zero-shot-react-description"
                );
                console.log("Loaded agent.");
            }
        
            const execResponse = await this.executor.call({input});
    
            const replyText = execResponse.output;
    
            return replyText;
            
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}
