<script lang="ts">
  import { enhance } from '$app/forms';
  let loginSuccess = false;
  let nickname = '';
  let password = '';

  async function login() {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('password', password);

    const response = await fetch('/login', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      loginSuccess = true;
      setTimeout(() => window.location.href = '/profile', 2000); // Přesměrování po 2 sekundách
    } else {
      alert('Login failed');
    }
  }
  
</script>

<svelte:head><title>XP Life - Login</title></svelte:head>

<a href="/register">Register</a>
<a href="/profile">Profile</a>
<a href="/">Home page</a>

<form on:submit|preventDefault={login} method="POST" use:enhance>
  <input type="text" bind:value={nickname} placeholder="Nickname" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
</form>

{#if loginSuccess}
  <div class="notification">Úspěšné přihlášení!</div>
{/if}