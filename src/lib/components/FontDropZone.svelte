<script lang="ts">
	import { toast } from 'svelte-sonner';
	import Upload from '@lucide/svelte/icons/upload';

	type CustomFont = {
		family: string;
		name: string;
		data?: string;
	};

	type Props = {
		onFontLoad: (font: CustomFont) => boolean;
	};

	let { onFontLoad }: Props = $props();
	let dragActive = $state(false);
	let fileInput: HTMLInputElement;

	const MAX_FONT_SIZE = 3 * 1024 * 1024; // 5MB
	const MAX_FONT_SIZE_MB = MAX_FONT_SIZE / (1024 * 1024); // Convert to MB
	const ALLOWED_FONT_TYPES = /\.(ttf|otf|woff|woff2)$/i;
	const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9\-_ ]+$/;

	async function loadFontFile(file: File) {
		// Validate file type
		if (!file.type.startsWith('font/') && !file.name.match(ALLOWED_FONT_TYPES)) {
			toast.error('Please select a valid font file (TTF, OTF, WOFF, WOFF2)');
			return;
		}

		// Validate file size
		if (file.size > MAX_FONT_SIZE) {
			toast.error('Font file too large (max 5MB)');
			return;
		}

		// Validate filename for safety
		const rawName = file.name.replace(ALLOWED_FONT_TYPES, '');
		if (!SAFE_FILENAME_REGEX.test(rawName)) {
			toast.error(
				'Invalid font file name. Use only letters, numbers, spaces, hyphens and underscores.'
			);
			return;
		}

		// Extract font name from file name
		const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '').replace(/[-_]/g, ' ');
		const fontId = `custom-${fontName}-${Date.now()}`;

		try {
			// Get array buffer for immediate font loading
			const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as ArrayBuffer);
				reader.onerror = () => reject(reader.error);
				reader.readAsArrayBuffer(file);
			});

			// Get base64 for storage
			const base64Data = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(file);
			});

			// Create and load the font from array buffer
			const fontFace = new FontFace(fontId, arrayBuffer);
			const font = await fontFace.load();
			document.fonts.add(font);

			const isNewFont = onFontLoad({
				family: fontId,
				name: fontName,
				data: base64Data
			});

			if (isNewFont) {
				toast.success(`${fontName} loaded successfully!`);
			} else {
				toast.info(`${fontName} is already loaded, switching to it`);
			}
		} catch (error) {
			toast.error('Failed to load font file');
			console.error('Font loading error:', error);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;

		const files = e.dataTransfer?.files;
		if (!files || files.length === 0) return;
		loadFontFile(files[0]);
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (!files || files.length === 0) return;
		loadFontFile(files[0]);
		input.value = ''; // Reset input to allow selecting the same file again
	}

	function handleClick() {
		fileInput?.click();
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<div
	role="button"
	aria-label="Font drop zone"
	tabindex="0"
	class="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors
    {dragActive
		? 'border-primary bg-primary/5'
		: 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'}"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	<input
		type="file"
		accept=".ttf,.otf,.woff,.woff2"
		class="hidden"
		onchange={handleFileSelect}
		bind:this={fileInput}
	/>
	<Upload class="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
	<div class="text-center">
		<p class="text-sm text-muted-foreground">Drop a font file here or click to browse</p>
		<p class="mt-0 text-xs text-muted-foreground/75">(TTF, OTF, WOFF, WOFF2)</p>
		<p class="mt-0.5 text-xs text-muted-foreground/75">Max size: {MAX_FONT_SIZE_MB}MB</p>
	</div>
</div>
