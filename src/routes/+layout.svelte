<script lang="ts">
	import type { Snippet } from "svelte";
    import { fly } from 'svelte/transition'
	import type { LayoutData } from "./$types";

    type Props = {
		children: Snippet; //ctrl + . pro import
        data: LayoutData;
	};

    const { children, data }: Props = $props();
</script>

{#key data.url}
<main in:fly={{ x: -200, duration: 300, delay: 300 }} out:fly={{ x: 200, duration: 300 }}>
    {@render children()}  
</main>
{/key}
