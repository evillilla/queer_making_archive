import { useEffect } from 'react';
import { PenLine } from 'lucide-react';
import type { Entry } from '../data/types';
import { KindIcon } from './kindIcon';
import { PixelX } from './PixelX';
import './EntryModal.css';

interface EntryModalProps {
  entry: Entry;
  onClose: () => void;
}

export function EntryModal({ entry, onClose }: EntryModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="entry-modal-overlay" onClick={onClose}>
      <div className="entry-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="entry-modal-close" onClick={onClose} aria-label="Close">
          <PixelX size={16} />
        </button>
        <div className="entry-modal-header">
          <div className="entry-modal-meta">
            <PenLine size={14} />
            <span>
              {entry.kind.toUpperCase()} &middot; {entry.thread.toUpperCase()}
            </span>
          </div>
          <h2 className="entry-modal-title">{entry.title}</h2>
          {entry.offeredBy && <p className="entry-modal-offered">offered by {entry.offeredBy}</p>}
        </div>
        <div className="entry-modal-body">
          {entry.tagline && <p className="entry-modal-tagline">{entry.tagline}</p>}
          {entry.imageUrl ? (
            <img className="entry-modal-image" src={entry.imageUrl} alt={entry.title} />
          ) : (
            entry.imageColor && <div className="entry-modal-image" style={{ background: entry.imageColor }} />
          )}
          <div className="entry-modal-text-box">
            {entry.link ? (
              <a href={entry.link} target="_blank" rel="noreferrer" className="entry-modal-link">
                <KindIcon kind={entry.kind} size={16} />
                {entry.body}
              </a>
            ) : (
              <p>{entry.body}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
