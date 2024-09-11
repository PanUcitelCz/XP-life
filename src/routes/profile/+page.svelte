<script lang="ts">
  import AddActivityModal from '$lib/components/AddActivityModal.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  const { data } = $props();
  const user = data.props?.user;

  // Aktivity uživatele
  let activities = $state<{ 
    activityName: string, 
    level: number, 
    points: number, 
    category: string, 
    id: number, 
    description: string, 
    difficulty: string,
    lastXPAdded: string,
  }[]>([]);
  let showActivityModal = $state(false);
  let selectedActivityId = $state<number | null>(null);
  let selectedCategory = $state<string | null>(null);

  // Funkce pro načtení aktivit uživatele
  async function fetchActivities() {
    const response = await fetch('/api/get-user-activities');
    if (response.ok) {
      activities = await response.json();
    } else {
      console.error('Failed to fetch activities');
    }
  }

  // Načti aktivity při mountování komponenty
  onMount(fetchActivities);

  // Funkce pro odhlášení uživatele
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

  // Funkce pro přidání XP podle obtížnosti
  async function addXP(activityId: number, difficulty: string) {
    let xp = 0;

    switch (difficulty) {
      case 'easy':
        xp = 5;
        break;
      case 'normal':
        xp = 10;
        break;
      case 'hard':
        xp = 15;
        break;
      default:
        return;
    }

    const response = await fetch('/api/add-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId, xp })
    });

    if (response.ok) {
      fetchActivities(); // Znovu načte aktivity
    } else {
      console.error('Failed to add XP');
    }
  }

  // Zobrazení modálu pro přidání aktivity
  function showAddActivityModal(category: string) {
    selectedCategory = category;
    showActivityModal = true;
  }

  // Zavření modálu pro přidání aktivity
  function closeModal() {
    showActivityModal = false;
    selectedCategory = null;
    fetchActivities(); // Znovu načti aktivity po přidání nové
  }

  // Filtrování aktivit podle kategorie
  function filterActivitiesByCategory(category: string) {
    return activities.filter(activity => activity.category === category);
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

    <!-- Zobrazení aktivit podle kategorií -->
    <section>
      <h2>Your Activities</h2>
    
      <div>
        <h3>Strength</h3>
        {#if filterActivitiesByCategory('Strength').length > 0}
          {#each filterActivitiesByCategory('Strength') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName: 'Unnamed Activity'}</h3> <!-- Zkontroluj, zda `activity.name` není prázdné -->
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Strength')}>Add Activity</button>
      </div>

      <div>
        <h3>Dexterity</h3>
        {#if filterActivitiesByCategory('Dexterity').length > 0}
          {#each filterActivitiesByCategory('Dexterity') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName : 'Unnamed Activity'}</h3>
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Dexterity')}>Add Activity</button>
      </div>

      <div>
        <h3>Constitution</h3>
        {#if filterActivitiesByCategory('Constitution').length > 0}
          {#each filterActivitiesByCategory('Constitution') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName : 'Unnamed Activity'}</h3>
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Constitution')}>Add Activity</button>
      </div>

      <div>
        <h3>Intelligence</h3>
        {#if filterActivitiesByCategory('Intelligence').length > 0}
          {#each filterActivitiesByCategory('Intelligence') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName : 'Unnamed Activity'}</h3>
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Intelligence')}>Add Activity</button>
      </div>

      <div>
        <h3>Wisdom</h3>
        {#if filterActivitiesByCategory('Wisdom').length > 0}
          {#each filterActivitiesByCategory('Wisdom') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName : 'Unnamed Activity'}</h3>
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Wisdom')}>Add Activity</button>
      </div>

      <div>
        <h3>Charisma</h3>
        {#if filterActivitiesByCategory('Charisma').length > 0}
          {#each filterActivitiesByCategory('Charisma') as activity}
            <div class="activity">
              <h3>{activity.activityName ? activity.activityName : 'Unnamed Activity'}</h3>
              <p>Level: {activity.level}</p>
              <p>XP: {activity.points}</p>
              {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                <button disabled>XP already added today</button>
              {:else}
                <button onclick={() => addXP(activity.id, activity.difficulty)}>Add XP</button>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No activities yet. Add one!</p>
        {/if}
        <button onclick={() => showAddActivityModal('Charisma')}>Add Activity</button>
      </div>
    </section>

    {#if showActivityModal && selectedCategory !== null}
      <AddActivityModal userId={user.id} category={selectedCategory} closeModal={closeModal} />
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
