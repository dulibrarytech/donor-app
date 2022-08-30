<script>
  import { Configuration } from '../config';
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  const roleId = args.roleId;
  var completeActionStatusUpdate;
  var enableCompleteAction;
  var isAdminUser;

  const init = () => {
    completeActionStatusUpdate = false;
    enableCompleteAction = true;
    isAdminUser = roleId == 2;
  }

  const formatGiftTypeField = (donation) => {
    return donation.important == 1 ? "Important" : "Standard";
  }

  const formatStatusField = (donation) => {
    return donation.letter == 1 ? "Pending Letter" : "Complete";
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

<thead>
  <tr>
    <th scope="col">Date of Record</th>
    <th scope="col">Date of Donation</th>
    <th scope="col">Last Name / Organization</th>
    <th scope="col">Donation Type</th>
    <th scope="col">Status</th>
    <th scope="col"></th><!-- View Donation -->
    {#if isAdminUser}<th scope="col"></th>{/if}<!-- Letter -->
    <th scope="col"></th><!-- Mark as Complete -->
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td width="10%">{donation.dateOfRecord?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>
        <td width="10%">{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>
        <td width="35%">{donation.lastName || donation.organization || ""}</td>
        <td width="10%">{formatGiftTypeField(donation) || "Unknown"}</td>
        <td width="10%">{#if completeActionStatusUpdate == donation.id}Updating...{:else}{formatStatusField(donation) || "Unknown"}{/if}</td>
        <td width="10%"><a href="{$Configuration.basePath}/donation/{donation.id}">View Donation</a></td>
        {#if isAdminUser}<td width="10%" style="text-align: center"><a href="{$Configuration.basePath}/letter/{donation.donorId}/{donation.id}">Letter</a></td>{/if}
        <td width="15%"><a href="#" on:click|preventDefault={(event) => onClickComplete(donation.id)} value={donation.id}>Mark as Complete</a></td>
      </tr>
    {/each}
  {:else}
    <h6>No new donations.</h6>
  {/if}
</tbody>

<style>

</style>
