// presets.ts
export type Preset = { label: string; step: number };

export const DEFAULTS = {
    viMin: 3.2,
    viMax: 12,
    baseMin: 16,
    baseMax: 19,
    rMin: 1.125,
    rMax: 1.25,
    precision: 2,
};

export const DEFAULTS_PRESETS: Preset[] = [
    { label: '2xs', step: -3 },
    { label: 'xs', step: -2 },
    { label: 'sm', step: -1 },
    { label: 'base', step: 0 },
    { label: 'md', step: 1 },
    { label: 'lg', step: 2 },
    { label: 'xl', step: 3 },
    { label: '2xl', step: 4 },
    { label: '3xl', step: 5 },
    { label: '4xl', step: 6 },
    { label: '5xl', step: 7 }
]


export const systemFonts = [
    { label: 'System Default', value: 'system-ui' },
    { label: 'Sans-serif', value: 'sans-serif' },
    { label: 'Serif', value: 'serif' },
    { label: 'Monospace', value: 'monospace' },
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times', value: '"Times New Roman", Times, serif' },
    { label: 'Courier', value: '"Courier New", Courier, monospace' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' }
];