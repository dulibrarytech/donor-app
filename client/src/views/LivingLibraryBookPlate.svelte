<script>
import { fetchData } from '../libs/ajax.js';
import { Configuration } from '../config';
import LivingLibraryBookplateForm from "../components/LivingLibraryBookplateForm.svelte";

export let params;

const baseUrl = `${$Configuration.livingLibraryApiDomain}/donations`;
const apiKey  = $Configuration.livingLibraryApiKey;
const donationId = params.donationId ?? null;
var data = {
  donor: {}
};
var donationUrl = `${baseUrl}?api_key=${apiKey}`;
if(donationId) donationUrl += `&id=${donationId}`;

const init = async () => {
  if(!donationId) window.location.replace("/notfound");
  data = getDonationData();
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
  console.log("Form submits data:", event.detail)

  // TODO convert to json strings, POST to server
}

init()
</script>

<div class="page">
  <div class="page-section donation-form">
    <h3>Living Library: Book Plate Form</h3>
    {#await data}
      <h6>Loading data...</h6>
    {:then data}
      {#if data}
        <svelte:component this={LivingLibraryBookplateForm} args={{donationId, submitButtonVisible:true}} {data} on:form-submit={onSubmitForm}/>
      {:else}
        <h6>Error retrieving data</h6>
      {/if}
    {/await}
  </div>
</div>

<style>

</style>
