import { Ollama } from "ollama";
import type { GenerateResponse } from "ollama/dist/browser.cjs";

export abstract class LLMInterface {
  async generate(input: Array<any>): Promise<string> {
    return "";
  }
}

export class OllamaInterface implements LLMInterface {
  _llm: Ollama;

  constructor() {
    // this._llm = new Ollama();
    this._llm = new Ollama({
      host: "https://ollama.com",
      headers: { Authorization: "Bearer " + process.env.OLLAMA_API_KEY },
    });
  }

  async generate(input: Array<any>): Promise<string> {
    const response = await this._llm.chat({
      model: "gemma4:31b",
      // model: "qwen2.5-coder:3b",
      messages: input,
    });

    return response.message.content;
  }
}
