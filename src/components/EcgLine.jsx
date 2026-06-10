import { useEffect, useRef } from 'react';

export default function EcgLine() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ECG pulse shape — one beat
    const beat = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0.05, 0.1, 0.05, 0,
      0, -0.15, 1, -0.4, 0.1, 0,
      0, 0, 0.2, 0.15, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;
    const amp = H * 0.38;
    const speed = 2.5;
    const beatLen = beat.length;
    const totalPoints = W;

    let offset = 0;
    let raf;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#be1823';
      ctx.strokeStyle = '#be1823';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let x = 0; x < totalPoints; x++) {
        const idx = Math.floor((x + offset) % beatLen);
        const y = mid - beat[idx] * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Bright leading dot
      const leadIdx = Math.floor(offset % beatLen);
      const leadY = mid - beat[leadIdx] * amp;
      ctx.beginPath();
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ff4455';
      ctx.fillStyle = '#ff4455';
      ctx.arc(0, leadY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      offset = (offset + speed) % (beatLen * 10);
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={44}
      style={{ width: '100%', height: '44px', display: 'block', opacity: 0.85 }}
    />
  );
}
