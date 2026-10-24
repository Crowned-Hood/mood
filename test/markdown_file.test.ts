import { describe, test, expect } from "bun:test";
import { MarkdownFile } from "../src/compiler/markdown_file";

describe("Markdown File Analysis", () => {
  test("markdown file without dependencies and in a folder", () => {
    const file = new MarkdownFile("utils/addThree.md");

    expect(file.references).toEqual(["../system.puml"]);
    expect(file.name).toBe("./utils/addThree");
  });

  test("markdown file with dependencies", () => {
    const file = new MarkdownFile("main.md");

    expect(file.references).toEqual(["./diagram.excalidraw", "./system.puml"]);
    expect(file.name).toBe("./main");
  });

  test("get markdown dependency tree", () => {
    const file = new MarkdownFile("main.md");

    const refs = file.resolvedReferences;
    expect(refs.map((r) => r.name)).toEqual([
      "./diagram.excalidraw",
      "./system.puml",
    ]);
  });
});
