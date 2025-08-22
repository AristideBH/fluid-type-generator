import type { Preset } from './presets';

type BumpFn = (label: string) => string;

function nextLargerLabel(presets: Preset[]): string {
    const ns = presets.map(p => {
        if (p.label === 'xl') return 1;
        const m = p.label.match(/^(\d+)xl$/);
        return m ? Number(m[1]) : 0;
    });
    const maxN = Math.max(0, ...ns);
    return maxN === 0 ? 'xl' : `${maxN + 1}xl`;
}

function nextSmallerLabel(presets: Preset[]): string {
    const ns = presets.map(p => {
        if (p.label === 'sm') return 0;
        if (p.label === 'xs') return 1;
        const m = p.label.match(/^(\d+)xs$/);
        return m ? Number(m[1]) : null;
    }).filter((n): n is number => n !== null);
    const maxN = ns.length ? Math.max(...ns) : 0;
    const n = maxN + 1;
    return n === 1 ? 'xs' : `${n}xs`;
}

function ensureUniqueLabel(label: string, bump: BumpFn, presets: Preset[]): string {
    let out = label;
    const seen = new Set(presets.map(p => p.label));
    while (seen.has(out)) out = bump(out);
    return out;
}

const bumpXL: BumpFn = (l) => {
    if (l === 'xl') return '2xl';
    const m = l.match(/^(\d+)xl$/);
    return m ? `${Number(m[1]) + 1}xl` : 'xl';
};

const bumpXS: BumpFn = (l) => {
    if (l === 'xs') return '2xs';
    const m = l.match(/^(\d+)xs$/);
    return m ? `${Number(m[1]) + 1}xs` : 'xs';
};

export function addLargerPreset(presets: Preset[]): Preset[] {
    const label = ensureUniqueLabel(nextLargerLabel(presets), bumpXL, presets);
    const step = Math.max(...presets.map(p => p.step)) + 1;
    return [...presets, { label, step }].sort((a, b) => a.step - b.step);
}

export function addSmallerPreset(presets: Preset[]): Preset[] {
    const label = ensureUniqueLabel(nextSmallerLabel(presets), bumpXS, presets);
    const step = Math.min(...presets.map(p => p.step)) - 1;
    return [...presets, { label, step }].sort((a, b) => a.step - b.step);
}

export function removePreset(presets: Preset[], label: string): Preset[] {
    if (label === 'base') return presets;
    return presets.filter(p => p.label !== label);
}
