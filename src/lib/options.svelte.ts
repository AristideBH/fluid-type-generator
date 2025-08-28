import { toast } from "svelte-sonner"

const DEFAULTS_OPTIONS: App.OptionsMap = {
    viMin: { name: "viMin", label: "vi lower", value: 3.2, min: 0, max: 100, step: 0.1 },
    viMax: { name: "viMax", label: "vi upper", value: 12, min: 0, max: 100, step: 0.1 },
    baseMin: { name: "baseMin", label: "Base MIN (px)", value: 16, min: 1, max: 100, step: 1 },
    baseMax: { name: "baseMax", label: "Base MAX (px)", value: 19, min: 1, max: 100, step: 1 },
    rMin: { name: "rMin", label: "MIN ratio", value: 1.125, min: 1.01, max: 3, step: 0.001 },
    rMax: { name: "rMax", label: "MAX ratio", value: 1.25, min: 1.01, max: 3, step: 0.001 },
    precision: { name: "precision", label: "Precision", value: 2, min: 0, max: 5, step: 1 },
}

export class Options {
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


const DEFAULTS_PREVIEW_PARAMS: App.PreviewSettings = {
    text: "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent",
    showDetails: true,
    fontWeight: 500,
    fontFamily: systemFonts[0].value
}

export class PreviewSettings {
    all = $state(DEFAULTS_PREVIEW_PARAMS)
    text = $derived(this.all.text)
    showDetails = $derived(this.all.showDetails)
    fontWeight = $derived(this.all.fontWeight)
    fontFamily = $derived(this.all.fontFamily)

    toObject(): App.PreviewSettings {
        return { ...this.all };
    }
}