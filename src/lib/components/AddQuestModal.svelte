<script lang="ts">
    const { onConfirm, onCancel } = $props<{
      onConfirm: (title: string, description: string, category: string, xpValue: number) => void;
      onCancel: () => void;
    }>();

    let title = $state('');
    let description = $state('');
    let category = $state('');
    // Přidáme proměnnou pro xpValue s default hodnotou 100
    let xpValue = $state(100);
    let errorMessage = $state('');

    const categories = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
    // Možné hodnoty pro xpValue
    const xpValues = [25, 50, 75, 100];

    const submitQuest = () => {
      if (!title || !description || !category) {
        errorMessage = 'All fields are required';
        return;
      }
      errorMessage = '';
      // Předáváme také xpValue jako čtvrtý parametr
      onConfirm(title, description, category, xpValue);
    };

    const closeModal = () => {
      onCancel();
    };
  </script>

  <div class="modal-backdrop" onclick={closeModal} role="button" tabindex="0" aria-label="Close modal" onkeydown={(e) => e.key === 'Enter' && closeModal()}></div>

  <div class="modal fade-in">
    <h2>Add New Quest</h2>

    <label for="title" class="label">Quest Title</label>
    <input id="title" type="text" bind:value={title} placeholder="Enter quest title" />

    <label for="description" class="label">Description</label>
    <textarea id="description" bind:value={description} placeholder="Enter quest description"></textarea>

    <label for="category" class="label">Category</label>
    <select id="category" bind:value={category}>
      <option value="" disabled selected>Select category</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>

    <!-- Nové pole pro výběr xpValue -->
    <label for="xpValue" class="label">XP Value</label>
    <select id="xpValue" bind:value={xpValue}>
      {#each xpValues as xp}
        <option value={xp}>{xp}</option>
      {/each}
    </select>

    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}

    <div class="modal-buttons">
      <button class="confirm-button" onclick={submitQuest}>Add Quest</button>
      <button class="cancel-button" onclick={closeModal}>Cancel</button>
    </div>
  </div>

  <style lang="stylus">
    .modal-backdrop
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh
      background-color rgba(0, 0, 0, 0.5)
      backdrop-filter blur(5px)
      cursor pointer
      z-index 1000

    .modal
      position fixed
      top 50%
      left 50%
      transform translate(-50%, -50%)
      background-color white
      padding 25px
      border-radius 12px
      box-shadow 0 4px 12px rgba(0, 0, 0, 0.2)
      width 90%
      max-width 400px
      z-index 1001
      text-align center
      animation fadeIn 0.3s ease-in-out

    h2
      color black
      margin-bottom 15px
      font-size 1.5rem
      font-weight 500

    .label
      text-align left
      display block
      margin-top 15px
      font-weight 500
      color black

    input, textarea, select
      width 100%
      padding 10px
      margin-top 5px
      border 1px solid #ddd
      border-radius 5px
      box-sizing border-box
      font-size 1rem
      background-color #f9f9f9
      color #333

    textarea
      resize vertical

    .error-message
      color red
      margin-top 10px

    .modal-buttons
      display flex
      justify-content space-between
      margin-top 20px

    button
      padding 10px 20px
      border none
      border-radius 5px
      font-size 1rem
      cursor pointer
      transition background-color 0.3s

    .confirm-button
      background-color #007bff
      color white

      &:hover
        background-color #0056b3

    .cancel-button
      background-color #ccc
      color black

      &:hover
        background-color #999

    @keyframes fadeIn
      from
        opacity 0
      to
        opacity 1
  </style>
