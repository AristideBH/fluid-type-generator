import { toast } from "svelte-sonner"
import { SvelteSet } from "svelte/reactivity";
import { DEFAULTS_OPTIONS, DEFAULTS_PRESETS, DEFAULTS_PREVIEW_PARAMS } from "./defaults";
import { PersistedState } from "runed";

type BumpFn = (label: string) => string;

export class SizePresets {
    #persistedPresets = new PersistedState("size-presets", DEFAULTS_PRESETS);
    all = $state<App.Preset[]>(this.#persistedPresets.current);

    constructor() {
        $effect(() => {
            this.#persistedPresets.current = this.all;
        });
    }

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
        this.#persistedPresets.current = DEFAULTS_PRESETS;
        toast.success('Presets reset to defaults');
    }

}

export class ScalingOptions {
    #persistedOptions = new PersistedState("scaling-options", DEFAULTS_OPTIONS);
    #options = $state<App.OptionsMap>(this.#persistedOptions.current);

    // Derived constraints
    baseMinMax = $derived(this.#options.baseMax.value);
    baseMaxMin = $derived(this.#options.baseMin.value);
    viMinMax = $derived(this.#options.viMax.value);
    viMaxMin = $derived(this.#options.viMin.value);

    constructor() {
        $effect(() => {
            // Persist changes
            this.#persistedOptions.current = this.#options;
        });

        // Show restore notification if we loaded persisted data
        if (JSON.stringify(this.#persistedOptions.current) !== JSON.stringify(DEFAULTS_OPTIONS)) {
            toast.success('Restored previous scaling options');
        }
    }

    get baseMin() { return this.#options.baseMin }
    set baseMin(opt) {
        const newValue = Math.min(opt.value, this.baseMinMax);
        this.#options.baseMin.value = newValue;
    }

    get baseMax() { return this.#options.baseMax }
    set baseMax(opt) {
        const newValue = Math.max(opt.value, this.baseMaxMin);
        this.#options.baseMax.value = newValue;
    }

    get viMin() { return this.#options.viMin }
    set viMin(opt) {
        const newValue = Math.min(opt.value, this.viMinMax);
        this.#options.viMin.value = newValue;
    }

    get viMax() { return this.#options.viMax }
    set viMax(opt) {
        const newValue = Math.max(opt.value, this.viMaxMin);
        this.#options.viMax.value = newValue;
    }

    get rMin() { return this.#options.rMin }
    set rMin(opt) { this.#options.rMin.value = opt.value }

    get rMax() { return this.#options.rMax }
    set rMax(opt) { this.#options.rMax.value = opt.value }

    get precision() { return this.#options.precision }
    set precision(opt) { this.#options.precision.value = opt.value }

    get all() { return this.#options }
    set all(opts) { this.#options = opts }

    reset() {
        this.all = DEFAULTS_OPTIONS;
        this.#persistedOptions.current = DEFAULTS_OPTIONS;
        toast.success('Options reset to defaults');
    }

    toObject(): App.OptionsMap {
        return { ...this.#options };
    }
}

export class PreviewSettings {
    #persistedSettings = new PersistedState("preview-settings", DEFAULTS_PREVIEW_PARAMS);
    #persistedCustomFonts = new PersistedState<Array<{
        family: string;
        name: string;
        data?: string; // Base64 encoded font data
    }>>("custom-fonts", []);

    all = $state(this.#persistedSettings.current)
    text = $derived(this.all.text)
    showDetails = $derived(this.all.showDetails)
    fontWeight = $derived(this.all.fontWeight)
    fontFamily = $derived(this.all.fontFamily)
    customFonts = $state<Array<{ family: string; name: string }>>(
        this.#persistedCustomFonts.current.map(({ family, name }) => ({ family, name }))
    )

    constructor() {
        $effect(() => {
            this.#persistedSettings.current = this.all;
        });

        // Restore custom fonts
        Promise.all(this.#persistedCustomFonts.current.map(async (font) => {
            if (font.data) {
                try {
                    // Convert base64 to array buffer
                    const response = await fetch(font.data);
                    const blob = await response.blob();
                    const arrayBuffer = await blob.arrayBuffer();

                    const fontFace = new FontFace(font.family, arrayBuffer);
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    return true;
                } catch (error) {
                    console.error('Failed to restore font:', font.name, error);
                    return false;
                }
            }
            return false;
        })).then(results => {
            // Remove any fonts that failed to load
            this.#persistedCustomFonts.current = this.#persistedCustomFonts.current.filter((_, i) => results[i]);

            if (results.some(success => success)) {
                toast.success(`Restored ${results.filter(Boolean).length} custom font(s)`);
            }
        });        // Show restore notification if we loaded persisted data
        if (this.customFonts.length > 0 || JSON.stringify(this.all) !== JSON.stringify(DEFAULTS_PREVIEW_PARAMS)) {
            toast.success('Restored previous preview settings');
        }
    }

    setCustomFont(font: { family: string; name: string; data?: string }): boolean {
        // Check if a font with the same name already exists
        const existingFont = this.customFonts.find(f => f.name.toLowerCase() === font.name.toLowerCase());
        if (existingFont) {
            // If it exists, just switch to it
            this.all = { ...this.all, fontFamily: existingFont.family };
            return false;
        }

        // Add new font to both state and persistence
        this.customFonts = [...this.customFonts, { family: font.family, name: font.name }];
        if (font.data) {
            this.#persistedCustomFonts.current = [
                ...this.#persistedCustomFonts.current,
                { family: font.family, name: font.name, data: font.data }
            ];
        }
        this.all = { ...this.all, fontFamily: font.family };
        return true;
    }

    removeCustomFont(family: string) {
        // Remove from customFonts state
        this.customFonts = this.customFonts.filter(f => f.family !== family);

        // Remove from persisted storage
        this.#persistedCustomFonts.current = this.#persistedCustomFonts.current
            .filter(f => f.family !== family);

        // Always reset to system default font
        this.all = { ...this.all, fontFamily: DEFAULTS_PREVIEW_PARAMS.fontFamily };

        // Try to remove from document.fonts
        const font = Array.from(document.fonts).find(f => f.family === family);
        if (font) {
            document.fonts.delete(font);
        }

        toast.success('Font removed and reset to system default');
    }

    toObject(): App.PreviewSettings {
        return { ...this.all };
    }
}