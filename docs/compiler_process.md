# Compiler Process

This is not a traditional compiler in the sense that it takes code, tokenizes, 
and parses it into an output. Instead, this process will take a file, and 
interpret an output for a new language.

## File Preparation 

First, we will gather the gray matter data from the file. This allows us to
find the required dependencies to compile the code successfully. this is a
recursive stage because it would be ideal to generate the code of the 
dependencies before generating the main file. If a file has already been
compiled properly, we will skip the compilation process to save tokens.

## Compilation Process

If no output has been previously generated, we will be using one prompt to 
create an initial file. We direct that the output should only generate code 
between code blocks and it should follow the constraints to generate effective
code for the compiler target.

If an output is already generated, we can then use the previous input as history
and implement a second prompt that guides the LLM to create an iteration.

After all this is done, *then* we can cache the previous iteration of the .md
file to prepare for the next compilation.
