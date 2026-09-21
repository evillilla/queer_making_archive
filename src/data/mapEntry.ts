import type { Entry } from './types';

// Supabase rows are snake_case; the app works in camelCase.
export interface EntryRow {
  id: string;
  kind: string;
  thread: string;
  source: string;
  title: string;
  offered_by: string | null;
  tagline: string | null;
  excerpt: string | null;
  body: string | null;
  link: string | null;
  file_url: string | null;
  file_name: string | null;
  thumbnail_url: string | null;
  x: number;
  y: number;
  report_count: number;
  hidden: boolean;
}

export function rowToEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    kind: row.kind as Entry['kind'],
    thread: row.thread,
    source: row.source as Entry['source'],
    title: row.title,
    offeredBy: row.offered_by ?? undefined,
    tagline: row.tagline ?? undefined,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    link: row.link ?? undefined,
    fileUrl: row.file_url ?? undefined,
    fileName: row.file_name ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    x: row.x,
    y: row.y,
    reportCount: row.report_count,
    hidden: row.hidden,
  };
}

export function entryToRow(entry: Omit<Entry, 'id'>) {
  return {
    kind: entry.kind,
    thread: entry.thread,
    source: entry.source,
    title: entry.title,
    offered_by: entry.offeredBy ?? null,
    tagline: entry.tagline ?? null,
    excerpt: entry.excerpt,
    body: entry.body,
    link: entry.link ?? null,
    file_url: entry.fileUrl ?? null,
    file_name: entry.fileName ?? null,
    thumbnail_url: entry.thumbnailUrl ?? null,
    x: entry.x,
    y: entry.y,
  };
}
