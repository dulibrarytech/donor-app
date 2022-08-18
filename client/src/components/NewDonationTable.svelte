<script>
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  const roleId = args.roleId;
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
    <th scope="col">Date of Donation</th>
    <th scope="col">Last Name</th>
    <th scope="col">Organization</th>
    <th scope="col">Donation Type</th>
    <th scope="col">Status</th>
    <th scope="col"></th><!-- View Donation -->
    {#if roleId == 2}<th scope="col"></th>{/if}<!-- Letter -->
    <th scope="col"></th><!-- Mark as Complete -->
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td width="10%">{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>

        <td width="17.5%">{donation.lastName || ""}</td>
        <td width="17.5%">{donation.organization || ""}</td>

        <td width="10%">{formatGiftTypeField(donation.important) || "Unknown"}</td>

        <td width="10%">{#if statusUpdate == donation.id}Updating...{:else}{formatStatusField(donation.letter) || "Unknown"}{/if}</td>

        <td width="10%"><a href="/donation/{donation.id}">View Donation</a></td>

        {#if roleId == 2}<td width="10%" style="text-align: center"><a href="/letter/{donation.donorId}/{donation.id}">Letter</a></td>{/if}

        <td width="15%"><a href="#" on:click|preventDefault={(event) => onClickComplete(donation.id)} value={donation.id}>Mark as Complete</a></td>
      </tr>
    {/each}
  {:else}
    <h6>No new donations.</h6>
  {/if}
</tbody>

<style>

</style>
