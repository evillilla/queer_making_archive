import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { KINDS, SOURCES, type Kind, type Source } from '../data/types';
import { useEntries } from '../hooks/useEntries';
import './Offer.css';

const KIND_ATTACHMENT_LABEL: Record<Kind, string> = {
  Image: 'Image file',
  Sound: 'Sound file',
  PDF: 'PDF file',
  Object: 'Photo of the object',
  Writing: 'Your writing',
  Link: 'Link URL',
};

export function Offer({ addEntry }: { addEntry: ReturnType<typeof useEntries>['addEntry'] }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<Kind>('Image');
  const [thread, setThread] = useState('');
  const [source, setSource] = useState<Source | ''>('');
  const [offeredBy, setOfferedBy] = useState('');
  const [note, setNote] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !thread.trim() || !source) return;

    addEntry({
      kind,
      thread: thread.trim(),
      source,
      title: title.trim(),
      offeredBy: offeredBy.trim() || undefined,
      tagline: note.trim() || undefined,
      excerpt: (kind === 'Writing' ? text : note || fileName || `A ${kind.toLowerCase()} offering.`).slice(0, 160),
      body:
        kind === 'Writing'
          ? text.trim() || 'No text was provided.'
          : kind === 'Link'
            ? link.trim()
            : note.trim() || (fileName ? `Attached: ${fileName}` : 'No description was provided.'),
      link: kind === 'Link' ? link.trim() : undefined,
      imageColor: kind === 'Image' || kind === 'Object' ? 'linear-gradient(135deg, #cbd8a0, #9fb385)' : undefined,
    });

    navigate('/');
  };

  const needsFile = kind === 'Image' || kind === 'Sound' || kind === 'PDF' || kind === 'Object';

  return (
    <div className="offer-page">
      <Link to="/" className="offer-back">
        <ArrowLeft size={16} />
        Back to the archive
      </Link>

      <h1 className="offer-heading">Offer something to the archive</h1>
      <p className="offer-description">
        No account needed. Share an image, a recording, a piece of writing, a link — anything
        that speaks to Making.
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

        <div className="offer-field-row">
          <label className="offer-field">
            <span>Kind</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>

          <label className="offer-field">
            <span>Thread</span>
            <input
              type="text"
              placeholder="e.g. toolmaking, gesture, repair"
              value={thread}
              onChange={(e) => setThread(e.target.value)}
              required
            />
          </label>
        </div>

        <label className="offer-field">
          <span>Source</span>
          <select value={source} onChange={(e) => setSource(e.target.value as Source)} required>
            <option value="" disabled>
              Where does it come from?
            </option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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

        {kind === 'Writing' && (
          <label className="offer-field">
            <span>Your writing</span>
            <textarea
              placeholder="Share the piece itself"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              required
            />
          </label>
        )}

        {kind === 'Link' && (
          <label className="offer-field">
            <span>Link URL</span>
            <input
              type="url"
              placeholder="https://…"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </label>
        )}

        {needsFile && (
          <label className="offer-field">
            <span>{KIND_ATTACHMENT_LABEL[kind]}</span>
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
          </label>
        )}

        <button type="submit" className="offer-submit">
          Offer to the archive
        </button>
      </form>
    </div>
  );
}
