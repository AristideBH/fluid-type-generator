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
	let config = $derived(
		Object.values(options.all).map((opt) => ({
			label: opt.label,
			name: opt.name,
			step: opt.step,
			min: opt.min,
			max: opt.max
		}))
	);
</script>

<div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each config as option}
		<fieldset class="grid gap-2 text-sm text-card-foreground">
			<Label>{option.label}</Label>
			<div class="flex gap-4">
				<Input
					type="number"
					bind:value={options.all[option.name].value}
					step={options.all[option.name].step}
					min={options.all[option.name].min}
					max={options.all[option.name].max}
				/>
				<Slider
					type="single"
					bind:value={options.all[option.name].value}
					step={options.all[option.name].step}
					min={options.all[option.name].min}
					max={options.all[option.name].max}
				/>
			</div>
		</fieldset>
	{/each}
</div>

<div class="mt-8 flex flex-wrap gap-2">
	<Button variant="destructive" class="me-auto" onclick={() => options.reset()}>
		<RotateCcw />
		Reset
	</Button>
	<Button onclick={() => copyCSSClasses(fontSizeMap)}>Copy CSS</Button>
	<Button onclick={() => copyJSON(fontSizeMap)}>Copy JSON</Button>
	<Button onclick={() => copyTailwindSnippet(fontSizeMap)}>Copy Tailwind snippet</Button>
</div>
