<script>
'use-strict'

import {Configuration} from '../config';
import {ajaxRequest} from '../libs/ajax.js';
import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';
import MessageDisplay from "../components/MessageDisplay.svelte";
import { DateInput } from '../libs/date-picker-svelte';
import { getIsoDateString } from '../libs/dateFormatter.js';

export let args;
export let data={};

const dispatch = createEventDispatcher();

var isAnonymousDonation;
var isDataDisplayForm;
var isAdminUser;
var isAnonymousDonor
let donorId = args.donorId || null;
let donationId = args.donationId || null;
let roleId = args.roleId || 1;

let method;
let action;
let buttonText;
let buttonDisabled;
let validationLabelDisplay = "inline";
let messageDisplay;
let typeSelect;
let bypassSelect;
let deleteButtonText = "Delete";
let confirmDelete = false;
let dateDisplay = null;
let statusDisplay = null;

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
  /* Set donor id */
  donorId = data.donorId || data.id || null;
  if(donorId) data['donorId'] = donorId;

  /* Set flags */
  isAnonymousDonation = donorId == 1;
  isDataDisplayForm = donationId != null;
  isAdminUser = roleId == 2;
  isAnonymousDonor = donorId != null && donorId == 1;

  /* Set form displays */
  typeSelect = data.important && data.important == 1 ? "important" : "standard";
  bypassSelect = data.bypassLetter || false;

  /* If there is an active donation, use the 'PUT' configuration (update donation form). Format field data */
  if(isDataDisplayForm) {
    method = "put";
    action = `${$Configuration.donorApiDomain}/donation/${donationId}`;
    buttonText = "Update";
    buttonDisabled = true;
    statusDisplay = formatStatusField(data);
    dateDisplay = new Date(data.dateOfGift);
  }

  /* If there is no active donation, use the default 'POST' configuration (new donation form) */
  else {
    method = "post";
    action = `${$Configuration.donorApiDomain}/donation`;
    buttonText = "Add Donation";
    buttonDisabled = false;
    dateDisplay = null;

    /* New donations have 'pending letter' state by default */
    data.letter = donorId == 1 ? 0 : 1;
  }
}

const formatStatusField = (data) => {
  let status;
  if(data.bypassLetter == 1) status = "Letter Bypassed";
  else if(data.letter == 1) status = "Pending Letter";
  else status = "Complete";
  return status;
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
  bypassSelect = false;
  dateDisplay = null;
}

const onSubmitForm = () => {
  data.important = typeSelect == "important" ? 1 : 0;
  data.bypassLetter = bypassSelect ? 1 : 0;
  data.dateOfGift = getIsoDateString(dateDisplay);

  if(formValidator.validate(data)) {
    messageDisplay.displayMessage("Submitting data...");
    ajaxRequest(method, action, async function(error, response, status) {
      if(error) {
        messageDisplay.displayMessage("Error", `Ajax error: ${error}`);
      }
      else if(status != 200) {
        messageDisplay.displayMessage("Error", `Response status: ${status}`);
      }
      else {
        response = await response.json()
        let notificationMessageFeedback = "";
        if(response.emailSent == true) notificationMessageFeedback = "Notification emails sent."
        if(response.message) console.log(response.message)
        let message = method == "post" ? `New donation created. ${notificationMessageFeedback}` : "Donation record updated";

        messageDisplay.displayMessage(message);
        setTimeout(() => {
          messageDisplay.displayMessage("");
          if(method == 'post') reset();
          else if(method == 'put') location.reload();
        }, 3000)
      }
    }, data);
  }
  else messageDisplay.displayTimeoutMessage("Form has validation errors");
}

const onViewDonorInfo = () => {
  if(donorId) {
    window.location.replace(`${$Configuration.basePath}/donor/${donorId}`)
  }
}

const onClickLetter = () => {
  window.location.replace(`${$Configuration.basePath}/letter/${donorId}/${donationId}`)
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
        <DateInput id="dateOfGift" format="yyyy-MM-dd" placeholder="" bind:value={dateDisplay} on:focus-out={onChangeFormValue}/>
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts">Item Count<span style="display:{validationLabelDisplay}">(Required)</span></label>
        <input type="text" class="form-control" id="numberOfGifts" bind:value={data.numberOfGifts} on:input={onChangeFormValue}>
      </div>
      <div class="col-md-3">
        {#if !isAnonymousDonor}
          {#if isDataDisplayForm}
            <label for="status">Status</label>
            <input type="text" class="form-control" id="status" style="pointer-events: none" bind:value={statusDisplay} on:input={onChangeFormValue}>
          {/if}
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
        {#if !isAnonymousDonation}
          <div class="form-control-set">
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
          </div>

          <div class="form-control-set">
            <label>
              <input type="checkbox" bind:checked={bypassSelect} on:input={onChangeFormValue}>
              Bypass Letter
            </label>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <button class="btn btn-default" type="submit" on:click|preventDefault={onSubmitForm} disabled={buttonDisabled}>{buttonText}</button>
  {#if isDataDisplayForm}
    {#if !isAnonymousDonor}
      {#if isAdminUser}
        <button class="btn btn-default" type="button" on:click={onClickLetter}>Letter</button>
      {/if}
      <button class="btn btn-default" type="button" on:click={onViewDonorInfo}>View Donor Info</button>
    {/if}
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

  .form-control-set:not(:first-child) {
    margin-top: 30px;
  }
</style>
