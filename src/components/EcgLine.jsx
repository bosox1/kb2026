export default function EcgLine() {
  return (
    <div className="w-full overflow-hidden" style={{ height: '36px', opacity: 0.5 }}>
      <svg viewBox="0 0 800 40" preserveAspectRatio="none" className="w-full h-full">
        <polyline
          points="0,20 60,20 80,20 90,5 100,35 110,5 120,20 160,20 180,20 190,8 200,20 240,20 800,20"
          fill="none"
          stroke="#BE1622"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ animation: 'ecg 2s ease forwards' }}
        />
      </svg>
    </div>
  );
}
