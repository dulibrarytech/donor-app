<script>
  export let items;
  console.log("Init donor table")
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
        <td>View</td>
        <td>Add Gift</td>
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}

</tbody>

<style>
 /* Column widths, and any other styles specific to the donor table */
</style>
