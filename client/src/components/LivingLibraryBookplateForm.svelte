<script>
/*
 * Living Library bookplate request form
 */
import { Configuration } from '../config';
import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';

export let args;
export let data;

const dispatch = createEventDispatcher();
var submitButtonVisible = true;
var validationLabelDisplay = "inline";
const donationId = args.donationId || null;
const IS_ENTRY_FORM = args.isEntryForm || false;

let donationData = data.donor || {
  donor_title: "",
  donor_first_name: "",
  donor_last_name: "",
  donor_date_of_donation: "",
  donor_subject_areas: [],
  donor_notes: ""
};
let bookData = data.book || {
  book_author_name: "",
  book_title: "",
  book_bibliographic_number: "",
  book_call_number: ""
}
let recipientData = data.recipient || {};
let whoToNotifyData = data.who_to_notify || [];
let donorTitleString;
let recipientTitleString;

var validationRules = {
  name: "book_bibliographic_number",
  book_bibliographic_number: {
    name: "book_bibliographic_number",
    required: true,
    maxlength: 30
  },
  book_title: {
    name: "book_title",
    required: true,
    maxlength: 100
  },
  book_call_number: {
    name: "book_call_number",
    required: true,
    maxlength: 30
  }
};
let formValidator = new FormValidator('living-library-bookplate-form', validationRules, "#ced4da");

const init = () => {
  if(donationId) validationLabelDisplay = "none";
  submitButtonVisible = args.submitButtonVisible || true;
  donorTitleString = `${donationData.donor_title} ${donationData.donor_first_name} ${donationData.donor_last_name}`;
  recipientTitleString = `${recipientData.recipient_title} ${recipientData.recipient_first_name} ${recipientData.recipient_last_name}`;
}

export const reset = () => {
  bookData = {
    book_author_name: "",
    book_title: "",
    book_bibliographic_number: "",
    book_call_number: ""
  }
}

const onSubmit = (event) => {
  if(formValidator.validate(bookData)) {
    dispatch('form-submit', {
      donor: donationData,
      recipient: recipientData,
      who_to_notify: whoToNotifyData,
      book: bookData
    });
  }
}

const viewDonationDetails = () => {
  window.location.replace(`${$Configuration.basePath}/livingLibrary/donation/${donationId}`)
}

init();
</script>

{#if IS_ENTRY_FORM}
<div class="donor-display">
  <table class="table">
    <tbody>
      <tr><td>Person making donation</td><td>{donorTitleString}</td></tr>
      <tr>
        <td>Person(s) to be notified of donation</td>
        <td>
          {#each whoToNotifyData as notify}
            {notify.notify_title} {notify.notify_first_name} {notify.notify_last_name}<br>
          {/each}
        </td>
      </tr>
      <tr><td>Person receiving donation</td><td>{recipientTitleString}</td></tr>
      <tr><td>Date of donation</td><td>{donationData.donor_date_of_donation}</td></tr>
      <tr>
        <td>Subject areas</td>
        <td>
          {#each donationData.donor_subject_areas as subject}
            {subject}<br>
          {/each}
        </td>
      </tr>
      <tr><td>Notes</td><td>{donationData.donor_notes}</td></tr>
    </tbody>
  </table>
  {#if donationId}<button type="button" on:click={viewDonationDetails}>View Donation Details</button>{/if}
</div>
{/if}

<form id="living-library-bookplate-form">
  <div class="required">Required field</div>
  <div class="form-input-section form-group-flex">
    <div class="form-group">
      <label for="book_author_name">Author Name</label>
      <input type="text" class="form-control" id="book_author_name" bind:value={bookData.book_author_name}/>
    </div>

    <div class="form-group">
      <label for="book_bibliographic_number" class="required">Bibliographic Number<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" class="form-control" id="book_bibliographic_number" bind:value={bookData.book_bibliographic_number}/>
    </div>

    <div class="form-group">
      <label for="book_title" class="required">Book title<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" class="form-control" id="book_title" bind:value={bookData.book_title}/>
    </div>

    <div class="form-group">
      <label for="book_call_number" class="required">Call Number<span style="display:{validationLabelDisplay}">(Required)</span></label>
      <input type="text" class="form-control" id="book_call_number" bind:value={bookData.book_call_number}/>
    </div>
  </div>
  <button type="button" on:click={onSubmit} style="display:{args.submitButtonVisible ? "block" : "none"}">Save Book Plate</button>
</form>

<style>
  form {
    padding: 12px;
  }

  form#living-library-bookplate-form {
    margin-top: 20px;
  }

  .form-group {
    width: 50%;
    padding: 0 30px;
  }

  .form-input-section {
  	padding: 30px 0px !important;
  }

  .donor-display table {
    width: 50%;
  }

  .donor-display tbody tr td:first-child {
    font-weight: bold
  }

  .donor-display tbody tr td:first-child::after {
    content: ':'
  }
</style>
