import { Gauge, Zap, RotateCw, Target, TrendingUp, Weight, Scissors, Move } from 'lucide-react';
import RadarChart from './RadarChart';
import { useRacketStore } from '@/store/useRacketStore';
import { getBladeById } from '@/data/blades';
import { getRubberById } from '@/data/rubbers';
import { clsx } from 'clsx';
import { useMemo } from 'react';

const PARAM_CONFIG = [
  { key: 'speed', name: '速度', icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10' },
  { key: 'spin', name: '旋转', icon: RotateCw, color: 'text-green-400', bg: 'bg-green-500/10' },
  { key: 'control', name: '控制', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'elasticity', name: '弹性', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { key: 'weight', name: '重量', icon: Weight, color: 'text-purple-400', bg: 'bg-purple-500/10' },
] as const;

export default function ParamsPanel() {
  const config = useRacketStore((s) => s.config);
  const params = useRacketStore((s) => s.params);
  const setClipEnabled = useRacketStore((s) => s.setClipEnabled);
  const setClipPosition = useRacketStore((s) => s.setClipPosition);

  const blade = useMemo(() => getBladeById(config.bladeId)!, [config.bladeId]);
  const forehandRubber = useMemo(() => getRubberById(config.forehandRubberId)!, [config.forehandRubberId]);
  const backhandRubber = useMemo(() => getRubberById(config.backhandRubberId)!, [config.backhandRubberId]);

  const totalThickness = blade.thickness + config.forehandSponge + config.backhandSponge + 0.16;

  return (
    <div className="h-full flex flex-col bg-[#1a1b26]/95 backdrop-blur-xl border-l border-white/10">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Gauge size={18} className="text-orange-400" />
          <h2 className="text-base font-bold text-white tracking-wide">性能参数</h2>
        </div>
        <p className="text-xs text-gray-500">五维雷达图实时展示</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-3 mb-4">
            <RadarChart />
          </div>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {PARAM_CONFIG.map((p) => {
              const Icon = p.icon;
              const value = p.key === 'weight' ? params.weight : (params[p.key] as number);
              const displayValue = p.key === 'weight' ? `${value}g` : value;
              const percentage = p.key === 'weight'
                ? Math.min(100, Math.max(0, ((value - 140) / 80) * 100))
                : (value as number);

              return (
                <div key={p.key} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', p.bg)}>
                        <Icon size={14} className={p.color} />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{p.name}</span>
                    </div>
                    <span className={clsx('text-lg font-bold', p.color)}>{displayValue}</span>
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all duration-200',
                        p.key === 'speed' && 'bg-gradient-to-r from-red-500 to-red-400',
                        p.key === 'spin' && 'bg-gradient-to-r from-green-500 to-green-400',
                        p.key === 'control' && 'bg-gradient-to-r from-blue-500 to-blue-400',
                        p.key === 'elasticity' && 'bg-gradient-to-r from-yellow-500 to-yellow-400',
                        p.key === 'weight' && 'bg-gradient-to-r from-purple-500 to-purple-400',
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
              <Scissors size={14} className="text-cyan-400" />
              切面视图
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setClipEnabled(!config.clipEnabled)}
                className={clsx(
                  'w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all border flex items-center justify-between',
                  config.clipEnabled
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
                )}
              >
                <span className="flex items-center gap-2">
                  <Move size={14} />
                  {config.clipEnabled ? '切面视图已开启' : '开启切面视图'}
                </span>
                <div className={clsx(
                  'w-10 h-5 rounded-full transition-all relative',
                  config.clipEnabled ? 'bg-cyan-500/30' : 'bg-white/10',
                )}>
                  <div className={clsx(
                    'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                    config.clipEnabled ? 'right-0.5 bg-cyan-400' : 'left-0.5 bg-gray-500',
                  )} />
                </div>
              </button>

              {config.clipEnabled && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">剖面位置</span>
                    <span className="text-cyan-400 font-medium">
                      {Math.round(config.clipPosition * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.clipPosition}
                    onChange={(e) => setClipPosition(parseFloat(e.target.value))}
                    className="w-full h-2 bg-black/30 rounded-full appearance-none cursor-pointer accent-cyan-500
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    滑动查看底板夹层结构和胶皮海绵厚度
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-bold text-gray-200 mb-3">当前配置规格</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">底板</span>
                <span className="text-gray-200 font-medium">{blade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">正手胶皮</span>
                <span className="text-red-400 font-medium">
                  {forehandRubber.name} ({config.forehandSponge}mm)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">反手胶皮</span>
                <span className="text-blue-400 font-medium">
                  {backhandRubber.name} ({config.backhandSponge}mm)
                </span>
              </div>
              <div className="border-t border-white/10 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-500">总厚度</span>
                <span className="text-gray-200">{totalThickness.toFixed(2)}mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">总重量</span>
                <span className="text-gray-200">{params.weight}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">底板层数</span>
                <span className="text-gray-200">{blade.layers}层</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
