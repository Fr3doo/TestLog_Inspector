export async function readFile(path: string): Promise<string> {
  const fs = await import('node:fs/promises');
  return fs.readFile(path, 'utf-8');
}

export async function writeFile(
  path: string,
  data: string | NodeJS.ArrayBufferView,
): Promise<void> {
  const fs = await import('node:fs/promises');
  await fs.writeFile(path, data);
}
