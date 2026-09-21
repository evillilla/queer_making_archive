import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Filters, type FilterState } from '../components/Filters';
import { EntryCanvas } from '../components/EntryCanvas';
import { EntryModal } from '../components/EntryModal';
import { AdminAccess } from '../components/AdminAccess';
import { mergeThreads } from '../data/entries';
import { KINDS } from '../data/types';
import type { Entry } from '../data/types';
import type { useAdminAuth } from '../hooks/useAdminAuth';
import type { useEntries } from '../hooks/useEntries';

interface ArchiveProps {
  entries: Entry[];
  loading: boolean;
  admin: ReturnType<typeof useAdminAuth>;
  reportEntry: ReturnType<typeof useEntries>['reportEntry'];
  deleteEntry: ReturnType<typeof useEntries>['deleteEntry'];
}

export function Archive({ entries, loading, admin, reportEntry, deleteEntry }: ArchiveProps) {
  const [filters, setFilters] = useState<FilterState>({ kind: 'All', thread: 'All', source: 'All' });
  const [openEntry, setOpenEntry] = useState<Entry | null>(null);

  const threads = useMemo(() => mergeThreads(entries), [entries]);

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
    return true;
  });

  return (
    <div className="archive-page">
      <Header />
      <Filters
        value={filters}
        onChange={setFilters}
        threads={threads}
        kindCounts={kindCounts}
        total={entries.length}
      />
      {loading ? (
        <p className="archive-loading">Loading the archive…</p>
      ) : (
        <EntryCanvas entries={filteredEntries} onOpen={setOpenEntry} />
      )}
      {openEntry && (
        <EntryModal
          entry={openEntry}
          onClose={() => setOpenEntry(null)}
          isAdmin={admin.isAdmin}
          onReport={(reason) => reportEntry(openEntry.id, reason)}
          onDelete={() => deleteEntry(openEntry.id)}
        />
      )}
      <AdminAccess admin={admin} />
    </div>
  );
}
