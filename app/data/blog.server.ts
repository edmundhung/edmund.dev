import { env, waitUntil } from 'cloudflare:workers';
import type { Octokit } from '@octokit/core';
import yaml from 'yaml';

import octokit from './octokit.server.ts';

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export interface BlogPost extends BlogPostMetadata {
  markdown: string;
}

interface TimestampMetadata {
  timestamp: string;
}

interface PostCacheMetadata extends BlogPostMetadata, TimestampMetadata {}

interface GitHubDirectoryEntry {
  name: string;
  type: string;
}

interface GitHubFile {
  content: string;
  type: 'file';
}

const BLOG_CACHE_KEY = 'blog';
const BLOG_CACHE_PREFIX = 'blog/';
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;
const STALE_AFTER_SECONDS = 60 * 5;
const BLOG_OWNER = 'edmundhung';
const BLOG_REPO = 'blog';

export async function getPosts(): Promise<BlogPostMetadata[]> {
  let timestamp = new Date().toISOString();
  let [cachedList, list] = await Promise.all([
    env.CACHE.getWithMetadata<string[], TimestampMetadata>(
      BLOG_CACHE_KEY,
      'json',
    ),
    env.CACHE.list<PostCacheMetadata>({ prefix: BLOG_CACHE_PREFIX }),
  ]);

  if (
    list.keys.length > 0 &&
    !isStale(cachedList.metadata?.timestamp, timestamp, STALE_AFTER_SECONDS)
  ) {
    return list.keys
      .flatMap(key => (key.metadata ? [toPostMetadata(key.metadata)] : []))
      .sort(compareLatestPostFirst);
  }

  let files = await getDirectory(octokit, 'content/articles');
  let posts = await Promise.all(
    files
      .filter(file => file.type === 'file' && file.name.endsWith('.md'))
      .map(async file => {
        let slug = file.name.slice(0, -3);
        let post = await getPost(slug);
        return post ? toPostMetadata(post) : null;
      }),
  );

  let freshPosts = posts.flatMap(post => (post ? [post] : []));

  waitUntil(
    env.CACHE.put(
      BLOG_CACHE_KEY,
      JSON.stringify(freshPosts.map(post => post.slug)),
      {
        expirationTtl: CACHE_TTL_SECONDS,
        metadata: { timestamp },
      },
    ),
  );

  return freshPosts.sort(compareLatestPostFirst);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  let timestamp = new Date().toISOString();
  let cachedPost = await env.CACHE.getWithMetadata<PostCacheMetadata>(
    `${BLOG_CACHE_PREFIX}${slug}`,
    'text',
  );

  if (
    cachedPost.value &&
    cachedPost.metadata &&
    !isStale(cachedPost.metadata.timestamp, timestamp, STALE_AFTER_SECONDS)
  ) {
    return {
      ...toPostMetadata(cachedPost.metadata),
      markdown: cachedPost.value,
    };
  }

  let file = await getFile(octokit, `content/articles/${slug}.md`);
  if (!file) return null;

  let post = parsePostFile(slug, atob(file.content), timestamp);

  waitUntil(
    env.CACHE.put(`${BLOG_CACHE_PREFIX}${slug}`, post.markdown, {
      expirationTtl: CACHE_TTL_SECONDS,
      metadata: { ...toPostMetadata(post), timestamp },
    }),
  );

  return post;
}

function compareLatestPostFirst(
  left: BlogPostMetadata,
  right: BlogPostMetadata,
) {
  return new Date(right.date).valueOf() - new Date(left.date).valueOf();
}

async function getDirectory(
  octokit: Octokit,
  path: string,
): Promise<GitHubDirectoryEntry[]> {
  let response = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: BLOG_OWNER,
      path,
      repo: BLOG_REPO,
    },
  );
  let data: unknown = response.data;

  if (!Array.isArray(data)) {
    throw new Error(`Expected ${path} to be a GitHub directory.`);
  }

  return data.flatMap(entry => (isGitHubDirectoryEntry(entry) ? [entry] : []));
}

async function getFile(
  octokit: Octokit,
  path: string,
): Promise<GitHubFile | null> {
  try {
    let response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: BLOG_OWNER,
        path,
        repo: BLOG_REPO,
      },
    );
    let data: unknown = response.data;

    if (!isGitHubFile(data)) {
      throw new Error(`Expected ${path} to be a GitHub file.`);
    }

    return data;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

function isGitHubDirectoryEntry(value: unknown): value is GitHubDirectoryEntry {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.type === 'string'
  );
}

function isGitHubFile(value: unknown): value is GitHubFile {
  return (
    isRecord(value) &&
    value.type === 'file' &&
    typeof value.content === 'string'
  );
}

function isNotFoundError(error: unknown): error is { status: 404 } {
  return isRecord(error) && error.status === 404;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStale(
  timestamp: string | null | undefined,
  now: string,
  maxAgeSeconds: number,
) {
  if (!timestamp) return true;
  return (
    new Date(now).valueOf() - new Date(timestamp).valueOf() >
    maxAgeSeconds * 1000
  );
}

function parsePostFile(
  slug: string,
  markdown: string,
  timestamp: string,
): BlogPost {
  let { body, frontmatter } = splitFrontmatter(markdown);
  let metadata = parseFrontmatter(slug, frontmatter, timestamp);
  return {
    ...metadata,
    markdown: body,
  };
}

function parseFrontmatter(
  slug: string,
  frontmatter: string,
  timestamp: string,
): PostCacheMetadata {
  let parsed = yaml.parse(frontmatter);

  if (!isRecord(parsed)) {
    throw new Error(`Expected frontmatter in ${slug}.md to be an object.`);
  }

  let title = parsed.title;
  let description = parsed.description;
  let date = parsed.date;

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof date !== 'string'
  ) {
    throw new Error(
      `Expected title, description, and date in ${slug}.md frontmatter.`,
    );
  }

  return {
    date,
    description,
    slug,
    timestamp,
    title,
  };
}

function splitFrontmatter(markdown: string) {
  if (!markdown.startsWith('---\n')) {
    throw new Error('Expected markdown file to start with YAML frontmatter.');
  }

  let frontmatterEnd = markdown.indexOf('\n---\n', 4);
  if (frontmatterEnd === -1) {
    throw new Error(
      'Expected markdown file to contain a closing YAML frontmatter fence.',
    );
  }

  return {
    body: markdown.slice(frontmatterEnd + 5).trim(),
    frontmatter: markdown.slice(4, frontmatterEnd),
  };
}

function toPostMetadata(post: BlogPostMetadata) {
  return {
    date: post.date,
    description: post.description,
    slug: post.slug,
    title: post.title,
  };
}
