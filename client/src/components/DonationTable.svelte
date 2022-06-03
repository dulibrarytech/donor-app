<script>
  export let items;
  export let args;
  let donorId = args;
</script>

<thead>
  <tr>
    <th scope="col">Date of Gift</th>
    {#if !donorId}
      <th scope="col">Last Name/Organization</th>
      <th scope="col">First Name</th>
    {/if}
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
        <td>{donation.dateOfGift?.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/) ?? "No date"}</td>
        {#if !donorId}
          <td>{donation.lastName || ""}</td>
          <td>{donation.firstName || ""}</td>
        {/if}
        <td>{donation.type || "Standard"}</td>
        <td>{donation.status}</td>
        <td>{donation.giftDescription}</td>
        <td>View</td>
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>

</style>
