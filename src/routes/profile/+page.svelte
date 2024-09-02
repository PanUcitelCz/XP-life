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

<a href="/login">Login</a>
<a href="/register">Register</a>
<a href="/">Home page</a>

{#if user}
  <h1>Welcome, {user.nickname}!</h1>
  <p>Email: {user.email}</p>
  <button onclick={logout}>Logout</button> <!-- onlick in svelte 5 -->
{:else}
  <p>You are not logged in.</p>
{/if}
