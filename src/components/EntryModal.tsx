import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Entry } from '../data/types';
import { KindIcon } from './kindIcon';
import { PixelX } from './PixelX';
import { DownloadIcon, TrashIcon, FlagIcon } from './customIcons';
import './EntryModal.css';

interface EntryModalProps {
  entry: Entry;
  onClose: () => void;
  isAdmin: boolean;
  onReport: (reason: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}

function formatLinkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function isPreviewableUrl(url: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function EntryMedia({ entry }: { entry: Entry }) {
  if (entry.kind === 'Image') {
    if (entry.fileUrl) return <img className="entry-modal-image" src={entry.fileUrl} alt={entry.title} />;
    if (entry.imageColor) return <div className="entry-modal-image" style={{ background: entry.imageColor }} />;
    return null;
  }

  if (entry.kind === 'Sound' && entry.fileUrl) {
    return <audio className="entry-modal-audio" controls src={entry.fileUrl} />;
  }

  if (entry.kind === 'Video' && entry.fileUrl) {
    return <video className="entry-modal-video" controls src={entry.fileUrl} />;
  }

  if (entry.fileUrl) {
    return (
      <a href={entry.fileUrl} target="_blank" rel="noreferrer" className="entry-modal-link">
        <DownloadIcon size={14} />
        {entry.fileName ?? 'Open file'}
      </a>
    );
  }

  return null;
}

export function EntryModal({ entry, onClose, isAdmin, onReport, onDelete }: EntryModalProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleReportSubmit = async () => {
    setReportError('');
    const ok = await onReport(reportReason.trim());
    if (ok) {
      setReportSent(true);
      setShowReportForm(false);
    } else {
      setReportError('Something went wrong — please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${entry.title}" for everyone? This can't be undone.`)) return;
    setDeleting(true);
    setDeleteError('');
    const ok = await onDelete();
    if (ok) {
      onClose();
    } else {
      setDeleting(false);
      setDeleteError('Something went wrong — please try again.');
    }
  };

  return (
    <div className="entry-modal-overlay" onClick={onClose}>
      <div className="entry-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="entry-modal-close" onClick={onClose} aria-label="Close">
          <PixelX size={16} />
        </button>
        <div className="entry-modal-header">
          <div className="entry-modal-meta">
            <KindIcon kind={entry.kind} size={14} />
            <span>
              {entry.kind.toUpperCase()} &middot; {entry.thread.toUpperCase()}
            </span>
          </div>
          <h2 className="entry-modal-title">{entry.title}</h2>
          {entry.offeredBy && <p className="entry-modal-offered">offered by {entry.offeredBy}</p>}
        </div>
        <div className="entry-modal-body">
          {entry.tagline && <p className="entry-modal-tagline">{entry.tagline}</p>}

          <EntryMedia entry={entry} />

          {entry.link ? (
            <div className="entry-modal-link-preview">
              {isPreviewableUrl(entry.link) && (
                <iframe
                  key={entry.link}
                  src={entry.link}
                  title={entry.title}
                  className="entry-modal-iframe"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <a href={entry.link} target="_blank" rel="noreferrer" className="entry-modal-link">
                <ExternalLink size={14} />
                {formatLinkLabel(entry.link)}
              </a>
              {isPreviewableUrl(entry.link) && (
                <p className="entry-modal-iframe-hint">
                  Some sites block being shown inside another page — if the preview above is
                  blank, use the link to open it directly.
                </p>
              )}
            </div>
          ) : (
            entry.body && (
              <div className="entry-modal-text-box">
                <p>{entry.body}</p>
              </div>
            )
          )}

          <div className="entry-modal-footer-controls">
            {reportSent ? (
              <p className="entry-modal-report-thanks">Thanks — this has been flagged for review.</p>
            ) : showReportForm ? (
              <div className="entry-modal-report-form">
                <textarea
                  placeholder="What's wrong with this offering? (optional)"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={2}
                />
                <div className="entry-modal-report-actions">
                  <button type="button" onClick={handleReportSubmit} className="entry-modal-report-submit">
                    Submit report
                  </button>
                  <button type="button" onClick={() => setShowReportForm(false)} className="entry-modal-report-cancel">
                    Cancel
                  </button>
                </div>
                {reportError && <p className="entry-modal-report-error">{reportError}</p>}
              </div>
            ) : (
              <button type="button" className="entry-modal-report-link" onClick={() => setShowReportForm(true)}>
                <FlagIcon size={13} />
                Report this offering
              </button>
            )}

            {isAdmin && (
              <div className="entry-modal-admin">
                <span className="entry-modal-admin-info">
                  {entry.reportCount ? `${entry.reportCount} report(s)` : 'No reports'}
                  {entry.hidden ? ' · hidden' : ''}
                </span>
                {deleteError && <span className="entry-modal-report-error">{deleteError}</span>}
                <button type="button" className="entry-modal-delete" onClick={handleDelete} disabled={deleting}>
                  <TrashIcon size={13} />
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
