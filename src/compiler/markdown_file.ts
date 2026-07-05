import * as path from "path";
import * as fs from "fs";

import * as matter from "gray-matter";
import { ConfigReader } from "../config_reader";

const config = ConfigReader.instance;

/**
 * An organized datatype for a .md file in the compiler
 */
export class MarkdownFile {
  dependencies?: string[];
  paradigm: string;
  script: string;
  name: string;
  compiledFile?: string;
  targetPath?: string;

  _lastEdit: Date;
  _lastCompile?: Date;

  /**
   * Returns true if the file has been compiled in the past
   */
  private findCompiledFile(): boolean {
    // First see if the file exists

    this.targetPath =
      path.join(path.join(process.cwd(), config.targetFolder), this.name) +
      ".ts";

    if (!fs.existsSync(this.targetPath)) return false;

    this._lastCompile = fs.statSync(this.targetPath).mtime;
    this.compiledFile = fs.readFileSync(this.targetPath, "utf-8");

    return true;
  }

  get isAlreadyCompiled(): boolean {
    if (this._lastCompile == null) return false;

    const list = this.fileList;
    for (let dep of list) {
      if (dep._lastCompile?.valueOf() < dep._lastEdit.valueOf()) return false;
    }

    return this._lastCompile.valueOf() >= this._lastEdit.valueOf();
  }

  constructor(file: string) {
    const relativePath = path.join(
      path.join(process.cwd(), config.sourceFolder),
      file,
    );

    // Obtain markdown file data
    const metadata = matter.read(relativePath);
    this.paradigm = metadata.data.paradigm;
    this.dependencies = metadata.data.dependencies;
    this.script = metadata.content;

    // Get file name relative to directory without extension
    const filename = `./${path.parse(file).dir}${path.parse(file).dir !== "" ? "/" : ""}${path.parse(file).name}`;
    this.name = filename;

    this._lastEdit = fs.statSync(relativePath).mtime;

    this.findCompiledFile();
  }

  private traverseDepTree(
    callback: (node: MarkdownFile) => void,
    visited?: Map<string, boolean>,
  ): void {
    if (visited == null) visited = new Map();
    if (visited.get(this.name) != null) return;
    callback(this);

    if (this.dependencies == null) return;

    for (let dep of this.dependencies) {
      visited.set(dep, true);
      var newMD = new MarkdownFile(
        path.join(path.parse(this.name).dir, dep + ".md"),
      );
      newMD.traverseDepTree(callback);
    }
  }

  /**
   * @returns an array of markdown files including itself that need to be compiled
   *
   * The array is sorted by whether a file is a dependency. That means that the
   * first files should have the least files.
   */
  get fileList(): MarkdownFile[] {
    const dependencies: MarkdownFile[] = [];

    // recursively traverse the tree
    this.traverseDepTree((node: MarkdownFile) => {
      dependencies.push(node);
    });

    dependencies.sort((a: MarkdownFile, b: MarkdownFile): number => {
      // Return -1 if a is a dependency of b
      return b.dependencies?.findIndex((n: string) => n === a.name) != -1
        ? -1
        : 1;
    });

    return dependencies;
  }
}
