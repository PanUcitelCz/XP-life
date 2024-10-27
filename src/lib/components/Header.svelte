<script lang="ts">
    import { page } from '$app/stores'; // Import pro sledování URL změn
    let navElement: HTMLElement | null = null;
    let hamburgerElement: HTMLElement | null = null;
    let activeLink: HTMLElement | null = null;
    let state = $state(0);

    const isActive = () => {
      if (state === 0) {
        navElement?.classList.add("isActive");
        hamburgerElement?.classList.add("isActive");
        state = 1;
      } else {
        navElement?.classList.remove("isActive");
        hamburgerElement?.classList.remove("isActive");
        state = 0;
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 744) {
        navElement?.classList.remove("isActive");
        hamburgerElement?.classList.remove("isActive");
        state = 0;
      }
    };

    const moveActiveIndicator = () => {
        const currentPath = $page.url.pathname;
        const links = navElement?.querySelectorAll('a');

        links?.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                const linkRect = link.getBoundingClientRect();
                const navRect = navElement?.getBoundingClientRect();

                if (window.innerWidth > 744 && activeLink && navRect) {
                    activeLink.style.width = `${linkRect.width + 20}px`;
                    activeLink.style.transform = `translateX(${linkRect.left - navRect.left - 10}px)`;
                } else if (activeLink) {
                    activeLink.style.width = "0";
                }
            }
        });
    };


    const addLinkClickListener = () => {
        const links = navElement?.querySelectorAll('a');
        links?.forEach(link => {
            link.addEventListener('click', () => {
            if (state === 1) isActive();
            });
        });
    };


    $effect(() => {
      // Přidání event listeneru pro přesun indikátoru aktivní stránky
      moveActiveIndicator();

      window.addEventListener('resize', moveActiveIndicator);

      return () => {
        window.removeEventListener('resize', moveActiveIndicator);
      };
    });

    $effect(() => {
      if (hamburgerElement) {
        hamburgerElement.addEventListener('click', isActive);

        return () => {
          hamburgerElement?.removeEventListener('click', isActive);
        };
      }
    });

    $effect(() => {
        window.addEventListener("resize", handleResize);
    })

    $effect(() => {
        moveActiveIndicator();
        addLinkClickListener(); // Zavolání nové funkce pro přidání event listenerů na odkazy

        window.addEventListener('resize', moveActiveIndicator);

        return () => {
            window.removeEventListener('resize', moveActiveIndicator);
        };
    });

</script>

<header>
  <div class="logo">
    <h1><a href="/">XP LIFE</a></h1>
    <div class="hamburger" bind:this={hamburgerElement} class:isActive={state == 1}>
      <span></span>
      <span></span>
    </div>
  </div>
  <nav bind:this={navElement} class:isActive={state == 1}>
    <div class="active-indicator" bind:this={activeLink}></div>
    <a href="/profile">Profile</a>
    <a href="/profile/quest">Quests</a>
    <a href="/login">Information</a>
  </nav>
</header>

<style lang="stylus">
    header
        margin 0
        z-index 10
        width 100%
        height 100px
        max-width 1900px
        box-sizing border-box
        margin auto
        margin-top 36px
        margin-bottom 24px
        padding 0 40px
        //position relative

        @media $medium-up
            display grid
            grid-template-columns 1fr 3fr // První potomek zabere 1fr, zbytek 4fr
            grid-gap 24px

        .logo
            color white
            background-color rgba(0, 0, 0, 0.35)
            //padding 20px
            border-radius 10px
            box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
            width 100%
            text-align center
            box-sizing border-box
            backdrop-filter: blur(10px)
            color white
            //cursor pointer
            text-decoration none
            display flex
            justify-content space-between
            padding 0 36px
            align-items center
            height 100%
            position relative
            z-index 10

            @media $medium-up
                width 100%
                justify-content center

            h1
                margin 0

                a
                    text-decoration none
                    color white

            .isActive
                transform translate(0)

                span:nth-child(1)
                    transform translate(0, 6px) rotate(45deg)

                span:nth-child(2)
                    transform translate(0, -4px) rotate(-45deg)

            .hamburger
                display flex
                justify-content center
                align-items center
                flex-direction column
                gap 8px
                cursor pointer
                z-index 10
                position relative

                @media $medium-up
                    display none

                span
                    border 1px solid white
                    width 36px
                    transition transform ease .3s

        nav
            background-color rgba(0, 0, 0, 0.35)
            border-radius 10px
            box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
            width 100%
            text-align center
            box-sizing border-box
            backdrop-filter: blur(10px)
            color white
            display flex
            justify-content center
            align-items center
            flex-direction column
            gap 36px
            position fixed
            right -100%
            top 0
            transition transform 0.3s ease-in-out
            height 100%
            z-index 8

            @media $medium-up
                right 0
                position relative
                height 100%
                transform translateX(0)
                justify-content center
                align-items center
                flex-direction row

            a
                color white
                font-weight 500
                font-size 18px
                text-decoration none
                z-index 11

            .active-indicator
                position absolute
                height 30px
                border-radius 10px
                z-index 10
                background-color #007bff
                bottom 35%
                left 0
                transition transform 0.4s ease, width 0.4s ease
                will-change: transform, width

        .isActive
            transform translate(-100%, 0)

</style>
