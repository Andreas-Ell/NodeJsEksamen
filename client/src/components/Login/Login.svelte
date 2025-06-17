<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  let email = '';
  let password = '';
  const dispatch = createEventDispatcher();

  onMount(() => {
    toastr.options = {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 3000
    };
  });

  async function login() {
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
        toastr.success('Login successful!');
        dispatch('login', { name: data.name });
      } else {
        toastr.error(data.error || 'Login failed');
      }
    } catch {
      toastr.error('Network error');
    }
  }
</script>

<h2>Login</h2>

<form on:submit|preventDefault={login}>
  <label>
    Email:
    <input bind:value={email} required />
  </label>

  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit">Login</button>
</form>
