import type { Entry } from './types';

// Placeholder seed content standing in for the real archive entries.
// Replace freely — this only exists so the canvas isn't empty.
export const seedEntries: Entry[] = [
  {
    id: 'e1',
    kind: 'Writing',
    thread: 'gesture',
    source: 'Other',
    title: 'Notes on joining',
    offeredBy: 'Lior',
    tagline: 'How two pieces learn to become one.',
    excerpt:
      'Every joint is a negotiation. The grain must be read, the faces coaxed into agreement. A well-cut joint disappears into the…',
    body: 'Every joint is a negotiation. The grain must be read, the faces coaxed into agreement. A well-cut joint disappears into the whole — but the maker remembers the meeting.',
    x: 420,
    y: 260,
  },
  {
    id: 'e2',
    kind: 'Writing',
    thread: 'repair',
    source: 'Other',
    title: 'On the ethics of repair',
    offeredBy: '',
    tagline: 'What we owe the things we keep.',
    excerpt:
      'To repair is to refuse the logic of disposal. It asks us to listen to the object — to its history of use, its worn places, its quiet…',
    body: 'To repair is to refuse the logic of disposal. It asks us to listen to the object — to its history of use, its worn places, its quiet request to continue.',
    x: 1040,
    y: 620,
  },
  {
    id: 'e3',
    kind: 'Image',
    thread: 'place',
    source: 'Minor Acts 1.0',
    title: 'Kitchen table, 2am',
    offeredBy: 'Sasha',
    tagline: 'Where the making actually happens.',
    excerpt: 'A cluttered table mid-project — thread, glue, half-finished forms.',
    body: 'A cluttered table mid-project — thread, glue, half-finished forms. The mess is part of the record.',
    imageColor: 'linear-gradient(135deg, #b9c58a, #8fae7a)',
    x: 160,
    y: 640,
  },
  {
    id: 'e4',
    kind: 'Image',
    thread: 'toolmaking',
    source: 'Minor Acts 1.0',
    title: 'Hand-forged awl',
    offeredBy: 'Duke',
    tagline: 'Made because none of the shop ones fit right.',
    excerpt: 'A small steel awl, handle wrapped in waxed cord.',
    body: 'A small steel awl, handle wrapped in waxed cord. Made because none of the shop ones fit right in a small hand.',
    imageColor: 'linear-gradient(135deg, #c8a97e, #a97e5a)',
    x: 760,
    y: 120,
  },
  {
    id: 'e5',
    kind: 'Image',
    thread: 'reference',
    source: 'Minor Acts 2.0',
    title: 'Pattern scrap',
    offeredBy: '',
    tagline: 'Kept for the curve, not the garment.',
    excerpt: 'A torn paper pattern piece, pencil marks still visible.',
    body: 'A torn paper pattern piece, pencil marks still visible. Kept for the curve, not the garment it belonged to.',
    imageColor: 'linear-gradient(135deg, #cbb9d8, #9c85b3)',
    x: 1320,
    y: 260,
  },
  {
    id: 'e6',
    kind: 'Sound',
    thread: 'sound',
    source: 'Minor Acts 2.0',
    title: 'Workshop hum',
    offeredBy: 'Ren',
    tagline: 'Thirty seconds of ambient shop noise.',
    excerpt: 'Recorded on a phone, left running on a shelf during a long session.',
    body: 'Recorded on a phone, left running on a shelf during a long session. Kept for what it remembers that photos don’t.',
    x: 580,
    y: 880,
  },
  {
    id: 'e7',
    kind: 'Sound',
    thread: 'gesture',
    source: 'Minor Acts 2.0',
    title: 'Hands sanding wood',
    offeredBy: '',
    tagline: 'The rhythm of a repeated motion.',
    excerpt: 'Close-mic recording of sandpaper against a table edge.',
    body: 'Close-mic recording of sandpaper against a table edge. The rhythm of a repeated motion, worn into sound.',
    x: 1180,
    y: 900,
  },
  {
    id: 'e8',
    kind: 'Link',
    thread: 'reference',
    source: 'Minor Acts 1.0',
    title: 'Zine: Tools We Trust',
    offeredBy: 'Nadia',
    tagline: 'A community zine on hand tools and care.',
    excerpt: 'An online zine collecting short essays on the tools people trust most.',
    body: 'An online zine collecting short essays on the tools people trust most, and why. Shared here as a reference thread.',
    link: '#',
    x: 220,
    y: 220,
  },
];

export const CANVAS_WIDTH = 1800;
export const CANVAS_HEIGHT = 1200;

export const THREADS = Array.from(new Set(seedEntries.map((e) => e.thread))).sort();

export function mergeThreads(entries: Entry[]): string[] {
  return Array.from(new Set([...THREADS, ...entries.map((e) => e.thread)])).sort();
}
