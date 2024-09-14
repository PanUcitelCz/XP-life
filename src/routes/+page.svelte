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
            font-size clamp(50px, 10vw, 100px)
            margin 0 0 clamp(6px, 1.2vw, 12px)
            text-align center
            font-weight 600
            
            
        h2
            font-size clamp(30px, 10vw, 60px)
            margin 0
            text-align center

        .buttons
            display flex
            gap 10px
            margin-top clamp(24px, 4.8vw, 48px)
            justify-content center
            align-items center
            max-width 400px
            width 100%
            flex-direction row

</style>
