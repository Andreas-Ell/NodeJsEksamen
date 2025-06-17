<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  export let flights = [];
  const dispatch = createEventDispatcher();

  onMount(() => {
    toastr.options = {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 3000
    };
  });

  async function bookFlight(flightId) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/bookings/${flightId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toastr.success(data.message, 'Booking bekræftet');
        dispatch('efterBooking');
      } else {
        toastr.error(data.error || 'Noget gik galt', 'Fejl');
      }
    } catch {
      toastr.error('Der opstod en netværksfejl ved booking.', 'Netværksfejl');
    }
  }

  function formatDate(dato) {
    return new Date(dato).toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<h2>Flight departures:</h2>

{#if flights.length > 0}
  <ul>
    {#each flights as flight}
      <li>
        ✈️ <strong>{flight.destination}</strong> –
        {formatDate(flight.departure_time)} –
        {flight.available_seats} Seats available
        <br />
        <em>{flight.description}</em>
        <br />
        <button on:click={() => bookFlight(flight.id)}>Book</button>
      </li>
    {/each}
  </ul>
{:else}
  <p>No flights found.</p>
{/if}
