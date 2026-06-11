import ConfigPanel from '@/components/panels/ConfigPanel';
import ParamsPanel from '@/components/panels/ParamsPanel';
import RacketScene from '@/components/racket3d/RacketScene';
import { RotateCw, ZoomIn, ZoomOut, Move3d } from 'lucide-react';

export default function Configurator() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#0d0e14] via-[#12131a] to-[#0a0b10]">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0d0e14]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <line x1="15.5" y1="8.5" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">RACKET LAB</h1>
            <p className="text-xs text-gray-500">乒乓球拍3D配置器</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Move3d size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">左键旋转</span>
          <span className="text-gray-700">·</span>
          <ZoomIn size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">滚轮缩放</span>
          <span className="text-gray-700">·</span>
          <RotateCw size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">双击复位</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">实时计算</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden sm:block w-80 flex-shrink-0">
          <ConfigPanel />
        </aside>

        <main className="flex-1 relative min-w-0">
          <div className="absolute inset-0">
            <RacketScene />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2">
              <ZoomOut size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">滑动滚轮缩放</span>
            </div>
          </div>

          <div className="absolute top-4 left-4 sm:hidden">
            <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 text-white">
              <Move3d size={18} />
            </button>
          </div>
        </main>

        <aside className="hidden lg:block w-80 flex-shrink-0">
          <ParamsPanel />
        </aside>
      </div>
    </div>
  );
}
