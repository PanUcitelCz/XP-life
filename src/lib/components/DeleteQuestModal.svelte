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
        const requiredText = `DELETE ${selectedQuestName}`;

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
    <div class="modal-overlay">
        <div class="modal">
            <h2>Delete Quest</h2>
            <label for="quest-select">Vyberte quest k odstranění:</label>
            <select id="quest-select" bind:value={selectedQuestId}>
                {#each userQuests as quest}
                    <option value={quest.id}>{quest.title}</option>
                {/each}
            </select>

            <p>Type "DELETE {selectedQuestName}" to confirm deletion:</p>
            <input bind:value={deleteConfirmation} placeholder="DELETE {selectedQuestName}" />
            <div class="modal-actions">
                <button onclick={confirmDeleteQuest}>Delete</button>
                <button onclick={closeModal}>Cancel</button>
            </div>
        </div>
    </div>
{/if}

<style lang="stylus">
.modal-overlay
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    display: flex
    justify-content: center
    align-items: center

.modal
    background-color: #fff
    padding: 2rem
    border-radius: 8px
    max-width: 400px
    width: 100%

.modal-actions
    display: flex
    justify-content: flex-end
    gap: 1rem
    margin-top: 1rem
</style>
