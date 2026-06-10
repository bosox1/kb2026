import { useState, useCallback } from 'react';
import SpecSelector from './components/SpecSelector';
import ScoreInput from './components/ScoreInput';
import EcgLine from './components/EcgLine';
import { SUBJECTS } from './data/specs';
import { useReveal } from './hooks/useReveal';

const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

function Label({ children }) {
  return (
    <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(0,255,136,0.6)' }}>
      // {children} //
    </p>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(190,24,35,0.5), transparent)' }} />
      <span className="text-xs" style={{ color: 'rgba(190,24,35,0.6)' }}>✦</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(190,24,35,0.5), transparent)' }} />
    </div>
  );
}

export default function App() {
  useReveal();

  const [spec, setSpec] = useState(null);
  const [subjKey, setSubjKey] = useState('');
  const [scores, setScores] = useState({ p1: '', p2: '', p3: '', p4: '' });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleSpecSelect = useCallback((s) => {
    setSpec(s);
    setSubjKey('');
    setScores((prev) => ({ ...prev, p4: '' }));
    setResult(null);
    setErrors([]);
  }, []);

  const handleSubjChange = (e) => {
    setSubjKey(e.target.value);
    setScores((prev) => ({ ...prev, p4: '' }));
    setResult(null);
  };

  const handleScore = (key, val) => {
    setScores((prev) => ({ ...prev, [key]: val }));
    setResult(null);
  };

  const k4 = spec && subjKey ? spec.vk[subjKey] : null;
  const k4max = spec ? Math.max(...Object.values(spec.vk)) : null;

  const calculate = () => {
    const errs = [];
    if (!spec) errs.push('Оберіть спеціальність');
    if (!subjKey) errs.push('Оберіть предмет на вибір');

    const p1 = parseFloat(scores.p1) || 0;
    const p2 = parseFloat(scores.p2) || 0;
    const p3 = parseFloat(scores.p3) || 0;
    const p4 = parseFloat(scores.p4) || 0;

    if (!p1 || !p2 || !p3) errs.push("Введіть оцінки з трьох обов'язкових предметів");
    if (!p4) errs.push('Введіть оцінку з предмету на вибір');

    [['Укр. мова', p1], ['Математика', p2], ['Історія', p3], ['Предмет на вибір', p4]].forEach(([n, p]) => {
      if (p && (p < 100 || p > 200)) errs.push(`${n}: оцінка поза діапазоном 100–200`);
    });

    setErrors(errs);
    if (errs.length) { setResult(null); return; }

    const numerator = spec.k1 * p1 + spec.k2 * p2 + spec.k3 * p3 + k4 * p4;
    const denominator = spec.k1 + spec.k2 + spec.k3 + (k4max + k4) / 2;
    let kb = numerator / denominator;
    kb = Math.min(200, Math.max(100, kb));
    setResult(kb.toFixed(3));
  };

  const subjOptions = spec
    ? SUBJECTS.map((s) => ({ ...s, coef: spec.vk[s.key], isMax: spec.vk[s.key] === k4max }))
    : [];

  return (
    <div className="min-h-screen" style={{ background: '#060a0a' }}>

      {/* Left pulse line — червоний ІФНМУ */}
      <div className="fixed left-3 top-0 bottom-0 pointer-events-none" style={{ width: '1px', zIndex: 10 }}>
        <div className="animate-pulse-line" style={{
          position: 'absolute', top: '10%', width: '2px', height: '80%',
          background: 'linear-gradient(180deg, transparent, #be1823, transparent)'
        }} />
      </div>

      {/* Top accent bar — червоний ІФНМУ */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #be1823, rgba(190,24,35,0.3), transparent)' }} />

      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 pb-20">

        {/* Header */}
        <header className="mb-12">
          <p className="text-xs tracking-[0.45em] uppercase mb-5 animate-fadein-0"
            style={{ color: 'rgba(0,255,136,0.5)' }}>
            ІФНМУ · НМТ · 2026
          </p>

          {/* Заголовок без glitch на переносі — два окремих рядки */}
          <div className="animate-fadein-1" style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(2.4rem, 9vw, 4.8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            fontWeight: 400,
          }}>
            {/* КОНКУРСНИЙ — з glitch */}
            <div
              className="glitch"
              data-text="КОНКУРСНИЙ"
              style={{ color: '#d4ede6', display: 'block' }}
            >
              КОНКУРСНИЙ
            </div>
            {/* БАЛ — outline червоним, без glitch */}
            <div style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px #be1823',
              textShadow: '0 0 25px rgba(190,24,35,0.35)',
              display: 'block',
            }}>
              БАЛ
            </div>
          </div>

          <p className="mt-5 text-xs tracking-[0.2em] animate-fadein-2"
            style={{ color: 'rgba(212,237,230,0.35)' }}>
            // розрахунок · Галузь І · МОН 2026 //
          </p>

          <div className="mt-7 animate-fadein-3">
            <EcgLine />
          </div>
        </header>

        {/* Step 1 */}
        <section className="reveal mb-8">
          <Label>01 · Оберіть спеціальність</Label>
          <SpecSelector selected={spec} onSelect={handleSpecSelect} />
          <p className="text-xs mt-3 tracking-wide" style={{ color: 'rgba(212,237,230,0.2)' }}>
            ↳ після вибору коефіцієнти підставляться автоматично
          </p>
        </section>

        <Divider />

        {/* Step 2 */}
        <section className="reveal mb-8">
          <Label>02 · Оцінки НМТ</Label>

          <div className="grid grid-cols-[1fr_56px_140px] gap-2 mb-1">
            <span />
            <span className="text-[10px] tracking-widest text-center uppercase"
              style={{ color: 'rgba(0,255,136,0.4)' }}>К</span>
            <span className="text-[10px] tracking-widest text-center uppercase"
              style={{ color: 'rgba(212,237,230,0.3)' }}>Оцінка</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,255,136,0.1)' }}>
            {[
              { key: 'p1', label: 'Українська мова', hint: "обов'язковий", coef: spec?.k1 ?? 0.35 },
              { key: 'p2', label: 'Математика',      hint: "обов'язковий", coef: spec?.k2 ?? 0.40 },
              { key: 'p3', label: 'Історія України', hint: "обов'язковий", coef: spec?.k3 ?? 0.25 },
              { key: 'p4', label: 'Предмет на вибір',
                hint: subjKey ? SUBJECTS.find(s => s.key === subjKey)?.label : 'оберіть зі списку нижче',
                coef: k4, disabled: !subjKey },
            ].map(({ key, label, hint, coef, disabled }) => (
              <div key={key} style={{ borderBottom: '1px solid rgba(0,255,136,0.07)' }}>
                <ScoreInput label={label} hint={hint} coef={coef}
                  value={scores[key]} onChange={(v) => handleScore(key, v)}
                  disabled={disabled} />
              </div>
            ))}
          </div>

          <div className="mt-3">
            <select value={subjKey} onChange={handleSubjChange} disabled={!spec} className="med-select">
              <option value="">
                {spec ? '— оберіть предмет на вибір —' : '— спочатку оберіть спеціальність —'}
              </option>
              {subjOptions.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}  —  К = {fmt(s.coef)}{s.isMax ? ' ★' : ''}
                </option>
              ))}
            </select>
          </div>
        </section>

        <Divider />

        {/* Fixed params */}
        <section className="reveal mb-8">
          <Label>03 · Фіксовані параметри ІФНМУ</Label>
          <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(212,237,230,0.4)' }}>
            ОУ = 0 — не закінчували підготовчих курсів ІФНМУ у рік вступу<br />
            РК = 1,00 — університет знаходиться у вашому регіоні<br />
            ГК = 1,00 — для ІФНМУ
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[['ОУ', '0'], ['РК', '1,00'], ['ГК', '1,00']].map(([lbl, val]) => (
              <div key={lbl} className="text-center py-3"
                style={{ border: '1px solid rgba(190,24,35,0.3)', background: 'rgba(190,24,35,0.05)' }}>
                <div className="text-xs tracking-widest mb-1" style={{ color: 'rgba(190,24,35,0.7)' }}>{lbl}</div>
                <div className="text-lg" style={{ color: '#d4ede6', fontFamily: 'Share Tech Mono, monospace' }}>{val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4" style={{ border: '1px solid rgba(190,24,35,0.5)', background: 'rgba(190,24,35,0.08)' }}>
            {errors.map((e, i) => (
              <div key={i} className="text-xs tracking-wider mb-1" style={{ color: '#ff6060' }}>
                ✗ {e}
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        <section className="reveal">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 p-6"
            style={{
              border: '1px solid rgba(0,255,136,0.2)',
              background: 'linear-gradient(135deg, rgba(0,255,136,0.04) 0%, transparent 70%)',
              boxShadow: result ? '0 0 40px rgba(0,255,136,0.08)' : 'none'
            }}>
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(0,255,136,0.5)' }}>
                // конкурсний бал //
              </p>
              <div className={result ? 'result-score' : ''} style={!result ? {
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
                color: 'rgba(212,237,230,0.15)',
                lineHeight: 1,
              } : {}}>
                {result ?? '—'}
              </div>
              {result && parseFloat(result) >= 180 && (
                <p className="text-xs mt-2 tracking-wider" style={{ color: '#00ff88' }}>
                  ✦ відмінний результат
                </p>
              )}
            </div>
            <button onClick={calculate} className="btn-calc">
              Розрахувати
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 pt-6" style={{ borderTop: '1px solid rgba(190,24,35,0.2)' }}>
          <p className="text-xs leading-relaxed text-center" style={{ color: 'rgba(212,237,230,0.25)' }}>
            ⚠ Калькулятор носить інформаційний характер.<br />
            Коефіцієнти — Додаток 10 до Порядку прийому МОН 2026, Галузь І.<br />
            <a href="https://vstup.edbo.gov.ua/konkurs-calculator" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(190,24,35,0.7)', textDecoration: 'underline' }}>
              vstup.edbo.gov.ua/konkurs-calculator
            </a>
          </p>
        </footer>
      </div>

      {/* Bottom accent bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(190,24,35,0.3), #be1823)' }} />
    </div>
  );
}
