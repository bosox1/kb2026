import { SPECS } from '../data/specs';

export default function SpecSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {SPECS.map((spec) => {
        const isActive = selected?.code === spec.code;
        return (
          <button
            key={spec.code}
            onClick={() => onSelect(spec)}
            className={`text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all leading-snug
              ${isActive
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
          >
            <span className={`block text-[10px] font-normal mb-0.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
              {spec.code}
            </span>
            {spec.name}
            {spec.subtitle && (
              <span className="block text-[11px] font-normal text-gray-400 mt-0.5">{spec.subtitle}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
