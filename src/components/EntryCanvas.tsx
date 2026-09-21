import { useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Entry } from '../data/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import { EntryCard } from './EntryCard';
import './EntryCanvas.css';

interface EntryCanvasProps {
  entries: Entry[];
  onOpen: (entry: Entry) => void;
}

interface Cluster {
  x: number;
  y: number;
  count: number;
}

const CLUSTER_DISTANCE = 420;

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

export function EntryCanvas({ entries, onOpen }: EntryCanvasProps) {
  const clusters = useMemo(() => computeClusters(entries), [entries]);

  return (
    <div className="entry-canvas-viewport">
      <TransformWrapper
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
          <div className="entry-canvas-world" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
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
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onOpen={onOpen} />
            ))}
            {entries.length === 0 && (
              <div className="entry-canvas-empty">No offerings match these filters yet.</div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
