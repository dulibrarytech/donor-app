<script>
  export let items;
  let donors = items;
</script>

<thead>
  <tr>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#each donors as donor (donor.id)}
    <tr>
      <td>{donor.lastName}</td>
      <td>{donor.firstName}</td>
      <td>View</td>
      <td>Add Gift</td>
    </tr>
  {/each}
</tbody>

<style>
 /* Column sizes, and styles specific to the donor table */
</style>
