import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export class DataLoader {
  static loadArray<T>(relativePath: string, requiredFields: readonly (keyof T)[]): readonly T[] {
    const parsed: unknown = JSON.parse(readFileSync(resolve(process.cwd(), relativePath), 'utf8'));
    if (!Array.isArray(parsed) || parsed.length === 0)
      throw new Error(`${relativePath} must contain a non-empty array`);
    parsed.forEach((record: unknown, index: number) => {
      if (typeof record !== 'object' || record === null)
        throw new Error(`${relativePath}[${index}] must be an object`);
      for (const field of requiredFields)
        if (!(field in record))
          throw new Error(`${relativePath}[${index}] is missing ${String(field)}`);
    });
    return structuredClone(parsed) as readonly T[];
  }
  static loadObject<T>(relativePath: string, requiredFields: readonly (keyof T)[]): T {
    const parsed: unknown = JSON.parse(readFileSync(resolve(process.cwd(), relativePath), 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
      throw new Error(`${relativePath} must contain an object`);
    for (const field of requiredFields)
      if (!(field in parsed)) throw new Error(`${relativePath} is missing ${String(field)}`);
    return structuredClone(parsed) as T;
  }
}
