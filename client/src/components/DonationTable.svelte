<script>
  export let items;
  export let args;
  let donorId = args?.donorId || null;
  let roleId = args?.roleId;

  const formatGiftTypeField = (value=false) => {
    return value == true ? "Important" : "Standard";
  }

  const formatStatusField = (value=false) => {
    return value == true ? "Pending letter" : "Complete";
  }
</script>

<thead class="header">
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
        <td>{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>

        {#if !donorId}
          <td>{donation.lastName || donation.organization || ""}</td>
          <td>{donation.firstName || ""}</td>
        {/if}

        {#if donation.donorId != 1}
          <td>{formatGiftTypeField(donation.important) || "Unknown"}</td>
        {:else}
          <td>n/a</td>
        {/if}

        {#if donation.donorId != 1}
          <td>{formatStatusField(donation.letter) || "Unknown"}</td>
        {:else}
          <td>n/a</td>
        {/if}

        <td>{donation.giftDescription}</td>

        <td><a href="/donation/{donation.id}">View</a></td>

        {#if donorId}
          {#if roleId == 2 || roleId == 3}
            <td><a href="/letter/{donorId}/{donation.id}">Letter</a></td>
          {/if}
        {/if}
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>

</style>
