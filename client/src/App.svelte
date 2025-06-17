<script>
  import { onMount } from 'svelte';
  import Login from './components/Login/Login.svelte';
  import Signup from './components/Login/Signup.svelte';
  import FlightList from './components/FlightList/FlightList.svelte';
  import MyBookings from './components/MyBooking/MyBookings.svelte';
  import { io } from 'socket.io-client';

  let flights = [];
  let loggedIn = false;

  const socket = io('http://localhost:8080');

  async function hentFlights() {
    try {
      const res = await fetch('http://localhost:8080/api/flights');
      flights = await res.json();
    } catch {}
  }

  function checkLogin() {
    const token = localStorage.getItem('token');
    loggedIn = !!token;
  }

  function handleLogin() {
    checkLogin();
    hentFlights();
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    loggedIn = false;
  }

  onMount(() => {
    checkLogin();
    if (loggedIn) hentFlights();

    socket.on('bookingUpdate', () => {
      hentFlights();
    });
  });
</script>

<style>
  .app-container {
    font-family: Arial, sans-serif;
    margin: 0 auto;
    max-width: 900px;
    padding: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #004080;
    color: white;
    padding: 1rem;
    border-radius: 8px;
  }

  .logout-btn {
    background-color: #ff6666;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
  }

  .login-wrapper {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .login-wrapper h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #004080;
  }

  .form-section {
    background-color: #f9f9f9;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
</style>


<div class="app-container">
  {#if loggedIn}
    <header class="header">
      <h1>Welcome to Oslo airport, find your next flight here!</h1>
      <button class="logout-btn" on:click={logout}>Log out</button>
    </header>

    <main class="main-content">
      <FlightList {flights} on:efterBooking={hentFlights} />
      <MyBookings />
    </main>
  {:else}
    <div class="login-wrapper">
      <h1>✈️ Your Flight Booking</h1>

      <div class="form-section">
        <Login on:login={handleLogin} />
      </div>

      <div class="form-section">
        <Signup />
      </div>
    </div>
  {/if}
</div>
