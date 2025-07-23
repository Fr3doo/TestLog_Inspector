import { LogParser, readFileContent } from "@testlog-inspector/log-parser";
import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { tempDir } from "./helpers/tempDir";
import { vi } from "vitest";

describe("LogParser", () => {
  let tmp: string;
  let cleanup: () => void;
  let dir: string;

  beforeEach(() => {
    ({ dir, cleanup } = tempDir("parser-"));
    tmp = join(dir, "test.log");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("readFileContent returns file content", async () => {
    writeFileSync(tmp, "abc");
    const res = await readFileContent(tmp);
    expect(res).toContain("abc");
  });

  it("should parse a nominal log file using a single read", async () => {
    const content = [
      "Scenario: login_flow",
      "ERROR: boom",
    ].join("\n");
    writeFileSync(tmp, content);

    const parser = new LogParser([]);
    const spy = vi.spyOn({ readFile }, "readFile");
    const res = await parser.parseFile(tmp);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(res.context.scenario).toBe("login_flow");
    expect(res.errors).toHaveLength(1);
  });

  it("should throw when file is corrupted", async () => {
    const parser = new LogParser([]);
    await expect(parser.parseFile("nonexistent.log")).rejects.toThrow(
      /Unable to read file/
    );
  });

  it("should propagate read errors", async () => {
    const parser = new LogParser([]);
    const error = new Error("permission denied");
    vi.spyOn({ readFile }, "readFile").mockRejectedValueOnce(error);

    await expect(parser.parseFile(tmp)).rejects.toThrow("permission denied");
  });
});
