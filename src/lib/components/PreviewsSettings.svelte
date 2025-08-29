<script lang="ts">
	import { systemFonts } from '@/defaults';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Upload from '@lucide/svelte/icons/upload';
	import FontDropZone from './FontDropZone.svelte';

	type Props = {
		settings: import('@/logic.svelte').PreviewSettings;
		presets: import('@/logic.svelte').SizePresets;
	};
	let { settings, presets }: Props = $props();
</script>

<div class="flex flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col gap-4">
		<div class="flex flex-col gap-4 sm:flex-row md:items-start">
			<div class="flex flex-col gap-2">
				<Label>Font family</Label>
				<div class="flex flex-col gap-2">
					<Select.Root type="single" bind:value={settings.fontFamily}>
						<Select.Trigger class="w-xs bg-background">
							{settings.customFonts.find((f) => f.family === settings.fontFamily)?.name ??
								systemFonts.find((f) => f.value === settings.fontFamily)?.label ??
								settings.fontFamily}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.GroupHeading>System Fonts</Select.GroupHeading>
								{#each systemFonts as font}
									<Select.Item value={font.value}>{font.label}</Select.Item>
								{/each}
							</Select.Group>
							{#if settings.customFonts.length > 0}
								<Select.Separator />
								<Select.Group>
									<Select.GroupHeading>Custom Fonts</Select.GroupHeading>
									{#each settings.customFonts as font}
										<Select.Item value={font.family}>
											<div class="flex items-center gap-2">
												<Upload class="size-4" />
												{font.name}
											</div>
										</Select.Item>
									{/each}
								</Select.Group>
							{/if}
						</Select.Content>
					</Select.Root>
					<FontDropZone onFontLoad={(font) => settings.setCustomFont(font)} />
				</div>
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
			<Button class="w-fit" onclick={() => presets.reset()}><RotateCcw />Reset presets</Button>
		</div>
		<div class="mt-2 flex gap-2">
			<Switch id="showSizeDetails" bind:checked={settings.showDetails} />
			<Label for="showSizeDetails">Show details</Label>
		</div>
	</div>
</div>
