export const KINDS = ['Image', 'Sound', 'Writing', 'Link', 'PDF', 'Object'] as const;
export type Kind = (typeof KINDS)[number];

export const SOURCES = ['Minor Acts 1.0', 'Minor Acts 2.0', 'Other'] as const;
export type Source = (typeof SOURCES)[number];

export interface Entry {
  id: string;
  kind: Kind;
  thread: string;
  source: Source;
  title: string;
  offeredBy?: string;
  tagline?: string;
  excerpt: string;
  body: string;
  link?: string;
  imageColor?: string;
  x: number;
  y: number;
}
