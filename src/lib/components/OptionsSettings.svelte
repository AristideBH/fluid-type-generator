<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { copyCSSClasses, copyJSON, copyTailwindSnippet } from '@/exporters';
	import { Button } from '$lib/components/ui/button/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	type Props = {
		options: import('@/logic.svelte').ScalingOptions;
		fontSizeMap: Record<string, string>;
	};

	let { options, fontSizeMap }: Props = $props();

	// Get dynamic constraints for a field
	const getDynamicConstraints = (option: { name: string }) => {
		const constraints =
			{
				baseMin: { max: options.baseMinMax },
				baseMax: { min: options.baseMaxMin },
				viMin: { max: options.viMinMax },
				viMax: { min: options.viMaxMin }
			}[option.name] ?? {};

		return {
			min: constraints.min ?? options.all[option.name].min,
			max: constraints.max ?? options.all[option.name].max
		};
	};

	let config = $derived(
		Object.values(options.all).map((opt) => ({
			label: opt.label,
			name: opt.name,
			step: opt.step,
			...getDynamicConstraints({ name: opt.name })
		}))
	);
</script>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-6">
	{#each config as option}
		{#if option.name !== 'precision'}
			<fieldset class="grid gap-2 text-sm text-card-foreground">
				<Label>{option.label}</Label>
				<div class="flex gap-4">
					<Input
						type="number"
						bind:value={options.all[option.name].value}
						step={options.all[option.name].step}
						min={option.min}
						max={option.max}
					/>
					<Slider
						type="single"
						bind:value={options.all[option.name].value}
						step={options.all[option.name].step}
						min={option.min}
						max={option.max}
					/>
				</div>
			</fieldset>
		{/if}
	{/each}
</div>

<div class="mt-8 flex flex-wrap gap-2">
	<Button variant="destructive" class="me-auto" onclick={() => options.reset()}>
		<RotateCcw />
		Reset options
	</Button>
	<Button onclick={() => copyCSSClasses(fontSizeMap)}>Copy CSS</Button>
	<Button onclick={() => copyJSON(fontSizeMap)}>Copy JSON</Button>
	<Button onclick={() => copyTailwindSnippet(fontSizeMap)}>Copy Tailwind snippet</Button>
</div>
