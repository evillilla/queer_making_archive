import { useCallback, useState } from 'react';
import type { Entry } from '../data/types';
import { generatePdfThumbnail } from '../data/pdfThumbnail';
import { fetchLinkPreviewImage } from '../data/linkPreview';

interface BackfillResult {
  processed: number;
  updated: number;
}

// Backfills previews for PDF/link entries submitted before this feature
// existed. Runs entirely in the admin's own browser (using their
// already-entered passcode) so the app never needs to send that passcode
// anywhere else — one entry at a time, to stay gentle on the free link-
// preview API.
export function useThumbnailBackfill(
  entries: Entry[],
  updateThumbnail: (id: string, url: string) => Promise<boolean>,
) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BackfillResult | null>(null);

  const run = useCallback(async () => {
    const targets = entries.filter((e) => (e.kind === 'PDF' || e.kind === 'Link') && !e.thumbnailUrl);
    setResult(null);
    if (targets.length === 0) {
      setResult({ processed: 0, updated: 0 });
      return;
    }
    setRunning(true);
    let updated = 0;
    for (const entry of targets) {
      try {
        let thumbnailUrl: string | null = null;
        if (entry.kind === 'PDF' && entry.fileUrl) {
          const response = await fetch(entry.fileUrl);
          const blob = await response.blob();
          thumbnailUrl = await generatePdfThumbnail(blob);
        } else if (entry.kind === 'Link' && entry.link) {
          thumbnailUrl = (await fetchLinkPreviewImage(entry.link)) ?? null;
        }
        if (thumbnailUrl) {
          const ok = await updateThumbnail(entry.id, thumbnailUrl);
          if (ok) updated += 1;
        }
      } catch {
        // skip this one, continue with the rest
      }
    }
    setRunning(false);
    setResult({ processed: targets.length, updated });
  }, [entries, updateThumbnail]);

  return { run, running, result };
}
