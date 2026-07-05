import * as fs from "fs";
import * as path from "path";

import { encode } from "@toon-format/toon";

import { ConfigReader } from "../config_reader";
import { LLMInterface, OllamaInterface } from "../llm/llm_interface";
import { MarkdownFile } from "./markdown_file";

interface LLMDepInfo {
  name: string;
  text?: string;
}

export class Compiler {
  _llm: LLMInterface;

  constructor() {
    this._llm = new OllamaInterface();
  }

  /**
   * Takes a file and compiles it into the language configured
   */
  async compileFile(file: MarkdownFile, deps?: LLMDepInfo[]): Promise<string> {
    const lang: String = ConfigReader.instance.targetLanguage;

    if (file.isAlreadyCompiled) {
      console.log(file.name, "is already compiled; Skipping to save tokens :)");

      return file.compiledFile!;
    }

    console.log("Compiling file", file.name);

    // Compiling Process
    const prompt = {
      constraints: [
        `Do not generate any dialogue response at all. Generate vaild ${lang} code that can be run`,
        "Do only what the file description says. Do not import dependencies unless mentioned",
        "Must follow behavior of specified dependencies",
        "Assume you are working in an agile environment so you need to make this file accessible to others",
        "If the previous iteration is not null, then consider using the file structure of that file.",
      ],
      filename: file.name,
      paradigm: file.paradigm,
      dependencies: deps,
      previous: file.compiledFile,
      fileDescription: file.script,
      task: `Take the file description and generate an iteration of ONLY ${lang} code for a large scale project.`,
      format: `\`\`\`
// imports

// code described
\`\`\``,
    };

    const promptString: string = encode(prompt);
    // console.log("Prompt", promptString);
    const response = await this._llm.generate(promptString);

    return response.split("\n").slice(1, -1).join("\n");
  }

  async buildProcess(main: string): void {
    const rootFile = new MarkdownFile(main);
    const compileList = rootFile.fileList;
    // console.log(compileList);

    for (let file of compileList) {
      // fetch dependencies as DepInfo;

      const requiredDeps: LLMDepInfo[] = [];

      if (file.dependencies !== undefined) {
        for (let dep of file.dependencies) {
          const depMD = compileList.find((n) => n.name === dep);
          requiredDeps.push({
            name: dep,
            text: depMD?.compiledFile || depMD?.script,
          });
        }
      }

      const output = await this.compileFile(
        file,
        requiredDeps.length != 0 ? requiredDeps : undefined,
      );

      file.compiledFile = output;

      fs.mkdirSync(path.parse(file.targetPath).dir, { recursive: true });
      fs.writeFileSync(file.targetPath, output);

      // console.log(output);
    }
  }
}
