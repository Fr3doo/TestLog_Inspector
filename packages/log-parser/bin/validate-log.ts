#!/usr/bin/env node
import { LogParser } from '../dist/index.js';

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: validate-log <file.log>');
    process.exit(1);
  }

  try {
    const parser = new LogParser();
    await parser.parseFile(file);
    console.log('Log is valid');
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
