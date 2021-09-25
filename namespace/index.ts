import generate from './generate';
import preview from './preview';
import publish from './publish';

async function main(): Promise<void> {
  const binding = process.env.BINDING;
  const source = process.env.SOURCE;
  const mode = process.env.MODE;

  if (!binding || !source) {
    throw new Error('Missing BINDING / SOURCE env variables');
  }

  console.log(`Start generating KV`);
  const entries = await generate(source);
  console.log(`KV Generated, total: ${entries.length}`);

  switch (mode) {
    case 'preview':
      await preview(binding, entries);
      break;
    case 'publish':
      await publish(binding, entries);
      break;
    default:
      process.stdout.write(JSON.stringify(entries, null, 2));
      break;
  }
}

main();
