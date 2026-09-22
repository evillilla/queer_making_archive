const MAX_THUMBNAIL_WIDTH = 480;

let workerConfigured = false;

// pdf.js is a heavy dependency (300KB+ gzipped) that most visitors never
// need — only loaded on demand when a PDF is actually being processed
// (submitting one, or the admin thumbnail backfill), via dynamic import so
// it lands in its own chunk instead of the main bundle.
async function loadPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!workerConfigured) {
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    workerConfigured = true;
  }
  return pdfjsLib;
}

// Renders a PDF's first page to a JPEG data URL client-side, for use as a
// card/modal thumbnail. Returns null if the file can't be parsed/rendered —
// callers should treat that as "no thumbnail available" rather than an error.
export async function generatePdfThumbnail(file: File | Blob): Promise<string | null> {
  try {
    const pdfjsLib = await loadPdfJs();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(2, MAX_THUMBNAIL_WIDTH / baseViewport.width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    if (canvas.width === 0 || canvas.height === 0) return null;

    await page.render({ canvas, viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    return null;
  }
}
