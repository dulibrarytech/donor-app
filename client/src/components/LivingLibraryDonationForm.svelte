<script>
/*
 * Living Library Donation and Donor Data Form
 *
 * If donation ID is present, the form will render as a data display form (all inputs are disabled)
 * If donation ID is null, the form will render as a data entry form
 */
'use strict'

import {createEventDispatcher} from 'svelte';
import LivingLibraryWhoToNotifyForm from "../components/LivingLibraryWhoToNotifyForm.svelte";
import FormValidator from '../libs/FormValidator.js';

export let args;
export let data;
export let fieldData;

const dispatch = createEventDispatcher();

const donationId = args.donationId ?? null;
var whoToNotifyForm;
var formState;
var inputPointerEvents;
var validationLabelDisplay;

let donorData = data.donor;
let recipientData = data.recipient;
let whoToNotifyData = data.who_to_notify;
let bookData = data.book;
let status;

if(!donorData) {
  donorData = {
    donor_title: "",
    donor_first_name: "",
    donor_last_name: "",
    donor_address: "",
    donor_city: "",
    donor_state: "",
    donor_zip: "",
    donor_amount_of_donation: "",
    donor_date_of_donation: "",
    donor_notes: "",
    donor_subject_areas: []
  }
}

if(!recipientData) {
  recipientData = {
    recipient_title: "",
    recipient_first_name: "",
    recipient_last_name: "",
    recipient_donation_type: ""
  }
}

if(!whoToNotifyData) {
  whoToNotifyData = [
    {
      notify_title: "",
      notify_first_name: "",
      notify_last_name: "",
      notify_address: "",
      notify_city: "",
      notify_state: "",
      notify_zip: "",
      notify_relation_to_donor: ""
    }
  ]
}

var validationRules = {
  donor_first_name: {
    name: "donor_first_name",
    required: true,
    maxlength: 30
  },
  donor_last_name: {
    name: "donor_last_name",
    required: true,
    maxlength: 30
  },
  donor_address: {
    name: "donor_address",
    required: true,
    maxlength: 70
  },
  donor_city: {
    name: "donor_city",
    required: true,
    maxlength: 70
  },
  donor_state: {
    name: "donor_state",
    required: true,
    maxlength: 20
  },
  donor_zip: {
    name: "donor_zip",
    required: true,
    maxlength: 11,
    pattern: /^([0-9]{2,5})(-[0-9]{1,5})*$/,
    patternFormat: "12345 or 12345-6789 (second part can have 1-5 digits)"
  },
  donor_amount_of_donation: {
    name: "donor_amount_of_donation",
    required: true,
    maxlength: 10,
    pattern: /^([0-9]+)\.[0-9]{2}$/,
    patternFormat: "1000.00"
  },
  donor_date_of_donation: {
    name: "donor_date_of_donation",
    required: true,
    maxlength: 10,
    pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    patternFormat: "yyyy-mm-dd"
  },
  recipient_first_name: {
    name: "recipient_first_name",
    required: true,
    maxlength: 30
  },
  recipient_last_name: {
    name: "recipient_last_name",
    required: true,
    maxlength: 30
  }
};

const init = () => {
  formState = donationId ? "data_display" : "data_entry";
  $: status = data.is_completed ? "Completed" : "Queued";

  if(formState == "data_display") {
    toggleInputEnabled(false);
    validationLabelDisplay = "none";
  }
  else {
    toggleInputEnabled(true);
    validationLabelDisplay = "inline";
  }
}

const addPersonToNotify = () => {
  var len = whoToNotifyData.length;
  whoToNotifyData[len] = {
    notify_title: "",
    notify_first_name: "",
    notify_last_name: "",
    notify_address: "",
    notify_city: "",
    notify_state: "",
    notify_zip: "",
    notify_relation_to_donor: ""
  }
}

const toggleInputEnabled = (isEnabled) => {
  inputPointerEvents = isEnabled ? "all" : "none";
}

const onSubmit = () => {
  let donationFormValidator = new FormValidator('living-library-donation-form', validationRules, "#ced4da");
  let donationFormValid = donationFormValidator.validate({...donorData, ...recipientData});

  let whoToNotifyRules = whoToNotifyForm.getValidationRules();
  let whoToNotifyFormValidator = new FormValidator('living-library-donation-who-to-notify-form', whoToNotifyRules, "#ced4da");
  let whoToNotifyFormValid = true;
  for(let data of whoToNotifyData) {
    if(whoToNotifyFormValidator.validate(data) == false) {
      whoToNotifyFormValid = false;
    };
  }

  if(donationFormValid && whoToNotifyFormValid) {
    dispatch('form-submit', {
      donor: donorData,
      who_to_notify: whoToNotifyData,
      recipient: recipientData
    });
  }
}

init();
</script>

<form id="living-library-donation-form">
  {#if formState == "data_display"}
    <label for="statusDisplay">Status:</label>
    <input type="text" id="statusDisplay" value={status}/>
  {/if}

  <h5>Person Making Donation</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="donor_title">Title</label>
      {#if formState == "data_display" }
        <input type="text" id="donor_title" bind:value="{donorData.donor_title}" style="pointer-events:{inputPointerEvents}" tabindex="1"/>
      {:else}
        <select class="form-select" id="donor_title" bind:value={donorData.donor_title} style="pointer-events:{inputPointerEvents}" tabindex="1">
          <option value="" selected disabled hidden>{#if fieldData.titles.length == 0}Error retrieving data{:else}-- Select a title --{/if}</option>
          {#each fieldData.titles as title}
            <option value="{title.term}" selected={donationId && donorData?.donor_title == title.term}>{title.term}</option>
          {/each}
        </select>
      {/if}

      <label for="donor_address">Address<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="donor_address" bind:value={donorData.donor_address} style="pointer-events:{inputPointerEvents}" tabindex="4"/>

      <label for="donor_zip">Zip Code<span style="display:{validationLabelDisplay}">(Required e.g. 80210 or 80210-4711)</span></label>
      <input type="text" id="donor_zip" bind:value={donorData.donor_zip} style="pointer-events:{inputPointerEvents}" tabindex="7"/>
    </div>
    <div class="form-group">
      <label for="donor_first_name">First Name<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="donor_first_name" bind:value={donorData.donor_first_name} style="pointer-events:{inputPointerEvents}" tabindex="2"/>

      <label for="donor_city">City<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="donor_city" bind:value={donorData.donor_city} style="pointer-events:{inputPointerEvents}" tabindex="5"/>
    </div>
    <div class="form-group">
      <label for="donor_last_name">Last Name<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="donor_last_name" bind:value={donorData.donor_last_name} style="pointer-events:{inputPointerEvents}" tabindex="3"/>

      <label for="state">State<span style="display:{validationLabelDisplay}">(Required)</span></label>
      {#if formState == "data_display" }
        <input type="text" id="donor_state" value={donorData.donor_state} style="pointer-events:{inputPointerEvents}" tabindex="6"/>
      {:else}
        <select class="form-select" id="donor_state" bind:value={donorData.donor_state} style="pointer-events:{inputPointerEvents}" tabindex="6">
          <option value="" selected disabled hidden>{#if fieldData.states.length == 0}Error retrieving data{:else}-- Select a state --{/if}</option>
          {#each fieldData.states as state}
            <option value="{state.term}" selected={donationId && donorData?.donor_state == state.term}>{state.term}</option>
          {/each}
        </select>
      {/if}
    </div>
  </div>

  <h5>Person(s) to be Notified of Donation</h5>
  <div id="whoToNotify">
    {#each whoToNotifyData as notify, index}
      <div><svelte:component this={LivingLibraryWhoToNotifyForm} bind:this={whoToNotifyForm} args={{donationId, inputPointerEvents, validationLabelDisplay, index}} {fieldData} {whoToNotifyData} /></div>
    {/each}
  </div>
  {#if formState == "data_entry"}
    <button type="button" on:click={addPersonToNotify} style="pointer-events:{inputPointerEvents}">Add person to be notified</button>
  {/if}

  <h5>Person Receiving Donation</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="recipient_title">Title</label>
      {#if formState == "data_display" }
        <input type="text" id="recipient_title" bind:value="{recipientData.recipient_title}" style="pointer-events:{inputPointerEvents}"/>
      {:else}
        <select class="form-select" id="recipient_title" bind:value={recipientData.recipient_title} style="pointer-events:{inputPointerEvents}">
          <option value="" selected disabled hidden>{#if fieldData.titles.length == 0}Error retrieving data{:else}-- Select a title --{/if}</option>
          {#each fieldData.titles as title}
            <option value="{title.term}" selected={donationId && recipientData.recipient_title == title.term}>{title.term}</option>
          {/each}
        </select>
      {/if}

      <label for="recipient_donation_type">Donation Type</label>
      <div class="form-check" id="recipient_donation_type">
        <input type="radio" class="form-check-input" id="recipient_donationTypeHonor" bind:group={recipientData.recipient_donation_type} style="pointer-events:{inputPointerEvents}" value="In Honor of">
        <label for="recipient_donationTypeHonor">In Honor of</label>
        <input type="radio" class="form-check-input" id="recipient_donationTypeMemory" bind:group={recipientData.recipient_donation_type} style="pointer-events:{inputPointerEvents}" value="In Memory of">
        <label for="recipient_donationTypeMemory">In Memory of</label>
      </div>
    </div>

    <div class="form-group">
      <label for="recipient_first_name">First Name<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="recipient_first_name" bind:value={recipientData.recipient_first_name} style="pointer-events:{inputPointerEvents}"/>
    </div>

    <div class="form-group">
      <label for="recipient_last_name">Last Name<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" id="recipient_last_name" bind:value={recipientData.recipient_last_name} style="pointer-events:{inputPointerEvents}"/>
    </div>
  </div>

  <h5>Donation Information</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="donor_amount_of_donation">Amount of Donation<span style="display:{validationLabelDisplay}">(Required e.g. 1500.00)</span></label>
      <input type="text" id="donor_amount_of_donation" bind:value={donorData.donor_amount_of_donation} style="pointer-events:{inputPointerEvents}"/>
    </div>

    <div class="form-group">
      <label for="donor_date_of_donation">Date of Donation<span style="display:{validationLabelDisplay}">(Required e.g. yyyy-mm-dd)</span></label>
      <input type="text" id="donor_date_of_donation" bind:value={donorData.donor_date_of_donation} style="pointer-events:{inputPointerEvents}"/>
    </div>

    <div class="form-group">
      <label for="donor_notes">Notes</label>
      <textarea class="form-control" id="donor_notes" bind:value={donorData.donor_notes} style="pointer-events:{inputPointerEvents}"></textarea>
    </div>
  </div>

  <h5>Subject Areas</h5>
  <div class="form-section">
    {#if formState == "data_display"}
      <ul>
        {#each donorData.donor_subject_areas as subject}
          <li>{subject}</li>
        {/each}
      </ul>
    {:else}
      <div class="form-group form-check">
        {#each fieldData.subject_areas as subject, index}
          <input class="form-check-input" type="checkbox" bind:group={donorData.donor_subject_areas} value={subject.term} id="subjectAreaCheck_{index+1}" style="pointer-events:{inputPointerEvents}">
          <label class="form-check-label" for="subjectAreaCheck_{index+1}">{subject.term}</label>
        {/each}
      </div>
    {/if}
  </div>

  {#if formState == "data_entry"}
    <button type="submit" on:click|preventDefault={onSubmit} style="pointer-events:{inputPointerEvents}">Send to queue</button>
  {/if}
</form>

<style>
  form {
    padding: 12px;
  }

  form .form-section {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
  }

  form > div + * {
    margin-top: 10px;
  }

  .form-group {
    border-style: none;
    width: 400px
  }

  #statusDisplay {
    pointer-events: none;
  }
</style>
