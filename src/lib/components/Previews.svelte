<script lang="ts">
	import { clampString, fmt, line } from '@/mathHelpers';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { copyText } from '@/exporters';
	import { syncScroll } from '@/utils';
	import { removePreset } from '@/stepsLabelsMgmt';

	let { opts, presets, fontWeight, fontFamily, previewText, areDetailsShown } = $props();
	let scrollDivs: HTMLDivElement[] = [];
</script>

<ul class="ms-0 mt-6 grid list-none gap-y-0 {areDetailsShown ? 'gap-y-2' : ''}">
	{#each presets as preset, index}
		{@const { label, step } = preset}
		{@const fontSize = clampString(step, opts)}
		{@const L = line(step, opts)}
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
					<Badge variant={label === 'base' ? 'default' : 'secondary'} class="border-bg font-mono"
						>{label}</Badge
					>
					{#if areDetailsShown}
						<p class="font-mono text-xs text-muted-foreground/50">
							<span>min : {fmt(L.min, opts.precision)}px</span> |
							<span>max : {fmt(L.max, opts.precision)}px</span> |
							<button
								onclick={() => copyText(clampString(step, opts))}
								class="cursor-copy select-all hover:text-foreground"
								title="Copy css proprety"
							>
								{clampString(step, opts)}
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
						style:font-family={fontFamily}
					>
						{previewText}
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>
