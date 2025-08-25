<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
	let open = $state(true);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="system" />
<Toaster />

<Sidebar.Provider bind:open>
	<AppSidebar />
	<main class="container mx-auto p-2">
		{#if !open}
			<Sidebar.Trigger class="sticky top-4 mb-6" />
		{/if}
		{@render children?.()}
	</main>
</Sidebar.Provider>
