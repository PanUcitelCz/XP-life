<script lang="ts">
	import { goto } from '$app/navigation'; // Import navigation for redirect
	import { fade } from 'svelte/transition'; // Import fade for transitions
	import FormButton from '$lib/components/FormButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte'; // Import modal component

	// Definice props
	const { currentNickname = 'New nickname', currentEmail = 'New email' } = $props<{ currentNickname: string; currentEmail: string }>();

	// Reaktivní proměnné
	let newNickname = $state('');
	let newEmail = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let notification = $state('');

	let showDeleteModal = $state(false); // Stav pro zobrazení modalu na smazání účtu

	// Function to validate password
	function validatePassword(password: string): string | null {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasNumber = /\d/.test(password);

		if (password.length < minLength) {
			return 'Password must be at least 8 characters long.';
		}
		if (!hasUpperCase) {
			return 'Password must contain at least one uppercase letter.';
		}
		if (!hasNumber) {
			return 'Password must contain at least one number.';
		}
		return null; // Password is valid
	}

	// Function to save changes to user account
	async function saveChanges() {
		notification = '';

		// Validate new password
		if (newPassword !== '') {
			const passwordValidationError = validatePassword(newPassword);
			if (passwordValidationError) {
				notification = passwordValidationError;
				return;
			}

			if (newPassword !== confirmPassword) {
				notification = 'Passwords do not match.';
				return;
			}
		}

		const formData = new FormData();
		formData.append('newNickname', newNickname);
		formData.append('newEmail', newEmail);
		formData.append('currentPassword', currentPassword);
		formData.append('newPassword', newPassword);

		const response = await fetch('/profile/settings', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			const result = await response.json();
			if (result.success) {
				notification = 'Changes saved successfully!';
				// Redirect after 2 seconds or reset the form
				setTimeout(() => {
					goto('/profile');
				}, 2000);
			} else {
				notification = result.message;
			}
		} else {
			const errorResult = await response.json();
			notification = errorResult.message;
		}
	}

	// Function to open the modal for account deletion
	function openDeleteModal() {
		showDeleteModal = true;
	}

	// Function to close the modal
	function closeDeleteModal() {
		showDeleteModal = false;
	}

	// Function to handle account deletion
    async function deleteAccount() {
        try {
            const response = await fetch('/api/delete-account', {
            method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok && result.success) {
            notification = 'Account deleted successfully';
            setTimeout(() => goto('/'), 1500);
            } else {
            notification = result.message || 'Failed to delete account';
            console.error('Error:', result);
            }
        } catch (error) {
            notification = 'An error occurred while deleting the account';
            console.error('Error:', error);
        }
    }

</script>

<svelte:head><title>XP Life - Profile Settings</title></svelte:head>

<div class="Main">
	<div class="form">
		<h1>Account Settings</h1>

		<form onsubmit={saveChanges}>
			<input type="text" bind:value={newNickname} placeholder={currentNickname} />

			<input type="email" bind:value={newEmail} placeholder={currentEmail} />

			<input type="password" bind:value={newPassword}  placeholder="New password"/>

			<input type="password" bind:value={confirmPassword} placeholder="Repeat password" />

			<input type="password" bind:value={currentPassword} required placeholder="Current password" />

			<FormButton type="submit" color="green">Save Changes</FormButton>
			<div class="form-buttons">
				<Button href="/profile" color="grey">Back</Button>
				<button class="delete-button" onclick={openDeleteModal}>Delete Account</button> <!-- Přidán klasický HTML button -->
			</div>
		</form>

		{#if notification}
			<div transition:fade class="notification">{notification}</div>
		{/if}
	</div>
</div>

<!-- Confirm Modal for account deletion -->
{#if showDeleteModal}
	<ConfirmModal
		message="Are you sure you want to delete your account? This action is irreversible. If you need delete account just wrote DELETE MY ACCOUNT"
		confirmText="DELETE MY ACCOUNT"
		onConfirm={deleteAccount}
		onCancel={closeDeleteModal}
	/>
{/if}

<style lang="stylus">
  @import '../../../lib/css/form.styl'

  .form-buttons
    display flex
    justify-content space-between

  .delete-button
    background-color #ff4c4c
    color white
    border none
    padding 10px
    border-radius 10px
    cursor pointer
    font-size 23px
    width 100%
    text-align center
    transition background $easeOutExpo .6s, color $easeOutExpo .6s
    font-weight 500

    &:hover
      background-color #d43f3f
</style>
