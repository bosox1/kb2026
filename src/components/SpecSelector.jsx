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
              style={{ color: isActive ? '#00ff88' : '#5ecf94' }}>
              {spec.code}
            </span>
            <span className="relative z-10 block text-sm leading-snug"
              style={{ color: '#e8f5ef' }}>
              {spec.name}
            </span>
            {spec.subtitle && (
              <span className="relative z-10 block text-[11px] mt-0.5"
                style={{ color: '#7ab89a' }}>
                {spec.subtitle}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
