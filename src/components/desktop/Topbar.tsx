'use client';

interface TopbarProps {
  time: string;
}

/** Fixed top bar with branding and clock. */
export default function Topbar({ time }: TopbarProps) {
  return (
    <header id="topbar">
      <div className="top-left">BOGI.OS v1.0</div>
      <div className="top-right">
        <div className="top-tag">software dev in training · roding, de</div>
        <div id="topClock">{time}</div>
      </div>
    </header>
  );
}
