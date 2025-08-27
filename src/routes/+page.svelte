<script lang="ts">
	import { copyCSSClasses, copyJSON, copyTailwindSnippet, copyText } from '@/exporters';
	import { clampString, fmt, line, type ScaleParams } from '@/mathHelpers';
	import { DEFAULTS, DEFAULTS_PRESETS, systemFonts, type Preset } from '@/presets';
	import { addLargerPreset, addSmallerPreset, removePreset } from '@/stepsLabelsMgmt';

	import { syncScroll } from '@/utils';
	import { toast } from 'svelte-sonner';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let previewText = $state('A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent');

	let params = $state<ScaleParams>({
		viMin: DEFAULTS.viMin,
		viMax: DEFAULTS.viMax,
		baseMin: DEFAULTS.baseMin,
		baseMax: DEFAULTS.baseMax,
		rMin: DEFAULTS.rMin,
		rMax: DEFAULTS.rMax,
		precision: DEFAULTS.precision
	});

	let presets = $state<Preset[]>(DEFAULTS_PRESETS);

	const fontSizeMap = $derived(
		Object.fromEntries(presets.map((p) => [p.label, clampString(p.step, params)]))
	);

	function resetParams() {
		toast.success('Parameters reset to default values');
		params = { ...DEFAULTS };
	}

	let scrollDivs: HTMLDivElement[] = [];
	let areDetailsShown = $state(false);
	let fontWeight = $state(500);
	let selectedFont = $state(systemFonts[0].value);

	$effect(() => {
		if (params.viMin > params.viMax) params.viMin = params.viMax;
		if (params.baseMin > params.baseMax)
			params.baseMax = params.baseMin < params.baseMax ? params.baseMax : params.baseMin;
		if (params.baseMin > params.baseMax) params.baseMin = params.baseMax;
	});
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
						<Input type="number" bind:value={params.baseMin} step="0.01" min="8" max="48" />
						<Slider type="single" bind:value={params.baseMin} min={8} max={48} step={0.1} />
					</div>
				</fieldset>
				<fieldset>
					<Label>Base MAX (px)</Label>
					<div>
						<Input type="number" bind:value={params.baseMax} step="0.01" min="12" max="64" />
						<Slider type="single" bind:value={params.baseMax} min={12} max={64} step={0.1} />
					</div>
				</fieldset>
				<fieldset>
					<Label>MIN ratio</Label>
					<div>
						<Input type="number" bind:value={params.rMin} step="0.001" min="1.05" max="1.333" />
						<Slider type="single" bind:value={params.rMin} min={1.05} max={1.333} step={0.01} />
					</div>
				</fieldset>
				<fieldset>
					<Label>MAX ratio</Label>
					<div>
						<Input type="number" bind:value={params.rMax} step="0.001" min="1.05" max="1.5" />
						<Slider type="single" bind:value={params.rMax} min={1.05} max={1.5} step={0.01} />
					</div>
				</fieldset>
				<fieldset>
					<Label>vi lower</Label>
					<div>
						<Input type="number" bind:value={params.viMin} step="0.01" min="0" max={params.viMax} />
						<Slider
							type="single"
							bind:value={params.viMin}
							min={0}
							max={params.viMax}
							step={0.01}
						/>
					</div>
				</fieldset>
				<fieldset>
					<Label>vi upper</Label>
					<div>
						<Input
							type="number"
							bind:value={params.viMax}
							step="0.01"
							min={params.viMin}
							max="30"
						/>
						<Slider
							type="single"
							bind:value={params.viMax}
							min={params.viMin}
							max={30}
							step={0.01}
						/>
					</div>
				</fieldset>
			</div>

			<!-- actions line -->
			<div class="mt-8 flex flex-wrap gap-2">
				<Button variant="destructive" class="me-auto" onclick={resetParams}>
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
							<Select.Root type="single" bind:value={selectedFont}>
								<Select.Trigger class="w-xs bg-background">{selectedFont}</Select.Trigger>
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

			<ul class="ms-0 mt-6 grid list-none gap-y-0 {areDetailsShown ? 'gap-y-2' : ''}">
				{#each presets as preset, index}
					{@const { label, step } = preset}
					{@const fontSize = clampString(step, params)}
					{@const L = line(step, params)}
					<li
						class="group relative rounded-xl border-dashed transition-all hover:bg-muted
							{areDetailsShown
							? ' border p-2'
							: 'rounded-t-none rounded-b-none border-b py-2 first:rounded-t-xl last:rounded-b-xl last:border-b-0 '}"
					>
						<div
							class="grid items-baseline gap-3
								{!areDetailsShown ? 'grid auto-cols-[auto_1fr] grid-flow-col' : ''}"
						>
							{#if label !== 'base' && label !== 'xs' && label !== 'sm' && label !== 'md' && label !== 'lg' && label !== 'xl'}
								<Button
									variant="secondary"
									class="absolute top-2 right-2 z-50 hidden size-7 group-hover:flex"
									size="icon"
									onclick={() => (presets = removePreset(presets, label))}
									title="Remove {label} preset"
								>
									<Trash2 class="cursor-pointer" />
								</Button>
							{/if}
							<div
								class="relative inline-flex items-end gap-3 transition-all
									{!areDetailsShown ? 'w-[7ch] ps-2' : ''} "
							>
								<Badge
									variant={label === 'base' ? 'default' : 'secondary'}
									class="border-bg font-mono">{label}</Badge
								>
								{#if areDetailsShown}
									<p class="font-mono text-xs text-muted-foreground/50">
										<span>min : {fmt(L.min, params.precision)}px</span> |
										<span>max : {fmt(L.max, params.precision)}px</span> |
										<button
											onclick={() => copyText(clampString(step, params))}
											class="cursor-copy select-all hover:text-foreground"
											title="Copy css proprety"
										>
											{clampString(step, params)}
										</button>
									</p>
								{/if}
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
									style:font-weight={fontWeight}
									style:font-family={selectedFont}
								>
									{previewText}
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
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
