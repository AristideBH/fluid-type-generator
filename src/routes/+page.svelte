<script lang="ts">
	import { copyCSSClasses, copyJSON, copyTailwindSnippet, copyText } from '@/exporters';
	import { clampString } from '@/mathHelpers';
	import { DEFAULTS_PRESETS, systemFonts, type Preset } from '@/presets';
	import { addLargerPreset, addSmallerPreset } from '@/stepsLabelsMgmt';
	import { Options } from '@/options.svelte';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Previews from '@/components/Previews.svelte';

	let previewText = $state('A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent');
	let areDetailsShown = $state(false);
	let fontWeight = $state(500);
	let fontFamily = $state(systemFonts[0].value);

	let presets = $state<Preset[]>(DEFAULTS_PRESETS);
	const opts = new Options();
	const fontSizeMap = $derived(
		Object.fromEntries(presets.map((p) => [p.label, clampString(p.step, opts)]))
	);
</script>

<section class="my-10">
	<h1 class="text-3xl leading-tight font-extrabold tracking-tighter">Fluid Type Scale Generator</h1>
	<p class="lead text-balance text-muted-foreground">
		Generate fluid type scales with custom parameters and preview them in real-time.
	</p>
</section>

<Accordion.Root type="multiple" value={['settings', 'preview']} class="grid gap-4">
	<!-- Fluid Type Scale -->
	<Accordion.Item value="settings" class="sticky top-4 z-10">
		<Accordion.Trigger>Settings</Accordion.Trigger>
		<Accordion.Content>
			<!-- controls with number + range -->
			<div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
				<fieldset>
					<Label>Base MIN (px)</Label>
					<div>
						<Input type="number" bind:value={opts.baseMin} step="0.01" min="8" max="48" />
						<Slider type="single" bind:value={opts.baseMin} min={8} max={48} step={0.1} />
					</div>
				</fieldset>
				<fieldset>
					<Label>Base MAX (px)</Label>
					<div>
						<Input type="number" bind:value={opts.baseMax} step="0.01" min="12" max="64" />
						<Slider type="single" bind:value={opts.baseMax} min={12} max={64} step={0.1} />
					</div>
				</fieldset>
				<fieldset>
					<Label>MIN ratio</Label>
					<div>
						<Input type="number" bind:value={opts.rMin} step="0.001" min="1.05" max="1.333" />
						<Slider type="single" bind:value={opts.rMin} min={1.05} max={1.333} step={0.01} />
					</div>
				</fieldset>
				<fieldset>
					<Label>MAX ratio</Label>
					<div>
						<Input type="number" bind:value={opts.rMax} step="0.001" min="1.05" max="1.5" />
						<Slider type="single" bind:value={opts.rMax} min={1.05} max={1.5} step={0.01} />
					</div>
				</fieldset>
				<fieldset>
					<Label>vi lower</Label>
					<div>
						<Input type="number" bind:value={opts.viMin} step="0.01" min="0" max={opts.viMax} />
						<Slider type="single" bind:value={opts.viMin} min={0} max={opts.viMax} step={0.01} />
					</div>
				</fieldset>
				<fieldset>
					<Label>vi upper</Label>
					<div>
						<Input type="number" bind:value={opts.viMax} step="0.01" min={opts.viMin} max="30" />
						<Slider type="single" bind:value={opts.viMax} min={opts.viMin} max={30} step={0.01} />
					</div>
				</fieldset>
			</div>

			<!-- actions line -->
			<div class="mt-8 flex flex-wrap gap-2">
				<Button variant="destructive" class="me-auto" onclick={opts.reset}>
					<RotateCcw />
					Reset
				</Button>
				<Button onclick={() => copyCSSClasses(fontSizeMap)}>Copy CSS</Button>
				<Button onclick={() => copyJSON(fontSizeMap)}>Copy JSON</Button>
				<Button onclick={() => copyTailwindSnippet(fontSizeMap)}>Copy Tailwind snippet</Button>
			</div>
		</Accordion.Content>
	</Accordion.Item>

	<Accordion.Item value="preview">
		<Accordion.Trigger>Preview</Accordion.Trigger>
		<Accordion.Content>
			<div class="flex flex-col items-start gap-4 md:flex-row">
				<div class="flex w-full flex-col gap-4 rounded-lg border border-dashed p-4">
					<div class="flex flex-col gap-4 sm:flex-row md:items-start">
						<div class="flex flex-col gap-2">
							<Label>Font family</Label>
							<Select.Root type="single" bind:value={fontFamily}>
								<Select.Trigger class="w-xs bg-background">{fontFamily}</Select.Trigger>
								<Select.Content>
									{#each systemFonts as font}
										<Select.Item value={font.value}>{font.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="flex grow flex-col gap-2">
							<Label>Font weight</Label>
							<div class="flex gap-4">
								<Input bind:value={fontWeight} disabled />
								<Slider type="single" bind:value={fontWeight} min={100} max={900} step={100} />
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<Label for="previewText">Preview text</Label>
						<Input
							type="text"
							bind:value={previewText}
							placeholder="Type preview text…"
							class="w-full"
							id="previewText"
						/>
					</div>
				</div>
				<div class="flex min-w-xs flex-col gap-2">
					<Label>Manage presets</Label>
					<div class="flex gap-2 md:flex-col">
						<Button class="w-fit" onclick={() => (presets = addSmallerPreset(presets))}>
							Add smaller
						</Button>
						<Button class="w-fit" onclick={() => (presets = addLargerPreset(presets))}>
							Add larger
						</Button>
					</div>
					<div class="mt-2 flex gap-2">
						<Switch id="showSizeDetails" bind:checked={areDetailsShown} />
						<Label for="showSizeDetails">Show details</Label>
					</div>
				</div>
			</div>

			<Previews {presets} {opts} {areDetailsShown} {previewText} {fontWeight} {fontFamily} />
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style lang="postcss">
	@reference "./../app.css";

	fieldset {
		@apply grid gap-2 text-sm text-card-foreground;

		& > div {
			@apply flex gap-4;
		}
	}
</style>
