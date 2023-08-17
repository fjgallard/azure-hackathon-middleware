import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { DadJokeAPI } from "../tools/DadJokeAPI";
import { PetFinderAPI } from "../tools/FindPetsAPI";

const KEY: string = process.env.OPENAI_API_KEY || '';
const ENDPOINT: string = process.env.OPENAI_API_BASE || '';
export class SendMessage {
    // model: OpenAIClient;
    model: ChatOpenAI;
    tools: any[];
    executor!: AgentExecutor;

    constructor() {
        this.model = new ChatOpenAI({ 
            temperature: 0.5, 
            azureOpenAIApiKey: process.env.OPENAI_API_KEY,
            azureOpenAIApiDeploymentName: process.env.DEPLOYMENT_NAME,
            azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,

         });
        // this.model = new OpenAIClient(ENDPOINT, new AzureKeyCredential(KEY));
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

        // const embeddings = new OpenAIEmbeddings();
    }

    async sendMessage(input: string): Promise<string> {

        try {
            if (!this.executor) {
    
                this.executor = await initializeAgentExecutorWithOptions(
                    this.tools,
                    this.model,
                    {
                        agentType: "zero-shot-react-description",
                     }
                );
                console.log("Loaded agent.");
            }
            const execResponse = await this.executor.call({input});
            
            const replyText = execResponse.output;
            // console.log(replyText);
            return replyText;
            
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}
