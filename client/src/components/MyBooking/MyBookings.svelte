<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  let bookings = [];
  const socket = io('http://localhost:8080');

  async function hentBookings() {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/bookings/mine', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        bookings = data;
      } else {
        toastr.error(data.error || 'Could not retrieve your bookings.');
      }
    } catch {
      toastr.error('Network error');
    }
  }

  async function sletBooking(bookingId) {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toastr.success('Booking deleted');
        hentBookings();
      } else {
        toastr.error(data.error || 'Could not delete booking.');
      }
    } catch {
      toastr.error('Network error with deleting');
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onMount(() => {
    hentBookings();
    socket.on('bookingUpdate', hentBookings);
  });
</script>

<h2>Your bookings</h2>

{#if bookings.length === 0}
  <p>You have no bookings yet.</p>
{:else}
  <ul>
    {#each bookings as booking}
      <li>
        <strong>{booking.destination}</strong> –
        {formatDate(booking.departure_time)}
        <br />
        <em>{booking.description}</em>
        <br />
        <button on:click={() => sletBooking(booking.bookingId)}>Slet booking</button>
      </li>
    {/each}
  </ul>
{/if}
