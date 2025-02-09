<script lang="ts">
    // Příjem props pomocí $props a deklarace s typy
    let {
        showDeleteQuestModal,
        userQuests = [], // Nastavení výchozí hodnoty pro userQuests, aby nebyl undefined
        closeModal,
        deleteQuest
    } = $props<{
        showDeleteQuestModal: boolean;
        userQuests: { id: number; title: string }[];
        closeModal: () => void;
        deleteQuest: (id: number | null) => Promise<{ success: boolean }>;
    }>();

    // Reaktivní proměnné pomocí $state
    let selectedQuestId = $state<number | null>(null);
    let deleteConfirmation = $state("");
    let selectedQuestName = $state("");

    // Reakce na změnu selectedQuestId pomocí $effect
    $effect(() => {
        if (userQuests && userQuests.length > 0) { // Kontrola, zda userQuests není undefined nebo prázdné
            const quest = userQuests.find((q: { id: number; title: string }) => q.id === selectedQuestId);
            selectedQuestName = quest ? quest.title : "";
        }
    });

    // Funkce pro potvrzení a smazání questu
    async function confirmDeleteQuest() {
        const requiredText = `DELETE`;

        if (deleteConfirmation !== requiredText) {
            alert("Please type the correct confirmation text to delete the quest.");
            return;
        }

        try {
            const result = await deleteQuest(selectedQuestId);
            if (result.success) {
                alert("Quest deleted successfully!");
                location.reload(); // Refresh stránky po úspěšném smazání
            } else {
                alert("Failed to delete quest. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting quest:", err);
        }
    }
</script>

{#if showDeleteQuestModal}
    <div class="modal-backdrop" onclick={closeModal} role="button" tabindex="0" aria-label="Close modal" onkeydown={(e) => e.key === 'Enter' && closeModal()}></div>

    <div class="modal fade-in">
        <h2>Delete Quest</h2>

        <label for="quest-select" class="label">Select Quest to Delete</label>
        <select id="quest-select" bind:value={selectedQuestId}>
            {#each userQuests as quest}
                <option value={quest.id}>{quest.title}</option>
            {/each}
        </select>

        <p>Type "DELETE " to confirm {selectedQuestName} deletion:</p>
        <input bind:value={deleteConfirmation} placeholder="DELETE" />

        <div class="modal-buttons">
            <button class="confirm-button" onclick={confirmDeleteQuest}>Delete</button>
            <button class="cancel-button" onclick={closeModal}>Cancel</button>
        </div>
    </div>
{/if}

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

    select, input
        width 100%
        padding 10px
        margin-top 5px
        border 1px solid #ddd
        border-radius 5px
        box-sizing border-box
        font-size 1rem
        background-color #f9f9f9
        color #333

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
        background-color #e74c3c
        color white

        &:hover
            background-color #c0392b

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
