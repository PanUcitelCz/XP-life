<script lang="ts">
	let { userId, category, closeModal } = $props<{ userId: number; category: string; closeModal: () => void }>();

	// Reaktivní proměnné
	let activityName = $state('');
	let description = $state('');
	let difficulty = $state('easy');
	let selectedCategory = $state(category); // Interní proměnná pro výběr kategorie, výchozí hodnota podle props
	let selectedActivity = $state('');
	let selectedActivityId = $state<number | null>(null);
	let confirmDelete = $state('');
	let errorMessage = $state('');
	let showAddActivity = $state(true);
	let selectedAction = $state('Enable'); // Výchozí akce pro správu

	let allActivities = $state<{ activityName: string; id: number; category: string }[]>([]);
	let filteredActivities = $state<{ activityName: string; id: number }[]>([]);


    async function addActivity() {
		if (!activityName) {
			errorMessage = 'Activity name cannot be empty.';
			return;
		}

		if (!selectedCategory) {
			errorMessage = 'You must select a category.';
			return;
		}

		const response = await fetch('/api/add-activity', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				category: selectedCategory,
				activityName,
				description,
				difficulty
			}),
		});

		if (response.ok) {
			closeModal();
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error || 'Failed to add activity';
		}
	}

    // Funkce pro přepínání mezi Add a Remove/Disable Activity
    function toggleActivityMode() {
        showAddActivity = !showAddActivity;
        if (!showAddActivity) {
            loadActivities();
        }
    }


	// Načtení aktivit
    async function loadActivities() {
        console.log('Načítám aktivity...');
        const response = await fetch(`/api/get-user-activities`);

        if (response.ok) {
            const data = await response.json();
            console.log('Data z API:', data);

            // Uložíme všechny aktivity z API
            allActivities = [];
            for (const cat in data) {
                if (data.hasOwnProperty(cat)) {
                    data[cat].forEach((activity: any) => {
                        allActivities.push({
                            activityName: activity.activityName,
                            id: activity.id,
                            category: cat,
                        });
                    });
                }
            }

            console.log('Všechny aktivity:', allActivities);

            // Zkontrolujeme filtrované aktivity pro výchozí kategorii
            if (selectedCategory) {
                handleCategoryChange();
            }
        } else {
            console.error('Failed to load activities');
        }
    }

	// Filtruj aktivity na základě zvolené kategorie
	function handleCategoryChange() {
		console.log('Zvolená kategorie:', selectedCategory);

		if (selectedCategory) {
			filteredActivities = allActivities.filter(activity => activity.category === selectedCategory.toLowerCase());
			console.log('Filtrované aktivity pro kategorii:', filteredActivities);
		} else {
			filteredActivities = [];
		}
	}

	// Funkce pro zpracování zvolené akce
	async function processAction() {
		if (!selectedActivityId) {
			errorMessage = 'Please select an activity.';
			return;
		}

		if (selectedAction === 'Delete') {
			if (confirmDelete !== `DELETE`) {
				errorMessage = `You must type 'DELETE' to delete this ${selectedActivity} activity.`;
				return;
			}
			await deleteActivity();
		} else if (selectedAction === 'Disable') {
			await disableActivity();
		} else if (selectedAction === 'Enable') {
			await enableActivity();
		}
	}

	// Funkce pro deaktivaci aktivity
	async function disableActivity() {
		const response = await fetch(`/api/disable-activity`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				activityId: selectedActivityId,
				category: selectedCategory,
			}),
		});

		if (response.ok) {
			closeModal();
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error || 'Failed to disable activity';
		}
	}

	// Funkce pro opětovnou aktivaci deaktivované aktivity
	async function enableActivity() {
		const response = await fetch(`/api/enable-activity`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				activityId: selectedActivityId,
				category: selectedCategory,
			}),
		});

		if (response.ok) {
			closeModal();
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error || 'Failed to enable activity';
		}
	}

	// Funkce pro odstranění aktivity
	async function deleteActivity() {
		const response = await fetch(`/api/delete-activity`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				category: selectedCategory,
				activityName: selectedActivity,
			}),
		});

		if (response.ok) {
			closeModal();
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error || 'Failed to delete activity';
		}
	}

	// Funkce pro výběr aktivity
	function handleActivitySelection(event: Event) {
		const selectedActivityIdValue = parseInt((event.target as HTMLSelectElement).value, 10);

		// Najdeme aktivitu podle ID v `filteredActivities`
		const selectedActivityObj = filteredActivities.find(activity => activity.id === selectedActivityIdValue);

		if (selectedActivityObj) {
			selectedActivityId = selectedActivityObj.id;
			selectedActivity = selectedActivityObj.activityName;
		} else {
			selectedActivityId = null;
			selectedActivity = '';
		}

		console.log(`Selected activity: ${selectedActivity}, ID: ${selectedActivityId}`);
	}

</script>

<!-- Modál pro přidání nebo úpravu aktivity -->
<button class="modal-backdrop" onclick={closeModal} aria-label="Close modal"></button>

{#if showAddActivity}
	<div class="modal fade-in">
		<h2>Add Activity</h2>
        <div class="toggle-buttons">
            <button class:active={showAddActivity} class="switch-btn" onclick={toggleActivityMode}>Add Activity</button>
            <button class:active={!showAddActivity} class="switch-btn" onclick={toggleActivityMode}>Remove/Disable Activity</button>
        </div>
		<label for="category">Category</label>
		<select id="category" bind:value={selectedCategory} onchange={handleCategoryChange}>
			<option value="" disabled selected>Select a category</option>
			<option value="Strength">Strength</option>
			<option value="Dexterity">Dexterity</option>
			<option value="Constitution">Constitution</option>
			<option value="Intelligence">Intelligence</option>
			<option value="Wisdom">Wisdom</option>
			<option value="Charisma">Charisma</option>
		</select>

		<label for="name">Activity Name</label>
		<input id="name" bind:value={activityName} placeholder="Enter activity name" />

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
{:else}
	<!-- Sekce pro deaktivaci nebo smazání/aktivaci aktivity -->
	<div class="modal fade-in">
		<h2>Manage Activity</h2>
		<div class="toggle-buttons">
			<button class:active={showAddActivity} class="switch-btn" onclick={toggleActivityMode}>Add Activity</button>
			<button class:active={!showAddActivity} class="switch-btn" onclick={toggleActivityMode}>Remove/Disable Activity</button>
		</div>

        <label for="category">Category</label>
        <select id="category" bind:value={selectedCategory} onchange={handleCategoryChange}>
            <option value="" disabled selected>Select a category</option>
            <option value="Strength">Strength</option>
            <option value="Dexterity">Dexterity</option>
            <option value="Constitution">Constitution</option>
            <option value="Intelligence">Intelligence</option>
            <option value="Wisdom">Wisdom</option>
            <option value="Charisma">Charisma</option>
        </select>

		<label for="activity-select">Select Activity</label>
        <!-- Výběr aktivity pro deaktivaci -->
        <select id="activity-select" onchange={handleActivitySelection}>
            <option value="" disabled selected>Select activity</option>
            {#each filteredActivities as activity}
                <option value={activity.id}>{activity.activityName}</option>
            {/each}
        </select>

		{#if selectedActivity && selectedAction === 'Delete'}
            <label for="input">If you want delete {selectedActivity} activity, you must type 'DELETE MY'</label>
			<input type="text" bind:value={confirmDelete} placeholder="Type 'DELETE'" />
		{/if}

        <div class="category">
            <label for="action">Choose Action</label>
            <select name="action" id="action" bind:value={selectedAction}>
                <option value="Enable">Enable</option>
                <option value="Disable">Disabled</option>
                <option value="Delete">Delete</option>
            </select>
        </div>

        <div class="modal-buttons">
            <button class="cancel" onclick={closeModal}>Cancel</button>
            <button class="accept" onclick={processAction}>Accept change</button>
        </div>

		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}
	</div>
{/if}

<style>
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
		box-sizing: border-box;
	}

	.fade-in {
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.switch-btn {
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.switch-btn:active {
		background-color: #28a745;
		color: white;
	}

	h2 {
		margin-top: 0;
	}

	label {
		display: block;
		margin-top: 15px;
	}

	input,
	textarea,
	select {
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

	.accept {
		background-color: #28a745;
		color: white;
	}

	.error-message {
		color: red;
		margin-top: 10px;
	}

	.toggle-buttons {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.toggle-buttons button {
		border: none;
	}

	.toggle-buttons button.active {
		background-color: #28a745;
		color: white;
	}
</style>

