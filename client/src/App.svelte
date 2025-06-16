<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import FlightList from './components/FlightList/FlightList.svelte';

  let message = 'Recieving...';
  let flights = [];

  onMount(async () => {
    const res = await fetch('http://localhost:8080/');
    message = await res.text();

    try {
      const flightRes = await fetch('http://localhost:8080/api/flights');
      flights = await flightRes.json();
    } catch (err) {
      console.error('Error finding flights:', err);
    }

    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      console.log('Socket.io connected:', socket.id);
    });
  });
</script>

<h1>{message}</h1>

<FlightList {flights} />