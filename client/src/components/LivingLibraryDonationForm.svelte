<script>
/*
 * Living Library Donation and Donor Data Form
 * Donor, recipient, person to be notified, donation info`
 * Display data or enter new data
 */
import LivingLibraryWhoToNotifyForm from "../components/LivingLibraryWhoToNotifyForm.svelte";

export let args;
export let data;

const donationId = args.donationId || null;

/*
 * donorData => 'donor' fields {}, subjectAreas [];
 * recipientData => 'recipient_' fields {};
 * whoToNotifyData => 'who_to_notify.notify_' fields {}
 * fieldData => fields to populate dropdowns on 'add donation' form (no donationId)
 *
 * null passed in if no data fetch pre-form (add donation form). Field data is required OR set default here to []
 */
let {donorData, recipientData, whoToNotifyData, fieldData} = data;

/* Radio and check input variables */
let recipientDonationType = "In Honor of";
let subjectAreas = [];

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
    donor_subject_areas: ""
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

var validationRules = {};

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

const onSubmit = () => {
  // TODO: POST object: {donor: {}, recipient: {}, who_to_notify: [{}]}

  console.log("donorData", donorData)
  console.log("recipientData", recipientData)
  console.log("whoToNotifyData", whoToNotifyData)
  console.log("subjectAreas", subjectAreas)
}

</script>

<form>
  <h5>Person Making Donation</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="donor_title">Title</label>
      {#if donationId }
        <input type="text" id="donor_title" bind:value="{donorData.donor_title}"/>
      {:else}
        <select class="form-select" id="donor_title" bind:value={donorData.donor_title}>
          <option value="" selected disabled hidden>-- Select a title --</option>
          {#each fieldData.titles as title}
            <option value="{title.term}" selected={donationId && donorData?.donor_title == title.term}>{title.term}</option>
          {/each}
        </select>
      {/if}

      <label for="donor_address">Address</label>
      <input type="text" id="donor_address" bind:value={donorData.donor_address}/>

      <label for="donor_zipCode">Zip Code</label>
      <input type="text" id="donor_zipCode" bind:value={donorData.donor_zip}/>
    </div>
    <div class="form-group">
      <label for="donor_firstName">First Name</label>
      <input type="text" id="donor_firstName" bind:value={donorData.donor_first_name}/>

      <label for="donor_city">City</label>
      <input type="text" id="donor_city" bind:value={donorData.donor_city}/>
    </div>
    <div class="form-group">
      <label for="donor_lastName">Last Name</label>
      <input type="text" id="donor_lastName" bind:value={donorData.donor_last_name}/>

      <label for="state">State</label>
      {#if donationId }
        <input type="text" id="donor_state" value="{donorData.donor_state}"/>
      {:else}
        <select class="form-select" id="donor_state" bind:value={donorData.donor_state}>
          <option value="" selected disabled hidden>-- Select a state --</option>
          {#each fieldData.states as state}
            <option value="{state.term}" selected={donationId && donorData?.donor_state == state.term}>{state.term}</option>
          {/each}
        </select>
      {/if}
    </div>
  </div>

  <h5>Person to be Notified of Donation</h5>
  <div id="whoToNotify">
  {#each whoToNotifyData as notify, index}
    <!-- <div class="form-section notify-section" id="notify_section_{index+1}">
      <div class="form-group">
        <label for="notify_title_{index+1}">Title</label>
        {#if donationId }
          <input type="text" id="notify_title_{index+1}" bind:value="{whoToNotifyData[index].notify_title}"/>
        {:else}
          <select class="form-select" id="notify_title_{index+1}" bind:value={whoToNotifyData[index].notify_title}>
            <option value="" selected disabled hidden>-- Select a title --</option>
            {#each fieldData.titles as title}
              <option value="{title.term}" selected={donationId && whoToNotifyData[index].notify_title == title.term}>{title.term}</option>
            {/each}
          </select>
        {/if}

        <label for="notify_address_{index+1}">Address</label>
        <input type="text" id="notify_address_{index+1}" bind:value={whoToNotifyData[index].notify_address}/>

        <label for="notify_zipCode_{index+1}">Zip Code</label>
        <input type="text" id="notify_zipCode_{index+1}" bind:value={whoToNotifyData[index].notify_zip}/>
      </div>
      <div class="form-group">
        <label for="notify_firstName_{index+1}">First Name</label>
        <input type="text" id="notify_firstName_{index+1}" bind:value={whoToNotifyData[index].notify_first_name}/>

        <label for="notify_city_{index+1}">City</label>
        <input type="text" id="notify_city_{index+1}" bind:value={whoToNotifyData[index].notify_city}/>

        <label for="notify_relation_to_donor_{index+1}">Relation to donor</label>
        {#if donationId }
          <input type="text" id="notify_relation_to_donor_{index+1}" value="{whoToNotifyData[index].notify_relation_to_donor}"/>
        {:else}
          <select class="form-select" id="notify_relation_to_donor_{index+1}" bind:value={whoToNotifyData[index].notify_relation_to_donor}>
            <option value="" selected disabled hidden>-- Select a relation --</option>
            {#each fieldData.relationships as relationship}
              <option value="{relationship.term}" selected={donationId && whoToNotifyData[index].notify_relation_to_donor == relationship.term}>{relationship.term}</option>
            {/each}
          </select>
        {/if}
      </div>

      <div class="form-group">
        <label for="notify_lastName_{index+1}">Last Name</label>
        <input type="text" id="notify_lastName_{index+1}" bind:value={whoToNotifyData[index].notify_last_name}/>

        <label for="notify_state_{index+1}">State</label>
        {#if donationId }
          <input type="text" id="notify_state_{index+1}" value="{whoToNotifyData[index].notify_state}"/>
        {:else}
          <select class="form-select" id="notify_state_{index+1}" bind:value={whoToNotifyData[index].notify_state}>
            <option value="" selected disabled hidden>-- Select a state --</option>
            {#each fieldData.states as state}
              <option value="{state.term}" selected={donationId && whoToNotifyData[index].notify_state == state.term}>{state.term}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div> -->
    <div><svelte:component this={LivingLibraryWhoToNotifyForm} {donationId} {fieldData} {whoToNotifyData} {index}/></div>
  {/each}

  </div>
  <button type="button" on:click={addPersonToNotify}>Add person to be notified</button>

  <h5>Person Receiving Donation</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="recipient_title">Title</label>
      {#if donationId }
        <input type="text" id="recipient_title" bind:value="{recipientData.recipient_title}"/>
      {:else}
        <select class="form-select" id="recipient_title" bind:value={recipientData.recipient_title}>
          <option value="0" selected disabled hidden>-- Select a title --</option>
          {#each fieldData.titles as title}
            <option value="{title.term}" selected={donationId && recipientData.recipient_title == title.term}>{title.term}</option>
          {/each}
        </select>
      {/if}

      <label for="recipient_donationType">Donation Type</label>
      <div class="form-check" id="recipient_donationType">
        <input type="radio" class="form-check-input" id="recipient_donationTypeHonor" bind:group={recipientDonationType} value="In Honor of" checked>
        <label for="recipient_donationTypeHonor">In Honor of</label>
        <input type="radio" class="form-check-input" id="recipient_donationTypeMemory" bind:group={recipientDonationType} value="In Memory of">
        <label for="recipient_donationTypeMemory">In Memory of</label>
      </div>
    </div>

    <div class="form-group">
      <label for="recipient_firstName">First Name</label>
      <input type="text" id="recipient_firstName" bind:value={recipientData.recipient_first_name}/>
    </div>

    <div class="form-group">
      <label for="recipient_lastName">Last Name</label>
      <input type="text" id="recipient_lastName" bind:value={recipientData.recipient_last_name}/>
    </div>
  </div>

  <h5>Donation Information</h5>
  <div class="form-section">
    <div class="form-group">
      <label for="donor_amountOfDonation">Amount of Donation (e.g. 1500.00)</label>
      <input type="text" id="donor_amountOfDonation" bind:value={donorData.donor_amount_of_donation}/>
    </div>

    <div class="form-group">
      <label for="donor_dateOfDonation">Amount of Donation (yyyy-mm-dd)</label>
      <input type="text" id="donor_dateOfDonation" bind:value={donorData.donor_date_of_donation}/>
    </div>

    <div class="form-group">
      <label for="donor_notes">Notes</label>
      <textarea class="form-control" id="donor_notes" bind:value={donorData.donor_notes}></textarea>
    </div>
  </div>

  <h5>Subject Areas</h5>
  <div class="form-section">
    <div class="form-group form-check">
      <!-- TODO: each subject_areas as area, add checkbox to add to donorData.subjectAreas[] -->
      {#each fieldData.subject_areas as subject, index}
        <input class="form-check-input" type="checkbox" bind:group={subjectAreas} value={subject.term} id="subjectAreaCheck_{index+1}">
        <label class="form-check-label" for="subjectAreaCheck_{index+1}">{subject.term}</label>
      {/each}
    </div>
  </div>

  <button type="submit" on:click|preventDefault={onSubmit}>Send to queue</button>
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
</style>
