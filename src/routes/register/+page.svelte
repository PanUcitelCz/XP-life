<script lang="ts">
  import { goto } from '$app/navigation';  // Importování goto z SvelteKit
  import { fade } from 'svelte/transition'; // Importování fade pro přechod
  import FormButton from '../../lib/components/FormButton.svelte';
  import Button from '../../lib/components/Button.svelte';

  let registrationSuccess = false;
  let email = '';
  let nickname = '';
  let password = '';
  let confirmPassword = '';
  let notification = '';

  function validatePassword(password: string) {
    const errors = [];
    if (!/[A-Z]/.test(password)) {
      errors.push('The password must contain at least one uppercase letter.');
    }
    else if (!/[0-9]/.test(password)) {
      errors.push('The password must contain at least one number');
    }
    else if (password.length < 8) {
      errors.push('The password must be at least 8 characters long');
    }
    return errors;
  }

  async function register() {
    notification = '';

    if (password !== confirmPassword) {
      notification = 'Passwords do not match';
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
<div class="Main">
  <div class="form">
    <h1>Register</h1>
    <form on:submit|preventDefault={register}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="text" bind:value={nickname} placeholder="Nickname" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />
      <FormButton type="submit" color="green">Register new account</FormButton>
    </form>
    <div class="form-buttons">
      <Button href="/" color="grey" >Home</Button>
      <Button href="/login" color="ghost">Login</Button>
    </div>
    {#if notification}
      <div transition:fade class="notification">{notification}</div>
    {/if}

    {#if registrationSuccess}
      <div transition:fade class="notification">Registrace úspěšná! Přesměrováváme na přihlášení...</div>
    {/if}

  </div> 
</div>


<style lang="stylus">
  @import '../../lib/css/form.styl'
    
</style>