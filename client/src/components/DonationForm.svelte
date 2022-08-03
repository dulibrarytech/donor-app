<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import FormValidator from '../libs/FormValidator.js';
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let args;
  export let data={};

  console.log("Donation Form data:", data)

  let donorId = args.donorId;
  let donationId = args.donationId;
  let roleId = args.roleId || 1;

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donation`;
  let buttonText = "Add Donation";
  let buttonDisabled = false;
  let messageDisplay;
  let typeSelect;

  /* Formatted fields: default values */
  let statusDisplay = null;

  /* Toggle visibility of controls */
  let displayGiftTypeSelect = true;

  let validationRules = {
    dateOfGift: {
      required: true,
      maxlength: 10,
      pattern: /[0-9]{4}-[0-9]{2}-[0-9]{2}/,
      patternFormat: "yyyy-mm-dd"
    },
    numberOfGifts: {
      required: true,
      maxlength: 10
    },
    giftDescription: {
      required: true,
      maxlength: 255
    }
  }
  let formValidator = new FormValidator('donation-form', validationRules, "#ced4da");

  const formatFormFields = () => {
    /* Convert status to text */
    statusDisplay = data.letter && data.letter == 1 ? "Pending" : "Complete";

    /* Format to yyyy-mm-dd. Formatted value should be submitted with the form. */
    data.dateOfGift = data.dateOfGift.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0];
  }

  const onSubmitForm = () => {
    $: data.important = typeSelect == "important" ? 1 : 0;

    if(formValidator.validate(data)) {
      messageDisplay.displayMessage("Submitting data...");
      ajaxRequest(method, action, function(error, response, status) {
        if(error) {
          messageDisplay.displayMessage("Error", `Ajax error: ${error}`);
        }
        else if(status != 200) {
          messageDisplay.displayMessage("Error", `Response status: ${status}`);
        }
        else {
          let message = method == "post" ? "New donation created" : "Donation record updated";
          messageDisplay.displayTimeoutMessage(message);
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
    window.location.replace(`/letter/${donorId}/${donationId}`)
  }

  const onChangeFormValue = (event) => {
    buttonDisabled = false;
  }

  const init = () => {
    donorId = data.donorId || data.id || null;
    if(donorId) data['donorId'] = donorId;

    /* Set select/radio control state */
    typeSelect = data.important && data.important == 1 ? "important" : "standard";

    /* Display data for donation */
    if(donationId) {
      method = "put";
      action = `${$Configuration.donorApiDomain}/donation/${donationId}`;
      buttonText = "Update";
      buttonDisabled = true;
      formatFormFields();
    }
    /* New donation */
    else {
      /* Set letter flag on all new donations, except for anonymous donations */
      data.letter = donorId == 1 ? 0 : 1;
    }

    /* Anonymous donation: hide the 'Status' and 'Gift Type' fields */
    if(donorId == 1) {
      statusDisplay = false;
      displayGiftTypeSelect = false;
    }
  }

  init();
</script>

<form id="donation-form" class="form" method="{method}" action="{action}">
  <div class="form-fields container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="dateOfGift">Date</label>
        <input type="text" class="form-control" id="dateOfGift" bind:value={data.dateOfGift} on:input={onChangeFormValue}>
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts">Item Count</label>
        <input type="text" class="form-control" id="numberOfGifts" bind:value={data.numberOfGifts} on:input={onChangeFormValue}>
      </div>
      <div class="col-md-3">
        {#if statusDisplay}
          <label for="status">Status</label>
          <input type="text" class="form-control" id="status" bind:value={statusDisplay} on:input={onChangeFormValue}>
        {/if}
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-9">
        <label for="giftDescription">Description</label>
        <textarea class="form-control" id="giftDescription" bind:value={data.giftDescription} on:input={onChangeFormValue}></textarea>
        <label for="giftDetails">Details</label>
        <textarea class="form-control" id="giftDetails" bind:value={data.giftDetails} on:input={onChangeFormValue}></textarea>
      </div>
      <div class="col-md-3">
        {#if displayGiftTypeSelect}
          <label class="form-check-label">Gift Type</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" bind:group={typeSelect} value="standard" id="type-standard" checked={typeSelect=='standard'} on:change={onChangeFormValue}>
            <label class="form-check-label" for="type-standard">
              Standard
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" bind:group={typeSelect} value="important" id="type-important" checked={typeSelect=='important'} on:change={onChangeFormValue}>
            <label class="form-check-label" for="type-important">
              Important
            </label>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <button class="btn btn-default" type="submit" on:click|preventDefault={onSubmitForm} disabled={buttonDisabled}>{buttonText}</button>
    {#if donationId && donorId > 1}
      {#if roleId == 2 || roleId == 3}
        <button class="btn btn-default" type="button" on:click={onClickLetter}>Letter</button>
      {/if}
      <button class="btn btn-default" type="button" on:click={onViewDonorInfo}>View Donor Info</button>
    {/if}
</form>
<MessageDisplay bind:this={messageDisplay} />

<style>
  input#dateOfGift {
    max-width: 130px;
  }

  input#numberOfGifts {
    max-width: 130px;
  }

  textarea {
    max-width: 75%;
    height: 120px;
  }
</style>
