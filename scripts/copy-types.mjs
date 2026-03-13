import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, '..');
const sourceFile = resolve(rootDir, 'src/lib/index.d.ts');
const distFile = resolve(rootDir, 'dist/index.d.ts');

await mkdir(dirname(distFile), { recursive: true });
await copyFile(sourceFile, distFile);
