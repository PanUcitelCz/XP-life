<script lang="ts">
	import { goto } from '$app/navigation'; // Import funkce pro navigaci
	import FormButton from '$lib/components/FormButton.svelte';
	import Button from '$lib/components/Button.svelte';

	let newPassword = '';
	let confirmPassword = '';
	let notification = '';
	let token = '';

	export let data;

	token = data.token;

	// Funkce pro ověření, že heslo splňuje pravidla
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
		return null; // Heslo je validní
	}

	async function resetPassword() {
		const validationError = validatePassword(newPassword);

		if (validationError) {
			notification = validationError;
			return;
		}

		if (newPassword !== confirmPassword) {
			notification = 'Passwords do not match.';
			return;
		}

		const formData = new FormData();
		formData.append('newPassword', newPassword);
		formData.append('token', token);

		const response = await fetch('/login/reset-password', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			notification = 'Password has been successfully changed. Redirecting to login...';

			setTimeout(() => {
				goto('/login'); // Použijeme `goto` pro přesměrování
			}, 2000); // 2 sekundové zpoždění
		} else {
			const result = await response.json();
			notification = result.message;
		}
	}
</script>

<div class="Main">
	<div class="form">
		<h1>Reset Password</h1>

		<form on:submit|preventDefault={resetPassword}>
			<input type="password" bind:value={newPassword} placeholder="Enter new password" required />
			<input type="password" bind:value={confirmPassword} placeholder="Confirm new password" required />

			<div class="form-buttons">
				<FormButton type="submit" color="green">Change</FormButton>
				<Button href="/profile" color="grey">Home</Button>
			</div>
		</form>

		{#if notification}
			<div class="notification">{notification}</div>
		{/if}
	</div>
</div>

<style lang="stylus">
      @import '../../../lib/css/form.styl'
</style>
