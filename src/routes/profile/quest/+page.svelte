<script lang="ts">
    import QuestCard from '$lib/components/QuestCard.svelte';
    import ModalQuest from '$lib/components/ModalQuest.svelte';
    import AddQuestModal from '$lib/components/AddQuestModal.svelte';
    import DeleteQuestModal from '$lib/components/DeleteQuestModal.svelte';
    import CompletedQuestCard from '$lib/components/CompletedQuestCard.svelte'; // Import CompletedQuestCard

    type Quest = {
        id: number;
        title: string;
        description: string;
        category: string;
        createdAt: string;
        isCompleted: number;
        completedAt?: string;
        xpValue: number; // Přidáno!
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
            const response = await fetch('/api/get-quest', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
            const questsFromApi = await response.json();
            reactiveQuests = questsFromApi.map((q: any) => ({
                ...q,
                xpValue: q.xp_value ?? 50  // Použije se hodnota z DB; pokud ji nemá, fallback je 50
            }));
            } else {
            console.error('Failed to load quests');
            }
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

    async function addQuest(title: string, description: string, category: string, xpValue: number) {
        const response = await fetch('/api/add-quest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, category, xp_value: xpValue })
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

<section>
    <h2>Quest life</h2>
    <p>Complete your quests to earn points!</p>

    {#if completionMessage}
        <div class="completion-message">{completionMessage}</div>
    {/if}
    {#if deleteConfirmationMessage}
        <div class="delete-message">{deleteConfirmationMessage}</div>
    {/if}

    <div class="button-group">
        <button onclick={openAddQuestModal}>Add Quest</button>
        <button onclick={openDeleteQuestModal} class="button-delete">Delete Quest</button>
    </div>
</section>

<section class="quest">
    <div>
        <h1>Active quests</h1>
    </div>
    <div class="quest-grid">
        {#each reactiveQuests.filter((quest) => quest.isCompleted === 0) as quest (quest.id)}
            <QuestCard activity={quest} onAddXP={() => openCompleteQuestModal(quest)} />
        {/each}
    </div>
</section>

<section class="quest">
    <h2>Completed quests</h2>
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
</section>

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

    section
        display flex
        flex-direction column
        justify-content center
        align-items center
        margin 36px 36px
        color white
        background-color rgba(0, 0, 0, 0.35)
        backdrop-filter blur(10px)
        padding 10px
        border-radius 10px

    .quest
        //justify-content flex-start
        min-height 350px
        gap 10px

        .quest-grid
            display flex
            flex-wrap wrap
            gap 20px
            justify-content center
            align-items start
            width 100%
            margin-bottom 20px

    .button-group
        display: flex
        gap: 10px
        max-width 460px
        width 100%
        flex-direction row
        margin-bottom 21px

        @media (max-width: 530px)
            flex-direction column

        button
            border-radius 10px
            padding 10px
            background-color #3cab52
            color white
            border none
            cursor pointer
            height 3rem
            font-size 18px
            width 100%
            display flex
            justify-content center
            align-items center
            //min-width 160px

        .button-delete
            background-color red

            &:hover
                background-color #0056b3

    .completion-message, .delete-message
        margin-top 10px
        padding 10px
        background-color #28a745
        color white
        text-align center
        border-radius 5px

    button


    button:hover
        background-color #0056b3
</style>
