import * as fs from "fs";
import * as path from "path";

import { encode } from "@toon-format/toon";

import { ConfigReader } from "../config_reader";
import { LLMInterface, OllamaInterface } from "../llm/llm_interface";
import { MarkdownFile } from "./markdown_file";
import { HistoryCache } from "./history_cache";

interface LLMDepInfo {
  name: string;
  text?: string;
}

export class Compiler {
  _llm: LLMInterface;

  constructor() {
    this._llm = new OllamaInterface();
  }

  private generatePrompt(file: MarkdownFile): Array<any> {
    const lang: String = ConfigReader.instance.targetLanguage;

    const filePrevious = HistoryCache.instance.getFile(file.name);
    const fileDesc = filePrevious !== undefined ? filePrevious : file.script;
    const depsPrevious = HistoryCache.instance.getFile(file.name + ".deps");
    const cacheDeps = depsPrevious !== undefined ? JSON.parse(depsPrevious) : file.resolvedReferences;

    // First Prompt, Used to create a first iteration
    const prompt1 = {
          constraints: [
            `Do not generate any dialogue response at all. Generate vaild ${lang} code that can be run`,
            "Do only what the file description says. Do not import dependencies unless mentioned",
            "Must follow behavior of specified dependencies",
            "Assume you are working in an agile environment so you need to make this file accessible to others",
            "If the previous iteration is not null, then consider using the file structure of that file.",
          ],
          filename: file.name,
          paradigm: file.paradigm,
          dependencies: cacheDeps,
          fileDescription: fileDesc,
          task: `write a ${lang} file for a large scale project based on the file description I have given you.`,
          format: `\`\`\`
    // imports first

    // code to generate
    \`\`\``,
        };

    const promptFull = [{
      role: "user",
      content: encode(prompt1)
    }];

    // Second Prompt, Used to iterate file
    if (filePrevious === undefined)
      return promptFull;

    promptFull.push({
      role: "assistant",
      content: `\`\`\`
${file.compiledFile!}
\`\`\``,
    });

    const prompt2 = {
      dependencies: file.resolvedReferences,
      fileDescription: file.script,
      task: "Compare the file descriptions and dependencies to make changes to the file"
    }

    promptFull.push({
      role: "user",
      content: encode(prompt2)
    })

    return promptFull;
  }

  /**
   * Takes a file and compiles it into the language configured
   */
  async compileFile(file: MarkdownFile): Promise<string> {

    if (file.isAlreadyCompiled && ConfigReader.instance.forceCompile !== true) {
      console.log(file.name, "is already compiled; Skipping to save tokens :)");

      return file.compiledFile!;
    }

    console.log("Compiling file", file.name);

    // Compiling Process
    const prompt = this.generatePrompt(file);
    console.log(prompt);
    const response = await this._llm.generate(prompt);
    console.log(response);

    // Assume successful, cache the iteration
    HistoryCache.instance.setFile(file.name, file.script);
    if (file.resolvedReferences !== undefined)
      HistoryCache.instance.setFile(file.name + ".deps", JSON.stringify(file.resolvedReferences));

    return response.split("\n").slice(1, -1).join("\n");
  }

  async buildProcess(main: string): Promise<void> {
    const rootFile = new MarkdownFile(main);
    const compileList = rootFile.fileList;
    // console.log(compileList);

    const output = await this.compileFile(rootFile);
    rootFile.compiledFile = output;
    fs.mkdirSync(path.parse(rootFile.targetPath).dir, { recursive: true });
    fs.writeFileSync(rootFile.targetPath, output);
  }
}
