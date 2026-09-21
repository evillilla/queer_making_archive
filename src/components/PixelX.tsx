// A rough placeholder pixel-art X (8x8 grid) in the app's burgundy.
// Swap this for the real icon asset whenever it's available.
const CELLS: [number, number][] = [
  [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
  [7, 0], [6, 1], [5, 2], [4, 3], [3, 4], [2, 5], [1, 6], [0, 7],
];

export function PixelX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges">
      {CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}
