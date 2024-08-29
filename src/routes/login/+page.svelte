<script lang="ts">
    export let data: { users: Array<{ name: string; email: string }> };
</script>
  
  
<main>
  <h1>Users</h1>
  <ul>
    {#each data.users as user}
      <li>{user.name} ({user.email})</li>
    {/each}
  </ul>
</main>
  