import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { seedEntries, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import { rowToEntry, entryToRow, type EntryRow } from '../data/mapEntry';
import type { Entry } from '../data/types';

export type NewEntry = Omit<Entry, 'id' | 'x' | 'y' | 'fileUrl' | 'reportCount' | 'hidden'>;

export type AddEntryResult = { ok: true; entry: Entry } | { ok: false; error: string };

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

  const addEntry = useCallback(async (entry: NewEntry, file: File | null): Promise<AddEntryResult> => {
    if (!supabase) {
      return {
        ok: false,
        error: isSupabaseConfigured
          ? 'Could not reach the server — check your connection and try again.'
          : 'Backend not configured for this deployment (missing Supabase environment variables).',
      };
    }
    try {
      let fileUrl: string | undefined;
      if (file) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('offerings').upload(path, file);
        if (uploadError) {
          console.error('File upload failed:', uploadError);
          const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
          return {
            ok: false,
            error: `Couldn't upload "${file.name}" (${sizeMb} MB): ${uploadError.message}. Large files may exceed this project's upload size limit.`,
          };
        }
        fileUrl = supabase.storage.from('offerings').getPublicUrl(path).data.publicUrl;
      }

      const row = entryToRow({
        ...entry,
        fileUrl,
        x: Math.round(140 + Math.random() * (CANVAS_WIDTH - 400)),
        y: Math.round(120 + Math.random() * (CANVAS_HEIGHT - 300)),
      });

      const { data, error } = await supabase.from('entries').insert(row).select().single();
      if (error || !data) {
        console.error('Insert entry failed:', error);
        return { ok: false, error: 'Something went wrong saving this — please try again.' };
      }

      const newEntry = rowToEntry(data as EntryRow);
      setEntries((prev) => [...prev, newEntry]);
      return { ok: true, entry: newEntry };
    } catch (err) {
      console.error('addEntry failed:', err);
      return { ok: false, error: 'Something went wrong submitting this — please try again.' };
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

  const updateThumbnail = useCallback(
    async (entryId: string, thumbnailUrl: string) => {
      if (!supabase || !adminPasscode) return false;
      try {
        const { data, error } = await supabase.rpc('admin_update_thumbnail', {
          p_passcode: adminPasscode,
          p_entry_id: entryId,
          p_thumbnail_url: thumbnailUrl,
        });
        if (error || !data) return false;
        setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, thumbnailUrl } : e)));
        return true;
      } catch {
        return false;
      }
    },
    [adminPasscode],
  );

  const clearReports = useCallback(
    async (entryId: string) => {
      if (!supabase || !adminPasscode) return false;
      try {
        const { data, error } = await supabase.rpc('admin_clear_reports', {
          p_passcode: adminPasscode,
          p_entry_id: entryId,
        });
        if (error || !data) return false;
        setEntries((prev) =>
          prev.map((e) => (e.id === entryId ? { ...e, reportCount: 0, hidden: false } : e)),
        );
        return true;
      } catch {
        return false;
      }
    },
    [adminPasscode],
  );

  return { entries, loading, addEntry, reportEntry, deleteEntry, updateThumbnail, clearReports };
}
