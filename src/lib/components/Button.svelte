<script lang="ts">
	// Typové argumenty pro props
	let { href, color, children } = $props<{ href: string; color: string; children: any }>();

	let buttonClass = $derived(`${color} button`);
</script>

<a {href} class={buttonClass}>
	{@render children()}
</a>

<style lang="stylus">
    a
        padding 10px
        border-radius 10px
        text-decoration none
        font-size 23px
        width 100%
        text-align center
        transition background $easeOutExpo .6s, color $easeOutExpo .6s
        font-weight 500

    .grey
        color white
        background #495464

        +hover()
            &:hover
                color white
                background #3cab52

    .ghost
        color black
        background white

        &:hover
            color white
            background #3cab52
</style>
