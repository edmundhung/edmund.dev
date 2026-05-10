declare namespace Cloudflare {
  interface Env {
    GITHUB_TOKEN?: string;
    SNAPSHOTS: R2Bucket;
  }
}

declare module 'shiki/onig.wasm' {
  const instantiator: (
    importObject:
      | Record<string, Record<string, WebAssembly.ImportValue>>
      | undefined,
  ) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;
  export default instantiator;
}
