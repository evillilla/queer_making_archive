import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Entry } from '../data/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import { EntryCard } from './EntryCard';
import './EntryCanvas.css';

interface EntryCanvasProps {
  entries: Entry[];
  onOpen: (entry: Entry) => void;
}

export function EntryCanvas({ entries, onOpen }: EntryCanvasProps) {
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
