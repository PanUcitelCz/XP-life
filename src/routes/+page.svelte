<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
    import BackdropCookies from '$lib/components/BackdropCookies.svelte';

	let isLoggedIn = $state(false); // Stav pro kontrolu, zda je uživatel přihlášen

	// Použití runy $effect pro kontrolu cookies
	$effect(() => {
		// Výpis všech cookies do konzole
		console.log("Cookies:", document.cookie);

		const cookies = document.cookie.split('; ').find(row => row.startsWith('session='));
		const session = cookies ? cookies.split('=')[1] : null;

		console.log("Session cookie value:", session); // Výpis hodnoty session cookie

		if (session) {
			isLoggedIn = true; // Pokud existuje session cookie, nastavíme stav na true
		} else {
			isLoggedIn = false; // Jinak zůstává stav false
		}
	});
</script>

<BackdropCookies />

<div class="Hero">
	<h1>XP Life</h1>
	<h2>Level Up Your Day</h2>
	<div class="buttons">
		{#if isLoggedIn}
			<Button href="/profile" color="grey">Profile</Button>
		{:else}
			<Button href="/login" color="grey">Login</Button>
		{/if}
		<Button href="/register" color="ghost">Register</Button>
	</div>
</div>

<style lang="stylus">
	.Hero
		display flex
		flex-direction column
		justify-content center
		align-items center
		width 100%
		height 100vh
		color white

		h1
			font-size clamp(70px, 10vw, 100px)
			margin 0 0 clamp(6px, 1.2vw, 12px)
			text-align center
			font-weight 600

		h2
			font-size clamp(28px, 3.6vw, 36px)
			font-weight 400
			margin 0
			text-align center

		.buttons
			display flex
			gap 10px
			margin-top clamp(32px, 4.8vw, 48px)
			justify-content center
			align-items center
			max-width 400px
			width 100%
			flex-direction row

			@media screen and (max-width: 600px)
				flex-direction column

				:global(.button)
					max-width fit-content
					min-width 280px
</style>
