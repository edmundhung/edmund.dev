export interface Metadata {
  url?: string;
  layout?: string;
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
}

export interface Entry {
  key: string;
  metadata: Metadata;
}
