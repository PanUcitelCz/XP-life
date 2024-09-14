<script lang="ts">
    import type { Snippet } from "svelte";
    import { fly } from 'svelte/transition'
    import type { LayoutData } from "./$types";
    import * as THREE from 'three'
    // @ts-ignore
    import WAVES from 'vanta/dist/vanta.waves.min.js'

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

    let background = $state();

    $effect(() =>{
        WAVES({
        el: background,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x121414,
        shininess: 54.00,
        waveHeight: 18.00,
        waveSpeed: 0.55,
        zoom: 1.48
    })
    })
   

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

<div bind:this={background} class="background"></div>

<style lang="stylus">

    .background
        position fixed
        z-index -1
        height 100svh
        width 100vw
        inset 0

    :global(body)
        /*background-image url('../lib/static/imgs/Home.svg')
        background-size cover
        background-position center
        background-size: cover; /* Zajistí, že se obrázek roztáhne tak, aby pokryl celé okno */
        //background-attachment: fixed;
        width 100%
        min-height 100vh
        margin 0
        padding 0
        overflow visible
        font-family "Poppins", sans-serif

    :global(main)
        min-height 100vh
        width 100%  // Zajistí, že main bude vždy 100% široký
        max-width 1800px  // Maximální šířka pro centralizaci obsahu
        margin auto
        padding 10px 5px
        box-sizing border-box


    :global(body.page-transitioning)
        overflow hidden 
</style>
