<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Definice dispatcheru pro vysílání událostí
	const dispatch = createEventDispatcher();

	let selectedFile: File | null = null;
	let errorMessage = '';

	// Funkce pro zpracování výběru souboru
	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
			errorMessage = '';
		} else {
			selectedFile = null;
		}
	}

	// Funkce pro potvrzení a odeslání souboru
	async function handleConfirm() {
		if (selectedFile) {
			const formData = new FormData();
			formData.append('profileImage', selectedFile);

			const response = await fetch('/api/upload-profile-image', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				dispatch('confirm'); // Zavolání confirm události
			} else {
				errorMessage = 'Upload failed. Please try again.';
			}
		} else {
			errorMessage = 'Please select a file first.';
		}
	}

	function handleCancel() {
		dispatch('cancel'); // Zavolání cancel události
	}
</script>

<div class="modal-backdrop">
	<div class="modal">
		<h3>Upload Profile Image</h3>
		<input type="file" accept="image/*" onchange={handleFileChange} />
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		<div class="modal-buttons">
			<button onclick={handleConfirm}>Confirm</button>
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
    max-width 500px
    text-align center

  .modal-buttons
    display flex
    gap 36px
    margin-top 20px

  input
    width 100%
    height 40px
    border-radius 10px
    border 0px
    background #f6f5f5
    text-align center
    font-size 21px

  button
    padding 10px
    border-radius 10px
    text-decoration none
    font-size 23px
    width 100%
    text-align center
    transition background .6s ease-out
    font-weight 500
    background #007bff
    color white
    border none
    cursor pointer

  button:hover
    background #495464

  .error
    color red
    margin-top 10px
</style>
