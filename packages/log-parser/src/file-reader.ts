export interface IFileReader {
  read(path: string): Promise<string>;
}

export class FileReader implements IFileReader {
  async read(path: string): Promise<string> {
    const fs = await import('node:fs/promises');
    try {
      return await fs.readFile(path, 'utf-8');
    } catch (e) {
      throw new Error(
        `Unable to read file "${path}" — ${(e as Error).message}`,
      );
    }
  }
}
