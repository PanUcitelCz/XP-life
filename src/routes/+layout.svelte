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
        background-image url('../lib/static/imgs/Home.svg')
        background-size cover
        background-position center
        background-size: cover; /* Zajistí, že se obrázek roztáhne tak, aby pokryl celé okno */
        background-attachment: fixed;
        width 100%
        min-height 100vh
        margin 0
        padding 0
        overflow visible
        font-family "Poppins", sans-serif

    :global(main)
        min-height 100vh
        max-width 1300px
        margin auto
        flex-direction column
        padding 10px 5px
        display grid
        place-items: center
        box-sizing border-box

    :global(body.page-transitioning)
        overflow hidden 
</style>
