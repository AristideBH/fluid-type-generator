import { toast } from "svelte-sonner"
import { SvelteSet } from "svelte/reactivity";
import { DEFAULTS_OPTIONS, DEFAULTS_PRESETS, DEFAULTS_PREVIEW_PARAMS } from "./defaults";

type BumpFn = (label: string) => string;

export class SizePresets {
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

export class ScalingOptions {
    #options = $state<App.OptionsMap>(DEFAULTS_OPTIONS);

    get baseMin() { return this.#options.baseMin }
    set baseMin(opt) { this.#options.baseMin.value = opt.value }

    get baseMax() { return this.#options.baseMax }
    set baseMax(opt) { this.#options.baseMax.value = opt.value }

    get viMin() { return this.#options.viMin }
    set viMin(opt) { this.#options.viMin.value = opt.value }

    get viMax() { return this.#options.viMax }
    set viMax(opt) { this.#options.viMax.value = opt.value }

    get rMin() { return this.#options.rMin }
    set rMin(opt) { this.#options.rMin.value = opt.value }

    get rMax() { return this.#options.rMax }
    set rMax(opt) { this.#options.rMax.value = opt.value }

    get precision() { return this.#options.precision }
    set precision(opt) { this.#options.precision.value = opt.value }

    get all() { return this.#options }
    set all(opts) { this.#options = opts }

    constructor() {
        $effect(() => {
            if (this.#options.viMin.value > this.#options.viMax.value) {
                this.#options.viMin.value = this.#options.viMax.value
            }
            if (this.#options.baseMin.value > this.#options.baseMax.value) {
                this.#options.baseMax.value = this.#options.baseMin.value
            }
            if (this.#options.baseMin.value > this.#options.baseMax.value) {
                this.#options.baseMin.value = this.#options.baseMax.value
            }
        })
    }

    reset() {
        toast.success('Options reset to defaults')
        this.all = DEFAULTS_OPTIONS
    }

    toObject(): App.OptionsMap {
        return { ...this.#options };
    }
}

export class PreviewSettings {
    all = $state(DEFAULTS_PREVIEW_PARAMS)
    text = $derived(this.all.text)
    showDetails = $derived(this.all.showDetails)
    fontWeight = $derived(this.all.fontWeight)
    fontFamily = $derived(this.all.fontFamily)
    customFonts = $state<Array<{ family: string; name: string }>>([])

    setCustomFont(font: { family: string; name: string }): boolean {
        // Check if a font with the same name already exists
        const existingFont = this.customFonts.find(f => f.name.toLowerCase() === font.name.toLowerCase());
        if (existingFont) {
            // If it exists, just switch to it
            this.all = { ...this.all, fontFamily: existingFont.family };
            return false;
        }

        // Add new font
        this.customFonts = [...this.customFonts, font];
        this.all = { ...this.all, fontFamily: font.family };
        return true;
    }

    toObject(): App.PreviewSettings {
        return { ...this.all };
    }
}