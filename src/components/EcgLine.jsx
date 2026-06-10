import { useEffect, useRef } from 'react';

export default function EcgLine() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;
    const amp = H * 0.38;

    // One QRS beat as normalized points (x: 0..1, y: -1..1)
    const beat = [
      [0.00, 0], [0.10, 0], [0.18, 0],
      [0.22, 0.08], [0.26, -0.18],
      [0.30, 1.0], [0.34, -0.55],
      [0.38, 0.12], [0.44, 0.12],
      [0.50, 0], [0.60, 0],
      [1.00, 0],
    ];

    // Duration of one full cycle in ms
    const cycleDuration = 2000;
    let startTime = null;
    let raf;

    // Interpolate beat points
    function getBeatY(t) {
      // t is 0..1 position in beat
      for (let i = 0; i < beat.length - 1; i++) {
        const [x0, y0] = beat[i];
        const [x1, y1] = beat[i + 1];
        if (t >= x0 && t <= x1) {
          const frac = (t - x0) / (x1 - x0);
          return y0 + (y1 - y0) * frac;
        }
      }
      return 0;
    }

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration; // 0..1 head position

      ctx.clearRect(0, 0, W, H);

      // Draw the trace — only the part behind the head
      ctx.beginPath();
      let started = false;

      for (let px = 0; px < W; px++) {
        const xFrac = px / W;

        // Only draw points that the head has already passed
        if (xFrac > progress) break;

        // Fade out the tail (last 25% of drawn line fades)
        const tailStart = Math.max(0, progress - 0.3);
        let alpha = 1;
        if (xFrac < tailStart) {
          alpha = (xFrac - (tailStart - 0.15)) / 0.15;
          alpha = Math.max(0, Math.min(1, alpha));
        }

        const beatT = xFrac / 1.0;
        const y = mid - getBeatY(beatT) * amp;

        ctx.globalAlpha = alpha * 0.9;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#be1823';
        ctx.strokeStyle = '#be1823';
        ctx.lineWidth = 1.8;

        if (!started) {
          ctx.moveTo(px, y);
          started = true;
        } else {
          ctx.lineTo(px, y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Glowing head dot
      if (progress < 1) {
        const headX = progress * W;
        const headY = mid - getBeatY(progress) * amp;
        ctx.beginPath();
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ff3344';
        ctx.fillStyle = '#ff4455';
        ctx.arc(headX, headY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={44}
      style={{ width: '100%', height: '44px', display: 'block', opacity: 0.9 }}
    />
  );
}
