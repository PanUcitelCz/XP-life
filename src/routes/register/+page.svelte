<script lang="ts">
  import { goto } from '$app/navigation';  // Importování goto z SvelteKit
  import { fade } from 'svelte/transition'; // Importování fade pro přechod

  let registrationSuccess = false;
  let email = '';
  let nickname = '';
  let password = '';
  let confirmPassword = '';
  let notification = '';

  function validatePassword(password: string) {
    const errors = [];
    if (!/[A-Z]/.test(password)) {
      errors.push('Heslo musí obsahovat alespoň jedno velké písmeno.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Heslo musí obsahovat alespoň jedno číslo.');
    }
    if (password.length < 8) {
      errors.push('Heslo musí být alespoň 8 znaků dlouhé.');
    }
    return errors;
  }

  async function register() {
    notification = '';

    if (password !== confirmPassword) {
      notification = 'Hesla se neshodují.';
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      notification = passwordErrors.join(' ');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('password', password);

    const response = await fetch('/register', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        registrationSuccess = true;
        setTimeout(() => {
          goto('/login');
        }, 1000); // Přesměrování s 2 sekundovým zpožděním
      } else {
        notification = result.message;
      }
    } else {
      const errorResult = await response.json();
      notification = errorResult.message;
    }
  }
</script>

<svelte:head><title>XP Life - Register</title></svelte:head>

<a href="/login">Login</a>
<a href="/profile">Profile</a>
<a href="/">Home page</a>

<form on:submit|preventDefault={register}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="text" bind:value={nickname} placeholder="Nickname" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />
  <button type="submit">Register</button>
</form>

{#if notification}
  <div transition:fade class="notification">{notification}</div>
{/if}

{#if registrationSuccess}
  <div transition:fade class="notification">Registrace úspěšná! Přesměrováváme na přihlášení...</div>
{/if}