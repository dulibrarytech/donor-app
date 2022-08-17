<script>
  export let items;
</script>

<thead class="header">
  <tr>
    <th scope="col">Last Name</th>
    <th scope="col">Organization</th>
    <th scope="col">First Name</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donor (donor.id)}
      {#if donor.id > 1} <!-- donor id 1 is reserved for anonymous donations -->
        <tr>
          <td width="20%">{donor.lastName}</td>
          <td width="30%">{donor.organization}</td>
          <td width="25%">{donor.firstName}</td>
          <td width="12.5%"><a href="/donor/{donor.id}">View</a></td>
          <td width="12.5%"><a href="/donation/donor/{donor.id}">Add Gift</a></td>
        </tr>
      {/if}
    {/each}
  {:else}
    <h6>No donors found.</h6> <!-- TODO: Abstract this in DataDisplay -->
  {/if}

</tbody>

<style>
 /* Column widths, and any other styles specific to the donor table */
</style>
