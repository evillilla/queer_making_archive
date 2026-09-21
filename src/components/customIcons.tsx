import type { ReactNode } from 'react';

interface IconBaseProps {
  viewBox: string;
  size?: number;
  children: ReactNode;
}

// Renders each custom icon at a consistent height while preserving its own
// natural width/aspect ratio (the source icons aren't all square).
function IconBase({ viewBox, size = 16, children }: IconBaseProps) {
  const [, , vw, vh] = viewBox.split(' ').map(Number);
  const width = size * (vw / vh);
  return (
    <svg width={width} height={size} viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function BackIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 78 97.5" size={size}>
      <polygon points="30 24 24 24 24 30 30 30 30 24" />
      <polygon points="36 18 30 18 30 24 36 24 36 18" />
      <polygon points="42 12 36 12 36 18 42 18 42 12" />
      <polygon points="30 54 30 48 24 48 24 54 30 54" />
      <polygon points="36 60 36 54 30 54 30 60 36 60" />
      <polygon points="42 66 42 60 36 60 36 66 42 66" />
      <path d="M60,36H24v-6h-6v6h-6v6h6v6h6v-6h42v-6h-6Z" />
    </IconBase>
  );
}

export function DocumentIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 110 135" size={size}>
      <path d="M26.2,24.8v70.4h-6.4V24.8h6.4ZM83.8,37.6v6.4h-19.2v6.4h19.2v44.8h6.4v-57.6h-6.4ZM77.4,31.2v6.4h6.4v-6.4h-6.4v-6.4h-6.4v6.4h6.4ZM26.2,101.6h57.6v-6.4H26.2v6.4ZM58.2,44h6.4v-19.2h6.4v-6.4H26.2v6.4h32s0,19.2,0,19.2Z" />
    </IconBase>
  );
}

export function DownloadIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 78 97.5" size={size}>
      <path
        fillRule="evenodd"
        d="M54,60v-6h6v12H18v-12h6v6h30ZM42,12v24h6v6h-6v6h-6v-6h-6v-6h6V12h6ZM30,30v6h-6v-6h6ZM54,30v6h-6v-6h6Z"
      />
    </IconBase>
  );
}

export function LinkIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 100 125" size={size}>
      <path d="M5,70.4l24.6-24.5,8.2,8.2,16.2-16.2,8.2,8.2,16.5-16.5-8.3-8.6-16.2,16.8-8.3-8.2,24.6-24.6,24.5,24.6-24.5,24.5-8.3-8.1-16.2,16.2,8.2,8.2-24.6,24.6-24.5-24.6ZM37.7,54.2l-16.3,16.2,8.2,8.2,16.3-16.2-8.2-8.2Z" />
    </IconBase>
  );
}

export function ObjectIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 100 125" size={size}>
      <rect x="45" y="5" width="10" height="5" />
      <rect x="35" y="10" width="10" height="5" />
      <rect x="25" y="15" width="10" height="5" />
      <rect x="15" y="20" width="10" height="5" />
      <rect x="15" y="30" width="10" height="5" />
      <rect x="25" y="35" width="10" height="5" />
      <rect x="35" y="40" width="10" height="5" />
      <rect x="55" y="10" width="10" height="5" />
      <rect x="65" y="15" width="10" height="5" />
      <rect x="75" y="20" width="10" height="5" />
      <polygon points="85 30 75 30 75 35 65 35 65 40 55 40 55 45 45 45 45 50 50 50 50 90 45 90 45 95 55 95 55 90 65 90 65 85 75 85 75 80 85 80 85 75 95 75 95 70 95 30 95 25 85 25 85 30" />
      <polygon points="10 70 10 30 15 30 15 25 5 25 5 30 5 70 5 75 15 75 15 70 10 70" />
      <rect x="15" y="75" width="10" height="5" />
      <rect x="25" y="80" width="10" height="5" />
      <rect x="35" y="85" width="10" height="5" />
    </IconBase>
  );
}

export function ShieldIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 100 125" size={size}>
      <rect x="24.3" y="69.3" width="12.9" height="12.9" />
      <polygon points="50 5 24.3 5 11.4 5 11.4 69.3 24.3 69.3 24.3 17.9 50 17.9 50 82.1 37.1 82.1 37.1 95 50 95 62.9 95 62.9 82.1 75.7 82.1 75.7 69.3 88.6 69.3 88.6 5 50 5" />
    </IconBase>
  );
}

export function SoundIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 110 135" size={size}>
      <rect x="80.4" y="24.9" width="10" height="10" />
      <rect x="90.4" y="14.9" width="10" height="10" />
      <rect x="80.4" y="54.9" width="20" height="10" />
      <rect x="80.4" y="84.9" width="10" height="10" />
      <rect x="90.4" y="94.9" width="10" height="10" />
      <g>
        <rect x="30.4" y="34.9" width="10" height="10" />
        <polygon points="60.4 44.9 60.4 14.9 50.4 14.9 50.4 24.9 40.4 24.9 40.4 34.9 50.4 34.9 50.4 84.9 40.4 84.9 40.4 94.9 50.4 94.9 50.4 104.9 60.4 104.9 60.4 74.9 70.4 74.9 70.4 44.9 60.4 44.9" />
        <polygon points="20.4 64.9 20.4 54.9 30.4 54.9 30.4 44.9 10.4 44.9 10.4 74.9 20.4 74.9 20.4 74.9 30.4 74.9 30.4 64.9 20.4 64.9" />
        <rect x="30.4" y="74.9" width="10" height="10" />
      </g>
    </IconBase>
  );
}

export function TrashIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 512 640" size={size}>
      <rect x="208" y="232" width="24" height="192" />
      <rect x="136" y="232" width="24" height="192" />
      <rect x="280" y="232" width="24" height="192" />
      <rect x="352" y="232" width="24" height="192" />
      <rect x="88" y="448" width="24" height="24" />
      <rect x="400" y="448" width="24" height="24" />
      <rect x="112" y="472" width="288" height="24" />
      <polygon points="64 160 64 448 88 448 88 184 424 184 424 448 448 448 448 160 64 160" />
      <rect x="40" y="112" width="24" height="48" />
      <polygon points="448 112 448 88 328 88 328 40 304 40 304 88 208 88 208 40 184 40 184 88 64 88 64 112 448 112" />
      <rect x="448" y="112" width="24" height="48" />
      <rect x="208" y="16" width="96" height="24" />
    </IconBase>
  );
}

export function VideoIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 100 125" size={size}>
      <polygon points="8.1 84 89.2 84 89.2 11 48.7 11 48.7 19.1 81.1 19.1 81.1 75.9 16.2 75.9 16.2 51.6 8.1 51.6 8.1 84" />
      <polygon points="16.2 43.5 24.3 43.5 24.3 35.3 32.4 35.3 32.4 27.2 40.5 27.2 40.5 19.1 32.4 19.1 32.4 11 24.3 11 24.3 2.9 16.2 2.9 16.2 43.5" />
    </IconBase>
  );
}

export function WritingIcon({ size }: { size?: number }) {
  return (
    <IconBase viewBox="0 0 502.102 502.102" size={size}>
      <path
        d="M39.62,288.938v-7.14v-22.78h30.118v-0.201h22.777h7.146h22.978v22.976v7.14v29.927h37.259v-29.921v-7.14v-22.976v-7.146
        v-22.78v-7.342v-22.774v-7.149v-30.124H129.78v-30.311H99.656v-29.731H62.583v30.125H32.468v30.118H2.548v29.923v7.149v22.969
        v7.146v22.78v7.341v22.78v7.14v29.927H39.62V288.938z M39.62,198.782v-7.149V168.85h29.926v-30.124h22.969v29.731h30.13v23.176
        v7.149v22.774h-30.13v0.195H69.738h-7.149H39.62V198.782z M209.445,318.865h22.969h7.149h22.769h7.151h30.134v-29.927h30.109
        v-30.121v-7.14V221.55h-30.109v-22.777h30.109v-29.929v-7.341v-29.921h-30.109v-30.121h-30.134h-7.151h-22.769h-7.149h-22.969
        h-7.155h-29.917v30.121v7.339v22.78v7.143v22.783v7.341v22.777v7.146v22.969v7.146v22.786v7.14v29.927h29.917h7.155V318.865z
        M209.445,168.85v-7.14v-22.783v-0.201h22.969h7.149h22.769h7.151h22.97v22.783v7.341v22.783h-22.97h-7.151h-22.769h-7.149
        h-22.969V168.85z M209.445,259.019v-7.152v-22.969h22.969h7.149h22.769h7.151h22.97v22.78v7.14v22.976h-22.97h-7.151h-22.769
        h-7.149h-22.969V259.019z M372.118,288.938h-29.914v-30.121v-7.14v-22.78v-7.146v-22.969v-7.149V168.85v-7.14v-30.118h29.926
        v-30.125h30.115h7.158h22.769h7.14h30.134v30.125h30.115v37.258h-37.268v-30.124h-22.981h-7.14h-22.769h-7.158h-22.975v22.984
        v7.14v22.783v7.149v22.969v7.146v22.78h0.201v30.121h22.773h7.158h22.769h7.347h22.774v-30.121h37.268v37.261h-30.115v29.927
        h-29.927h-7.347h-22.769h-7.158H372.13v-29.927H372.118z M33.479,333.695v33.467H0v-33.467H33.479z M33.479,367.162h33.47v33.479
        h-33.47V367.162z M100.418,333.695v33.467h-33.47v-33.467H100.418z M100.418,367.162h33.479v33.479h-33.479V367.162z
        M167.366,333.695v33.467h-33.476v-33.467H167.366z M167.366,367.162h33.473v33.479h-33.473V367.162z M234.309,333.695v33.467
        h-33.47v-33.467H234.309z M234.309,367.162h33.479v33.479h-33.479V367.162z M301.26,333.695v33.467h-33.473v-33.467H301.26z
        M301.26,367.162h33.479v33.479H301.26V367.162z M368.205,333.695v33.467h-33.467v-33.467H368.205z M368.205,367.162h33.479v33.479
        h-33.479V367.162z M435.15,333.695v33.467h-33.467v-33.467H435.15z M502.102,333.695v33.467h-33.473v-33.467H502.102z
        M435.15,367.162h33.473v33.479H435.15V367.162z"
      />
    </IconBase>
  );
}
