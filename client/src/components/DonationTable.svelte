<script>
  import { Configuration } from '../config';
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  let donorId = args?.donorId || null;
  let roleId = args?.roleId;

  var completeActionStatusUpdate;
  var enableCompleteAction;
  var isDonorPage;
  var isAdminUser;
  var isExtRelUser;

  const init = () => {
    completeActionStatusUpdate = false;
    enableCompleteAction = true;
    isDonorPage = donorId ? true : false;
    isAdminUser = roleId == 2;
    isExtRelUser = roleId == 3;
  }

  const formatGiftTypeField = (donation) => {
    return donation.important == 1 ? "Important" : "Standard";
  }

  const formatStatusField = (donation) => {
    let status;
    if(donation.bypassLetter == 1) status = "Letter Bypassed";
    else if(donation.letter == 1) status = "Pending Letter";
    else status = "Complete";
    return status;
  }

  const isAnonymousDonation = (donation) => {
    return donation.donorId == 1;
  }

  const isPendingLetter = (donation) => {
    return (donation.letter == 1) && (isAdminUser && isImportantGift(donation) == false || isExtRelUser && isImportantGift(donation) == true)
  }

  const isImportantGift = (donation) => {
    return donation.important == 1;
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
    {#if !isDonorPage}
      <th scope="col">Last Name/Organization</th>
      <th scope="col">First Name</th>
    {/if}
    <th scope="col">Donation Type</th>
    <th scope="col">Status</th>
    <th scope="col">Description</th>
    <th scope="col"></th><!-- View link -->
    {#if isAdminUser}
      <th scope="col"></th><!-- Letter link -->
    {/if}
    {#if isDonorPage && (isAdminUser || isExtRelUser)}
      <th scope="col"></th><!-- Mark As Complete link -->
    {/if}
  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <!-- Date of Donation -->
        <td width="12.5%">{donation.dateOfGift?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) ?? "No date"}</td>

        {#if !isDonorPage}
          <!-- Last Name/Organization -->
          <td width="20%">{donation.lastName || donation.organization || ""}</td>

          <!-- First Name -->
          <td width="10%">{donation.firstName || ""}</td>
        {/if}

        <!-- Donation Type -->
        {#if !isAnonymousDonation(donation)}
          <td width="12.5%">{formatGiftTypeField(donation) || "Unknown"}</td>
        {:else}
          <td width="12.5%">n/a</td>
        {/if}

        <!-- Status -->
        {#if !isAnonymousDonation(donation)}
          <td width="12.5%">{#if completeActionStatusUpdate == donation.id}Updating...{:else}{formatStatusField(donation) || "Unknown"}{/if}</td>
        {:else}
          <td width="12.5%">n/a</td>
        {/if}

        <!-- Description -->
        <td width="20%">{donation.giftDescription}</td>

        <!-- View link -->
        <td width="10%"><a href="{$Configuration.basePath}/donation/{donation.id}">View</a></td>

        <!-- Letter link -->
        {#if isAdminUser}
          <td width="10%">{#if donation.donorId != 1}<a href="{$Configuration.basePath}/letter/{donorId}/{donation.id}">Letter</a>{/if}</td>
        {/if}

        <!-- Mark as Complete link -->
        {#if isDonorPage && (isAdminUser || isExtRelUser)}
          {#if isPendingLetter(donation)}
            <td width="10%"><a href="/" on:click|preventDefault={(event) => onClickComplete(donation.id)} value={donation.id}>Mark as Complete</a></td>
          {:else}
            <td></td>
          {/if}
        {/if}
      </tr>
    {/each}
  {/if}
</tbody>

<style>

</style>
