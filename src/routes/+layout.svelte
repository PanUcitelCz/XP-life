<script>
import { fly } from 'svelte/transition'

  export let data;
</script>

<header>

</header>

{#key data.url}
<main in:fly={{ x: -200, duration: 300, delay: 300 }}
out:fly={{ x: 200, duration: 300 }}>
    <slot />
</main>
{/key}
<style>

</style>