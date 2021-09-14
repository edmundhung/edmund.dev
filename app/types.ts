export interface Metadata {
  url?: string;
  layout?: string;
  title: string;
  description: string;
  image?: string;
  author?: string;
  tags?: string[];
}

export interface Entry {
  name: string;
  metadata: Metadata;
}
