import { LogParser } from "@testlog-inspector/log-parser";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("LogParser", () => {
  const tmp = join(tmpdir(), "test.log");

  afterEach(() => {
    try {
      // remove file quietly
      writeFileSync(tmp, "");
    } catch (_) {}
  });

  it("should parse a nominal log file", async () => {
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
    const res = await parser.parseFile(tmp);

    expect(res.context.scenario).toBe("login_flow");
    expect(res.errors).toHaveLength(1);
  });

  it("should throw when file is corrupted", async () => {
    const parser = new LogParser();
    await expect(parser.parseFile("nonexistent.log")).rejects.toThrow(
      /Unable to read file/
    );
  });
});
