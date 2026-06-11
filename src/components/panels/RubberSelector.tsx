import { useState } from 'react';
import { CircleDot, Droplets } from 'lucide-react';
import { RUBBERS_BY_TYPE } from '@/data/rubbers';
import { useRacketStore } from '@/store/useRacketStore';
import type { RubberType } from '@/types';
import { clsx } from 'clsx';

const TYPE_CONFIG: Record<RubberType, { name: string; icon: typeof CircleDot; desc: string }> = {
  sticky: { name: '黏性', icon: Droplets, desc: '旋转强烈，持球好' },
  'non-sticky': { name: '涩性', icon: CircleDot, desc: '速度快，出球干脆' },
};

type HandType = 'forehand' | 'backhand';

export default function RubberSelector() {
  const [activeHand, setActiveHand] = useState<HandType>('forehand');
  const [activeType, setActiveType] = useState<RubberType>('sticky');
  const config = useRacketStore((s) => s.config);
  const setForehandRubber = useRacketStore((s) => s.setForehandRubber);
  const setBackhandRubber = useRacketStore((s) => s.setBackhandRubber);
  const setForehandSponge = useRacketStore((s) => s.setForehandSponge);
  const setBackhandSponge = useRacketStore((s) => s.setBackhandSponge);

  const rubbers = RUBBERS_BY_TYPE[activeType];
  const currentRubberId = activeHand === 'forehand' ? config.forehandRubberId : config.backhandRubberId;
  const currentSponge = activeHand === 'forehand' ? config.forehandSponge : config.backhandSponge;
  const currentRubber = rubbers.find((r) => r.id === currentRubberId);

  const handleSelectRubber = (id: string) => {
    if (activeHand === 'forehand') {
      setForehandRubber(id);
    } else {
      setBackhandRubber(id);
    }
  };

  const handleSetSponge = (thickness: number) => {
    if (activeHand === 'forehand') {
      setForehandSponge(thickness);
    } else {
      setBackhandSponge(thickness);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveHand('forehand')}
          className={clsx(
            'py-2.5 px-3 rounded-xl border text-sm font-medium transition-all',
            activeHand === 'forehand'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 border-red-500/50 text-red-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
          )}
        >
          正手胶皮
        </button>
        <button
          onClick={() => setActiveHand('backhand')}
          className={clsx(
            'py-2.5 px-3 rounded-xl border text-sm font-medium transition-all',
            activeHand === 'backhand'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-blue-500/50 text-blue-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
          )}
        >
          反手胶皮
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(TYPE_CONFIG) as RubberType[]).map((type) => {
          const cfg = TYPE_CONFIG[type];
          const Icon = cfg.icon;
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={clsx(
                'flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all',
                isActive
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
              )}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{cfg.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 italic">
        {TYPE_CONFIG[activeType].desc}
      </p>

      {currentRubber && (
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">海绵厚度</div>
          <div className="flex gap-2 flex-wrap">
            {currentRubber.spongeThickness.map((t) => (
              <button
                key={t}
                onClick={() => handleSetSponge(t)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                  currentSponge === t
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
                )}
              >
                {t}mm
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
        {rubbers.map((rubber) => {
          const isSelected = currentRubberId === rubber.id;
          return (
            <button
              key={rubber.id}
              onClick={() => handleSelectRubber(rubber.id)}
              className={clsx(
                'w-full text-left p-3 rounded-xl border transition-all duration-200 group',
                isSelected
                  ? 'bg-gradient-to-r from-orange-500/20 to-transparent border-orange-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10"
                  style={{ backgroundColor: rubber.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className={clsx(
                    'font-medium text-sm truncate',
                    isSelected ? 'text-orange-400' : 'text-gray-200 group-hover:text-white',
                  )}>
                    {rubber.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {rubber.type === 'sticky' ? '黏性' : '涩性'} · 可选厚度: {rubber.spongeThickness.join('/')}mm
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {rubber.description}
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-red-400">速{rubber.speed}</span>
                <span className="text-green-400">旋{rubber.spin}</span>
                <span className="text-blue-400">控{rubber.control}</span>
                <span className="text-yellow-400">弹{rubber.elasticity}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
