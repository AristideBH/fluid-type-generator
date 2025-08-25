<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Fluid Type Scale Generator</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta
		name="description"
		content="Generate fluid type scales with custom parameters and preview them in real-time."
	/>
</svelte:head>

<ModeWatcher defaultMode="system" />
<Toaster position="bottom-center" />

<main class="mx-auto w-full max-w-[1440px] p-4">
	{@render children?.()}
</main>
