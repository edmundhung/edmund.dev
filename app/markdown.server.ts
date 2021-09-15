import remark from 'remark';
import html from 'remark-html';

export async function parse(source: string): Promise<string> {
  const result = await new Promise((resolve, reject) => {
    remark()
      .use(html)
      .process(source, function (err, file) {
        if (err) {
          reject(err);
          return;
        }

        resolve(file);
      });
  });

  return result.contents;
}
