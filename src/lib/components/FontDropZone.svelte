<script lang="ts">
	import { toast } from 'svelte-sonner';

	type CustomFont = {
		family: string;
		name: string;
	};

	type Props = {
		onFontLoad: (font: CustomFont) => void;
	};

	let { onFontLoad }: Props = $props();
	let dragActive = $state(false);

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;

		const files = e.dataTransfer?.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		if (!file.type.startsWith('font/') && !file.name.match(/\.(ttf|otf|woff|woff2)$/i)) {
			toast.error('Please drop a valid font file (TTF, OTF, WOFF, WOFF2)');
			return;
		}

		// Extract font name from file name
		const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '').replace(/[-_]/g, ' ');
		const fontId = `custom-${fontName}-${Date.now()}`;

		const reader = new FileReader();
		reader.onload = async (event) => {
			const fontFace = new FontFace(fontId, event.target?.result as ArrayBuffer);
			try {
				const font = await fontFace.load();
				document.fonts.add(font);
				onFontLoad({ family: font.family, name: fontName });
				toast.success(`${fontName} loaded successfully!`);
			} catch (error) {
				toast.error('Failed to load font file');
				console.error('Font loading error:', error);
			}
		};
		reader.readAsArrayBuffer(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}
</script>

<div
	role="button"
	aria-label="Font drop zone"
	tabindex="0"
	class="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors
    {dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<p class="text-center text-sm text-muted-foreground">
		Drop a font file here<br />
		<span class="text-xs">(TTF, OTF, WOFF, WOFF2)</span>
	</p>
</div>
