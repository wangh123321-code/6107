import { useState } from 'react';
import { Layers, Disc3, Palette, RotateCcw } from 'lucide-react';
import BladeSelector from './BladeSelector';
import RubberSelector from './RubberSelector';
import AppearancePanel from './AppearancePanel';
import { useRacketStore } from '@/store/useRacketStore';
import { clsx } from 'clsx';

type TabType = 'blade' | 'rubber' | 'appearance';

const TABS: { id: TabType; name: string; icon: typeof Layers }[] = [
  { id: 'blade', name: '底板', icon: Layers },
  { id: 'rubber', name: '胶皮', icon: Disc3 },
  { id: 'appearance', name: '外观', icon: Palette },
];

export default function ConfigPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('blade');
  const resetConfig = useRacketStore((s) => s.resetConfig);

  return (
    <div className="h-full flex flex-col bg-[#1a1b26]/95 backdrop-blur-xl border-r border-white/10">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">配置面板</h2>
            <p className="text-xs text-gray-500 mt-0.5">打造你的专属球拍</p>
          </div>
          <button
            onClick={resetConfig}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            title="重置配置"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-black/30 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-b from-orange-500/25 to-orange-600/15 text-orange-400 shadow-lg shadow-orange-500/10'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5',
                )}
              >
                <Icon size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'blade' && <BladeSelector />}
        {activeTab === 'rubber' && <RubberSelector />}
        {activeTab === 'appearance' && <AppearancePanel />}
      </div>
    </div>
  );
}
