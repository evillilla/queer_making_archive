export const KINDS = ['Image', 'Sound', 'Video', 'Writing', 'Link', 'PDF', 'Font', 'Object'] as const;
export type Kind = (typeof KINDS)[number];

// Base/default source options — visitors can also type a custom one via
// "Other", the same way custom threads work.
export const SOURCES = ['Minor Acts 1.0', 'Minor Acts 2.0', 'Other'] as const;

export interface Entry {
  id: string;
  kind: Kind;
  thread: string;
  source: string;
  title: string;
  offeredBy?: string;
  tagline?: string;
  excerpt: string;
  body: string;
  link?: string;
  imageColor?: string;
  fileUrl?: string;
  fileName?: string;
  x: number;
  y: number;
  reportCount?: number;
  hidden?: boolean;
}
