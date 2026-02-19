'use client';

import Link from 'next/link';

export default function XPPage() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <div className="container" />
      <div style={{position: 'absolute', top: 16, left: 16}}>
        <Link href="/" style={{
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 6,
          textDecoration: 'none',
          fontFamily: 'Courier New, monospace'
        }}>Back</Link>
      </div>
    </main>
  );
}
