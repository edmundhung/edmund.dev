---
title: Deploying Remix app on Cloudflare Workers
description: Step by step guide on how to deploy your remix app to Cloudflare Workers using the `remix-worker-template`
layout: col-span-2
tags:
- Remix
- Cloudflare Workers
---
# Deploying Remix app on Cloudflare Workers

One of the core features about [Remix](https://remix.run/) is to allow deploying your app anywhere. The Remix team maintains several adapters for platforms such as Vercel, Architect, Netlify and also Cloudflare Workers.

The official adapter for Cloudflare Workers is not ready yet at the time this article is written. We will be showing you how to do it with minimal patches using [remix-worker-template](https://github.com/edmundhung/remix-worker-template) here.

## Preparation

If you are new to Cloudflare Workers, be sure to [signup](https://dash.cloudflare.com/sign-up) first. No custom domain nor credit card is required. A default `workers.dev` domain will be set with a [free plan](https://developers.cloudflare.com/workers/platform/limits#worker-limits) available.

The environment should be set with node 14+. You should also set up the remix license following the instructions on the [dashboard](https://remix.run/dashboard).

## Set it up

To begin, create a new repository using the [remix-worker-template](https://github.com/edmundhung/remix-worker-template/generate) and clone it to your computer. Install all the packages required by running:

```sh
npm install
```

The next step is to setup the wrangler cli. [Wrangler](https://github.com/cloudflare/wrangler) is an official tool from Cloudflare for managing your workers. It should be installed together in the previous step. Authenticate the cli using:

```sh
npx wrangler login
```

This will open the Cloudflare account login page. Click `Authorize Wrangler` and it is set.

## Before deploying...

The workers environment is somehow tricky and is hard to verify locally. It is strongly suggest to test it first using the preview service before deploying:

```sh
npx wrangler preview
```

This will deploy your Remix app to a production-alike environment on Cloudflare. Be aware that usages on this environment counts towards your worker quota.

## Take it live!

If everything works fine on the preview environment, then you are good to go. Simply run

```sh
npx wrangler publish
```

And now your worker is released on production and should be accessible on the assigned `worker.dev` domain as stated on the cli result.
