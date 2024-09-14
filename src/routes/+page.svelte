<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="Hero">
	<h1>XP Life</h1>
	<h2>Level Up Your Day</h2>
	<div class="buttons">
		<Button href="/login" color="grey">Login</Button>
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
