<script lang="ts">
	import '$lib/css/fantasticon/fantasticon.css';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { LayoutData } from './$types';
	import * as THREE from 'three';
	// @ts-ignore
	import WAVES from 'vanta/dist/vanta.waves.min.js';
	import Header from '$lib/components/Header.svelte';

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

	$effect(() => {
		const vantaEffect = WAVES({
			el: background,
			THREE: THREE,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			scale: 1.0,
			scaleMobile: 1.0,
			color: 0x1b1b1b,
			shininess: 10.0,
			waveHeight: 6.0,
			waveSpeed: 1.0,
			zoom: 1
		});

		return () => {
			if (vantaEffect) vantaEffect.destroy();
		};
	});
</script>

{#if data.url.startsWith('/profile')}
	<Header />
{/if}

{#key data.url}
	<main class="main"
		in:fly={{ x: -200, duration: 300, delay: 300 }}
		out:fly={{ x: 200, duration: 300 }}
		onintrostart={startTransition}
		onintroend={endTransition}
		onoutrostart={startTransition}
		onoutroend={endTransition}
	>
		{@render children()}
	</main>
{/key}

<div bind:this={background} class="background"></div>

<style lang="stylus">

	.background
		position fixed
		z-index -1
		height 100%
		width 100vw
		inset 0
		overflow hidden // Přidáno skrytí přetečení, aby se zabránilo bílé čáře na mobilu

	:global(body)
		width 100%
		min-height 100vh
		margin 0
		padding 0
		overflow-x hidden // Zakázat horizontální přetékání
		overflow-y scroll // Nastavení scrollování pro vertikální osu
		font-family Geist, sans-serif
		background-color #121212 // Fallback barva, pokud se VANTA.js nenačte správně

	:global(main)
		min-height 100vh
		width 100%
		max-width 1800px
		margin auto
		box-sizing border-box
		padding-bottom 2rem // Přidán prostor dole pro lepší scrollování

	:global(body.page-transitioning)
		overflow hidden // Skrytí scrollování během přechodů

	:global(i[class^='icon-']:before),
	:global(i[class*='icon-']:before)
		display inline-block // Optimalizace pro ikonky

	/* Styl scrollbaru */
	:global(::-webkit-scrollbar)
		width 5px

	:global(::-webkit-scrollbar-thumb)
		background-color grey
		border-radius 10px
		border: 1px solid transparent

	:global(::-webkit-scrollbar-thumb:hover)
		background-color blue

	/* Optimalizace scrollbaru pro Firefox */
	*
		scrollbar-width thin
		scrollbar-color transparent

</style>
