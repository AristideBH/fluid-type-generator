<script lang="ts">
	import { clampString } from '@/utils';
	import { ScalingOptions, PreviewSettings, SizePresets } from '@/logic.svelte';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import PreviewsFontSize from '@/components/PreviewsFontSize.svelte';
	import OptionsSettings from '@/components/OptionsSettings.svelte';
	import PreviewsSettings from '@/components/PreviewsSettings.svelte';

	let presets = new SizePresets();
	let options = new ScalingOptions();
	let settings = new PreviewSettings();
	let fontSizeMap = $derived<App.FontSizeMap>(
		Object.fromEntries(presets.all.map((p) => [p.label, clampString(p.step, options.toObject())]))
	);
</script>

<section class="my-10">
	<h1 class="text-3xl leading-tight font-extrabold tracking-tighter">Fluid Type Scale Generator</h1>
	<p class="lead text-balance text-muted-foreground">
		Generate fluid type scales with custom parameters and preview them in real-time.
	</p>
</section>

<Accordion.Root type="multiple" value={['preview']} class="grid gap-4">
	<Accordion.Item value="settings" class="sticky top-4 z-10">
		<Accordion.Trigger>Settings</Accordion.Trigger>
		<Accordion.Content>
			<OptionsSettings {options} {fontSizeMap} />
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="preview">
		<Accordion.Trigger>Preview</Accordion.Trigger>
		<Accordion.Content>
			<PreviewsSettings {settings} {presets} />
			<PreviewsFontSize {presets} {options} {settings} />
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
