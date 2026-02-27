import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Mode = 'light' | 'dark' | 'system';

export type ColorScheme = 'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'cyan';

export interface ColorSchemeConfig {
    name: string;
    label: string;
    preview: string; // Tailwind bg class for the preview swatch
    hue: number;
}

export const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeConfig> = {
    emerald: { name: 'emerald', label: 'Emerald', preview: 'bg-emerald-500', hue: 160 },
    blue:    { name: 'blue',    label: 'Ocean',   preview: 'bg-blue-500',    hue: 217 },
    violet:  { name: 'violet',  label: 'Violet',  preview: 'bg-violet-500',  hue: 263 },
    rose:    { name: 'rose',    label: 'Rose',    preview: 'bg-rose-500',    hue: 350 },
    amber:   { name: 'amber',   label: 'Amber',   preview: 'bg-amber-500',   hue: 38 },
    cyan:    { name: 'cyan',    label: 'Cyan',    preview: 'bg-cyan-500',    hue: 188 },
};

interface ThemeContextProps {
    mode: Mode;
    resolvedMode: 'light' | 'dark';
    colorScheme: ColorScheme;
    setMode: (mode: Mode) => void;
    setColorScheme: (scheme: ColorScheme) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const STORAGE_KEY_MODE = 'aiapplymate-mode';
const STORAGE_KEY_SCHEME = 'aiapplymate-color-scheme';

function getSystemMode(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<Mode>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_MODE);
        return (stored as Mode) || 'light';
    });

    const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_SCHEME);
        return (stored as ColorScheme) || 'emerald';
    });

    const resolvedMode: 'light' | 'dark' = mode === 'system' ? getSystemMode() : mode;

    // Listen for system preference changes when mode is 'system'
    useEffect(() => {
        if (mode !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setModeState('system'); // triggers re-render
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [mode]);

    // Apply dark class
    useEffect(() => {
        const root = document.documentElement;
        if (resolvedMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [resolvedMode]);

    // Apply color scheme class
    useEffect(() => {
        const root = document.documentElement;
        // Remove all scheme classes
        Object.keys(COLOR_SCHEMES).forEach((s) => root.classList.remove(`scheme-${s}`));
        // Add current
        root.classList.add(`scheme-${colorScheme}`);
    }, [colorScheme]);

    const setMode = (m: Mode) => {
        setModeState(m);
        localStorage.setItem(STORAGE_KEY_MODE, m);
    };

    const setColorScheme = (s: ColorScheme) => {
        setColorSchemeState(s);
        localStorage.setItem(STORAGE_KEY_SCHEME, s);
    };

    const toggleMode = () => {
        const next = resolvedMode === 'light' ? 'dark' : 'light';
        setMode(next);
    };

    return (
        <ThemeContext.Provider value={{ mode, resolvedMode, colorScheme, setMode, setColorScheme, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
