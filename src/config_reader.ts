import * as fs from "fs";
import path from "path";

export class ConfigReader {
  private static _instance: ConfigReader | null = null;

  targetLanguage: string;
  targetFolder: string;
  sourceFolder: string;
  mainFile: string;
  forceCompile: boolean;

  constructor(config: any) {
    this.targetLanguage = config.targetLanguage || "JavaScript";
    this.targetFolder = config.targetFolder || "out";
    this.sourceFolder = config.sourceFolder || "src";
    this.mainFile = config.mainFile || "./main.md";
    this.forceCompile = false;
  }

  static get instance(): any {
    if (ConfigReader._instance != null) return ConfigReader._instance;

    var configFileText: string = fs.readFileSync(
      path.join(process.cwd(), "llmscript.json"),
      "utf8",
    );
    var config: any = JSON.parse(configFileText);

    ConfigReader._instance = new ConfigReader(config);

    return ConfigReader._instance;
  }
}
