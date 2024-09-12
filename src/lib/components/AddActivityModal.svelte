<script lang="ts">
  export let userId: number;
  export let category: string;
  export let closeModal: () => void;

  let activityName = '';
  let description = '';
  let difficulty = 'easy';
  let errorMessage = '';

  // Funkce pro přidání aktivity
  async function addActivity() {
    if (!activityName) {
      errorMessage = 'Activity name cannot be empty.';
      return;
    }

    if (!category) {
      errorMessage = 'You must select a category.';
      return;
    }

    const response = await fetch('/api/add-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        category,
        activityName,
        description,
        difficulty
      })
    });

    if (response.ok) {
      closeModal(); // Zavři modál po úspěšném přidání
    } else {
      const errorData = await response.json();
      errorMessage = errorData.error || 'Failed to add activity';
    }
  }
</script>

<button class="modal-backdrop" onclick={closeModal} aria-label="Close modal"></button>

<div class="modal">
  <h2>Add Activity</h2>

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

  <label for="name">Activity Name</label>
  <input id="name" bind:value={activityName} placeholder="Enter activity name" />

  <label for="category">Category</label>
  <select id="category" bind:value={category}>
    <option value="" disabled selected>Select a category</option>
    <option value="Strength">Strength</option>
    <option value="Dexterity">Dexterity</option>
    <option value="Constitution">Constitution</option>
    <option value="Intelligence">Intelligence</option>
    <option value="Wisdom">Wisdom</option>
    <option value="Charisma">Charisma</option>
  </select>

  <label for="description">Description</label>
  <textarea id="description" bind:value={description} placeholder="Enter description"></textarea>

  <label for="difficulty">Difficulty</label>
  <select id="difficulty" bind:value={difficulty}>
    <option value="easy">Easy (5 XP)</option>
    <option value="normal">Normal (10 XP)</option>
    <option value="hard">Hard (15 XP)</option>
  </select>

  <div class="modal-buttons">
    <button class="add" onclick={addActivity}>Add Activity</button>
    <button class="cancel" onclick={closeModal}>Cancel</button>
  </div>
</div>

<style>
  /* Styl modálu a pozadí */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 20;
    width: 90%;
    max-width: 400px;
    margin: 10px;
    box-sizing: border-box;
  }

  h2 {
    margin-top: 0;
  }

  label {
    display: block;
    margin-top: 15px;
  }

  input, textarea, select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .modal-buttons button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .add {
    background-color: #007bff;
    color: white;
  }

  .cancel {
    background-color: #ccc;
    color: black;
  }

  .add:hover {
    background-color: #0056b3;
  }

  .cancel:hover {
    background-color: #999;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
</style>
