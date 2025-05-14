'use client';

export default function StaticBackground() {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'linear-gradient(135deg, #0a0514 0%, #1a1033 50%, #12121e 100%)',
        opacity: 0.92
      }}
    />
  );
}
