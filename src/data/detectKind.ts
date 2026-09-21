import type { Kind } from './types';

const FONT_EXTENSIONS = ['ttf', 'otf', 'woff', 'woff2'];

// Matches the "offerings" storage bucket's file_size_limit in supabase/schema.sql
// (Supabase's free-tier ceiling). Raise both together if the project upgrades plans.
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = '50MB';

export function detectKindFromFile(file: File): Kind {
  const type = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('audio/')) return 'Sound';
  if (type.startsWith('video/')) return 'Video';
  if (type === 'application/pdf') return 'PDF';
  if (type.includes('font') || FONT_EXTENSIONS.includes(ext)) return 'Font';
  return 'Object';
}
