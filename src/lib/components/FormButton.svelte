<script lang="ts">
    export let type: 'button' | 'submit' | 'reset' = 'button'; 
    export let color: string;

    $: buttonClass = `${color} button`;
</script>

<button type={type} class={buttonClass}>
    <slot />
</button>

<style lang="stylus">
    .button
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
        cursor pointer

    .green
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
            background #BBBFCA
            border #BBBFCA 2px solid

</style>