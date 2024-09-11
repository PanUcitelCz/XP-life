<script lang="ts">
  export let closeModal: () => void;
  export let userId: number;
  export let category: string;

  let activityName = '';
  let description = '';
  let difficulty = 'easy'; // Výchozí obtížnost

  async function addActivity() {
    const response = await fetch('/api/add-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, category, activityName, description, difficulty }),
    });

    if (response.ok) {
      closeModal(); // Zavře modal po úspěšném přidání
    } else {
      console.error('Failed to add activity');
    }
  }
</script>

<div class="modal">
  <h3>Add a new activity to {category}</h3>
  <input type="text" placeholder="Activity Name" bind:value={activityName} />
  <textarea placeholder="Description" bind:value={description}></textarea>
  
  <!-- Výběr úrovně obtížnosti -->
  <label>
    <input type="radio" name="difficulty" value="easy" bind:group={difficulty} />
    Easy (5 XP)
  </label>
  <label>
    <input type="radio" name="difficulty" value="normal" bind:group={difficulty} />
    Normal (10 XP)
  </label>
  <label>
    <input type="radio" name="difficulty" value="hard" bind:group={difficulty} />
    Hard (15 XP)
  </label>
  
  <button onclick={addActivity}>Add Activity</button>
  <button onclick={closeModal}>Cancel</button>
</div>

<style>
  .modal {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  input, textarea {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
      background-color: #0056b3;
    }
</style>
