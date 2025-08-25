<script lang="ts">
	import { DEFAULTS, type Preset } from '@/presets';
	import { line, fmt, clampString, type ScaleParams } from '@/mathHelpers';
	import { addLargerPreset, addSmallerPreset, removePreset } from '@/stepsLabelsMgmt';
	import { copyJSON, copyTailwindSnippet, downloadJSON, downloadTailwindJS } from '@/exporters';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let previewText = $state('The quick brown fox jumps over the lazy dog');

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

	$effect(() => {
		if (viMin > viMax) viMin = viMax;
		if (baseMin > baseMax) baseMax = baseMin < baseMax ? baseMax : baseMin;
		if (baseMin > baseMax) baseMin = baseMax;
	});
</script>

<Accordion.Root type="multiple" value={['parameters', 'presets']} class="grid gap-4">
	<!-- Fluid Type Scale -->
	<Accordion.Item value="parameters">
		<Accordion.Trigger>Fluid Type Scale</Accordion.Trigger>
		<Accordion.Content>
			<!-- controls with number + range -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
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
				<Button variant="secondary" onclick={() => copyJSON(fontSizeMap)}>Copy JSON</Button>
				<Button variant="secondary" onclick={() => copyTailwindSnippet(fontSizeMap)}>
					Copy Tailwind snippet
				</Button>
				<Button variant="secondary" onclick={() => downloadJSON(fontSizeMap)}>Download JSON</Button>
				<Button variant="secondary" onclick={() => downloadTailwindJS(fontSizeMap)}>
					Download JS
				</Button>
				<Button variant="destructive" class="ml-auto " onclick={resetParams}>
					Reset parameters
				</Button>
			</div>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Preview -->
	<Accordion.Item value="preview">
		<Accordion.Trigger>Preview</Accordion.Trigger>
		<Accordion.Content>
			<div class="mb-6 flex w-full flex-col gap-1.5">
				<Label for="previewText">Preview text</Label>
				<Input
					type="text"
					bind:value={previewText}
					placeholder="Type preview text…"
					class="w-full"
				/>
			</div>

			<ul class="mt-3 grid grid-cols-1 gap-3">
				{#each presets as p (p.label)}
					<li>
						<div class="grid grid-cols-[auto_1fr] items-baseline gap-3">
							<div class="w-[5ch]">
								<Badge variant="secondary">{p.label}</Badge>
							</div>
							<div class="max-w-full min-w-0 overflow-x-auto overflow-y-hidden whitespace-nowrap">
								<p
									style={`font-size: ${clampString(p.step, params)}; line-height:1.5; font-weight:600;`}
								>
									{previewText}
								</p>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Presets -->
	<Accordion.Item value="presets">
		<Accordion.Trigger>Presets</Accordion.Trigger>
		<Accordion.Content>
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-sm text-card-foreground">
					Add/remove sizes. Labels & steps are automatic.
				</div>
				<div class="ml-auto flex gap-2">
					<Button variant="secondary" onclick={() => (presets = addSmallerPreset(presets))}>
						Add smaller
					</Button>
					<Button variant="secondary" onclick={() => (presets = addLargerPreset(presets))}>
						Add larger
					</Button>
				</div>
			</div>

			<Table.Root class="mt-3 overflow-x-auto">
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Label</Table.Head>
						<Table.Head>Min size (px)</Table.Head>
						<Table.Head>Max size (px)</Table.Head>
						<Table.Head>Clamp value</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each presets as p (p.label)}
						{@const L = line(p.step, params)}
						<Table.Row>
							<Table.Cell class="font-medium">
								<Badge variant="secondary">{p.label}</Badge>
							</Table.Cell>
							<Table.Cell>{fmt(L.min, precision)}</Table.Cell>
							<Table.Cell>{fmt(L.max, precision)}</Table.Cell>
							<Table.Cell>{clampString(p.step, params)}</Table.Cell>
							<Table.Cell class="text-right">
								{#if p.label !== 'base'}
									<Button
										variant="secondary"
										class="ms-auto"
										size="sm"
										onclick={() => (presets = removePreset(presets, p.label))}
									>
										Remove
									</Button>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style lang="postcss">
	@reference "./../app.css";

	label {
		@apply grid gap-1 text-sm text-card-foreground;

		& > div {
			@apply flex gap-6;
		}
	}
</style>
