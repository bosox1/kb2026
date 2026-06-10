import { useState, useCallback } from 'react';
import SpecSelector from './components/SpecSelector';
import ScoreInput from './components/ScoreInput';
import { SUBJECTS } from './data/specs';

const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

function SectionTitle({ step, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {step && (
        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
          {step}
        </span>
      )}
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{children}</span>
    </div>
  );
}

export default function App() {
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
    if (!spec) errs.push('Оберіть спеціальність.');
    if (!subjKey) errs.push('Оберіть предмет на вибір.');

    const p1 = parseFloat(scores.p1) || 0;
    const p2 = parseFloat(scores.p2) || 0;
    const p3 = parseFloat(scores.p3) || 0;
    const p4 = parseFloat(scores.p4) || 0;

    if (!p1 || !p2 || !p3) errs.push("Введіть оцінки з усіх трьох обов'язкових предметів.");
    if (!p4) errs.push('Введіть оцінку з предмету на вибір.');

    [['Укр. мова', p1], ['Математика', p2], ['Історія', p3], ['Предмет на вибір', p4]].forEach(([n, p]) => {
      if (p && (p < 100 || p > 200)) errs.push(`${n}: оцінка поза діапазоном 100–200.`);
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
    ? SUBJECTS.map((s) => {
        const coef = spec.vk[s.key];
        const isMax = coef === k4max;
        return { ...s, coef, isMax };
      })
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[720px] mx-auto px-4 sm:px-5 py-8 pb-14">

        <div className="mb-7">
          <p className="text-xs text-gray-400 mb-1 tracking-wide">
            ІФНМУ · Вступна кампанія 2026 · НМТ
          </p>
          <h1 className="text-xl font-semibold text-gray-900">Калькулятор конкурсного балу</h1>
        </div>

        <section className="mb-7">
          <SectionTitle step="1">Оберіть спеціальність</SectionTitle>
          <SpecSelector selected={spec} onSelect={handleSpecSelect} />
          <p className="text-[11px] text-gray-300 mt-2">
            Після вибору коефіцієнти підставляться автоматично
          </p>
        </section>

        <div className="border-t border-gray-100 mb-7" />

        <section className="mb-7">
          <SectionTitle step="2">Введіть оцінки НМТ</SectionTitle>

          <div className="grid grid-cols-[1fr_56px_130px] gap-2.5 mb-2">
            <span />
            <span className="text-[10px] text-gray-300 text-center">К</span>
            <span className="text-[10px] text-gray-300 text-center">Оцінка (100–200)</span>
          </div>

          <div className="space-y-3">
            <ScoreInput
              label="Українська мова"
              hint="обов'язковий"
              coef={spec?.k1 ?? 0.35}
              value={scores.p1}
              onChange={(v) => handleScore('p1', v)}
            />
            <ScoreInput
              label="Математика"
              hint="обов'язковий"
              coef={spec?.k2 ?? 0.40}
              value={scores.p2}
              onChange={(v) => handleScore('p2', v)}
            />
            <ScoreInput
              label="Історія України"
              hint="обов'язковий"
              coef={spec?.k3 ?? 0.25}
              value={scores.p3}
              onChange={(v) => handleScore('p3', v)}
            />
            <ScoreInput
              label="Предмет на вибір"
              hint={subjKey ? SUBJECTS.find((s) => s.key === subjKey)?.label : 'оберіть зі списку нижче'}
              coef={k4}
              value={scores.p4}
              onChange={(v) => handleScore('p4', v)}
              disabled={!subjKey}
            />

            <select
              value={subjKey}
              onChange={handleSubjChange}
              disabled={!spec}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-700
                disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed
                focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
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

        <div className="border-t border-gray-100 mb-7" />

        <section className="mb-7">
          <SectionTitle>Фіксовані параметри ІФНМУ</SectionTitle>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700 leading-relaxed mb-4">
            <strong>ОУ = 0</strong> — якщо ви не закінчували підготовчих курсів ІФНМУ у рік вступу.<br />
            <strong>РК = 1,00</strong> — університет знаходиться у вашому регіоні.<br />
            <strong>ГК = 1,00</strong> — для ІФНМУ.
          </div>
          <div className="space-y-2">
            {[
              ['Додаткова оцінка (ОУ)', '0'],
              ['Регіональний коефіцієнт (РК)', '1,00'],
              ['Галузевий коефіцієнт (ГК)', '1,00'],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-sm px-3 py-1 rounded border border-gray-100 bg-gray-50 text-gray-400 font-mono min-w-[64px] text-center">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 leading-relaxed mb-5">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl px-5 py-4">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Конкурсний бал</div>
            <div className="text-4xl font-semibold text-gray-900 tracking-tight tabular-nums">
              {result ?? '—'}
            </div>
          </div>
          <button
            onClick={calculate}
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Розрахувати
          </button>
        </div>

        <p className="text-xs text-red-500 mt-6 text-center leading-relaxed">
          ⚠️ Калькулятор носить інформаційний характер. Коефіцієнти — згідно з Додатком 10 до Порядку прийому МОН 2026, Галузь І.<br />
          Офіційний розрахунок:{' '}
          <a
            href="https://vstup.edbo.gov.ua/konkurs-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            vstup.edbo.gov.ua/konkurs-calculator
          </a>
        </p>
      </div>
    </div>
  );
}
