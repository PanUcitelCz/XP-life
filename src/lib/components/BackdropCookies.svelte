<script lang="ts">
    let showCookieBanner = $state(false); // Stav pro zobrazení banneru

    $effect(() => {
        // Zpoždění kontroly cookies o 500ms
        setTimeout(() => {
            // Kontrola, zda uživatel již souhlasil s cookies nebo je odmítl
            const consent = document.cookie.split('; ').find(row => row.startsWith('cookie_consent='));
            if (!consent || consent.includes('rejected')) {
                showCookieBanner = true; // Zobrazíme banner, pokud cookie neexistuje nebo byla odmítnuta
            }
        }, 500); // Zpoždění o 500ms
    });

	function acceptCookies() {
		// Nastavení cookie pro souhlas
		document.cookie = "cookie_consent=accepted; max-age=" + 60 * 60 * 24 * 365 + "; path=/";
		showCookieBanner = false;
	}

	function rejectCookies() {
		// Nastavení cookie pro odmítnutí cookies, které ale neukládáme na dlouhou dobu (pouze na session)
		document.cookie = "cookie_consent=rejected; max-age=0; path=/";
		showCookieBanner = false;
	}
</script>

{#if showCookieBanner}
	<div class="cookie-banner">
		<p>This site uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.</p>
		<div class="buttons">
			<button onclick={rejectCookies}>Reject</button>
            <button onclick={acceptCookies}>Accept Cookies</button>
		</div>
	</div>
{/if}

<style lang="stylus">
.cookie-banner
    position: fixed
    bottom: 10px
    left: 50%
    transform: translateX(-50%)
    max-width: 350px
    width: calc(100% - 100px) // Nastaví šířku na 100% minus margin
    background: rgba(0, 0, 0, 0.5)
    color: white
    padding: 20px
    text-align: center
    border-radius: 10px
    z-index: 1000
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3)

    p
        margin: 0 0 10px 0
        font-size: 16px

    .buttons
        display: flex
        justify-content: center
        gap 21px
        flex-wrap wrap
        align-items center

    button
        padding: 10px 15px
        border: none
        border-radius: 5px
        background-color: #495464
        color: white
        cursor: pointer
        transition: background-color 0.3s, color 0.3s

        &:hover
            background-color: #3cab52

        &:last-child
            background-color: white
            color black

        &:last-child:hover
            background-color: #3cab52
            color white

</style>
