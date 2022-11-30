import * as markdoc from '@markdoc/markdoc';

export function parse(markdown: string) {
  const ast = markdoc.parse(markdown);
  const node = markdoc.transform(ast, {
    nodes: {
      fence: {
        render: 'Fence',
        attributes: {
          language: {
            type: String,
            description:
              'The programming language of the code block. Place it after the backticks.',
          },
        },
      },
      heading: {
        render: 'Heading',
        attributes: {
          level: { type: Number, required: true, default: 1 },
        },
      },
      link: {
        render: 'Hyperlink',
        attributes: {
          href: { type: String, required: true },
          title: { type: String },
          active: { type: Boolean, default: true },
        },
      },
    },
  });

  return node;
}

export function isTag(node: markdoc.RenderableTreeNode): node is markdoc.Tag {
  return node !== null && typeof node !== 'string';
}

export function getChildren(
  nodes: markdoc.RenderableTreeNodes,
): markdoc.RenderableTreeNode[] {
  if (Array.isArray(nodes) || !isTag(nodes)) {
    return [];
  }

  return nodes.children;
}
