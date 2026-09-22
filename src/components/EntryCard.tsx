import type { Entry } from '../data/types';
import { isMinorActsSource } from '../data/types';
import { KindIcon } from './kindIcon';
import { MinorActsBadge } from './MinorActsBadge';
import './EntryCard.css';

interface EntryCardProps {
  entry: Entry;
  onOpen: (entry: Entry) => void;
  isHighlighted?: boolean;
}

export function EntryCard({ entry, onOpen, isHighlighted }: EntryCardProps) {
  return (
    <button
      type="button"
      className={`entry-card${entry.hidden ? ' entry-card-hidden' : ''}${isHighlighted ? ' entry-card-highlighted' : ''}`}
      onClick={() => onOpen(entry)}
      style={{ left: entry.x, top: entry.y }}
    >
      {entry.hidden && <span className="entry-card-hidden-tag">Hidden</span>}
      {entry.kind === 'Image' && entry.fileUrl ? (
        <img className="entry-card-image" src={entry.fileUrl} alt={entry.title} />
      ) : entry.kind === 'Video' && entry.thumbnailUrl ? (
        <img className="entry-card-image" src={entry.thumbnailUrl} alt={entry.title} />
      ) : entry.kind === 'Video' || entry.kind === 'Sound' ? (
        <div className="entry-card-icon-header">
          <KindIcon kind={entry.kind} size={40} />
        </div>
      ) : entry.imageColor ? (
        <div className="entry-card-image" style={{ background: entry.imageColor }} />
      ) : (
        <div className="entry-card-header">
          <KindIcon kind={entry.kind} />
          <span className="entry-card-excerpt">{entry.excerpt}</span>
        </div>
      )}
      <div className="entry-card-footer">
        {isMinorActsSource(entry.source) && <MinorActsBadge size={13} />}
        <span className="entry-card-title">{entry.title}</span>
      </div>
    </button>
  );
}
