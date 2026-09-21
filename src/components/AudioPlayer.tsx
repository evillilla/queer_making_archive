import { useEffect, useRef, useState } from 'react';
import { PixelPlay, PixelPause } from './PixelPlayback';
import './AudioPlayer.css';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <button type="button" className="audio-player-toggle" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <PixelPause size={16} /> : <PixelPlay size={16} />}
      </button>
      <input
        type="range"
        className="audio-player-seek"
        min={0}
        max={duration || 0}
        step={0.01}
        value={currentTime}
        onChange={(e) => handleSeek(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--color-maroon) ${progress}%, #f0f0f0 ${progress}%)` }}
      />
      <span className="audio-player-time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
