import { createEventListener } from "./worker";
import build from "../build/index.js";

const eventListener = createEventListener({
  build,
  getLoadContext() {
    return {
      async listPosts() {
        const result = await POSTS.list();

        return result.keys.map<[string, {}]>(key => [key.name, key.metadata]);
      },
      async getPost(slug) {
        const post = await POSTS.getWithMetadata(slug);

        if (post.value === null) {
          return null;
        }

        return post;
      },
    };
  }
});

addEventListener("fetch", eventListener);
