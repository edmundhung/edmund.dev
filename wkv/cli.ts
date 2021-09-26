import meow from 'meow';
import generate from './generate';
import preview from './preview';
import publish from './publish';

const cli = meow(
  `
	Usage
		$ wkv generate <source> <output>
		$ wkv preview <source>
		$ wkv publish <source>

	Options
		--binding   Namespace binding

	Examples
		$ wkv generate ./content --binding Content > content.json
		$ wkv preview ./content.json --binding Content
		$ wkv publish ./content.json --binding Content
`,
  {
    description: 'CLI for Worker KV',
    flags: {
      binding: {
        type: 'string',
        isRequired: (flags, input) => input[0] !== 'generate',
      },
    },
  },
);

const [command, source] = cli.input;

switch (command) {
  case 'generate':
    generate(source);
    break;
  case 'preview':
    preview(source, cli.flags.binding ?? '');
    break;
  case 'publish':
    publish(source, cli.flags.binding ?? '');
    break;
  default:
    cli.showHelp();
    break;
}
