import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Header } from '../components/Header';
import { Filters, type FilterState } from '../components/Filters';
import { EntryCanvas } from '../components/EntryCanvas';
import { EntryModal } from '../components/EntryModal';
import { AdminAccess } from '../components/AdminAccess';
import { mergeThreads, mergeSources } from '../data/entries';
import { KINDS } from '../data/types';
import type { Entry } from '../data/types';
import type { useAdminAccess } from '../hooks/useAdminAccess';
import type { useEntries } from '../hooks/useEntries';
import { useFavorites } from '../hooks/useFavorites';

interface ArchiveProps {
  entries: Entry[];
  loading: boolean;
  admin: ReturnType<typeof useAdminAccess>;
  reportEntry: ReturnType<typeof useEntries>['reportEntry'];
  deleteEntry: ReturnType<typeof useEntries>['deleteEntry'];
  updateThumbnail: ReturnType<typeof useEntries>['updateThumbnail'];
}

export function Archive({ entries, loading, admin, reportEntry, deleteEntry, updateThumbnail }: ArchiveProps) {
  const [filters, setFilters] = useState<FilterState>({
    kind: 'All',
    thread: 'All',
    source: 'All',
    favoritesOnly: false,
  });
  const [openEntry, setOpenEntry] = useState<Entry | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [lastViewedEntryId, setLastViewedEntryId] = useState<string | null>(null);
  const favorites = useFavorites();

  const handleOpenEntry = (entry: Entry) => {
    setOpenEntry(entry);
    setLastViewedEntryId(entry.id);
  };

  const threads = useMemo(() => mergeThreads(entries), [entries]);
  const sources = useMemo(() => mergeSources(entries), [entries]);

  const kindCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const k of KINDS) counts[k] = 0;
    for (const e of entries) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
    return counts;
  }, [entries]);

  const filteredEntries = entries.filter((e) => {
    if (filters.kind !== 'All' && e.kind !== filters.kind) return false;
    if (filters.thread !== 'All' && e.thread !== filters.thread) return false;
    if (filters.source !== 'All' && e.source !== filters.source) return false;
    if (filters.favoritesOnly && !favorites.isFavorited(e.id)) return false;
    return true;
  });

  const activeFilterCount =
    [filters.kind, filters.thread, filters.source].filter((v) => v !== 'All').length +
    (filters.favoritesOnly ? 1 : 0);

  return (
    <div className="archive-page">
      {loading ? (
        <p className="archive-loading">Loading the archive…</p>
      ) : (
        <EntryCanvas
          entries={filteredEntries}
          onOpen={handleOpenEntry}
          lastViewedEntryId={lastViewedEntryId}
          favoriteIds={favorites.favoriteIds}
          isFavorited={favorites.isFavorited}
        />
      )}

      <div className="archive-overlay-panel">
        <Header />

        <button
          type="button"
          className="archive-panel-toggle"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
        >
          About &amp; filters
          {activeFilterCount > 0 && <span className="archive-panel-toggle-count">{activeFilterCount}</span>}
          <ChevronDown size={16} className={`archive-panel-toggle-chevron${panelOpen ? ' is-open' : ''}`} />
        </button>

        <div className={`archive-panel-body${panelOpen ? ' is-open' : ''}`}>
          <p className="archive-subtitle">
            A nebulous, growing web of offerings. Images, sounds, writing, links and objects,
            circling the practice of making. Add your own thread.
          </p>
          <Filters
            value={filters}
            onChange={setFilters}
            threads={threads}
            sources={sources}
            kindCounts={kindCounts}
            total={entries.length}
            favoriteCount={favorites.favoriteIds.length}
          />
        </div>
      </div>

      {openEntry && (
        <EntryModal
          entry={openEntry}
          onClose={() => setOpenEntry(null)}
          isAdmin={admin.isAdmin}
          onReport={(reason) => reportEntry(openEntry.id, reason)}
          onDelete={() => deleteEntry(openEntry.id)}
          isFavorited={favorites.isFavorited(openEntry.id)}
          onToggleFavorite={() => favorites.toggleFavorite(openEntry.id)}
        />
      )}
      <AdminAccess admin={admin} entries={entries} updateThumbnail={updateThumbnail} />
    </div>
  );
}
