<script lang="ts">
    import QuestCard from '$lib/components/QuestCard.svelte';
    import ModalQuest from '$lib/components/ModalQuest.svelte';
    import AddQuestModal from '$lib/components/AddQuestModal.svelte';
    import DeleteQuestModal from '$lib/components/DeleteQuestModal.svelte';
    import CompletedQuestCard from '$lib/components/CompletedQuestCard.svelte'; // Import CompletedQuestCard

    type Quest = {
      id: number;
      title: string;
      category: string;
      createdAt: string;
      description: string;
      isCompleted: number;
      completedAt?: string; // Přidání completedAt pro datum dokončení
    };

    let reactiveQuests: Quest[] = $state([]);
    let showCompleteQuestModal = $state(false);
    let showAddQuestModal = $state(false);
    let showDeleteQuestModal = $state(false);
    let selectedQuest: Quest | null = $state(null);
    let completionMessage = $state("");
    let deleteConfirmationMessage = $state("");

    async function loadQuests() {
      try {
        const response = await fetch('/api/get-quest', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (response.ok) reactiveQuests = await response.json();
        else console.error('Failed to load quests');
      } catch (error) {
        console.error('Error loading quests:', error);
      }
    }

    loadQuests();

    async function completeQuest() {
        if (selectedQuest) {
            try {
            const response = await fetch('/api/complete-quest', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questId: selectedQuest!.id })
            });

            if (response.ok) {
                reactiveQuests = reactiveQuests.map((quest) =>
                quest.id === selectedQuest!.id ? { ...quest, isCompleted: 1, completedAt: new Date().toISOString() } : quest
                );
                completionMessage = `Quest "${selectedQuest!.title}" was successfully completed!`;
                setTimeout(() => (completionMessage = ""), 3000);
                closeModal();
            } else {
                console.error("Failed to complete quest. Response status:", response.status);
            }
            } catch (error) {
            console.error("Error during quest completion process:", error);
            }
        }
    }

    async function addQuest(title: string, description: string, category: string) {
      const response = await fetch('/api/add-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      });

      if (response.ok) {
        await loadQuests();
        closeAddQuestModal();
      } else {
        console.error('Failed to add quest');
      }
    }

    async function deleteQuest(id: number | null): Promise<{ success: boolean }> {
        if (id !== null) {
            const response = await fetch('/api/delete-quest', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questId: id })
            });

            if (response.ok) {
                reactiveQuests = reactiveQuests.filter((quest) => quest.id !== id);
                deleteConfirmationMessage = `Quest deleted successfully.`;
                setTimeout(() => (deleteConfirmationMessage = ""), 3000);
                return { success: true };
            } else {
                console.error('Failed to delete quest');
                return { success: false };
            }
        } else {
            console.error('No quest selected for deletion');
            return { success: false };
        }
    }

    const openCompleteQuestModal = (quest: Quest) => {
      selectedQuest = quest;
      showCompleteQuestModal = true;
    };

    const openAddQuestModal = () => {
      showAddQuestModal = true;
    };

    const openDeleteQuestModal = () => {
      if (reactiveQuests.length > 0) {
        selectedQuest = reactiveQuests[0];
        showDeleteQuestModal = true;
      }
    };

    const closeModal = () => {
      showCompleteQuestModal = false;
      selectedQuest = null;
    };

    const closeAddQuestModal = () => {
      showAddQuestModal = false;
    };

    const closeDeleteQuestModal = () => {
      showDeleteQuestModal = false;
      selectedQuest = null;
    };
</script>

<h2>Active Quests</h2>
<p>Complete your quests to earn points!</p>
{#if completionMessage}
    <div class="completion-message">{completionMessage}</div>
{/if}
{#if deleteConfirmationMessage}
    <div class="delete-message">{deleteConfirmationMessage}</div>
{/if}

<!-- Tlačítka pro přidání a mazání -->
<div class="button-group">
    <button onclick={openAddQuestModal}>Add Quest</button>
    <button onclick={openDeleteQuestModal}>Delete Quest</button>
</div>

<div class="quest-grid">
    {#each reactiveQuests.filter((quest) => quest.isCompleted === 0) as quest (quest.id)}
      <div>
        <QuestCard activity={quest} onAddXP={() => openCompleteQuestModal(quest)} />
      </div>
    {/each}
</div>

<h2>Completed Quests</h2>
<p>These quests have already been completed.</p>
<div class="quest-grid completed">
    {#each reactiveQuests.filter((quest) => quest.isCompleted === 1) as quest (quest.id)}
        <CompletedQuestCard
          title={quest.title}
          category={quest.category}
          description={quest.description}
          createdAt={quest.createdAt}
          completedAt={quest.completedAt ?? new Date().toISOString()}
        />
    {/each}
</div>

<ModalQuest questTitle={selectedQuest?.title ?? ''} showModal={showCompleteQuestModal} onConfirm={completeQuest} />
{#if showAddQuestModal}
  <AddQuestModal onConfirm={addQuest} onCancel={closeAddQuestModal} />
{/if}
{#if showDeleteQuestModal}
  <DeleteQuestModal
    showDeleteQuestModal={showDeleteQuestModal}
    userQuests={reactiveQuests}
    closeModal={closeDeleteQuestModal}
    deleteQuest={deleteQuest}
  />
{/if}

<style lang="stylus">
.button-group
    display: flex
    gap: 10px
    margin-top: 20px

.quest-grid
    display grid
    grid-template-columns repeat(auto-fill, minmax(250px, 1fr))
    gap 20px

.completion-message, .delete-message
    margin-top 10px
    padding 10px
    background-color #28a745
    color white
    text-align center
    border-radius 5px

button
    padding 10px
    background-color #007bff
    color white
    border none
    cursor pointer

button:hover
    background-color #0056b3
</style>
