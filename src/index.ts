import { Command } from "commander";
import { Compiler } from "./compiler/compiler";
import { ConfigReader } from "./config_reader";

const program = new Command();

program
  .name("MOOD")
  .description(
    "An extremely experimental cli program that that uses an LLM to compile markdown to a target language of choice",
  );

program
  .command("build")
  .description("takes the main file and compiles the entire file graph")
  .action((str, options) => {
    const compiler: Compiler = new Compiler();
    compiler.buildProcess(ConfigReader.instance.mainFile);
  });

program.parse();
