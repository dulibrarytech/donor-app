<script>
  export let items;
</script>

<thead>
  <tr>
    <th scope="col">Date of Gift</th>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <th scope="col">Gift Type</th>
    <th scope="col">Status</th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#each items as donation (donation.id)}
    <tr>
      <td>{donation.dateOfGift}</td>
      <td>{donation.lastName}</td>
      <td>{donation.firstName}</td>
      <td>{donation.type}</td>
      <td>{donation.status}</td>
      <td>View</td>
    </tr>
  {/each}
</tbody>

<style>

</style>
