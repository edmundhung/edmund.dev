import { Octokit } from '@octokit/core';
import type { Env } from 'worker.env';

interface GitHubConfig {
  auth?: string;
  owner: string;
  repo: string;
  env: Env;
  ctx: ExecutionContext;
}

interface PostValue {
  content: string;
}

interface Metadata {
  timestamp: string;
}

interface PostMetadata extends Metadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

type Post = {
  value: PostValue;
  metadata: PostMetadata;
};

class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private env: Env;
  private ctx: ExecutionContext;

  constructor({ auth, owner, repo, env, ctx }: GitHubConfig) {
    this.octokit = new Octokit({ auth });
    this.owner = owner;
    this.repo = repo;
    this.env = env;
    this.ctx = ctx;
  }

  private isStale(
    timestamp: string | undefined,
    now: string,
    maxAge: number,
  ): boolean {
    if (!timestamp) {
      return true;
    }

    const prev = new Date(timestamp).valueOf();
    const next = new Date(now).valueOf();

    return next - prev > maxAge * 1000;
  }

  private async getContent(path: string, ref?: string) {
    const content = await this.octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: this.owner,
        repo: this.repo,
        path,
        ref,
      },
    );

    return content;
  }

  private async getDirectory(path: string, ref?: string) {
    const directory = await this.getContent(path, ref);

    if (!Array.isArray(directory.data)) {
      throw new Error('The path is not pointed to a directory');
    }

    return directory.data;
  }

  private async getFile(path: string, ref?: string) {
    const file = await this.getContent(path, ref);

    if (Array.isArray(file.data) || file.data.type !== 'file') {
      throw new Error('The path is not pointed to a file');
    }

    return file.data;
  }

  private async cachePost(slug: string, post: Post): Promise<void> {
    await this.env.CACHE.put(`blog/${slug}`, JSON.stringify(post.value), {
      expirationTtl: 60 * 60 * 24 * 7,
      metadata: post.metadata,
    });
  }

  private formatFile(slug: string, content: string, timestamp: string): Post {
    return {
      value: {
        content: atob(content),
      },
      metadata: {
        timestamp,
        slug,
        title: '',
        description: '',
        date: '',
        tags: [],
      },
    };
  }

  public async getPosts(): Promise<PostMetadata[]> {
    const timestamp = new Date().toISOString();
    const [cache, list] = await Promise.all([
      this.env.CACHE.getWithMetadata<string[], Metadata>('blog', {
        type: 'json',
      }),
      this.env.CACHE.list<PostMetadata>({ prefix: 'blog/' }),
    ]);

    if (
      list.keys.length > 0 &&
      !this.isStale(cache.metadata?.timestamp, timestamp, 300)
    ) {
      return list.keys.reduce<PostMetadata[]>((result, key) => {
        if (key.metadata) {
          result.push(key.metadata);
        }

        return result;
      }, []);
    }

    const files = await this.getDirectory('content/articles');
    const directory = files.reduce<Record<string, Post>>((result, file) => {
      if (
        file.type === 'file' &&
        typeof file.content !== 'undefined' &&
        file.name.endsWith('.md')
      ) {
        const slug = file.name.slice(0, -3);

        result[slug] = this.formatFile(slug, file.content, timestamp);
      }

      return result;
    }, {});

    this.ctx.waitUntil(
      Promise.all(
        Object.entries(directory).map(([slug, post]) =>
          this.cachePost(slug, post),
        ),
      ),
    );
    this.ctx.waitUntil(
      this.env.CACHE.put('blog', JSON.stringify(Object.keys(directory)), {
        expirationTtl: 60 * 60 * 24 * 7,
        metadata: {
          timestamp,
        },
      }),
    );

    return Object.values(directory).map(post => post.metadata);
  }

  public async getPost(slug: string): Promise<Post> {
    const timestamp = new Date().toISOString();
    const cache = await this.env.CACHE.getWithMetadata<PostValue, PostMetadata>(
      `blog/${slug}`,
      { type: 'json' },
    );

    if (
      cache.value &&
      cache.metadata &&
      !this.isStale(cache.metadata.timestamp, timestamp, 300)
    ) {
      return {
        value: cache.value,
        metadata: cache.metadata,
      };
    }

    const file = await this.getFile(`content/articles/${slug}.md`);
    const post = this.formatFile(slug, file.content, timestamp);

    this.ctx.waitUntil(this.cachePost(slug, post));

    return post;
  }
}

export default GitHubService;
