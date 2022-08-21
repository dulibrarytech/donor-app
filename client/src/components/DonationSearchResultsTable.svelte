<script>
  export let items;
  export let args;

  let searchFieldLabel;
  let searchField;

  $: switch (args.searchField) {
    case "giftDescription":
      searchFieldLabel = "Description";
      break;
    case "giftDetails":
      searchFieldLabel = "Details";
      break;
    default:
      searchFieldLabel = "";
  }

  $: searchField = args.searchField;
</script>

<thead>
  <tr>
    <th scope="col">Date of Donation</th>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <th scope="col">{searchFieldLabel}</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td width="15%">{donation.dateOfGift?.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/) ?? "No date"}</td>
        <td width="15%">{donation.organization || donation.lastName || ""}</td>
        <td width="15%">{donation.firstName || ""}</td>
        <td width="25%">{donation[searchField]}</td>
        <td width="15%">{#if donation.donorId > 1}<a href="/donor/{donation.donorId}">View Donor</a>{/if}</td>
        <td width="15%"><a href="/donation/{donation.id}">View Donation</a></td>
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>

</style>
