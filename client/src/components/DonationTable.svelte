<script>
  export let items;
  export let args;
  let donorId = args;

  const formatGiftTypeField = (value=false) => {
    return value == true ? "Important" : "Standard";
  }

  const formatStatusField = (value=false) => {
    return value == true ? "Pending letter" : "Complete";
  }
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
    {#if donorId}
      <th scope="col"></th>
    {/if}
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
        <td>{formatGiftTypeField(donation.important) || "Unknown"}</td>
        <td>{formatStatusField(donation.letter) || "Unknown"}</td>
        <td>{donation.giftDescription}</td>
        <td><a href="/donation/{donation.id}">View</a></td>
        {#if donorId}
          <td><a href="/letter/{donation.id}">Letter</a></td>
        {/if}
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>

</style>
