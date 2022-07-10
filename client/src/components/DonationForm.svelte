<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let donationId;
  export let data = {};
  export let donorId = null;

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donation`;
  let buttonText = "Add Donation";
  let messageDisplay;

  /* Formatted fields */
  let statusDisplay = null;

  /* Set select/radio control state */
  let typeSelect = data.important && data.important == 1 ? "important" : "standard";
  $: data.important = typeSelect == "important" ? 1 : 0;

  const validateFormFields = () => {
    let isValid = false;
    // TODO: Custom validation for each data field. If fail, set field input red and add feedback.
    return true;
  }

  const formatFormFields = () => {
    statusDisplay = data.letter && data.letter == 1 ? "Pending" : "Complete";
  }

  const onSubmitForm = () => {
    if(validateFormFields()) {
      messageDisplay.displayMessage("Submitting");
      ajaxRequest(method, action, function(error, response, status) {
        if(error) {
          console.error("Error:", error);
          messageDisplay.displayMessage("Error");
        }
        else if(status != 200) {
          console.log("Response status: ", status);
          messageDisplay.displayMessage("Error");
        }
        else {
          messageDisplay.displayTimeoutMessage("New donation created");
        }
      }, data);
    }
  }

  const onViewDonorInfo = () => {
    if(donorId) {
      window.location.replace(`/donor/${donorId}`)
    }
  }

  const onClickLetter = () => {
    window.location.replace(`/letter/${donationId}`)
  }

  const init = () => {
    /* Display data for donation */
    if(donationId) {
      method = "put";
      action = `${$Configuration.donorApiDomain}/donation/${donationId}`;
      buttonText = "Update";
      formatFormFields();
    }
    /* New donation */
    else {
      data.letter = 1; // TODO: Add 'bypass letter' checkbox to new donation form, sets data.letter value. Just default to 1 now for new donations
    }
  }

  init();
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <div class="form-fields container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="dateOfGift">Date</label>
        <input type="text" class="form-control" id="dateOfGift" bind:value={data.dateOfGift}>
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts">Item Count</label>
        <input type="text" class="form-control" id="numberOfGifts" bind:value={data.numberOfGifts}>
      </div>
      <div class="col-md-3">
        {#if statusDisplay}
          <label for="status">Status</label>
          <input type="text" class="form-control" id="status" bind:value={statusDisplay}>
        {/if}
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-9">
        <label for="giftDescription">Description</label>
        <input type="text" class="form-control" id="giftDescription" bind:value={data.giftDescription}>
        <label for="giftDetails">Details</label>
        <input type="text" class="form-control" id="giftDetails" bind:value={data.giftDetails}>
      </div>
      <div class="col-md-3">
        <label class="form-check-label">Gift Type</label>
        <div class="form-check">
          <input class="form-check-input" type="radio" bind:group={typeSelect} value="standard" id="type-standard" checked={typeSelect=='standard'}>
          <label class="form-check-label" for="type-standard">
            Standard
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" bind:group={typeSelect} value="important" id="type-important" checked={typeSelect=='important'}>
          <label class="form-check-label" for="type-important">
            Important
          </label>
        </div>
      </div>
    </div>
  </div>

  <button class="btn btn-default" type="submit" on:click|preventDefault={onSubmitForm}>{buttonText}</button> <!-- TODO: on:click|preventDefault={onSubmitDonorForm} to add validation -->
  {#if donationId && donorId > 1}
    <button class="btn btn-default" type="button" on:click={onClickLetter}>Letter</button>
    <button class="btn btn-default" type="button" on:click={onViewDonorInfo}>View Donor Info</button>
  {/if}
</form>
<MessageDisplay bind:this={messageDisplay} />

<style>

</style>
