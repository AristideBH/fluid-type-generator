<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { copyCSSClasses, copyJSON, copyTailwindSnippet } from '@/exporters';
	import { Button } from '$lib/components/ui/button/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

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

	<Dialog.Root>
		<Dialog.Trigger>
			<Button>View CSS</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>CSS Classes</Dialog.Title>
				<Dialog.Description>
					Here are the generated CSS classes for your fluid type scale:
				</Dialog.Description>
			</Dialog.Header>
			<pre class="mt-4 overflow-x-auto rounded-md bg-muted p-4"><code
					>{Object.entries(fontSizeMap)
						.map(([label, size]) => `.text-${label} { font-size: ${size}; }`)
						.join('\n')}</code
				></pre>
			<Dialog.Footer>
				<Button onclick={() => copyCSSClasses(fontSizeMap)}>Copy to clipboard</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button>View JSON</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>JSON Output</Dialog.Title>
				<Dialog.Description>Your fluid type scale in JSON format:</Dialog.Description>
			</Dialog.Header>
			<pre class="mt-4 overflow-x-auto rounded-md bg-muted p-4"><code
					>{JSON.stringify(fontSizeMap, null, 2)}</code
				></pre>
			<Dialog.Footer>
				<Button onclick={() => copyJSON(fontSizeMap)}>Copy to clipboard</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button>View Tailwind</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Tailwind Config</Dialog.Title>
				<Dialog.Description>Configuration snippet for your Tailwind CSS config:</Dialog.Description>
			</Dialog.Header>
			<pre class="mt-4 overflow-x-auto rounded-md bg-muted p-4"><code
					>// Tailwind config snippet
// put this under theme.extend.fontSize
fontSize: {JSON.stringify(fontSizeMap, null, 2)},</code
				></pre>
			<Dialog.Footer>
				<Button onclick={() => copyTailwindSnippet(fontSizeMap)}>Copy to clipboard</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
