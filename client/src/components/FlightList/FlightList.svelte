<script>
  export let flights = [];

  async function bookFlight(flightId) {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${flightId}`, {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Fejl ved booking:', err);
      alert('⚠️ Der opstod en fejl ved booking.');
    }
  }

  function formatDate(dato) {
    return new Date(dato).toLocaleString('da-DK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<h2>Flight departures.:</h2>

{#if flights.length > 0}
  <ul>
    {#each flights as flight}
      <li>
        ✈️ <strong>{flight.destination}</strong> –
        {formatDate(flight.departure_time)} –
        {flight.seats} Seats
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
