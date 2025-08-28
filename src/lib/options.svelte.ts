import { toast } from "svelte-sonner"

type Option = {
    value: number;
    min: number;
    max: number;
    step: number;
}

type OptionMap = {
    viMin: Option;
    viMax: Option;
    baseMin: Option;
    baseMax: Option;
    rMin: Option;
    rMax: Option;
    precision: Option;
}

const DEFAULTS_OPTIONS: OptionMap = {
    viMin: { value: 3.2, min: 0, max: 100, step: 0.1 },
    viMax: { value: 12, min: 0, max: 100, step: 0.1 },
    baseMin: { value: 16, min: 1, max: 100, step: 1 },
    baseMax: { value: 19, min: 1, max: 100, step: 1 },
    rMin: { value: 1.125, min: 1.01, max: 3, step: 0.001 },
    rMax: { value: 1.25, min: 1.01, max: 3, step: 0.001 },
    precision: { value: 2, min: 0, max: 5, step: 1 },
}

export class Options {
    #options = $state(structuredClone(DEFAULTS_OPTIONS))

    get baseMin() { return this.#options.baseMin.value }
    set baseMin(value) { this.#options.baseMin.value = value }

    get baseMax() { return this.#options.baseMax.value }
    set baseMax(value) { this.#options.baseMax.value = value }

    get viMin() { return this.#options.viMin.value }
    set viMin(value) { this.#options.viMin.value = value }

    get viMax() { return this.#options.viMax.value }
    set viMax(value) { this.#options.viMax.value = value }

    get rMin() { return this.#options.rMin.value }
    set rMin(value) { this.#options.rMin.value = value }

    get rMax() { return this.#options.rMax.value }
    set rMax(value) { this.#options.rMax.value = value }

    get precision() { return this.#options.precision.value }
    set precision(value) { this.#options.precision.value = value }

    get all() { return this.#options }

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
        this.#options = DEFAULTS_OPTIONS
    }
}