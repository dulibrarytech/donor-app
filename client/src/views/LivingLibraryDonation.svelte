<script>
'use-strict'
/*
 * Living Library Donation page
 * Display donation form and book plate form
 */
import { ajaxRequest } from '../libs/ajax.js';
import { Configuration } from '../config';
import LivingLibraryDonationForm from "../components/LivingLibraryDonationForm.svelte";

export let params;
const donationId = params.id ?? null;

var pageLabel;
var formData = {};

const baseUrl = `${$Configuration.livingLibraryApiDomain}/donations`;
const apiKey  = $Configuration.livingLibraryApiKey;

const donationUrl = `${baseUrl}?api_key=${apiKey}&id=${donationId ?? ""}`;
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
      if(donationId) resolve({title: "Dr.", test2: "test2"}) // resolve(await fetchData(donationUrl))
      else resolve({});
    }
    catch(e) {
      console.error(e);
      reject(e);
    }
  });
}

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    ajaxRequest('GET', url, function(error, response, status) {
      if(error) {
        console.error(error);
        resolve([]);
      }
      else if(status != 200) resolve([]);
      else resolve(response.json());
    });
  });
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
      <svelte:component this={LivingLibraryDonationForm} args={{donationId}} data={formData} />
    {/await}
  </div>
</div>

<style>
  #livinglibrary-donation-form {
    max-width: 80%;
  }
</style>
