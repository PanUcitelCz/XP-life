a<script lang="ts">
  import { goto } from '$app/navigation';  
  import { onMount } from 'svelte';
  import AddActivityModal from '$lib/components/AddActivityModal.svelte';
  import AddXPModal from '$lib/components/AddXPModal.svelte';

  const { data } = $props();
  const user = data.props?.user;

  // Použití $state pro reaktivní proměnné
  let activities = $state<{ name: string, level: number, points: number, category: string, id: number }[]>([]);
  let showActivityModal = $state(false);
  let showXPModal = $state(false);
  let selectedActivityId = $state<number | null>(null);

  // Funkce pro načtení aktivit uživatele
  async function fetchActivities() {
    const response = await fetch('/api/get-user-activities');
    if (response.ok) {
      activities = await response.json();
    } else {
      console.error('Failed to fetch activities');
    }
  }

  // Funkce pro odhlášení
  async function logout() {
    const response = await fetch('/logout', { method: 'POST' });

    if (response.ok) {
      setTimeout(() => {
        goto('/login');
      }, 1000);
    } else {
      alert('Logout failed');
    }
  }

  onMount(fetchActivities);

  function showAddXPModal(activityId: number) {
    selectedActivityId = activityId;
    showXPModal = true;
  }

  function showAddActivityModal() {
    showActivityModal = true;
  }

  // Funkce pro filtrování aktivit podle kategorie
  function filterActivitiesByCategory(category: string) {
    return activities.filter(activity => activity.category === category);
  }

  function closeModal() {
    showActivityModal = false; // Zavře modal
  }
</script>

<svelte:head>
  <title>XP Life - Profile</title>
</svelte:head>

{#if user}
  <div class="hero">
    <h1>Welcome, {user.nickname}!</h1>
    <p>Email: {user.email}</p>
    <a href="/profile/settings">Profile settings</a>
    <button onclick={logout}>Logout</button>

    <!-- Rozdělení aktivit podle kategorií -->
    <section>
      <h2>Your Activities</h2>
      <div>
        <h3>Intelligence</h3>
        {#if filterActivitiesByCategory('Intelligence').length > 0}
          {#each filterActivitiesByCategory('Intelligence') as activity}
            <div class="activity">
              <h3>{activity.name}</h3>
              <p>Level: {activity.level}</p>
              <p>Points: {activity.points}</p>
              <button onclick={() => showAddXPModal(activity.id)}>Add XP</button>
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
      </div>

      <div>
        <h3>Strength</h3>
        {#if filterActivitiesByCategory('Strength').length > 0}
          {#each filterActivitiesByCategory('Strength') as activity}
            <div class="activity">
              <h3>{activity.name}</h3>
              <p>Level: {activity.level}</p>
              <p>Points: {activity.points}</p>
              <button onclick={() => showAddXPModal(activity.id)}>Add XP</button>
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
      </div>

      <div>
        <h3>Dexterity</h3>
        {#if filterActivitiesByCategory('Dexterity').length > 0}
          {#each filterActivitiesByCategory('Dexterity') as activity}
            <div class="activity">
              <h3>{activity.name}</h3>
              <p>Level: {activity.level}</p>
              <p>Points: {activity.points}</p>
              <button onclick={() => showAddXPModal(activity.id)}>Add XP</button>
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
      </div>

      <div>
        <h3>Hobbies</h3>
        {#if filterActivitiesByCategory('Hobbies').length > 0}
          {#each filterActivitiesByCategory('Hobbies') as activity}
            <div class="activity">
              <h3>{activity.name}</h3>
              <p>Level: {activity.level}</p>
              <p>Points: {activity.points}</p>
              <button onclick={() => showAddXPModal(activity.id)}>Add XP</button>
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
      </div>

      <button onclick={showAddActivityModal}>Add Activity</button>
    </section>

    {#if showActivityModal}
      <AddActivityModal userId={user.id} closeModal={closeModal} />
    {/if}

    {#if selectedActivityId !== null}
      <AddXPModal activityId={selectedActivityId} closeModal={() => showXPModal = false} />
    {/if}
  </div>
{:else}
  <p>You are not logged in.</p>
{/if}

<style lang="stylus">
  .hero
    max-width 300px
    width 100%
    box-sizing border-box
    padding 21px
    display flex
    justify-content center
    align-items center
    flex-direction column
    text-align center
    background white
    border-radius 21px
    box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px

  .activity
    margin-bottom 20px
    padding 10px
    border 1px solid #ccc
    border-radius 10px
    background-color #f9f9f9
    box-shadow rgba(0, 0, 0, 0.1) 0px 4px 8px 0px
    text-align left
    width 100%

  button
    background-color #007bff
    color white
    padding 10px 20px
    border none
    border-radius 5px
    cursor pointer
    &:hover
      background-color #0056b3
</style>
