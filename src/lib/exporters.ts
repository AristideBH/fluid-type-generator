// exporters.ts
export type FontSizeMap = { [label: string]: string };
import { toast } from "svelte-sonner";

// ---- Copy functions ----
export function copyText(text: string) {
    navigator.clipboard?.writeText(text);
    toast.success('Copied to clipboard');
}

export function copyJSON(map: FontSizeMap) {
    copyText(JSON.stringify(map, null, 2));
}

export function copyTailwindSnippet(map: FontSizeMap) {
    const body = `// Tailwind config snippet
// put this under theme.extend.fontSize
fontSize: ${JSON.stringify(map, null, 2)},`;
    copyText(body);
}

export function copyCSSClasses(map: FontSizeMap) {
    let classes = `/* Font size classes (generated) */\n`;
    for (const [label, size] of Object.entries(map)) {
        classes += `.text-${label} { font-size: ${size}; }\n`;
    }
    copyText(classes);
}

// ---- Download functions ----
function download(filename: string, content: string, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}

export function downloadJSON(map: FontSizeMap) {
    download('fontSize.json', JSON.stringify(map, null, 2));
}

export function downloadTailwindJS(map: FontSizeMap) {
    const js = `// font-size scale (generated)
export const fontSize = ${JSON.stringify(map, null, 2)};`;
    download('fontSize.js', js, 'application/javascript');
}
