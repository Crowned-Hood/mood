import { Compiler } from "../src/compiler/compiler";
import { MarkdownFile } from "../src/compiler/markdown_file";

var compiler = new Compiler();

// Test 1: Single Compiler File
const output = await compiler.buildProcess("main.md");
