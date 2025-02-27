<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let profileImages = $state<string[]>([
		'/profile/Profilovka%201%20-%20Paladin.png',
		'/profile/Profilovka%202%20-%20Ranger.png',
		'/profile/Profilovka%203%20-%20Rogue.png',
		'/profile/Profilovka%204%20-%20Mage.png',
		'/profile/Profilovka%205%20-%20Ork.png'
	]);
	let selectedImage = $state<string | null>(null);
	let errorMessage = $state('');
	let loading = $state(false);

	// Uložení vybraného obrázku
	async function handleSave() {
		if (!selectedImage) {
			errorMessage = 'Please select an image before saving.';
			return;
		}

		try {
			const response = await fetch('/api/update-profile-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ profileImage: selectedImage }),
			});

			if (!response.ok) throw new Error('Failed to update profile image.');
			location.reload(); // Aktualizace stránky
		} catch (error) {
			errorMessage = 'Failed to update profile image. Please try again.';
		}
	}

	// Zrušení výběru
	function handleCancel() {
		dispatch('cancel');
	}
</script>

<div class="modal-backdrop">
	<div class="modal">
		<h3>Select Profile Image</h3>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		<div class="image-grid">
			{#each profileImages as image}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <!-- svelte-ignore a11y_img_redundant_alt -->

				<img
					src={image}
					alt="Profile Image"
					class:selected={selectedImage === image}
					onclick={() => (selectedImage = image)}
				/>
			{/each}
		</div>
		<div class="modal-buttons">
			<button onclick={handleSave}>Save</button>
			<button onclick={handleCancel}>Cancel</button>
		</div>
	</div>
</div>

<style lang="stylus">
	.modal-backdrop
		position fixed
		top 0
		left 0
		width 100vw
		height 100vh
		background rgba(0, 0, 0, 0.5)
		display flex
		justify-content center
		align-items center
		z-index 9999

	.modal
		background white
		padding 20px
		border-radius 10px
		max-width 800px
		width 100%
		text-align center

	.image-grid
		display grid
		grid-template-columns repeat(auto-fit, minmax(150px, 1fr))
		gap 20px
		margin: 20px 0

	img
		width 100%
		height 150px
		border-radius 10px
		object-fit cover
		cursor pointer
		border 2px solid transparent
		transition border-color 0.3s, transform 0.3s

		&:hover
			border-color #007bff
			transform scale(1.05)

		&.selected
			border-color #007bff
			box-shadow 0 0 10px #007bff

	.modal-buttons
		display flex
		gap 10px
		margin-top 20px
		justify-content center

	button
		padding 10px 20px
		border-radius 5px
		border none
		background #007bff
		color white
		cursor pointer
		transition background 0.3s

		&:hover
			background #0056b3

		&:nth-child(2)
			background-color #ccc

			&:hover
				background #999

	.error
		color red
		margin-top 10px
</style>
