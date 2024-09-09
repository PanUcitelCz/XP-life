<script lang="ts">
    // Typové argumenty pro props
    let { href, color, children } = $props<{ href: string, color: string, children: any }>();

    let buttonClass = $derived(`${color} button`);
</script>

<a href="{href}" class={buttonClass}>
    {@render children()}
</a>


<style lang="stylus">


    a
        padding 10px
        border-radius 10px
        text-decoration none
        font-family "Poppins", sans-serif
        font-size 23px
        width 100%
        text-align center
        border 2px white solid
        transition ease .3s
        font-weight 500

    .grey
        color white
        background #495464

        &:hover
            color white
            background #57D131
            border #57D131 2px solid

    .ghost
        color black
        background white
        border black 2px solid

        &:hover
            color white
            background #57D131
            border #57D131 2px solid

</style>