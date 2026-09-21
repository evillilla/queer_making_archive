import { ImageIcon, Volume2, PenLine, Link2, FileText, Box } from 'lucide-react';
import type { Kind } from '../data/types';

const ICONS: Record<Kind, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Image: ImageIcon,
  Sound: Volume2,
  Writing: PenLine,
  Link: Link2,
  PDF: FileText,
  Object: Box,
};

export function KindIcon({ kind, size = 14 }: { kind: Kind; size?: number }) {
  const Icon = ICONS[kind];
  return <Icon size={size} strokeWidth={2} />;
}
