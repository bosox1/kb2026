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
            className={`spec-card ${isActive ? 'active' : ''}`}
          >
            <span className="relative z-10 block text-[10px] tracking-widest uppercase mb-1"
              style={{ color: isActive ? '#BE1622' : 'rgba(26,26,26,0.35)' }}>
              {spec.code}
            </span>
            <span className="relative z-10 block text-sm leading-snug"
              style={{ color: isActive ? '#1a1a1a' : 'rgba(26,26,26,0.7)' }}>
              {spec.name}
            </span>
            {spec.subtitle && (
              <span className="relative z-10 block text-[11px] mt-0.5"
                style={{ color: 'rgba(26,26,26,0.4)' }}>
                {spec.subtitle}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
