<script lang="ts">
  import { enhance } from '$app/forms';
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
      alert('Login successful');
      window.location.href = '/profile';
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
