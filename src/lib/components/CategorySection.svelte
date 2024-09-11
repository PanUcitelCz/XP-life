<script lang="ts">
    export let categoryName: string;
    export let activities: { 
      activityName: string; 
      level: number; 
      points: number; 
      id: number; 
      lastXPAdded: string; 
    }[];
    export let totalPoints: number;
    export let onAddXP: (activityId: number) => void;
  </script>
  
  <div>
    <h3>{categoryName} (Total XP: {totalPoints})</h3>
    
    {#if activities.length > 0}
      {#each activities as activity}
        <div>
          <h4>{activity.activityName}</h4>
          <p>Level: {activity.level}</p>
          <p>XP: {activity.points}</p>
          {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
            <button disabled>XP already added today</button>
          {:else}
            <button onclick={() => onAddXP(activity.id)}>Add XP</button>
          {/if}
        </div>
      {/each}
    {:else}
      <p>You need to add an activity to level up</p> <!-- Zobrazí zprávu, pokud není žádná aktivita -->
    {/if}
  </div>
  
  
  <style>
    button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
  
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  </style>
  