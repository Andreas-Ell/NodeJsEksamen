<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  let message = 'Henter...';

  onMount(async () => {
    const res = await fetch('http://localhost:8080/');
    message = await res.text();

    
    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      console.log('Socket.io forbundet:', socket.id);
    });
  });
</script>

<h1>{message}</h1>
