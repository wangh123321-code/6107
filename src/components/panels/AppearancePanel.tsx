import { useRef } from 'react';
import { Upload, X, Palette } from 'lucide-react';
import { HANDLE_COLORS } from '@/types';
import { useRacketStore } from '@/store/useRacketStore';
import { fileToDataUrl } from '@/utils/decalMapping';
import { clsx } from 'clsx';

export default function AppearancePanel() {
  const config = useRacketStore((s) => s.config);
  const setHandleColor = useRacketStore((s) => s.setHandleColor);
  const setLogoUrl = useRacketStore((s) => s.setLogoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png')) {
      alert('请上传PNG格式图片（支持透明背景）');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setLogoUrl(dataUrl);
    } catch {
      alert('图片上传失败');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-orange-400" />
          <h3 className="text-sm font-medium text-gray-200">拍柄配色</h3>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {HANDLE_COLORS.map((color) => {
            const isSelected = config.handleColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => setHandleColor(color.value)}
                title={color.name}
                className={clsx(
                  'aspect-square rounded-lg transition-all relative group',
                  isSelected ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-[#1a1b26] scale-110' : 'hover:scale-105',
                )}
                style={{ backgroundColor: color.value }}
              >
                <div className="absolute inset-0 rounded-lg border border-white/20" />
                <span className="sr-only">{color.name}</span>
              </button>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          当前: {HANDLE_COLORS.find((c) => c.value === config.handleColor)?.name || '自定义'}
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Upload size={16} className="text-orange-400" />
          <h3 className="text-sm font-medium text-gray-200">拍面Logo贴花</h3>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        {config.logoUrl ? (
          <div className="relative">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-200 font-medium">Logo已上传</div>
                  <div className="text-xs text-gray-500">PNG透明背景 · 自动贴合弧面</div>
                </div>
              </div>
              <button
                onClick={() => setLogoUrl(null)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-6 rounded-xl border-2 border-dashed border-white/15 bg-white/5 hover:bg-white/10 hover:border-orange-500/40 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/15 transition-all">
                <Upload size={20} className="text-gray-400 group-hover:text-orange-400" />
              </div>
              <div className="text-sm text-gray-300 font-medium">点击上传Logo</div>
              <div className="text-xs text-gray-500">支持PNG透明背景 · 建议尺寸 512×512</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
