<script>
  export let items;
</script>

<thead>
  <tr>
    <th scope="col">Last Name</th>
    <th scope="col">First Name</th>
    <th scope="col">Organization</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donor (donor.id)}
      <tr>
        <td>{donor.lastName}</td>
        <td>{donor.firstName}</td>
        <td>{donor.organization ?? ""}</td>
        <td><a href="/donor/{donor.id}">View</a></td>
        <td><a href="/donation/donor/{donor.id}">Add Gift</a></td>
      </tr>
    {/each}
  {:else}
    <h6>No donors found.</h6> <!-- TODO: Abstract this in DataDisplay -->
  {/if}

</tbody>

<style>
 /* Column widths, and any other styles specific to the donor table */
</style>
