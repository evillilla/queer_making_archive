import { useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import type { Entry } from '../data/types';
import { isMinorActsSource } from '../data/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import { EntryCard } from './EntryCard';
import { PlaceIcon } from './customIcons';
import './EntryCanvas.css';

interface EntryCanvasProps {
  entries: Entry[];
  onOpen: (entry: Entry) => void;
  lastViewedEntryId: string | null;
  favoriteIds: string[];
  isFavorited: (id: string) => boolean;
}

interface Cluster {
  x: number;
  y: number;
  count: number;
}

const CLUSTER_DISTANCE = 420;
const HIGHLIGHT_DURATION_MS = 4000;

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

function center(entry: Entry) {
  return { x: entry.x + 110, y: entry.y + 80 };
}

function groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}

function edgesWithinGroups(groups: Map<unknown, Entry[]>, color: string): Edge[] {
  const edges: Edge[] = [];
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = center(group[i]);
        const b = center(group[j]);
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color });
      }
    }
  }
  return edges;
}

function computeEdges(entries: Entry[]): Edge[] {
  const byThread = groupBy(entries, (e) => e.thread);
  const byMinorActsSource = groupBy(
    entries.filter((e) => isMinorActsSource(e.source)),
    (e) => e.source,
  );
  return [
    ...edgesWithinGroups(byThread, 'var(--color-line-neutral)'),
    ...edgesWithinGroups(byMinorActsSource, 'var(--color-accent)'),
  ];
}

// A trail through your own favorites, in the order you saved them —
// rather than a full mesh, which would get busy fast as favorites grow.
function computeFavoriteTrail(favoriteIds: string[], entries: Entry[]): Edge[] {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const edges: Edge[] = [];
  for (let i = 0; i < favoriteIds.length - 1; i++) {
    const a = byId.get(favoriteIds[i]);
    const b = byId.get(favoriteIds[i + 1]);
    if (!a || !b) continue;
    const ca = center(a);
    const cb = center(b);
    edges.push({ x1: ca.x, y1: ca.y, x2: cb.x, y2: cb.y, color: 'var(--color-favorite)' });
  }
  return edges;
}

function computeClusters(entries: Entry[]): Cluster[] {
  const clusters: Cluster[] = [];
  for (const entry of entries) {
    const cx = entry.x + 110;
    const cy = entry.y + 80;
    const nearest = clusters.find((c) => Math.hypot(c.x - cx, c.y - cy) < CLUSTER_DISTANCE);
    if (nearest) {
      nearest.x = (nearest.x * nearest.count + cx) / (nearest.count + 1);
      nearest.y = (nearest.y * nearest.count + cy) / (nearest.count + 1);
      nearest.count += 1;
    } else {
      clusters.push({ x: cx, y: cy, count: 1 });
    }
  }
  return clusters;
}

export function EntryCanvas({
  entries,
  onOpen,
  lastViewedEntryId,
  favoriteIds,
  isFavorited,
}: EntryCanvasProps) {
  // Favorited entries get their own coral glow instead — leave them out of
  // the general chartreuse density blobs so the two don't visually mix.
  const clusters = useMemo(
    () => computeClusters(entries.filter((e) => !isFavorited(e.id))),
    [entries, isFavorited],
  );
  const edges = useMemo(
    () => [...computeEdges(entries), ...computeFavoriteTrail(favoriteIds, entries)],
    [entries, favoriteIds],
  );

  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const hasFitInitially = useRef(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Fits the view to wherever the cards actually are, instead of the
  // canvas's fixed geometric center — with entries scattered across a
  // large world, that center can easily land in empty space (worst on
  // narrow/mobile viewports, where the visible slice is smallest).
  const fitAllCards = (animationTime: number) => {
    const cards = worldRef.current?.querySelectorAll<HTMLElement>('.entry-card');
    if (!transformRef.current || !cards || cards.length === 0) return;
    transformRef.current.zoomToElement(Array.from(cards), { maxScale: 1.1, animationTime });
  };

  useEffect(() => {
    if (hasFitInitially.current || entries.length === 0) return;
    hasFitInitially.current = true;
    const frame = requestAnimationFrame(() => fitAllCards(0));
    return () => cancelAnimationFrame(frame);
  }, [entries]);

  const handleFindMe = () => {
    if (!lastViewedEntryId) return;
    fitAllCards(500);
    setHighlightedId(lastViewedEntryId);
    window.setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
  };

  return (
    <div className="entry-canvas-viewport">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.4}
        maxScale={2.5}
        centerOnInit
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        >
          <div ref={worldRef} className="entry-canvas-world" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
            {clusters.map((cluster, i) => {
              const size = 380 + cluster.count * 90;
              return (
                <div
                  key={i}
                  className="entry-canvas-blob"
                  style={{
                    left: cluster.x,
                    top: cluster.y,
                    width: size,
                    height: size,
                  }}
                />
              );
            })}
            <svg className="entry-canvas-edges" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
              {edges.map((edge, i) => (
                <line
                  key={i}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={edge.color}
                  strokeWidth={1}
                  opacity={0.7}
                />
              ))}
            </svg>
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onOpen={onOpen}
                isHighlighted={entry.id === highlightedId}
                isFavorited={isFavorited(entry.id)}
              />
            ))}
            {entries.length === 0 && (
              <div className="entry-canvas-empty">No offerings match these filters yet.</div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {lastViewedEntryId && (
        <button type="button" className="entry-canvas-find-me" onClick={handleFindMe}>
          <PlaceIcon size={14} />
          Find me
        </button>
      )}
    </div>
  );
}
