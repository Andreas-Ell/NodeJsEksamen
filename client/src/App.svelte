<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import FlightList from './components/FlightList/FlightList.svelte';

  let message = 'Henter...';
  let flights = [];

  async function hentFlights() {
    try {
      const flightRes = await fetch('http://localhost:8080/api/flights');
      flights = await flightRes.json();
    } catch (err) {
      console.error('Fejl ved hentning af fly:', err);
    }
  }

  onMount(async () => {
    const res = await fetch('http://localhost:8080/');
    message = await res.text();

    await hentFlights();

    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      console.log('Socket.io forbundet:', socket.id);
    });

    socket.on('bookingUpdate', () => {
    console.log('Booking opdateret – henter fly på ny...');
    hentFlights();
   });
  });
</script>

<h1>{message}</h1>

<FlightList {flights} on:efterBooking={hentFlights} />