<script>
export let items;
let donors = items;
</script>

<table class="table">
  <thead>
    <tr>
      <th scope="col">Last Name/Organization</th>
      <th scope="col">First Name</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>

    <!-- Iterate donors, create a <tr> with <td> for each item -->
    {#each donors as donor (donor.id)}
      <tr>
        <td>{donor.lastName}</td>
        <td>{donor.firstName}</td>
        <td>View</td>
        <td>Add Gift</td>
      </tr>
    {/each}

  </tbody>
</table>

<style>
  tbody tr:nth-child(even) { background: #e5e3e1; }

  table thead {
    background-color: #e5e3e1;
  }
</style>
