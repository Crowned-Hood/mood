import { Command } from "commander";
import { Compiler } from "./compiler/compiler";
import { ConfigReader } from "./config_reader";

// Program Initialization

const program = new Command();

program
  .name("MOOD")
  .description(
    "An extremely experimental cli program that that uses an LLM to compile markdown to a target language of choice",
  );

program
  .option("-f, --force", "forces the cli action without any restraint")
  .option(
    "-m, --main <string>",
    "the main file path from the source directory",
  );

program.parse(process.argv);
const options = program.opts();

// Override configs where needed
const config = ConfigReader.instance;
if (options.force !== undefined) config.forceCompile = true;

// Run Compilation Process
const compiler: Compiler = new Compiler();
compiler.buildProcess(config.mainFile);
