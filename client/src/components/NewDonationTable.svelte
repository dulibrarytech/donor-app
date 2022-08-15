<script>
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  var statusUpdate = "";
  var enableCompleteAction = true;

  const formatGiftTypeField = (value=false) => {
    return value == true ? "Important" : "Standard";
  }

  const formatStatusField = (value=false) => {
    return value == true ? "Pending letter" : "Complete";
  }

  const onClickComplete = (donationId) => {
    if(enableCompleteAction) {
      enableCompleteAction = false;
      statusUpdate = donationId;
      dispatch('message', {data: donationId ?? null, eventName: "complete-action"});
    }
  }
</script>

<thead>
  <tr>
    <th scope="col">Date of Gift</th>
    <th scope="col">Last Name/Organization</th>
    <th scope="col">First Name</th>
    <th scope="col">Gift Type</th>
    <th scope="col">Status</th>
    <th scope="col"></th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td>{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>

        <td>{donation.lastName || donation.organization || ""}</td>
        <td>{donation.firstName || ""}</td>

        <td>{formatGiftTypeField(donation.important) || "Unknown"}</td>

        <td>{#if statusUpdate == donation.id}Updating...{:else}{formatStatusField(donation.letter) || "Unknown"}{/if}</td>

        <td><a href="/donation/{donation.id}">View Gift</a></td>

        <td><a href="/donor/{donation.donorId}">View Donor</a></td>

        <td><a href="#" on:click|preventDefault={(event) => onClickComplete(donation.id)} value={donation.id}>Complete</a></td>
      </tr>
    {/each}
  {:else}
    <h6>No new donations.</h6>
  {/if}
</tbody>

<style>

</style>
