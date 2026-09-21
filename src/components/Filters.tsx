import { KINDS, SOURCES, type Kind, type Source } from '../data/types';
import './Filters.css';

export interface FilterState {
  kind: Kind | 'All';
  thread: string | 'All';
  source: Source | 'All';
}

interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  threads: string[];
  kindCounts: Record<string, number>;
  total: number;
}

function Pill({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      className={`filter-pill${active ? ' filter-pill-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
      {typeof count === 'number' && <span className="filter-pill-count">{count}</span>}
    </button>
  );
}

export function Filters({ value, onChange, threads, kindCounts, total }: FiltersProps) {
  return (
    <div className="filters">
      <div className="filter-row">
        <span className="filter-label">Kind</span>
        <div className="filter-pills">
          <Pill active={value.kind === 'All'} onClick={() => onChange({ ...value, kind: 'All' })} count={total}>
            All
          </Pill>
          {KINDS.map((kind) => (
            <Pill
              key={kind}
              active={value.kind === kind}
              onClick={() => onChange({ ...value, kind })}
              count={kindCounts[kind] ?? 0}
            >
              {kind}
            </Pill>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Thread</span>
        <div className="filter-pills">
          <Pill active={value.thread === 'All'} onClick={() => onChange({ ...value, thread: 'All' })}>
            All
          </Pill>
          {threads.map((thread) => (
            <Pill
              key={thread}
              active={value.thread === thread}
              onClick={() => onChange({ ...value, thread })}
            >
              {thread}
            </Pill>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Source</span>
        <div className="filter-pills">
          <Pill active={value.source === 'All'} onClick={() => onChange({ ...value, source: 'All' })}>
            All
          </Pill>
          {SOURCES.map((source) => (
            <Pill
              key={source}
              active={value.source === source}
              onClick={() => onChange({ ...value, source })}
            >
              {source}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
