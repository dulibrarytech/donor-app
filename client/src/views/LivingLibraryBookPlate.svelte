<script>
import { ajaxRequest, fetchData } from '../libs/ajax.js';
import { Configuration } from '../config';
import LivingLibraryBookplateForm from "../components/LivingLibraryBookplateForm.svelte";
import MessageDisplay from "../components/MessageDisplay.svelte";

export let params;

const baseUrl = `${$Configuration.livingLibraryApiDomain}/donations`;
const apiKey  = $Configuration.livingLibraryApiKey;
const donationId = params.donationId ?? null;
let data = {
  donor: {}
};
let donationUrl = `${baseUrl}?api_key=${apiKey}`;
let form;
let messageDisplay;

const init = async () => {
  if(!donationId) window.location.replace("/notfound");
  else {
    donationUrl += `&id=${donationId}`;
    data = getDonationData();
  }
}

const getDonationData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await fetchData(donationUrl);
      if(data.length > 0) {
        data = data[0];
        if(data.donor)  data.donor = JSON.parse(data.donor || {});
        data["book"] = null;
        if(data.recipient)  data.recipient = JSON.parse(data.recipient || {});
        if(data.who_to_notify)  data.who_to_notify = JSON.parse(data.who_to_notify || []);
        resolve(data)
      }
      else resolve(null);
    }
    catch(e) {
      console.error(e);
      reject(e);
    }
  });
}

const onSubmitForm = (event) => {
  let bookSubmitData = {
    book: JSON.stringify(event.detail.book)
  }

  ajaxRequest('PUT', donationUrl, async function(error, response, status) {
    if(error) messageDisplay.displayTimeoutMessage("Error", error);
    else if(status != 200 && status != 201) messageDisplay.displayTimeoutMessage("Error", `Form post receives response status of ${status}`);
    else {
      messageDisplay.displayTimeoutMessage("Book plate request created. Notification email sent.");
      form.reset();
    }
  }, bookSubmitData);
}

init()
</script>

<div class="page">
  <h3>Living Library: Book Plate Form</h3>
  <div class="page-section donation-form">
    {#await data}
      <h6>Loading data...</h6>
    {:then data}
      {#if data}
        <svelte:component this={LivingLibraryBookplateForm} args={{donationId, isEntryForm: true, submitButtonVisible:true}} {data} on:form-submit={onSubmitForm} bind:this={form}/>
      {:else}
        <h6>Error retrieving data</h6>
      {/if}
    {/await}
    <MessageDisplay bind:this={messageDisplay} />
  </div>
</div>

<style>

</style>
