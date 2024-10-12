<script lang="ts">

</script>

<header>
    <nav>
        <a href="/profile">Quest</a>
        <a href="/">Home page</a>
        <a href="/profile">Profile</a>
    </nav>
    <div class="hamburger">
        <span></span>
        <span></span>
    </div>
</header>

<style lang="stylus">
    header
        margin 0
        position fixed
        top 0
        z-index 10
        width 100%

        .hamburger
            display flex
            flex-direction column
            gap 8px
            //justify-content center
            align-items center
            width 35px
            position absolute
            top 15px
            right 5px
            transform rotate(0.62turn)
            cursor pointer

            span
                border 1.5px solid white
                transition $easeOutExpo .6s

                &:nth-child(1)
                    width 35px

                &:nth-child(2)
                    width 10px



            &:hover
                span
                    border-color #ff8113
                    width 36px

        nav
            positon absolute
            display flex
            flex-direction column
            justify-content flex-end
            transform translate(-100%)

            a
                color white
    /*header
        width calc(100% - 72px)
        height 100px
        background rgba(0, 0, 0, 0.6)
        backdrop-filter blur(15px)
        margin auto
        border-radius 10px
        position fixed
        z-index 10
        width 100%
        bottom 0

        nav
            display flex
            justify-content center
            gap 36px
            height 100%
            align-items center

            a
                display flex
                justify-content center
                color white
                text-decoration none
                font-weight 500
                transition ease .3s

                &:hover
                    color #ff8113*/
</style>
