export default function ScoreInput({ label, hint, coef, value, onChange, disabled = false, placeholder = '100–200' }) {
  const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

  return (
    <div className="grid grid-cols-[1fr_56px_130px] gap-2.5 items-center">
      <div>
        <div className="text-sm text-gray-800">{label}</div>
        {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
      </div>
      <div className="text-center text-sm px-2 py-1.5 rounded-md border border-gray-100 bg-gray-50 text-gray-400 font-mono">
        {coef !== null && coef !== undefined ? fmt(coef) : '—'}
      </div>
      <input
        type="number"
        min={100}
        max={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-900
          disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-50"
      />
    </div>
  );
}
