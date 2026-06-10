export default function ScoreInput({ label, hint, coef, value, onChange, disabled = false }) {
  const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

  return (
    <div className="grid grid-cols-[1fr_56px_140px] gap-2 items-center py-2">
      <div>
        <div className="text-sm" style={{ color: 'rgba(212,237,230,0.85)' }}>{label}</div>
        {hint && <div className="text-xs mt-0.5 tracking-wide" style={{ color: 'rgba(212,237,230,0.3)' }}>{hint}</div>}
      </div>
      <div className="coef-badge">{coef !== null && coef !== undefined ? fmt(coef) : '—'}</div>
      <input
        type="number"
        min={100}
        max={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="100–200"
        className="med-input"
      />
    </div>
  );
}
