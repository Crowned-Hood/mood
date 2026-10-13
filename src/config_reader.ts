import * as fs from "fs";
import path from "path";

export class ConfigReader {
  private static _instance: ConfigReader | null = null;

  targetLanguage: string;
  targetFolder: string;
  sourceFolder: string;
  mainFile: string;
  forceCompile: boolean;

  private constructor(config: any) {
    this.targetLanguage = config.targetLanguage || "JavaScript";
    this.targetFolder = config.targetFolder || "sandbox";
    this.sourceFolder = config.sourceFolder || "architecture";
    this.mainFile = config.mainFile || "./main.md";
    this.forceCompile = false;
  }

  static get instance(): any {
    if (ConfigReader._instance != null) return ConfigReader._instance;

    var configFileText: string = fs.readFileSync(
      path.join(process.cwd(), "moodconf.json"),
      "utf8",
    );
    var config: any = JSON.parse(configFileText);

    ConfigReader._instance = new ConfigReader(config);

    return ConfigReader._instance;
  }
}
