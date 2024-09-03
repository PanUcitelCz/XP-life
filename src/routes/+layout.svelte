<script lang="ts">
    import type { Snippet } from "svelte";
    import { fly } from 'svelte/transition'
    import type { LayoutData } from "./$types";

    type Props = {
        children: Snippet;
        data: LayoutData;
    };

    // Přidáme a odstraníme třídu během přechodů
    const startTransition = () => {
        document.body.classList.add('page-transitioning');
    };

    const endTransition = () => {
        document.body.classList.remove('page-transitioning');
    };

    const { children, data }: Props = $props();
</script>

{#key data.url}
<main 
    in:fly={{ x: -200, duration: 300, delay: 300 }} 
    out:fly={{ x: 200, duration: 300 }} 
    onintrostart={startTransition} 
    onintroend={endTransition} 
    onoutrostart={startTransition} 
    onoutroend={endTransition}>
    {@render children()}  
</main>
{/key}

<style lang="stylus">


    :global(body)
        background-image url('../lib/imgs/home.svg')
        background-size cover
        background-position center
        width 100%
        height 100vh
        margin 0
        padding 0
        overflow visible
        font-family "Poppins", sans-serif

    :global(main)
        height 100vh

    :global(body.page-transitioning)
        overflow hidden 
</style>
