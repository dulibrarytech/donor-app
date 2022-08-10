<script>
'use-strict'
/*
 * Living Library Donation page
 * Display donation form and book plate form
 */
import { ajaxRequest, fetchData } from '../libs/ajax.js';
import { Configuration } from '../config';
import LivingLibraryDonationForm from "../components/LivingLibraryDonationForm.svelte";
import LivingLibraryBookplateForm from "../components/LivingLibraryBookplateForm.svelte";

export let params;
const donationId = params.id ?? null;

var pageLabel;
var formData = {};

const baseUrl = `${$Configuration.livingLibraryApiDomain}/donations`;
const apiKey  = $Configuration.livingLibraryApiKey;

var donationUrl = `${baseUrl}?api_key=${apiKey}`;
if(donationId) donationUrl += `&id=${donationId}`;

const fieldDataUrls = [
  {
    name: "states",
    url: `${baseUrl}?api_key=${apiKey}&tbl=states&is_active=true`
  },
  {
    name: "titles",
    url: `${baseUrl}?api_key=${apiKey}&tbl=titles&is_active=true`
  },
  {
    name: "relationships",
    url: `${baseUrl}?api_key=${apiKey}&tbl=relationships&is_active=true`
  },
  {
    name: "subject_areas",
    url: `${baseUrl}?api_key=${apiKey}&tbl=subject_areas&is_active=true`
  }
]

const init = async () => {
  if(donationId) pageLabel = "Living Library: Donation Record";
  else pageLabel = "Living Library: Donation Form";

  formData = getFormData();
}

const getFormData = async () => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    data['donationData'] = await getDonationData();
    data['fieldData'] = await getFormFieldData();

    if(Object.keys(data.donationData).length > 0) {
      data.donationData.donor = JSON.parse(data.donationData.donor || {});
      data.donationData.recipient = JSON.parse(data.donationData.recipient || {});
      data.donationData.who_to_notify = JSON.parse(data.donationData.who_to_notify || {});
      if(data.donationData.book) data.donationData.book = JSON.parse(data.donationData.book);
    }

    resolve(data);
  });
}

const getFormFieldData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      for(let field of fieldDataUrls) {
        data[field.name] = await fetchData(field.url);
      }
      resolve(data);
    }
    catch(e) {
      console.error(e);
      reject(e);
    }
  });
}

const getDonationData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if(donationId) {
        let data = await fetchData(donationUrl);
        if(data.length > 0) resolve(data[0])
        else window.location.replace("/notfound");
      }

      else resolve({});
    }
    catch(e) {
      console.error(e);
      reject(e);
    }
  });
}

const onSubmitForm = (event) => {
  let formSubmitData = {};
  for(let key in event.detail) {
    formSubmitData[key] = JSON.stringify(event.detail[key]);
  }

  ajaxRequest('POST', donationUrl, function(error, response, status) {
    if(error) console.error(error)
    else if(status != 200 && status != 201) console.error(`Form post receives response status of ${status}`);
    else console.log("Donation created sucessfully.");
  }, formSubmitData);
}

init()
</script>

<div class="page">
  <div id="livinglibrary-donation-form">
    <h3>{pageLabel}</h3>

    {#await formData}
      <h6>Loading data...</h6>
    {:then formData}
      <!-- <h6>{getDonorInfoLabel(donationData)}</h6> -->
      <svelte:component this={LivingLibraryDonationForm} args={{donationId}} data={formData.donationData} fieldData={formData.fieldData} on:form-submit={onSubmitForm}/>

      {#if donationId && formData.donationData.book}
        <h5>Book Plate Record</h5>
        <svelte:component this={LivingLibraryBookplateForm} args={{donationId, submitButtonVisible:false}} data={formData.donationData}/>
      {/if}
    {/await}
  </div>
</div>

<style>
  #livinglibrary-donation-form {
    max-width: 80%;
  }

  :global(#livinglibrary-donation-form #living-library-bookplate-form input) {
    pointer-events: none;
  }
</style>
