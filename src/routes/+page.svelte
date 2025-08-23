<script lang="ts">
	import { DEFAULTS, type Preset } from '$lib/presets';
	import { line, fmt, clampString, type ScaleParams } from '$lib/mathHelpers';
	import { addLargerPreset, addSmallerPreset, removePreset } from '$lib/stepsLabelsMgmt';
	import { copyJSON, copyTailwindSnippet, downloadJSON, downloadTailwindJS } from '$lib/exporters';

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

<div class="mx-auto grid max-w-[1100px] gap-3 p-5">
	<!-- Fluid Type Scale -->
	<details open>
		<summary class="flex items-center justify-between px-4 py-3">
			<h2 class="text-xl font-semibold">Fluid Type Scale</h2>
			<span class="chev text-neutral-500"></span>
		</summary>
		<div class="px-4 pb-4">
			<!-- controls with number + range -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				<label>
					<span>Base MIN (px)</span>
					<div>
						<input type="number" bind:value={baseMin} step="0.01" min="8" max="48" />
						<input type="range" bind:value={baseMin} min="8" max="48" step="0.1" class="flex-1" />
					</div>
				</label>
				<label>
					<span>Base MAX (px)</span>
					<div>
						<input type="number" bind:value={baseMax} step="0.01" min="12" max="64" />
						<input type="range" bind:value={baseMax} min="12" max="64" step="0.1" class="flex-1" />
					</div>
				</label>
				<label>
					<span>MIN ratio</span>
					<div>
						<input type="number" bind:value={rMin} step="0.001" min="1.05" max="1.333" />
						<input
							type="range"
							bind:value={rMin}
							min="1.05"
							max="1.333"
							step="0.01"
							class="flex-1"
						/>
					</div>
				</label>
				<label>
					<span>MAX ratio</span>
					<div>
						<input type="number" bind:value={rMax} step="0.001" min="1.05" max="1.5" />
						<input type="range" bind:value={rMax} min="1.05" max="1.5" step="0.01" class="flex-1" />
					</div>
				</label>
				<label>
					<span>vi lower</span>
					<div>
						<input type="number" bind:value={viMin} step="0.01" min="0" max={viMax} />
						<input type="range" bind:value={viMin} min="0" max={viMax} step="0.01" class="flex-1" />
					</div>
				</label>
				<label>
					<span>vi upper</span>
					<div>
						<input type="number" bind:value={viMax} step="0.01" min={viMin} max="30" />
						<input
							type="range"
							bind:value={viMax}
							min={viMin}
							max="30"
							step="0.01"
							class="flex-1"
						/>
					</div>
				</label>
				<label>
					<span>Decimals</span>
					<div>
						<input type="number" bind:value={precision} min="0" max="6" step="1" />
						<input type="range" bind:value={precision} min="0" max="6" step="1" class="flex-1" />
					</div>
				</label>
			</div>

			<!-- actions line -->
			<div class="mt-4 flex flex-wrap gap-2">
				<button onclick={() => copyJSON(fontSizeMap)}>Copy JSON</button>
				<button onclick={() => copyTailwindSnippet(fontSizeMap)}>Copy Tailwind snippet</button>
				<button onclick={() => downloadJSON(fontSizeMap)}>Download JSON</button>
				<button onclick={() => downloadTailwindJS(fontSizeMap)}>Download JS</button>
				<button class="ml-auto border-red-500 text-red-600" onclick={resetParams}>
					Reset parameters
				</button>
			</div>
		</div>
	</details>

	<!-- Presets -->
	<details open>
		<summary class="flex items-center justify-between px-4 py-3">
			<h2 class="text-xl font-semibold">Presets</h2>
			<span class="chev text-neutral-500"></span>
		</summary>
		<div class="px-4 pb-4">
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-sm text-neutral-600">Add/remove sizes. Labels & steps are automatic.</div>
				<div class="ml-auto flex gap-2">
					<button onclick={() => (presets = addSmallerPreset(presets))}> Add smaller </button>
					<button onclick={() => (presets = addLargerPreset(presets))}> Add larger </button>
				</div>
			</div>

			<div class="mt-3 overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="border-b border-neutral-200">
							<th>Label</th>
							<th>MIN (px)</th>
							<th>MAX (px)</th>
							<th>clamp()</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each presets as p (p.label)}
							{@const L = line(p.step, params)}
							<tr class="border-b border-neutral-100">
								<td>
									<span class="badge">
										{p.label}
									</span>
								</td>
								<td class="tabular-nums">{fmt(L.min, precision)}</td>
								<td class="tabular-nums">{fmt(L.max, precision)}</td>
								<td class="overflow-x-auto font-mono text-sm whitespace-nowrap">
									{clampString(p.step, params)}
								</td>
								<td>
									{#if p.label !== 'base'}
										<button onclick={() => (presets = removePreset(presets, p.label))}>
											Remove
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</details>

	<!-- Preview -->
	<details open>
		<summary class="flex items-center justify-between px-4 py-3">
			<h2 class="text-xl font-semibold">Preview</h2>
			<span class="chev text-neutral-500"></span>
		</summary>
		<div class="px-4 pb-4">
			<div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[auto,1fr]">
				<label class="text-sm text-neutral-700" for="previewText">Preview text</label>
				<input
					type="text"
					bind:value={previewText}
					class="rounded-lg border border-neutral-300 px-2.5 py-2"
					placeholder="Type preview text…"
					name="previewText"
				/>
			</div>

			<ul class="mt-3 grid grid-cols-1 gap-3">
				{#each presets as p (p.label)}
					<li>
						<div class="grid grid-cols-[auto_1fr] items-baseline gap-3">
							<div class="w-[5ch]">
								<span class="badge">{p.label}</span>
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
		</div>
	</details>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	/* minimal CSS to enhance <details> (accordion) */
	details {
		@apply rounded-2xl border border-neutral-200 bg-white;
	}
	summary {
		@apply cursor-pointer list-none select-none;

		&::-webkit-details-marker {
			@apply hidden;
		}

		.chev::after {
			@apply ml-2 inline-block transition-transform duration-150 ease-in-out content-['▸'];
		}
	}

	details[open] .chev::after {
		@apply rotate-90;
	}

	button {
		@apply cursor-pointer rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2;
	}

	label {
		@apply grid gap-1 text-sm text-neutral-700;

		& > div {
			@apply flex items-center gap-2;

			& > input[type='number'] {
				@apply w-28 rounded-lg border border-neutral-300 px-2.5 py-2;
			}
		}
	}

	thead th {
		@apply px-2 py-2 text-left font-semibold text-neutral-700;
	}
	tbody td {
		@apply px-2 py-2;
	}

	span.badge {
		@apply rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs;
	}
</style>
