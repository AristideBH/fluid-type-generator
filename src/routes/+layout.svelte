<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { fade, slide } from 'svelte/transition';

	let { children } = $props();
	let open = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="system" />
<Toaster position="top-center" />

<Sidebar.Provider bind:open class="relative">
	<AppSidebar />
	{#if !open}
		<div in:fade class=" sticky top-2 m-2 h-fit">
			<Sidebar.Trigger />
		</div>
	{/if}
	<main class="container mx-auto p-4">
		{@render children?.()}
	</main>
</Sidebar.Provider>
