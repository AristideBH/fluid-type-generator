<script lang="ts">
	import { systemFonts } from '@/defaults';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	type Props = {
		settings: App.PreviewSettings;
		presets: import('@/logic.svelte').SizePresets;
	};
	let { settings, presets }: Props = $props();
</script>

<div class="flex flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col gap-4 rounded-lg border border-dashed p-4">
		<div class="flex flex-col gap-4 sm:flex-row md:items-start">
			<div class="flex flex-col gap-2">
				<Label>Font family</Label>
				<Select.Root type="single" bind:value={settings.fontFamily}>
					<Select.Trigger class="w-xs bg-background">{settings.fontFamily}</Select.Trigger>
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
					<Input bind:value={settings.fontWeight} disabled />
					<Slider type="single" bind:value={settings.fontWeight} min={100} max={900} step={100} />
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Label for="previewText">Preview text</Label>
			<Input
				type="text"
				bind:value={settings.text}
				placeholder="Type preview text…"
				class="w-full"
				id="previewText"
			/>
		</div>
	</div>
	<div class="flex min-w-xs flex-col gap-2">
		<Label>Manage presets</Label>
		<div class="flex gap-2 md:flex-col">
			<Button class="w-fit" onclick={() => presets.addSmaller()}>Add smaller</Button>
			<Button class="w-fit" onclick={() => presets.addLarger()}>Add larger</Button>
			<Button class="w-fit" onclick={() => presets.reset()}><RotateCcw />Reset</Button>
		</div>
		<div class="mt-2 flex gap-2">
			<Switch id="showSizeDetails" bind:checked={settings.showDetails} />
			<Label for="showSizeDetails">Show details</Label>
		</div>
	</div>
</div>
