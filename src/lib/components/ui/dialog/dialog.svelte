&lt;script lang="ts">
	import * as DialogPrimitive from '@radix-svelte/dialog';
	import { cn } from '@/lib/utils';

	type $$Props = DialogPrimitive.DialogProps;
</script>

<DialogPrimitive.Root {...$$props}>
	<slot />
</DialogPrimitive.Root>
