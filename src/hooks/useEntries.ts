import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { seedEntries, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import { rowToEntry, entryToRow, type EntryRow } from '../data/mapEntry';
import type { Entry } from '../data/types';

export type NewEntry = Omit<Entry, 'id' | 'x' | 'y' | 'fileUrl' | 'reportCount' | 'hidden'>;

export function useEntries(adminPasscode: string | null) {
  const [entries, setEntries] = useState<Entry[]>(isSupabaseConfigured ? [] : seedEntries);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const fetchEntries = useCallback(async (passcode: string | null) => {
    if (!supabase) return;
    try {
      const { data, error } = passcode
        ? await supabase.rpc('admin_list_entries', { p_passcode: passcode })
        : await supabase.from('entries').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        setEntries((data as EntryRow[]).map(rowToEntry));
      }
    } catch {
      // network/connection failure — leave whatever entries we already have
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(adminPasscode);
  }, [fetchEntries, adminPasscode]);

  const addEntry = useCallback(async (entry: NewEntry, file: File | null) => {
    if (!supabase) return null;
    try {
      let fileUrl: string | undefined;
      if (file) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('offerings').upload(path, file);
        if (!uploadError) {
          fileUrl = supabase.storage.from('offerings').getPublicUrl(path).data.publicUrl;
        }
      }

      const row = entryToRow({
        ...entry,
        fileUrl,
        x: Math.round(140 + Math.random() * (CANVAS_WIDTH - 400)),
        y: Math.round(120 + Math.random() * (CANVAS_HEIGHT - 300)),
      });

      const { data, error } = await supabase.from('entries').insert(row).select().single();
      if (error || !data) return null;

      const newEntry = rowToEntry(data as EntryRow);
      setEntries((prev) => [...prev, newEntry]);
      return newEntry;
    } catch {
      return null;
    }
  }, []);

  const reportEntry = useCallback(async (entryId: string, reason: string) => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.rpc('report_entry', {
        p_entry_id: entryId,
        p_reason: reason || null,
      });
      return !error;
    } catch {
      return false;
    }
  }, []);

  const deleteEntry = useCallback(
    async (entryId: string) => {
      if (!supabase || !adminPasscode) return false;
      try {
        const { data, error } = await supabase.rpc('admin_delete_entry', {
          p_passcode: adminPasscode,
          p_entry_id: entryId,
        });
        if (error || !data) return false;
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        return true;
      } catch {
        return false;
      }
    },
    [adminPasscode],
  );

  return { entries, loading, addEntry, reportEntry, deleteEntry };
}
