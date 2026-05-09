import { env } from 'cloudflare:workers';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export default octokit;
