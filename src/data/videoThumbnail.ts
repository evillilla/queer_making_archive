const MAX_THUMBNAIL_WIDTH = 480;
const CAPTURE_TIMEOUT_MS = 8000;

// Grabs a still frame from a video file client-side and returns it as a
// JPEG data URL, for use as a card/modal thumbnail. Returns null if the
// browser can't decode the file or nothing loads in time — callers should
// treat that as "no thumbnail available" rather than an error.
export function generateVideoThumbnail(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    let settled = false;
    const finish = (result: string | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      resolve(result);
    };

    const timeout = setTimeout(() => finish(null), CAPTURE_TIMEOUT_MS);

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, (video.duration || 1) / 2);
    });

    video.addEventListener('seeked', () => {
      try {
        const scale = Math.min(1, MAX_THUMBNAIL_WIDTH / video.videoWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx || canvas.width === 0 || canvas.height === 0) {
          finish(null);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        finish(null);
      }
    });

    video.addEventListener('error', () => finish(null));
  });
}
