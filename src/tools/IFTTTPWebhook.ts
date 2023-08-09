const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

export class IFTTTWebhook extends Tool {
  name: string;
  description: string;
  returnDirect: boolean;

    constructor(url: string, name: string, description: string) {
      super();
      this.url = url;
      this.name = name || "ifttt";
      this.description = description || "Send data to an IFTTT webhook URL";
      this.returnDirect = true;
    }
  
    async call(input: any) {
      const headers = { "Content-Type": "application/json" };
      const body = JSON.stringify({ "this": input });
  
      const response = await fetch(this.url, {
        method: "POST",
        headers,
        body,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const result = await response.text();
      return result;
    }
  }