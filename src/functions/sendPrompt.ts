import axios from "axios";

export const sendPrompt = async (prompt: string) => {
    // return "Elon Reeve Musk (/ˈiːlɒn/ EE-lon; born June 28, 1971) is a business magnate and investor. Musk is the founder, chairman, CEO and chief technology officer of SpaceX, angel investor, CEO and product architect of Tesla, Inc., owner and CTO of Twitter, founder of the Boring Company, a co-founder of Neuralink and OpenAI, and the president of the Musk Foundation. He is the wealthiest person in the world, with an estimated net worth of US$239 billion as of July 2023, according to the Bloomberg Billionaires Index, and $248.8 billion according to Forbes, primarily from his ownership stakes in Tesla and SpaceX.[3][4][5]";
    const url = `${process.env.OPENAI_API_BASE}/computervision/retrieval:vectorizeText?api-version=${process.env.REACT_APP_COGNITIVE_SERVICES_API_VERSION}`;
    const headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.REACT_APP_COGNITIVE_SERVICES_API_KEY,
    };
    const response = await axios.post(
        url, prompt, { headers }
      );

    return response;
}