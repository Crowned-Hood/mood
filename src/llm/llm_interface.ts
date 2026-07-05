import { Ollama } from "ollama";
import type { GenerateResponse } from "ollama/dist/browser.cjs";

export abstract class LLMInterface {
  async generate(input: string): Promise<string> {
    return "";
  }
}

export class OllamaInterface implements LLMInterface {
  _llm: Ollama;

  constructor() {
    this._llm = new Ollama();
  }

  async generate(input: string): Promise<string> {
    const response: GenerateResponse = await this._llm.generate({
      model: "qwen2.5-coder:3b",
      prompt: input,
      think: false,
    });

    return response.response;
  }
}
