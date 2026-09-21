import { ImageIcon, Type } from 'lucide-react';
import type { Kind } from '../data/types';
import { SoundIcon, VideoIcon, WritingIcon, LinkIcon, DocumentIcon, ObjectIcon } from './customIcons';

const ICONS: Record<Kind, React.ComponentType<{ size?: number }>> = {
  // Still lucide, pending matching custom icons
  Image: ImageIcon,
  Font: Type,
  Sound: SoundIcon,
  Video: VideoIcon,
  Writing: WritingIcon,
  Link: LinkIcon,
  PDF: DocumentIcon,
  Object: ObjectIcon,
};

export function KindIcon({ kind, size = 14 }: { kind: Kind; size?: number }) {
  const Icon = ICONS[kind];
  return <Icon size={size} />;
}
