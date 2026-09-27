import { readFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const files = (await readFile(resolve(root, 'public-files.txt'), 'utf8')).split('\n').map(line => line.trim()).filter(Boolean);
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
for (const file of files) {
  if (file.startsWith('/') || file.split('/').includes('..')) throw new Error(`Invalid public path: ${file}`);
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await cp(resolve(root, file), target);
}
console.log(`Built ${files.length} public files into dist/. Research and private sources are excluded.`);
