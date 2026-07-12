import { dir } from "console";
import * as fs from "fs";
import path from "path";

/**
 * Stores file iterations in an environment for iterative purposes
 */
export class HistoryCache {
  constructor() {
    fs.mkdirSync("./cache/", { recursive: true });
  }

  CloseCache(): void {
    // Todo
  }

  static _instance: HistoryCache;

  static get instance(): HistoryCache {
    if (this._instance == null)
      this._instance = new HistoryCache();

    return this._instance;
  }

  getFile(name: string): string | undefined {
    if (!fs.existsSync("./cache/" + name))
      return undefined;

    var file = fs.readFileSync(path.join("./cache/", name), "utf-8");
    return file;
  }

  setFile(name: string, data: string): void {
    fs.mkdirSync(path.parse(path.join("./cache/", name)).dir, { recursive: true });
    fs.writeFileSync(path.join("./cache/", name), data);
  }
}
