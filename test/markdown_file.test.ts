import { describe, test, expect } from "bun:test";
import { MarkdownFile } from "../src/compiler/markdown_file";

describe("Markdown File Analysis", () => {
  test("markdown file without dependencies and in a folder", () => {
    const file = new MarkdownFile("utils/addThree.md");

    expect(file.paradigm).toBe("object oriented");
    expect(file.dependencies).toBeUndefined();
    expect(file.name).toBe("./utils/addThree");
  });

  test("markdown file with dependencies", () => {
    const file = new MarkdownFile("main.md");

    expect(file.paradigm).toBe("functional");
    expect(file.dependencies![0]).toBe("./utils/addThree");
    expect(file.name).toBe("./main");
  });

  test("get markdown dependency tree", () => {
    const file = new MarkdownFile("main.md");

    console.log(file.fileList);
  });
});
