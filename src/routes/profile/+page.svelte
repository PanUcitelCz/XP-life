<script lang="ts">
  import { goto } from '$app/navigation';  // Importování goto z SvelteKit
  import { fade } from 'svelte/transition'; // Importování fade pro přechod
  
  const { data } = $props(); // Svelte 5 import data
  const user = data.props?.user; // props - writing select object

  async function logout() {
    const response = await fetch('/logout', { method: 'POST' });

    if (response.ok) {
      setTimeout(() => {
        goto('/login'); // Přesměrování po úspěšném odhlášení
      }, 1000); // 1 sekundové zpoždění před přesměrováním
    } else {
      alert('Logout failed');
    }
  }
</script>

<svelte:head><title>XP Life - Profile</title></svelte:head>



{#if user}
  <div class="hero">
    <h1>Welcome, {user.nickname}!</h1>
    <p>Email: {user.email}</p>
    <a href="/profile/settings">Profile settings</a>
    <button onclick={logout}>Logout</button> <!-- onlick in svelte 5 -->
  </div>
{:else}
  <p>You are not logged in.</p>
{/if}

<style lang="stylus">
  .hero
    max-width 300px
    width 100%
    box-sizing border-box
    padding 21px
    display flex
    justify-content center
    align-items center
    flex-direction column
    text-align center
    background white
    border-radius 21px
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
    
    
</style>