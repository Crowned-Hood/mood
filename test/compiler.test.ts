import { describe, test, expect, beforeAll } from "bun:test";
import { Compiler } from "../src/compiler/compiler";

import * as fs from "fs";

describe("Compiler Tests", () => {
    let compiler: Compiler;
    beforeAll(() => {
        compiler = new Compiler();
    })

    test("Compiling main.md", async () => {
        compiler.buildProcess("main.md").then(() => {
            const code: string = fs.readFileSync("./example/out/main.ts");

            const hasReferenceToDiagram = code.includes("diagram.excalidraw");
            expect(hasReferenceToDiagram).toBe(true);
        })
    })
})