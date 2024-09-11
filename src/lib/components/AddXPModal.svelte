<script lang="ts">
    export let closeModal: () => void;  // Explicitní typ pro closeModal
    export let activityId: number;  // Typ pro activityId jako number
  
    async function addXP(amount: number) {  // Explicitní typ pro amount
      const response = await fetch('/api/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, xp: amount }),
      });
  
      if (response.ok) {
        closeModal(); // Zavře modal
      } else {
        console.error('Failed to add XP');
      }
    }
  </script>
  
  <div class="modal">
    <h3>How much did you practice?</h3>
    <button onclick={() => addXP(10)}>Light (10 XP)</button> <!-- onclick místo on:click -->
    <button onclick={() => addXP(20)}>Normal (20 XP)</button>
    <button onclick={() => addXP(30)}>Hard (30 XP)</button>
    <button onclick={closeModal}>Cancel</button> <!-- onclick místo on:click -->
  </div>
  
<style lang="stylus">
    
</style>
  