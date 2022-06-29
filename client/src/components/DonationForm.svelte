<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';

  export let data = {
    donorId: null,
    dateOfGift: "",
    numberOfGifts: "",
    important: 0,
    letter: 0,
    giftDescription: "",
    giftDetails: ""
  };
  export let donationId;

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donation`;
  let buttonText = "Add Donation";
  let statusDisplay = null;

  // Form select controls
  let typeSelect = data.important && data.important == 1 ? "important" : "standard";
  $: data.important = typeSelect == "important" ? 1 : 0;

  if(donationId) {
    method = "put";
    action = `${$Configuration.donorApiDomain}/donation/${donationId}`;
    buttonText = "Update";
    statusDisplay = data.letter && data.letter == 1 ? "Pending" : "Complete";
  }

  const validateFormFields = (data) => {
    let isValid = false;
    // TODO: Custom validation for each data field. If fail, set field input red and add feedback.
    return true;
  }

  const onSubmitForm = () => {
    if(validateFormFields()) {
      let message = "Submitting...";
      ajaxRequest(method, action, function(error, response, status) {
        if(error) {
          console.error("Error:", error);
          message = "Error";
        }
        else if(status != 200) {
          console.log("Response status: ", status);
          message = "Error";
        }
        else {
          message = "New donation created";
        }

        // TODO: Initiate feedback (message)
      }, data);
    }
  }
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

  <button class="btn btn-default" type="submit" on:click|preventDefault={onSubmitForm}>{buttonText}</button> <!-- on:click|preventDefault={onSubmitDonorForm} to add validation -->
  {#if donationId}
    <button class="btn btn-default" type="button">Letter</button>
    <button class="btn btn-default" type="button">View Donor Info</button>
  {/if}
</form>

<style>

</style>
