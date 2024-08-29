<script lang="ts">
  export let user: { nickname: string; email: string } | undefined;

  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>

{#if user}
  <h1>Welcome, {user.nickname}!</h1>
  <p>Email: {user.email}</p>
  <button on:click={logout}>Logout</button>
{:else}
  <p>You are not logged in.</p>
{/if}