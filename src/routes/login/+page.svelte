<script lang="ts">
  import { goto } from '$app/navigation';  // Importování goto z SvelteKit
  import { fade } from 'svelte/transition'; // Importování fade pro přechod

  let loginSuccess = false;
  let notification = '';
  let nickname = '';
  let password = '';

  async function login() {
    notification = '';

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('password', password);

    const response = await fetch('/login', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        loginSuccess = true;
        setTimeout(() => {
          goto('/profile');
        }, 1000); // Přesměrování s 2 sekundovým zpožděním
      } else if (result.message === 'Please verify your email before logging in.') {
        notification = 'Váš email nebyl ještě potvrzen. Prosím ověřte ho před přihlášením.';
      } else {
        notification = result.message;
      }
    } else {
      const errorResult = await response.json();
      notification = errorResult.message;
    }
  }
</script>

<a href="/profile">Profile</a>
<a href="/register">Register</a>
<a href="/">Home page</a>

<form on:submit|preventDefault={login}>
  <input type="text" bind:value={nickname} placeholder="Nickname" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
</form>

{#if notification}
  <div transition:fade class="notification">{notification}</div>
{/if}

{#if loginSuccess}
  <div transition:fade class="notification">Přihlášení úspěšné! Přesměrováváme na profil...</div>
{/if}
