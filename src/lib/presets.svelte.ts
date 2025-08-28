import { SvelteSet } from "svelte/reactivity";

type BumpFn = (label: string) => string;

export const DEFAULTS_PRESETS: App.Preset[] = [
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


export class Presets {
    all = $state<App.Preset[]>(DEFAULTS_PRESETS);

    private bumpXL(label: string): string {
        if (label === 'xl') return '2xl';
        const m = label.match(/^(\d+)xl$/);
        return m ? `${Number(m[1]) + 1}xl` : 'xl';
    }

    private bumpXS(label: string): string {
        if (label === 'xs') return '2xs';
        const m = label.match(/^(\d+)xs$/);
        return m ? `${Number(m[1]) + 1}xs` : 'xs';
    }

    private nextLargerLabel(): string {
        const ns = this.all.map(p => {
            if (p.label === 'xl') return 1;
            const m = p.label.match(/^(\d+)xl$/);
            return m ? Number(m[1]) : 0;
        });
        const maxN = Math.max(0, ...ns);
        return maxN === 0 ? 'xl' : `${maxN + 1}xl`;
    }


    private nextSmallerLabel(): string {
        const ns = this.all.map(p => {
            if (p.label === 'sm') return 0;
            if (p.label === 'xs') return 1;
            const m = p.label.match(/^(\d+)xs$/);
            return m ? Number(m[1]) : null;
        }).filter((n): n is number => n !== null);
        const maxN = ns.length ? Math.max(...ns) : 0;
        const n = maxN + 1;
        return n === 1 ? 'xs' : `${n}xs`;
    }

    private ensureUniqueLabel(label: string, bump: BumpFn): string {
        let out = label;
        const seen = new SvelteSet(this.all.map(p => p.label));
        while (seen.has(out)) out = bump(out);
        return out;
    }

    addLarger() {
        const label = this.ensureUniqueLabel(this.nextLargerLabel(), this.bumpXL);
        const step = Math.max(...this.all.map(p => p.step)) + 1;
        this.all = [...this.all, { label, step }].sort((a, b) => a.step - b.step);
    }

    addSmaller() {
        const label = this.ensureUniqueLabel(this.nextSmallerLabel(), this.bumpXS);
        const step = Math.min(...this.all.map(p => p.step)) - 1;
        this.all = [...this.all, { label, step }].sort((a, b) => a.step - b.step);
    }

    remove(label: string) {
        if (label === 'base') return this.all;
        this.all = this.all.filter(p => p.label !== label);
    }

    reset() {
        this.all = DEFAULTS_PRESETS;
    }


}