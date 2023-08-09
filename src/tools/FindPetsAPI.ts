const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

export class PetFinderAPI extends Tool {
  name: string;
  description: string;
  returnDirect: boolean;

  constructor() {
    super();
    this.name = "petfinder";
    this.description = "find pets by status. returns the name of each available pet. if status is not specified, default to available.";
    this.returnDirect = true;
  }

  async call(status = "available") {
    const headers = { "Accept": "application/json" };
    const searchUrl = `https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`;

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const pets = await response.json();
    const petNames = pets.map((pet: any) => pet.name);

    return petNames;
  }
}