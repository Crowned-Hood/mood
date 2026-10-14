# MOOD

MOOD - Markdown Object Oriented Describer 

A heavily experimental compiler program that uses an LLM to generate programs 
in theoretically any existing programming language of choice using a traditional
compiler system.

## Why?

Originally this was used as a concept to give friends a laugh. However, over the
recent development of AI, there are more teams that are encouraging software 
developers to use AI in development. It is even seen with recent software 
development breakthroughs such as reverse engineering software effortlessly, or
even re-programming software. This is what has brought encouragement in continuing
development in this project.

There is a breakthrough in software development. However, one of the more common
issues is the mindless prompting in software development and lack of note taking
and documentation. The main motivation of MOOD is to implement natural language
software development to transition work from engineering to documentation first.

## How?

Although any paradigm should work, this program takes advantage of a multi-file
architecture to generate code for a project. The "compiler" takes a root 
markdown file, and compiles every required file starting from the independent
files all the way to the main file itself.

**Example**

```md
---
references: 
  - ./system.puml
  - ./diagram.excalidraw
---

this is the main file the program enters from

print a line that says Hello World
call the method addThree from the class addThree with n = 5
print the 5th fibonacci sequence.

Once it is done printing those commands, it should draw out a box interface in the terminal. Use the excalidraw diagram for reference. 
```

Figure 1. see [main.md](./example/src/main.md)

> Why `.puml` and `.excalidraw`?
>
> PlantUML is an architecture based modeling "language" to describe the
> architecture used in software design. You can feed any documentation
> file (including other markdown files), but PlantUML is great for giving
> code more context than needed with less tokens.
>
> This will also work well with .excalidraw files or any other format that is
> text based.
>
> The references you give will be up to you, but as long as you have a plan
> on how to communicate your software architecture, you can implement anything.

## Q&A

**Q. Does that mean this should replace coding entirely?**

A. In an ideal situation, this should result in being your primary "programming
language". However, there are always cases where you need to manually fine-tune
code. Think of this as a documentation first tool instead of a programming-first
language.