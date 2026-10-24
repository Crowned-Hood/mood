import * as path from "path";
import * as fs from "fs";

import * as matter from "gray-matter";
import { ConfigReader } from "../config_reader";

const config = ConfigReader.instance;

export interface fileReference {
    name: string;
    type: "architecture" | "fileDescription";
    data: string;
}

export class MarkdownFile {
    references?: string[];
    extension?: string;
    script: string;
    name: string;
    folder: string;
    private _lastEdit: Date;


    targetPath: string;
    targetLang: string;
    compiledFile?: string;
    private _lastCompile?: Date;

    /**
     * Returns true if the file has been compiled in the past
     */
    private _findCompiledFile(): boolean {
      // First see if the file exists

      if (!fs.existsSync(this.targetPath)) return false;

      this._lastCompile = fs.statSync(this.targetPath).mtime;
      this.compiledFile = fs.readFileSync(this.targetPath, "utf-8");

      return true;
    }

    get isAlreadyCompiled(): boolean {
        if (this._lastCompile == null) return false;

        const list = this.resolvedReferences;
        for (let dep of list) {
            // if (dep._lastCompile?.valueOf() < dep._lastEdit.valueOf()) return false;
        }

        return this._lastCompile.valueOf() >= this._lastEdit.valueOf();
    }

    constructor(file: string, absolute: boolean = false) {
        const sourceDir = path.join(process.cwd(), config.sourceFolder);
        const isAbs = absolute || path.isAbsolute(file);

        // Determine the absolute path for reading the file
        const absolutePath = isAbs ? file : path.join(sourceDir, file);
        
        // Determine the path relative to the source folder for naming and target mapping
        const relativeToSource = isAbs ? path.relative(sourceDir, file) : file;

        // Obtain markdown file data
        const metadata = matter.read(absolutePath);
        this.references = metadata.data.references;
        this.script = metadata.content;

        // Get file name relative to directory without extension
        const parsed = path.parse(relativeToSource);
        const filename = `${parsed.dir == "." ? "" : "./"}${parsed.dir}${parsed.dir !== "" ? "/" : ""}${parsed.name}`;
        this.name = filename;

        this.folder = path.dirname(relativeToSource);

        this._lastEdit = fs.statSync(absolutePath).mtime;

        this.targetLang = metadata.data.targetLang;
        this.extension = metadata.data.extension ?? config.fileExtension;
        this.targetPath =
            path.join(path.join(process.cwd(), config.targetFolder), this.name) +
            this.extension;
        this._findCompiledFile();
    }

    get resolvedReferences(): fileReference[] {
        if (this.references == undefined)
            return [];
        
        const list: Array<fileReference> = [];

        for (let ref of this.references) {
            const extension = path.extname(ref);

            const fileType = extension === "" ? "fileDescription" : "architecture";
            let fileData: string = "";
            
            if (fileType == "architecture") {
                fileData = fs.readFileSync(path.resolve(process.cwd(), ConfigReader.instance.sourceFolder, this.folder, ref), "UTF-8");
            } else {
                const mdFile = new MarkdownFile(path.resolve(ConfigReader.instance.sourceFolder, this.folder, ref + ".md"), true);
                fileData = mdFile.isAlreadyCompiled ? mdFile.compiledFile! : mdFile.script;
            }

            list.push({
                name: ref,
                type: fileType,
                data: fileData 
            })
        }

        return list;
    }
}