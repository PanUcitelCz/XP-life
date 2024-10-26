<script lang="ts">
    export let onConfirm: (title: string, description: string, category: string) => void;
    export let onCancel: () => void;

    let title = '';
    let description = '';
    let category = '';

    const categories = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

    function submit() {
      if (title && description && category) {
        onConfirm(title, description, category);
      }
    }
  </script>

  <div class="modal-overlay">
    <div class="modal">
      <h2>Add New Quest</h2>
      <input bind:value={title} placeholder="Quest Title" />
      <input bind:value={description} placeholder="Description" />

      <select bind:value={category}>
        <option disabled value="">Select Category</option>
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>

      <button onclick={submit}>Add Quest</button>
      <button onclick={onCancel}>Cancel</button>
    </div>
  </div>

<style lang="stylus">
    .modal-overlay
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      display flex
      justify-content center
      align-items center
      background rgba(0, 0, 0, 0.5)

    .modal
      background-color white
      padding 20px
      border-radius 10px
      width 300px
      text-align center

    button
      margin 10px
      padding 10px
      cursor pointer
</style>
