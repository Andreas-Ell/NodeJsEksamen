<script>
  export let flights = [];

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

<h2>Flight departures:</h2>

{#if flights.length > 0}
  <ul>
    {#each flights as flight}
      <li>
        ✈️ <strong>{flight.destination}</strong> – 
        {formatDate(flight.departure_time)} – 
        {flight.seats} Seats
        <br />
        <em>{flight.description}</em>
      </li>
    {/each}
  </ul>
{:else}
  <p>No planes found.</p>
{/if}