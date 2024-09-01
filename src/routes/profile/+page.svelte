<script lang="ts">
  const {data} = $props(); // Svelte 5 import data
  
  const user = data.props?.user; // props - writing select object

  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>

{#if user}
  <h1>Welcome, {user.nickname}!</h1>
  <p>Email: {user.email}</p>
  <button onclick={logout}>Logout</button> <!-- onlick in svelte 5 -->
{:else}
  <p>You are not logged in.</p>
{/if} 