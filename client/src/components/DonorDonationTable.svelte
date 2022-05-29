<script>
  export let items;
</script>

<thead>
  <tr>
    <th scope="col">Date of Gift</th>
    <th scope="col">Gift Type</th>
    <th scope="col">Status</th>
    <th scope="col">Description</th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation (donation.id)}
      <tr>
        <td>{donation.dateOfGift}</td>
        <td>{donation.type}</td>
        <td>{donation.status}</td>
        <td>{donation.giftDescription}</td>
        <td>View</td>
      </tr>
    {/each}
  {:else}
    <h6>No donations found.</h6>
  {/if}
</tbody>

<style>

</style>
