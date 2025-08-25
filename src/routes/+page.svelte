<script lang="ts">
	import { copyCSSClasses, copyJSON, copyTailwindSnippet, copyText } from '@/exporters';
	import { clampString, fmt, line, type ScaleParams } from '@/mathHelpers';
	import { DEFAULTS, type Preset } from '@/presets';
	import { addLargerPreset, addSmallerPreset, removePreset } from '@/stepsLabelsMgmt';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { syncScroll } from '@/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let previewText = $state('A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent');

	let viMin = $state(DEFAULTS.viMin);
	let viMax = $state(DEFAULTS.viMax);
	let baseMin = $state(DEFAULTS.baseMin);
	let baseMax = $state(DEFAULTS.baseMax);
	let rMin = $state(DEFAULTS.rMin);
	let rMax = $state(DEFAULTS.rMax);
	let precision = $state(DEFAULTS.precision);

	const params: ScaleParams = $derived({
		viMin,
		viMax,
		baseMin,
		baseMax,
		rMin,
		rMax,
		precision
	});

	let presets = $state<Preset[]>([
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
	]);

	const fontSizeMap = $derived(
		Object.fromEntries(presets.map((p) => [p.label, clampString(p.step, params)]))
	);

	function resetParams() {
		viMin = DEFAULTS.viMin;
		viMax = DEFAULTS.viMax;
		baseMin = DEFAULTS.baseMin;
		baseMax = DEFAULTS.baseMax;
		rMin = DEFAULTS.rMin;
		rMax = DEFAULTS.rMax;
		precision = DEFAULTS.precision;
	}

	let scrollDivs: HTMLDivElement[] = [];

	$effect(() => {
		if (viMin > viMax) viMin = viMax;
		if (baseMin > baseMax) baseMax = baseMin < baseMax ? baseMax : baseMin;
		if (baseMin > baseMax) baseMin = baseMax;
	});
</script>

{#snippet previewPreset(preset: Preset, index: number)}
	{@const { label, step } = preset}
	{@const fontSize = clampString(step, params)}
	{@const L = line(step, params)}
	<li class="group rounded-xl border border-dashed p-2">
		<div class="grid items-baseline gap-3">
			<div class="relative inline-flex items-baseline gap-3">
				<Badge variant="secondary">{label}</Badge>
				{#if label !== 'base'}
					<Button
						variant="secondary"
						class="absolute top-0 right-0 hidden size-7 group-hover:flex"
						size="icon"
						onclick={() => (presets = removePreset(presets, label))}
						title="Remove {label} preset"
					>
						<Trash2 />
					</Button>
				{/if}
				<p class="font-mono text-xs text-muted-foreground/50">
					<span>min : {fmt(L.min, precision)}px</span> |
					<span>max : {fmt(L.max, precision)}px</span> |
					<button
						onclick={() => copyText(clampString(step, params))}
						class="cursor-copy select-all hover:text-foreground"
					>
						{clampString(step, params)}
					</button>
				</p>
			</div>
			<div
				class="max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-[0.2em] whitespace-nowrap"
				style:font-size={fontSize}
				bind:this={scrollDivs[index]}
				onscroll={() => syncScroll(index, scrollDivs)}
			>
				<div
					class="py-[0.1em] font-semibold"
					style="text-box-edge: cap alphabetic; text-box-trim: trim-both; font-size:inherit;"
				>
					{previewText}
				</div>
			</div>
		</div>
	</li>
{/snippet}

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
			<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
				<label>
					<Label>Base MIN (px)</Label>
					<div>
						<Input type="number" bind:value={baseMin} step="0.01" min="8" max="48" />
						<Slider type="single" bind:value={baseMin} min={8} max={48} step={0.1} />
					</div>
				</label>
				<label>
					<Label>Base MAX (px)</Label>
					<div>
						<Input type="number" bind:value={baseMax} step="0.01" min="12" max="64" />
						<Slider type="single" bind:value={baseMax} min={12} max={64} step={0.1} />
					</div>
				</label>
				<label>
					<Label>MIN ratio</Label>
					<div>
						<Input type="number" bind:value={rMin} step="0.001" min="1.05" max="1.333" />
						<Slider type="single" bind:value={rMin} min={1.05} max={1.333} step={0.01} />
					</div>
				</label>
				<label>
					<Label>MAX ratio</Label>
					<div>
						<Input type="number" bind:value={rMax} step="0.001" min="1.05" max="1.5" />
						<Slider type="single" bind:value={rMax} min={1.05} max={1.5} step={0.01} />
					</div>
				</label>
				<label>
					<Label>vi lower</Label>
					<div>
						<Input type="number" bind:value={viMin} step="0.01" min="0" max={viMax} />
						<Slider type="single" bind:value={viMin} min={0} max={viMax} step={0.01} />
					</div>
				</label>
				<label>
					<Label>vi upper</Label>
					<div>
						<Input type="number" bind:value={viMax} step="0.01" min={viMin} max="30" />
						<Slider type="single" bind:value={viMax} min={viMin} max={30} step={0.01} />
					</div>
				</label>
			</div>

			<!-- actions line -->
			<div class="mt-8 flex flex-wrap gap-2">
				<Button variant="destructive" class="ms-auto" onclick={resetParams}>
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
			<div class="flex items-end gap-4">
				<div class="flex w-full flex-col gap-2">
					<Label for="previewText">Preview text</Label>
					<Input
						type="text"
						bind:value={previewText}
						placeholder="Type preview text…"
						class="w-full"
						id="previewText"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Manage presets</Label>
					<div class="ml-auto flex gap-2">
						<Button variant="secondary" onclick={() => (presets = addSmallerPreset(presets))}>
							Add smaller
						</Button>
						<Button variant="secondary" onclick={() => (presets = addLargerPreset(presets))}>
							Add larger
						</Button>
					</div>
				</div>
			</div>

			<ul class="ms-0 mt-6 grid list-none gap-y-2">
				{#each presets as preset, index}
					{@render previewPreset(preset, index)}
				{/each}
			</ul>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style lang="postcss">
	@reference "./../app.css";

	label {
		@apply grid gap-2 text-sm text-card-foreground;

		& > div {
			@apply flex gap-4;
		}
	}
</style>
