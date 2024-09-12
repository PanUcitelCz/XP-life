<script lang="ts">
    import { goto } from '$app/navigation'; // Import navigation for redirect
    import { fade } from 'svelte/transition'; // Import fade for transitions
    import FormButton from '$lib/components/FormButton.svelte';
    import Button from '$lib/components/Button.svelte';

    let currentNickname = ''; // User's current nickname (will be filled from user data)
    let currentEmail = '';    // User's current email (will be filled from user data)
    let newNickname = '';
    let newEmail = '';
    let currentPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let notification = '';
  
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
        body: formData
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
</script>
  
<svelte:head><title>XP Life - Profile Settings</title></svelte:head>

<div class="Main">
  <div class="form">
    <h1>Account Settings</h1>
        
    <form on:submit|preventDefault={saveChanges}>
      <label for="newNickname">New Nickname</label>
      <input type="text" bind:value={newNickname} placeholder={currentNickname} />
        
      <label for="newEmail">New Email</label>
      <input type="email" bind:value={newEmail} placeholder={currentEmail} />
        
      <label for="currentPassword">Current Password (required to confirm changes)</label>
      <input type="password" bind:value={currentPassword} required />
        
      <label for="newPassword">New Password (optional)</label>
      <input type="password" bind:value={newPassword} />
        
      <label for="confirmPassword">Confirm New Password</label>
      <input type="password" bind:value={confirmPassword} />
            
      <FormButton type="submit" color="green">Save Changes</FormButton>
      <div class="form-buttons">
          <Button href="/profile" color="grey">Back</Button>
          <Button href="/profile" color="grey">Odstranit účet</Button>
      </div>
    </form>
      
    {#if notification}
        <div transition:fade class="notification">{notification}</div>
    {/if}
  </div>
</div>
  

<style lang="stylus">
  @import '../../../lib/css/form.styl'
  
  label
    text center
</style>