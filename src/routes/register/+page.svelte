<script>
  let email = '';
  let nickname = '';
  let password = '';

  async function register() {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('password', password);

    const response = await fetch('/register', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Registration successful');
    } else if (response.status === 409) {
      alert('User with this email or nickname already exists');
    } else {
      alert('Registration failed');
    }
  }
</script>

<form on:submit|preventDefault={register}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="text" bind:value={nickname} placeholder="Nickname" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Register</button>
</form>
