<script>
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  let name = '';
  let email = '';
  let password = '';

  async function signup() {
    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        toastr.success(data.message || 'user created!');
      } else {
        toastr.error(data.error || 'Signup failed.');
      }
    } catch {
      toastr.error('Network error');
    }
  }
</script>

<h2>Signup</h2>

<form on:submit|preventDefault={signup}>
  <label>
    Name:
    <input bind:value={name} required />
  </label>

  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit">Create new user</button>
</form>
