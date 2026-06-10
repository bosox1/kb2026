export default function ScoreInput({ label, hint, coef, value, onChange, disabled = false }) {
  const fmt = (n) => n?.toFixed(2).replace('.', ',') ?? '—';

  return (
    <div className="grid grid-cols-[1fr_56px_140px] gap-2 items-center py-2 px-3 rounded-xl bg-gray-50 border border-gray-100">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
      </div>
      <div className="text-center text-sm px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-blue-600 font-bold font-mono">
        {coef !== null && coef !== undefined ? fmt(coef) : '—'}
      </div>
      <input
        type="number"
        min={100}
        max={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="100–200"
        className="w-full px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-900 font-medium
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-100
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50
          [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-40"
      />
    </div>
  );
}
