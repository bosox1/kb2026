import { useEffect, useRef, useState } from 'react';

const CHARS = '0123456789';

export default function MatrixResult({ value }) {
  const [display, setDisplay] = useState('—');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!value) { setDisplay('—'); return; }

    let iterations = 0;
    const target = value;
    const maxIter = 35;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        target.split('').map((char, i) => {
          if (char === '.' || char === ',') return char;
          if (iterations > i * 2.5) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      iterations++;
      if (iterations > maxIter) {
        setDisplay(target);
        clearInterval(intervalRef.current);
      }
    }, 80);

    return () => clearInterval(intervalRef.current);
  }, [value]);

  return <>{display}</>;
}
