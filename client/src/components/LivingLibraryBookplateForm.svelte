<script>
/*
 * Living Library bookplate request form
 */
import {createEventDispatcher} from 'svelte';

export let args;
export let data;

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

$: donorTitleString = `${donationData.donor_title} ${donationData.donor_first_name} ${donationData.donor_last_name}`;
$: recipientTitleString = `${recipientData.recipient_title} ${recipientData.recipient_first_name} ${recipientData.recipient_last_name}`;

const dispatch = createEventDispatcher();
var submitButtonVisible = args.submitButtonVisible || true;

const onSubmit = (event) => {
  dispatch('form-submit', {
    donor: donationData,
    recipient: recipientData,
    who_to_notify: whoToNotifyData,
    book: bookData
  });
}
</script>

<div class="donor-display">
  <table class="table">
    <tbody>
      <tr><td>Person making donation</td><td>{donorTitleString}</td></tr>
      <tr>
        <td>Person(s) to be notified of donation</td>
        <td>
          {#each whoToNotifyData as notify}
            {notify.notify_title} {notify.notify_first_name} {notify.notify_last_name}
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
</div>

<form>
  <div class="form-section">
    <div class="form-group">
      <label for="book_author_name">Author Name</label>
      <input type="text" id="book_author_name" bind:value={bookData.book_author_name}/>

      <label for="book_bibliographic_number">Bibliographic Number</label>
      <input type="text" id="book_bibliographic_number" bind:value={bookData.book_bibliographic_number}/>
    </div>

    <div class="form-group">
      <label for="book_title">Book title</label>
      <input type="text" id="book_title" bind:value={bookData.book_title}/>

      <label for="book_call_number">Call Number</label>
      <input type="text" id="book_call_number" bind:value={bookData.book_call_number}/>
    </div>
  </div>
  <button type="button" on:click={onSubmit} style="display:{args.submitButtonVisible ? "block" : "none"}">Save Book Plate</button>
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
