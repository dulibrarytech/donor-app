<script>
  export let items;
  export let args;

  let searchFieldLabel;

  $: switch (args) {
    case "giftDescription":
      searchFieldLabel = "Description";
      break;
    case "giftDetails":
      searchFieldLabel = "Details";
      break;
    default:
      searchFieldLabel = "";
  }
</script>

<thead>
  <tr>
    <th scope="col">Date of Gift</th>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <th scope="col">{searchFieldLabel}</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation (donation.id)}
      <tr>
        <td>{donation.dateOfGift?.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/) ?? "No date"}</td>
        <td>{donation.organization || donation.lastName || ""}</td>
        <td>{donation.firstName || ""}</td>
        <td>{donation[args]}</td>
        <td>View Donor</td>
        <td>View Donation</td>
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>

</style>
