<script>
'use-strict'

import {Configuration} from '../config';
import {ajaxRequest} from '../libs/ajax.js';
import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';
import MessageDisplay from "../components/MessageDisplay.svelte";

export let args;
export let data={};

const dispatch = createEventDispatcher();

var isAnonymousDonation;

let donorId = args.donorId;
let donationId = args.donationId;
let roleId = args.roleId || 1;

let method;
let action;
let buttonText;
let buttonDisabled;
let validationLabelDisplay = "inline";
let messageDisplay;
let typeSelect;
let deleteButtonText = "Delete";
let confirmDelete = false;

/* Formatted fields: default values */
let dateDisplay = null;
let statusDisplay = null;

/* Toggle visibility of controls */
let displayGiftTypeSelect = true;

let validationRules = {
  dateOfGift: {
    name: "dateOfGift",
    required: true,
    maxlength: 10,
    pattern: /[0-9]{4}-[0-9]{2}-[0-9]{2}/,
    patternFormat: "yyyy-mm-dd"
  },
  numberOfGifts: {
    name: "numberOfGifts",
    required: true,
    maxlength: 10
  },
  giftDescription: {
    name: "giftDescription",
    required: true,
    maxlength: 255
  }
}
let formValidator = new FormValidator('donation-form', validationRules, "#ced4da");

const init = () => {
  donorId = data.donorId || data.id || null;
  //if(donorId) data['donorId'] = donorId;

  isAnonymousDonation = donorId == 1;

  /* Set select/radio control state */
  typeSelect = data.important && data.important == 1 ? "important" : "standard";

  statusDisplay = formatStatusField(data);

  dateDisplay = formatDateField(data);

  /* If there is an active donation, use the 'PUT' configuration (update donation form) */
  if(donationId) {
    method = "put";
    action = `${$Configuration.donorApiDomain}/donation/${donationId}`;
    buttonText = "Update";
    buttonDisabled = true;
    // formatFormFields();
    //formatStatusField();
  }
  /* If there is no active donation, use the default 'POST' configuration (new donation form) */
  else {
    method = "post";
    action = `${$Configuration.donorApiDomain}/donation`;
    buttonText = "Add Donation";
    buttonDisabled = false;

    /* New donations have 'pending letter' state by default */
    data.letter = donorId == 1 ? 0 : 1;
  }

  /* If anonymous donation hide the 'Status' and 'Gift Type' fields */
  if(isAnonymousDonation) {
    statusDisplay = false;
    displayGiftTypeSelect = false;
  }
}

// const formatFormFields = () => {
//   /* Convert status to text */
//   statusDisplay = data.letter && data.letter == 1 ? "Pending Letter" : "Complete";
//
//   /* Format to yyyy-mm-dd. Formatted value should be submitted with the form. */
//   data.dateOfGift = data.dateOfGift ? data.dateOfGift.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] : "No date";
// }

const formatStatusField = (data) => {
  let status;
  if(data.bypassLetter == 1) status = "Letter Bypassed";
  else if(data.letter == 1) status = "Pending Letter";
  else status = "Complete";
  return status;
  //statusDisplay = status;
}

const formatDateField = (data) => {
  return data.dateOfGift ? data.dateOfGift.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] : "No date";
}

const showValidationLabels = (isVisible) => {
  validationLabelDisplay = isVisible ? "inline" : "none";
}

const reset = () => {
  data = {...data, ...{dateOfGift: "", numberOfGifts: "", giftDescription: "", giftDetails: "", important: 0}};
  typeSelect = "standard";
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
        let message = method == "post" ? "New donation created. Notification email sent." : "Donation record updated";
        messageDisplay.displayTimeoutMessage(message);
        if(method == 'post') reset();
      }
    }, data);
  }
  else messageDisplay.displayTimeoutMessage("Form has validation errors");
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

const onDeleteDonation = () => {
  if(confirmDelete) deleteDonation();
  else {
    deleteButtonText = "Click to Confirm";
    confirmDelete = true;
    setTimeout(() => {
      deleteButtonText = "Delete";
      confirmDelete = false;
    }, 3000);
  }
}

const deleteDonation = () => {
  deleteButtonText = "Delete";
  confirmDelete = false;
  messageDisplay.displayMessage("Deleting record...");
  dispatch('delete-donation', donationId);
}

init();
</script>

<form id="donation-form" class="form" method="{method}" action="{action}">
  <div class="form-fields container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="dateOfGift">Date<span style="display:{validationLabelDisplay}">(Required yyyy-mm-dd)</span></label>
        <input type="text" class="form-control" id="dateOfGift" bind:value={dateDisplay} on:input={onChangeFormValue}>
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts">Item Count<span style="display:{validationLabelDisplay}">(Required)</span></label>
        <input type="text" class="form-control" id="numberOfGifts" bind:value={data.numberOfGifts} on:input={onChangeFormValue}>
      </div>
      <div class="col-md-3">
        {#if statusDisplay}
          <label for="status">Status</label>
          <input type="text" class="form-control" id="status" style="pointer-events: none" bind:value={statusDisplay} on:input={onChangeFormValue}>
        {/if}
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-9">
        <label for="giftDescription">Description<span style="display:{validationLabelDisplay}">(Required)</span></label>
        <textarea class="form-control" id="giftDescription" bind:value={data.giftDescription} on:input={onChangeFormValue}></textarea>
        <label for="giftDetails">Details</label>
        <textarea class="form-control" id="giftDetails" bind:value={data.giftDetails} on:input={onChangeFormValue}></textarea>
      </div>
      <div class="col-md-3">
        {#if displayGiftTypeSelect}
          <label class="form-check-label">Donation Type</label>
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
    {#if roleId == 2}
      <button class="btn btn-default" type="button" on:click={onClickLetter}>Letter</button>
    {/if}
    <button class="btn btn-default" type="button" on:click={onViewDonorInfo}>View Donor Info</button>
    <button class="btn btn-default" type="button" on:click={onDeleteDonation}>{deleteButtonText}</button>
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
