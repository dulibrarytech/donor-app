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
let letterType;
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
  if(data.bypassLetter == 1) letterType = "bypass";
  else letterType = data.important && data.important == 1 ? "important" : "standard";

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
  letterType = "standard";
  dateDisplay = null;
}

const onSubmitForm = () => {
  data.important = letterType == "important" ? 1 : 0;
  data.bypassLetter = letterType == "bypass" ? 1 : 0;
  data.dateOfGift = dateDisplay ? getIsoDateString(dateDisplay) : "";

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

        let emailStatusMessage = "";
        if(response.emailStatus == 1) emailStatusMessage = "Notification emails sent";
        else if(response.emailStatus == 2) emailStatusMessage = "Error sending email notifications";

        if(response.message) console.log(response.message)
        let message = method == "post" ? `New donation created. ${emailStatusMessage}` : "Donation record updated";
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

const onDatepickerTabKey = (event) => {
  if(event.detail.shift) {} // TODO: Tab to previous action element, or swap date and item count
  else document.getElementById('numberOfGifts').focus();
}

init();
</script>

<form id="donation-form" class="form" method="{method}" action="{action}">
  <div class="required">Required field</div>
  <div class="form-fields container">
    <div class="form-input-section row">
      <div class="col-md-3">
        <label for="dateOfGift" class="required input-label">Date<span style="display:{validationLabelDisplay}">(e.g. yyyy-mm-dd)</span></label>
        <DateInput id="dateOfGift" format="yyyy-MM-dd" placeholder="" min={new Date("1970-01-01")} bind:value={dateDisplay} on:focus-out={onChangeFormValue} on:tab={onDatepickerTabKey} />
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts" class="required input-label">Item Count</label>
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
    <div class="form-input-section row">
      <div class="col-md-9">
        <label for="giftDescription" class="required input-label">Description</label>
        <textarea class="form-control" id="giftDescription" bind:value={data.giftDescription} on:input={onChangeFormValue}></textarea>
        <label for="giftDetails" class="input-label">Details</label>
        <textarea class="form-control" id="giftDetails" bind:value={data.giftDetails} on:input={onChangeFormValue}></textarea>
      </div>
      <div class="col-md-3">
        {#if !isAnonymousDonation}
          <p class="form-check-label">Letter Type</p>
          <div class="form-control-group">
            <div class="form-check">
              <input class="form-check-input" type="radio" bind:group={letterType} value="standard" id="type-standard" checked={letterType=='standard'} on:change={onChangeFormValue}>
              <label class="form-check-label" for="type-standard">
                Standard Letter
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" bind:group={letterType} value="important" id="type-important" checked={letterType=='important'} on:change={onChangeFormValue}>
              <label class="form-check-label" for="type-important">
                Hand-Typed Letter
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" bind:group={letterType} value="bypass" id="type-bypass]" checked={letterType=='bypass'} on:change={onChangeFormValue}>
              <label class="form-check-label" for="type-bypass">
                No Action Required
              </label>
            </div>
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
  input#numberOfGifts {
    max-width: 130px;
  }

  textarea {
    max-width: 75%;
    height: 120px;
  }

  p.form-check-label {
    margin-bottom: 5px;
  }

  :global(input#dateOfGift) {
    height: 38px;
  }
</style>
