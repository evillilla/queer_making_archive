import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type Entry, type Kind } from '../data/types';
import { mergeThreads, mergeSources } from '../data/entries';
import { detectKindFromFile } from '../data/detectKind';
import { KindIcon } from '../components/kindIcon';
import { useEntries } from '../hooks/useEntries';
import './Offer.css';

const NEW_THREAD = '__new__';

export function Offer({
  entries,
  addEntry,
}: {
  entries: Entry[];
  addEntry: ReturnType<typeof useEntries>['addEntry'];
}) {
  const navigate = useNavigate();
  const threads = useMemo(() => mergeThreads(entries), [entries]);
  const sources = useMemo(() => mergeSources(entries), [entries]);

  const [title, setTitle] = useState('');
  const [selectedThread, setSelectedThread] = useState('');
  const [newThread, setNewThread] = useState('');
  const [isNewThread, setIsNewThread] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [isCustomSource, setIsCustomSource] = useState(false);
  const [offeredBy, setOfferedBy] = useState('');
  const [note, setNote] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const derivedKind: Kind | null = file
    ? detectKindFromFile(file)
    : link.trim()
      ? 'Link'
      : text.trim()
        ? 'Writing'
        : null;

  const thread = isNewThread ? newThread.trim() : selectedThread;
  const source = isCustomSource ? customSource.trim() : selectedSource;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !thread || !source) return;
    if (!derivedKind) {
      setError('Add a link, some writing, or a file so the archive knows what this is.');
      return;
    }

    setSubmitting(true);

    const result = await addEntry(
      {
        kind: derivedKind,
        thread,
        source,
        title: title.trim(),
        offeredBy: offeredBy.trim() || undefined,
        tagline: note.trim() || undefined,
        excerpt: (note.trim() || text.trim() || file?.name || 'A new offering.').slice(0, 160),
        body:
          derivedKind === 'Link'
            ? link.trim()
            : derivedKind === 'Writing'
              ? text.trim()
              : note.trim() || (file ? `Attached: ${file.name}` : 'No description was provided.'),
        link: derivedKind === 'Link' ? link.trim() : undefined,
        fileName: file?.name,
      },
      file,
    );

    setSubmitting(false);
    if (!result) {
      setError('Something went wrong submitting this — please try again.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="offer-page">
      <Link to="/" className="offer-back">
        <ArrowLeft size={16} />
        Back to the archive
      </Link>

      <h1 className="offer-heading">Offer something to the archive</h1>
      <p className="offer-description">
        No account needed. Share an image, a recording, a video, a font, a piece of writing, a
        link — anything that speaks to Making.
      </p>

      <form className="offer-form" onSubmit={handleSubmit}>
        <label className="offer-field">
          <span>Title</span>
          <input
            type="text"
            placeholder="A name for what you're sharing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="offer-field">
          <span>Thread</span>
          {isNewThread ? (
            <div className="offer-thread-new">
              <input
                type="text"
                placeholder="Name the new thread"
                value={newThread}
                onChange={(e) => setNewThread(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="offer-thread-toggle"
                onClick={() => {
                  setIsNewThread(false);
                  setNewThread('');
                }}
              >
                Choose an existing thread instead
              </button>
            </div>
          ) : (
            <select
              value={selectedThread}
              onChange={(e) => {
                if (e.target.value === NEW_THREAD) {
                  setIsNewThread(true);
                } else {
                  setSelectedThread(e.target.value);
                }
              }}
              required
            >
              <option value="" disabled>
                Choose an existing thread
              </option>
              {threads.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value={NEW_THREAD}>+ Add a new thread…</option>
            </select>
          )}
        </label>

        <label className="offer-field">
          <span>Source</span>
          {isCustomSource ? (
            <div className="offer-thread-new">
              <input
                type="text"
                placeholder="Where does it come from?"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="offer-thread-toggle"
                onClick={() => {
                  setIsCustomSource(false);
                  setCustomSource('');
                }}
              >
                Choose an existing source instead
              </button>
            </div>
          ) : (
            <select
              value={selectedSource}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setIsCustomSource(true);
                } else {
                  setSelectedSource(e.target.value);
                }
              }}
              required
            >
              <option value="" disabled>
                Where does it come from?
              </option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className="offer-field">
          <span>Your name (optional)</span>
          <input
            type="text"
            placeholder="How you'd like to be credited"
            value={offeredBy}
            onChange={(e) => setOfferedBy(e.target.value)}
          />
        </label>

        <label className="offer-field">
          <span>A short note (optional)</span>
          <textarea
            placeholder="What is it? Why does it belong here?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </label>

        <label className="offer-field">
          <span>Your writing</span>
          <textarea
            placeholder="If you're sharing writing, put it here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </label>

        <label className="offer-field">
          <span>Link URL</span>
          <input
            type="url"
            placeholder="https://…"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>

        <label className="offer-field">
          <span>Attach a file</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <span className="offer-field-hint">
            Image, sound, video, PDF, font — anything. It'll be tagged automatically.
          </span>
        </label>

        {derivedKind && (
          <div className="offer-detected-kind">
            <KindIcon kind={derivedKind} size={16} />
            Will be tagged as <strong>{derivedKind}</strong>
          </div>
        )}

        {error && <p className="offer-error">{error}</p>}

        <button type="submit" className="offer-submit" disabled={submitting}>
          Offer to the archive
        </button>
      </form>
    </div>
  );
}
