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

program.command("build")
  .option("-f, --force", "forces the cli action without any restraint")
  .argument(
    "[files...]",
    "the list of files to compile",
  )
  .action((files: string[], options) => {
    // Override configs where needed
    const config = ConfigReader.instance;
    if (options.force !== undefined) config.forceCompile = true;

    // Run Compilation Process
    const compiler: Compiler = new Compiler();

    if (files.length > 0) {
      for (const i of files)
        compiler.buildProcess(i);

      return;
    }

    compiler.buildTree();
  })

program.parse(process.argv);
