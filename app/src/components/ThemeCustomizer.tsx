import { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Check, X } from 'lucide-react';
import { useTheme, COLOR_SCHEMES, type ColorScheme } from '@/contexts/ThemeContext';

const ThemeCustomizer = () => {
  const { mode, resolvedMode, colorScheme, setMode, setColorScheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const modeOptions: { value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
          open
            ? 'bg-primary text-primary-foreground shadow-lg'
            : resolvedMode === 'dark'
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}
        aria-label="Customize theme"
        title="Customize theme"
      >
        <Palette className="w-[18px] h-[18px]" />
      </button>

      {/* Panel */}
      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
            resolvedMode === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            resolvedMode === 'dark' ? 'border-slate-700' : 'border-slate-100'
          }`}>
            <span className={`text-sm font-bold ${resolvedMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Customize Theme
            </span>
            <button
              onClick={() => setOpen(false)}
              className={`p-1 rounded-lg transition-colors ${
                resolvedMode === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Mode toggle */}
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${
                resolvedMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Mode
              </label>
              <div className={`flex rounded-xl p-1 ${resolvedMode === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                {modeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = mode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setMode(opt.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                        active
                          ? resolvedMode === 'dark'
                            ? 'bg-slate-600 text-white shadow-sm'
                            : 'bg-white text-slate-900 shadow-sm'
                          : resolvedMode === 'dark'
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color scheme */}
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider mb-3 block ${
                resolvedMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Color Scheme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((key) => {
                  const scheme = COLOR_SCHEMES[key];
                  const active = colorScheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setColorScheme(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        active
                          ? resolvedMode === 'dark'
                            ? 'border-white/30 bg-slate-700'
                            : 'border-slate-300 bg-slate-50'
                          : resolvedMode === 'dark'
                            ? 'border-transparent hover:border-slate-600 hover:bg-slate-700/50'
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full ${scheme.preview} shadow-sm`} />
                        {active && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${
                        active
                          ? resolvedMode === 'dark' ? 'text-white' : 'text-slate-900'
                          : resolvedMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {scheme.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply / Done button */}
            <button
              onClick={() => setOpen(false)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                resolvedMode === 'dark'
                  ? 'bg-primary text-white hover:opacity-90'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              <Check className="w-4 h-4" />
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeCustomizer;
