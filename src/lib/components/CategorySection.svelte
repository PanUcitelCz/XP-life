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

<div class="category-section">
  <h3>{categoryName} (Total XP: {totalPoints})</h3>

  {#if activities.length > 0}
    <div class="activity-list">
      {#each activities as activity}
        <div class="activity-row">
          <div class="activity-header">
            <span class="activity-name">{activity.activityName}</span>
            <span class="activity-level">Level: {activity.level}</span>
          </div>
          <p class="activity-xp">XP: {activity.points}</p>
          <div class="activity-actions">
            {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
              <button disabled>XP already added today</button>
            {:else}
              <button onclick={() => onAddXP(activity.id)}>Add XP</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="no-activities">You need to add an activity to level up</p>
  {/if}
</div>

<style>
  .category-section {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 1.5rem;
  }

  .activity-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .activity-row {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    text-align: center;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    margin: 10px;
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .activity-name {
    font-weight: bold;
    color: #007bff;
  }

  .activity-level, .activity-xp {
    font-size: 1rem;
    color: #555;
  }

  .activity-xp {
    margin-bottom: 10px;
    font-size: 1.1rem;
    color: #333;
    text-align: center;
  }

  .activity-actions {
    display: flex;
    justify-content: center;
  }

  button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    max-width: 300px;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .no-activities {
    font-style: italic;
    color: #666;
    font-size: 1rem;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
    text-align: center;
  }
</style>
