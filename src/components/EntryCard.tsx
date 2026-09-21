import type { Entry } from '../data/types';
import { KindIcon } from './kindIcon';
import './EntryCard.css';

interface EntryCardProps {
  entry: Entry;
  onOpen: (entry: Entry) => void;
}

export function EntryCard({ entry, onOpen }: EntryCardProps) {
  return (
    <button type="button" className="entry-card" onClick={() => onOpen(entry)} style={{ left: entry.x, top: entry.y }}>
      {entry.imageColor ? (
        <div className="entry-card-image" style={{ background: entry.imageColor }} />
      ) : (
        <div className="entry-card-header">
          <KindIcon kind={entry.kind} />
          <span className="entry-card-excerpt">{entry.excerpt}</span>
        </div>
      )}
      <div className="entry-card-footer">
        <span className="entry-card-dot" />
        <span className="entry-card-title">{entry.title}</span>
      </div>
    </button>
  );
}
