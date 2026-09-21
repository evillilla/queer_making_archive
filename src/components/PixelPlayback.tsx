// Pixel-art play/pause icons (8x8 grid), matching the style of PixelX.

const PLAY_CELLS: [number, number][] = [
  [1, 0],
  [1, 1], [2, 1],
  [1, 2], [2, 2], [3, 2],
  [1, 3], [2, 3], [3, 3], [4, 3],
  [1, 4], [2, 4], [3, 4], [4, 4],
  [1, 5], [2, 5], [3, 5],
  [1, 6], [2, 6],
  [1, 7],
];

const PAUSE_CELLS: [number, number][] = [
  [1, 0], [2, 0], [5, 0], [6, 0],
  [1, 1], [2, 1], [5, 1], [6, 1],
  [1, 2], [2, 2], [5, 2], [6, 2],
  [1, 3], [2, 3], [5, 3], [6, 3],
  [1, 4], [2, 4], [5, 4], [6, 4],
  [1, 5], [2, 5], [5, 5], [6, 5],
  [1, 6], [2, 6], [5, 6], [6, 6],
  [1, 7], [2, 7], [5, 7], [6, 7],
];

function PixelIcon({ cells, size = 16 }: { cells: [number, number][]; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

export function PixelPlay({ size = 16 }: { size?: number }) {
  return <PixelIcon cells={PLAY_CELLS} size={size} />;
}

export function PixelPause({ size = 16 }: { size?: number }) {
  return <PixelIcon cells={PAUSE_CELLS} size={size} />;
}
