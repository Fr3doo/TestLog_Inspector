import { readFile } from './file-utils.js';

export interface IFileReader {
  read(path: string): Promise<string>;
}

export class FileReader implements IFileReader {
  async read(path: string): Promise<string> {
    try {
      return await readFile(path);
    } catch (e) {
      throw new Error(
        `Unable to read file "${path}" — ${(e as Error).message}`,
      );
    }
  }
}
