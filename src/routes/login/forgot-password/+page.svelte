<script lang="ts">
    import { goto } from '$app/navigation'; // Import funkce pro navigaci
  
    let email = '';
    let notification = '';
  
    async function handleForgotPassword() {
      const formData = new FormData();
      formData.append('email', email);
  
      const response = await fetch('/login/forgot-password', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        notification = 'A link to reset your password has been sent to your email. Redirecting to login...';
  
        setTimeout(() => {
          goto('/login'); // Použijeme `goto` pro přesměrování
        }, 2000); // Zpoždění 2 sekundy
      } else {
        notification = 'Failed to send the password reset link. Please try again.';
      }
    }
  </script>
  
  <h1>Forgot Password?</h1>
  
  <form on:submit|preventDefault={handleForgotPassword}>
    <label for="email">Email Address</label>
    <input type="email" bind:value={email} placeholder="Enter your email" required />
  
    <button type="submit">Send Reset Link</button>
  </form>
  
  {#if notification}
    <div class="notification">{notification}</div>
  {/if}
  