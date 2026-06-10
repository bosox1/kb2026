import { useState, useCallback } from 'react';
import SpecSelector from './components/SpecSelector';
import ScoreInput from './components/ScoreInput';
import { SUBJECTS } from './data/specs';

const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

function SectionTitle({ step, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {step && (
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
      )}
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{children}</span>
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

  const scoreColor = result
    ? parseFloat(result) >= 180 ? 'text-green-600'
    : parseFloat(result) >= 160 ? 'text-blue-600'
    : 'text-gray-900'
    : 'text-gray-300';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-3 text-center">
        <span className="text-xs font-medium tracking-wide opacity-80">
          ІФНМУ · Вступна кампанія 2026 · НМТ
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Калькулятор конкурсного балу</h1>
        <p className="text-sm text-gray-500 mb-8">Розрахуйте свій прохідний бал для вступу в ІФНМУ 2026</p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          {/* Step 1 */}
          <SectionTitle step="1">Оберіть спеціальність</SectionTitle>
          <SpecSelector selected={spec} onSelect={handleSpecSelect} />
          <p className="text-xs text-gray-300 mt-3 mb-6">Після вибору коефіцієнти підставляться автоматично</p>

          <div className="border-t border-gray-100 mb-6" />

          {/* Step 2 */}
          <SectionTitle step="2">Введіть оцінки НМТ</SectionTitle>

          <div className="grid grid-cols-[1fr_56px_140px] gap-2 mb-2 px-1">
            <span />
            <span className="text-[10px] font-semibold text-gray-400 text-center uppercase tracking-wider">К</span>
            <span className="text-[10px] font-semibold text-gray-400 text-center uppercase tracking-wider">Оцінка</span>
          </div>

          <div className="space-y-2 mb-4">
            <ScoreInput label="Українська мова" hint="обов'язковий" coef={spec?.k1 ?? 0.35}
              value={scores.p1} onChange={(v) => handleScore('p1', v)} />
            <ScoreInput label="Математика" hint="обов'язковий" coef={spec?.k2 ?? 0.40}
              value={scores.p2} onChange={(v) => handleScore('p2', v)} />
            <ScoreInput label="Історія України" hint="обов'язковий" coef={spec?.k3 ?? 0.25}
              value={scores.p3} onChange={(v) => handleScore('p3', v)} />
            <ScoreInput
              label="Предмет на вибір"
              hint={subjKey ? SUBJECTS.find((s) => s.key === subjKey)?.label : 'оберіть зі списку нижче'}
              coef={k4}
              value={scores.p4}
              onChange={(v) => handleScore('p4', v)}
              disabled={!subjKey}
            />
          </div>

          <select
            value={subjKey}
            onChange={handleSubjChange}
            disabled={!spec}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
              focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
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

        {/* Fixed params */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Фіксовані параметри ІФНМУ</p>
          <p className="text-sm text-blue-700 leading-relaxed mb-3">
            <strong>ОУ = 0</strong> — якщо ви не закінчували підготовчих курсів ІФНМУ у рік вступу.<br />
            <strong>РК = 1,00</strong> — університет знаходиться у вашому регіоні.<br />
            <strong>ГК = 1,00</strong> — для ІФНМУ.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[['ОУ', '0'], ['РК', '1,00'], ['ГК', '1,00']].map(([label, val]) => (
              <div key={label} className="bg-white rounded-xl px-3 py-2 text-center border border-blue-100">
                <div className="text-xs text-blue-400 font-medium mb-0.5">{label}</div>
                <div className="text-sm font-bold text-blue-700 font-mono">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 leading-relaxed mb-4">
            {errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
          </div>
        )}

        {/* Result */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Конкурсний бал</div>
            <div className={`text-5xl font-bold tracking-tight tabular-nums transition-colors ${scoreColor}`}>
              {result ?? '—'}
            </div>
            {result && parseFloat(result) >= 180 && (
              <div className="text-xs text-green-600 font-medium mt-1">Відмінний результат 🎉</div>
            )}
          </div>
          <button
            onClick={calculate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-7 py-3 rounded-xl transition-colors shadow-sm"
          >
            Розрахувати
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
          ⚠️ Калькулятор носить інформаційний характер. Коефіцієнти — згідно з Додатком 10 до Порядку прийому МОН 2026, Галузь І.<br />
          Офіційний розрахунок:{' '}
          <a href="https://vstup.edbo.gov.ua/konkurs-calculator" target="_blank" rel="noopener noreferrer"
            className="text-blue-500 underline font-medium">
            vstup.edbo.gov.ua/konkurs-calculator
          </a>
        </p>
      </div>
    </div>
  );
}
