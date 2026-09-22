import { useState } from 'react';
import type { Entry } from '../data/types';
import { isMinorActsSource } from '../data/types';
import { KindIcon } from './kindIcon';
import { MinorActsBadge } from './MinorActsBadge';
import { getFaviconUrl, formatLinkDomain } from '../data/linkPreview';
import './EntryCard.css';

interface EntryCardProps {
  entry: Entry;
  onOpen: (entry: Entry) => void;
  isHighlighted?: boolean;
  isFavorited: boolean;
  isAdmin: boolean;
}

function reportLabel(count: number): string {
  return `${count} report${count === 1 ? '' : 's'}`;
}

// Thumbnails can come from a remote URL (an og:image that might later 404,
// or a favicon service a visitor's network happens to block) — fall back
// to the plain icon layout rather than showing a broken image.
function EntryCardMedia({ entry }: { entry: Entry }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [faviconFailed, setFaviconFailed] = useState(false);

  if (entry.kind === 'Image' && entry.fileUrl) {
    return <img className="entry-card-image" src={entry.fileUrl} alt={entry.title} />;
  }

  const hasThumbnail = Boolean(entry.thumbnailUrl) && !thumbnailFailed;

  if ((entry.kind === 'Video' || entry.kind === 'PDF' || entry.kind === 'Link') && hasThumbnail) {
    return (
      <img
        className="entry-card-image"
        src={entry.thumbnailUrl}
        alt={entry.title}
        onError={() => setThumbnailFailed(true)}
      />
    );
  }

  if (entry.kind === 'Video' || entry.kind === 'Sound' || entry.kind === 'PDF') {
    return (
      <div className="entry-card-icon-header">
        <KindIcon kind={entry.kind} size={40} />
      </div>
    );
  }

  if (entry.kind === 'Link') {
    const favicon = entry.link && !faviconFailed ? getFaviconUrl(entry.link) : undefined;
    return (
      <div className="entry-card-icon-header entry-card-link-header">
        {favicon ? (
          <img
            className="entry-card-favicon"
            src={favicon}
            alt=""
            onError={() => setFaviconFailed(true)}
          />
        ) : (
          <KindIcon kind="Link" size={40} />
        )}
        {entry.link && <span className="entry-card-link-domain">{formatLinkDomain(entry.link)}</span>}
      </div>
    );
  }

  if (entry.imageColor) {
    return <div className="entry-card-image" style={{ background: entry.imageColor }} />;
  }

  return (
    <div className="entry-card-header">
      <KindIcon kind={entry.kind} />
      <span className="entry-card-excerpt">{entry.excerpt}</span>
    </div>
  );
}

export function EntryCard({ entry, onOpen, isHighlighted, isFavorited, isAdmin }: EntryCardProps) {
  const showReportTag = isAdmin && Boolean(entry.reportCount);
  return (
    <button
      type="button"
      className={`entry-card${entry.hidden ? ' entry-card-hidden' : ''}${isHighlighted ? ' entry-card-highlighted' : ''}${isFavorited ? ' entry-card-favorited' : ''}`}
      onClick={() => onOpen(entry)}
      style={{ left: entry.x, top: entry.y }}
    >
      {entry.hidden ? (
        <span className="entry-card-hidden-tag">
          Hidden{showReportTag ? ` · ${reportLabel(entry.reportCount!)}` : ''}
        </span>
      ) : (
        showReportTag && (
          <span className="entry-card-report-tag">{reportLabel(entry.reportCount!)}</span>
        )
      )}
      <EntryCardMedia entry={entry} />
      <div className="entry-card-footer">
        {isMinorActsSource(entry.source) && <MinorActsBadge size={13} />}
        <span className="entry-card-title">{entry.title}</span>
      </div>
    </button>
  );
}
