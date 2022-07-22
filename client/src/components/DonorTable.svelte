<script>
  export let items;
</script>

<thead>
  <tr>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <!-- <th scope="col">Organization</th> -->
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donor (donor.id)}
      {#if donor.id > 1} <!-- donor id 1 is reserved for anonymous donations -->
        <tr>
          <td>{donor.lastName.length > 1 ? donor.lastName : donor.organization}</td>
          <td>{donor.firstName}</td>
          <!-- <td>{donor.organization ?? ""}</td> -->
          <td><a href="/donor/{donor.id}">View</a></td>
          <td><a href="/donation/donor/{donor.id}">Add Gift</a></td>
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
