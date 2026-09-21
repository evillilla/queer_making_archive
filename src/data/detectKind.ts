import type { Kind } from './types';

const FONT_EXTENSIONS = ['ttf', 'otf', 'woff', 'woff2'];

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
