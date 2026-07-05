# MOOD

MOOD - Markdown Object Oriented Describer 

A heavily experimental compiler program that uses an LLM to generate programs 
in theoretically any existing programming language of choice using a traditional
compiler system

## Why?

As of this point, I don't think I'll ever actually use this myself, but I thought 
it would be a funny experiment to see if this is a viable alternative to "vibe
coding".

## How?

Although any paradigm should work, this program takes advantage of a multi-file
architecture to generate code for a project. The "compiler" takes a root 
markdown file, and compiles every required file starting from the independent
files all the way to the main file itself.

**Example**

```md
---
paradigm: functional
dependencies: 
  - ./utils/addThree
  - ./utils/fib
---
this is the main file the program enters from

this main should perform the following:
- print a line that says Hello World
- use the function AddThree with n = 5
- print the 5th fibonacci sequence
```
