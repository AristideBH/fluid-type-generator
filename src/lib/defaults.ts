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

export const DEFAULTS_OPTIONS: App.OptionsMap = {
    viMin: { name: "viMin", label: "vi lower", value: 3.2, min: 0, max: 100, step: 0.1 },
    viMax: { name: "viMax", label: "vi upper", value: 12, min: 0, max: 100, step: 0.1 },
    baseMin: { name: "baseMin", label: "Base MIN (px)", value: 16, min: 1, max: 100, step: 1 },
    baseMax: { name: "baseMax", label: "Base MAX (px)", value: 19, min: 1, max: 100, step: 1 },
    rMin: { name: "rMin", label: "MIN ratio", value: 1.125, min: 1.01, max: 3, step: 0.001 },
    rMax: { name: "rMax", label: "MAX ratio", value: 1.25, min: 1.01, max: 3, step: 0.001 },
    precision: { name: "precision", label: "Precision", value: 2, min: 0, max: 5, step: 1 },
}

export const DEFAULTS_PREVIEW_PARAMS: App.PreviewSettings = {
    text: "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent",
    showDetails: false,
    fontWeight: 500,
    fontFamily: systemFonts[0].value
}
