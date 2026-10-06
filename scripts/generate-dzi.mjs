import { mkdir, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: npm run dzi:generate -- /path/to/image /path/to/new-output-folder');
  process.exitCode = 1;
} else {
  const directory = resolve(output);
  await mkdir(directory, { recursive: true });
  if ((await readdir(directory)).length) throw new Error('Choose an empty output folder to avoid overwriting an existing slide.');
  await sharp(resolve(input))
    .rotate()
    .jpeg({ quality: 90 })
    .tile({ layout: 'dz', size: 254, overlap: 1 })
    .toFile(join(directory, 'slide'));
  console.log(`Upload ${directory} from Admin → DZI slides → Choose folder.`);
}
