import { LogParser } from "@testlog-inspector/log-parser";
import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { vi } from "vitest";

describe("LogParser", () => {
  const tmp = join(tmpdir(), "test.log");

  afterEach(() => {
    vi.restoreAllMocks();
    try {
      // remove file quietly
      writeFileSync(tmp, "");
    } catch (_) {}
  });

  it("should parse a nominal log file using a single read", async () => {
    const content = `
      Scenario: login_flow
      Date: 2025-07-20
      Environment: staging
      Browser: Chrome
      ERROR: NullPointerException Something went wrong
        at com.example.Test(Example.java:42)
      Version App 1.2.3
    `;
    writeFileSync(tmp, content);

    const parser = new LogParser();
    const spy = vi.spyOn({ readFile }, "readFile");
    const res = await parser.parseFile(tmp);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(res.context.scenario).toBe("login_flow");
    expect(res.errors).toHaveLength(1);
  });

  it("should throw when file is corrupted", async () => {
    const parser = new LogParser();
    await expect(parser.parseFile("nonexistent.log")).rejects.toThrow(
      /Unable to read file/
    );
  });

  it("should propagate read errors", async () => {
    const parser = new LogParser();
    const error = new Error("permission denied");
    vi.spyOn({ readFile }, "readFile").mockRejectedValueOnce(error);

    await expect(parser.parseFile(tmp)).rejects.toThrow("permission denied");
  });
});
