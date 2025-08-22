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
} as const;
