import { useState } from 'react';
import { TreePine, Layers, Sparkles } from 'lucide-react';
import { BLADES_BY_MATERIAL } from '@/data/blades';
import { useRacketStore } from '@/store/useRacketStore';
import type { BladeMaterial } from '@/types';
import { clsx } from 'clsx';

const MATERIAL_CONFIG: Record<BladeMaterial, { name: string; icon: typeof TreePine; desc: string }> = {
  wood: { name: '纯木', icon: TreePine, desc: '手感清晰，控制出色' },
  carbon: { name: '碳素', icon: Layers, desc: '速度快，爆发力强' },
  arylate: { name: '芳基', icon: Sparkles, desc: '旋转强，手感柔和' },
};

export default function BladeSelector() {
  const [activeMaterial, setActiveMaterial] = useState<BladeMaterial>('wood');
  const config = useRacketStore((s) => s.config);
  const setBlade = useRacketStore((s) => s.setBlade);

  const blades = BLADES_BY_MATERIAL[activeMaterial];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(MATERIAL_CONFIG) as BladeMaterial[]).map((mat) => {
          const cfg = MATERIAL_CONFIG[mat];
          const Icon = cfg.icon;
          const isActive = activeMaterial === mat;
          return (
            <button
              key={mat}
              onClick={() => setActiveMaterial(mat)}
              className={clsx(
                'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border',
                isActive
                  ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/50 text-orange-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200',
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{cfg.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 italic">
        {MATERIAL_CONFIG[activeMaterial].desc}
      </p>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
        {blades.map((blade) => {
          const isSelected = config.bladeId === blade.id;
          return (
            <button
              key={blade.id}
              onClick={() => setBlade(blade.id)}
              className={clsx(
                'w-full text-left p-3 rounded-xl border transition-all duration-200 group',
                isSelected
                  ? 'bg-gradient-to-r from-orange-500/20 to-transparent border-orange-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className={clsx(
                    'font-medium text-sm truncate',
                    isSelected ? 'text-orange-400' : 'text-gray-200 group-hover:text-white',
                  )}>
                    {blade.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {blade.layers}层 · {blade.thickness}mm · {blade.weight}g
                  </div>
                </div>
                <div className="flex -space-x-1 flex-shrink-0">
                  {blade.layerStructure.slice(0, 5).map((layer, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-5 rounded-sm"
                      style={{ backgroundColor: layer.color }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {blade.description}
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-red-400">速{blade.speed}</span>
                <span className="text-green-400">旋{blade.spin}</span>
                <span className="text-blue-400">控{blade.control}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
