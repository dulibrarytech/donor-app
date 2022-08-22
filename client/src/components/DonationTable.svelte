<script>
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  let donorId = args?.donorId || null;
  let roleId = args?.roleId;
  var completeActionStatusUpdate;
  var enableCompleteAction;

  const init = () => {
    completeActionStatusUpdate = "";
    enableCompleteAction = true;
  }

  const formatGiftTypeField = (value=false) => {
    return value == true ? "Important" : "Standard";
  }

  const formatStatusField = (value=false) => {
    return value == true ? "Pending letter" : "Complete";
  }

  const onClickComplete = (donationId) => {
    if(enableCompleteAction) {
      enableCompleteAction = false;
      completeActionStatusUpdate = donationId;
      setTimeout(() => {
        dispatch('message', {data: donationId ?? null, eventName: "complete-action"});
        init();
      }, 2000)
    }
  }

  init();
</script>

<thead class="header">
  <tr>
    <th scope="col">Date of Donation</th>
    {#if !donorId}
      <th scope="col">Last Name/Organization</th>
      <th scope="col">First Name</th>
    {/if}
    <th scope="col">Donation Type</th>
    <th scope="col">Status</th>
    <th scope="col">Description</th>
    <th scope="col"></th>
    {#if donorId && roleId == 2}
      <th scope="col"></th>
    {/if}
    {#if donorId && (roleId == 2 || roleId == 3)}
      <th scope="col"></th>
    {/if}
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td width="12.5%">{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>
        {#if !donorId}
          <td width="20%">{donation.lastName || donation.organization || ""}</td>
          <td width="10%">{donation.firstName || ""}</td>
        {/if}
        {#if donation.donorId != 1}
          <td width="12.5%">{formatGiftTypeField(donation.important) || "Unknown"}</td>
        {:else}
          <td width="12.5%">n/a</td>
        {/if}
        {#if donation.donorId != 1}
          <td width="12.5%">{#if completeActionStatusUpdate == donation.id}Updating...{:else}{formatStatusField(donation.letter) || "Unknown"}{/if}</td>
        {:else}
          <td width="12.5%">n/a</td>
        {/if}
        <td width="20%">{donation.giftDescription}</td>
        <td width="10%"><a href="/donation/{donation.id}">View</a></td>
        {#if donorId && roleId == 2}
          <td  width="10%"><a href="/letter/{donorId}/{donation.id}">Letter</a></td>
        {/if}
        {#if donorId && (donation.letter == 1) && (roleId == 2 || roleId == 3)}
          <td width="10%"><a href="#" on:click|preventDefault={(event) => onClickComplete(donation.id)} value={donation.id}>Mark as Complete</a></td>
        {/if}
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>
td.link {
  max-width: 15%;
}
</style>
