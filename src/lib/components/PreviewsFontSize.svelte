<script lang="ts">
	import { clampString, fmt, line } from '@/utils';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { copyText } from '@/exporters';
	import { ScrollSync } from '@/scrollSync.svelte';

	type Props = {
		options: import('@/logic.svelte').ScalingOptions;
		presets: import('@/logic.svelte').SizePresets;
		settings: import('@/logic.svelte').PreviewSettings;
	};

	let { options, presets, settings }: Props = $props();
	let scrollDivs = $state<HTMLDivElement[]>([]);
	const scrollSync = new ScrollSync(scrollDivs);
</script>

<ul class="ms-0 mt-6 grid list-none gap-y-0 {settings.showDetails ? 'gap-y-2' : ''}">
	{#each presets.all as preset, index}
		{@const { label, step } = preset}
		{@const fontSize = clampString(step, options.all)}
		{@const L = line(step, options.all)}
		<li
			class="group relative rounded-xl border-dashed transition-all hover:bg-muted
			{settings.showDetails
				? ' border p-2'
				: 'rounded-t-none rounded-b-none border-b py-2 first:rounded-t-xl last:rounded-b-xl last:border-b-0 '}"
		>
			<div
				class="grid items-baseline gap-3
				{!settings.showDetails ? 'grid auto-cols-[auto_1fr] grid-flow-col' : ''}"
			>
				{#if label !== 'base' && label !== 'xs' && label !== 'sm' && label !== 'md' && label !== 'lg' && label !== 'xl'}
					<Button
						variant="secondary"
						class="absolute top-2 right-2 z-50 hidden size-7 group-hover:flex"
						size="icon"
						title="Remove {label} preset"
						onclick={() => presets}
					>
						<Trash2 class="cursor-pointer" />
					</Button>
				{/if}
				<div
					class=" relative inline-flex max-w-full min-w-0 items-end gap-3 overflow-x-auto whitespace-nowrap transition-all
						{!settings.showDetails ? 'w-[7ch] ps-2' : ''} "
				>
					<Badge
						variant={label === 'base' ? 'default' : 'secondary'}
						class="border-bg sticky left-0 font-mono"
					>
						{label}
					</Badge>
					{#if settings.showDetails}
						<p class="leading-tighttext-muted-foreground/50 font-mono text-xs">
							<span>min : {fmt(L.min, options.precision.value)}px</span> |
							<span>max : {fmt(L.max, options.precision.value)}px</span> |
							<button
								onclick={() => copyText(clampString(step, options.all))}
								class="cursor-copy select-all hover:text-foreground"
								title="Copy css proprety"
							>
								{clampString(step, options.all)}
							</button>
						</p>
					{/if}
				</div>
				<div
					class="max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-[0.2em] whitespace-nowrap"
					style:font-size={fontSize}
					bind:this={scrollDivs[index]}
					onscroll={() => scrollSync.onScroll(index)}
				>
					<div
						class="py-[0.1em] font-semibold"
						style="text-box-edge: cap alphabetic; text-box-trim: trim-both; font-size:inherit;"
						style:font-weight={settings.fontWeight}
						style:font-family={settings.fontFamily}
					>
						{settings.text}
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>
