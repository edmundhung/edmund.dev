const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["worker/index.ts"],
  bundle: true,
  format: "esm",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "./worker.js",
});
