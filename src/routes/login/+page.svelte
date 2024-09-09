<script lang="ts">
  import FormButton from '../../lib/components/FormButton.svelte';
  import Button from '../../lib/components/Button.svelte';
  import { goto } from '$app/navigation';  // Importování goto z SvelteKit
  import { fade } from 'svelte/transition'; // Importování fade pro přechod
  

  // Reaktivní proměnné
  let loginSuccess = $state(false);
  let notification = $state('');
  let nickname = $state('');
  let password = $state('');

  async function login(event: Event) {
    event.preventDefault(); // Zamezíme přirozenému odeslání formuláře
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
        }, 1000); // Přesměrování s 1 sekundovým zpožděním
      } else if (result.message === 'Please verify your email before logging in.') {
        notification = 'The email has not been verified yet. Please verify it before logging in.';
      } else {
        notification = result.message;
      }
    } else {
      const errorResult = await response.json();
      notification = errorResult.message;
    }
  }
</script>

<div class="form">
  <h1>Login</h1>
  <!-- Zde už není `|preventDefault`, používáme pouze `onsubmit` -->
  <form onsubmit={login}>
    <input type="text" bind:value={nickname} placeholder="Nickname" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <FormButton type="submit" color="green">Login</FormButton>
  </form>
  <a href="/login/forgot-password">Forgot password?</a>
  <div class="form-buttons">
    <Button href="/" color="grey">Home</Button>
    <Button href="/register" color="ghost">Register</Button>
  </div>

  {#if notification}
    <div transition:fade class="notification">{notification}</div>
  {/if}

  {#if loginSuccess}
    <div transition:fade class="notification" style="color: green">
      Login successful! Redirecting to your profile...
    </div>
  {/if}
</div>



<style lang="stylus">    
  @import '../../lib/css/form.styl'
  a
    text-decoration none
    color #334257
    transition ease .3s
    padding 10px
    border-radius 10px

    &:hover
      color black
      background #F5F5F5

</style>