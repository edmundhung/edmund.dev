---
title: Deploying remix app on Cloudflare Workers
tags:
- remix
- cloudflare worker
---
# Deploying remix app on Cloudflare Workers

I was an early supporter of Remix and have been watching out for its development for a while. With its [v1 Beta Launch](https://youtu.be/4dOAFJUOi-s), I think it is a good time to give it a try and spent a weekend building my first Remix app - a Blog.

## Why Cloudflare Workers?

There are many options out there you can deploy your app to. But the idea of being able to run it in the Edge is pretty new to me.

Cloudflare Workers, as one of the providers, adopted the service worker model. The way Remix utilising the Request/Response from the [Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) makes them a perfect fit.

The Remix team has been working on some official adapters for different platforms. Even though Cloudflare Workers is on their roadmap, it is not yet ready as of the time I build this. Luckily, the Remix community is really helpful and shared [example](https://github.com/GregBrimble/remix) how you can do it.

## Requirments

- Node 14+
- Remix 0.17+
- Wrangler 1.16+
## Work in progress...
