<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import AddActivityModal from '$lib/components/AddActivityModal.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';

  const { data } = $props();
  const user = data.props?.user;

  // Kategoriální data uživatele
  let categories = $state<{ 
    activityName: string, 
    level: number, 
    points: number, 
    category: string, 
    id: number, 
    lastXPAdded: string 
  }[]>([]);

  let showActivityModal = $state(false);
  let selectedCategory = $state<string | null>(null);

  let strengthTotalPoints = $state(0);
  let dexterityTotalPoints = $state(0);
  let constitutionTotalPoints = $state(0);
  let intelligenceTotalPoints = $state(0);
  let wisdomTotalPoints = $state(0);
  let charismaTotalPoints = $state(0);

  // Funkce pro načtení kategorií uživatele
  async function fetchCategories() {
    const response = await fetch('/api/get-user-categories');
    if (response.ok) {
      const categoriesData = await response.json();
      categories = categoriesData;

      // Spočítání celkových bodů pro každou kategorii
      strengthTotalPoints = categories.filter(a => a.category === 'Strength').reduce((total, activity) => total + activity.points, 0);
      dexterityTotalPoints = categories.filter(a => a.category === 'Dexterity').reduce((total, activity) => total + activity.points, 0);
      constitutionTotalPoints = categories.filter(a => a.category === 'Constitution').reduce((total, activity) => total + activity.points, 0);
      intelligenceTotalPoints = categories.filter(a => a.category === 'Intelligence').reduce((total, activity) => total + activity.points, 0);
      wisdomTotalPoints = categories.filter(a => a.category === 'Wisdom').reduce((total, activity) => total + activity.points, 0);
      charismaTotalPoints = categories.filter(a => a.category === 'Charisma').reduce((total, activity) => total + activity.points, 0);
    } else {
      console.error('Failed to fetch categories');
    }
  }

  // Načti kategorie při mountování komponenty
  onMount(fetchCategories);

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

  // Funkce pro zobrazení modálu pro přidání aktivity
  function showAddActivityModal(category: string) {
  if (category) {
    selectedCategory = category;
    showActivityModal = true;
  }
}

  // Zavření modálu po přidání aktivity
  function closeModal() {
    showActivityModal = false;
    selectedCategory = null;
    fetchCategories(); // Znovu načti kategorie po přidání aktivity
  }

  // Funkce pro přidání XP do aktivity na základě obtížnosti
  async function addXP(activityId: number, category: string) {
    const activity = categories.find(a => a.id === activityId && a.category === category);
    
    if (!activity) {
      console.error('Activity not found');
      return;
    }

    // Odeslání požadavku na server, kde se vyřeší přidání XP
    const response = await fetch('/api/add-xp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activityId, category }) // Pošleme ID aktivity a kategorii
    });

    if (response.ok) {
      fetchCategories(); // Znovu načteme kategorie po úspěšném přidání XP
    } else {
      console.error('Failed to add XP');
    }
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

    <section>
      <CategorySection 
        categoryName="Strength" 
        activities={categories.filter(a => a.category === 'Strength')}
        totalPoints={strengthTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Strength')} 
      />
    
      <CategorySection 
        categoryName="Dexterity" 
        activities={categories.filter(a => a.category === 'Dexterity')}
        totalPoints={dexterityTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Dexterity')}  
      />
    
      <CategorySection 
        categoryName="Constitution" 
        activities={categories.filter(a => a.category === 'Constitution')}
        totalPoints={constitutionTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Constitution')} 
      />
    
      <CategorySection 
        categoryName="Intelligence" 
        activities={categories.filter(a => a.category === 'Intelligence')}
        totalPoints={intelligenceTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Intelligence')} 
      />
    
      <CategorySection 
        categoryName="Wisdom" 
        activities={categories.filter(a => a.category === 'Wisdom')}
        totalPoints={wisdomTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Wisdom')}  
      />
    
      <CategorySection 
        categoryName="Charisma" 
        activities={categories.filter(a => a.category === 'Charisma')}
        totalPoints={charismaTotalPoints} 
        onAddXP={(activityId: number) => addXP(activityId, 'Charisma')}  
      />
    </section>
    
    
    <!-- Tlačítko pro přidání nové aktivity -->
    <button onclick={() => showAddActivityModal('Strength')}>Add Activity</button>

    {#if showActivityModal && selectedCategory !== null}
      <AddActivityModal userId={user.id} category={selectedCategory!} closeModal={closeModal} />
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
