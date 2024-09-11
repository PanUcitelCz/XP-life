<script lang="ts">
    export let closeModal: () => void;
    export let userId: number;
  
    // Zde předpokládáme, že aktivity budou načteny z databáze
    let activities = [
      { id: 1, name: 'Reading' },
      { id: 2, name: 'Running' }
      // Případně další aktivity, načtené přes API
    ];
  
    async function addActivityToUser(activityId: number) {
      const response = await fetch('/api/add-user-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activityId }),
      });
  
      if (response.ok) {
        closeModal();  // Zavře modal po úspěšném přidání aktivity
      } else {
        console.error('Failed to add activity to user');
      }
    }
  </script>
  
  <!-- Zobrazení aktivit jako divů, které lze kliknout -->
  <div class="modal">
    <h3>Add a new activity to your category</h3>
    <div class="activities">
      {#each activities as activity}
        <button 
          class="activity" 
          onclick={() => addActivityToUser(activity.id)} 
          onkeydown={(e) => { if (e.key === 'Enter') addActivityToUser(activity.id); }} 
          type="button">
          {activity.name}
        </button>
      {/each}
    </div>
    <button onclick={closeModal}>Cancel</button>
  </div>  
  
  <style>
    .modal {
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .activities {
      display: flex;
      flex-direction: column;
    }
  
    .activity {
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .activity:hover {
      background-color: #f0f0f0;
    }
  </style>
  