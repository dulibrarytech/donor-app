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

var fieldDataUrls = [
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
  else pageLabel = "Living Library: Book Plate Form";

  formData = getFormData(donationId);
}

const getFormData = async (donationId) => {
  return new Promise(async (resolve, reject) => {
    let data = {};

    if(donationId) data['donationData'] = await getDonationData();
    else data['donationData'] = {};

    data['fieldData'] = await getFormFieldData(fieldDataUrls);

    resolve(data);
  });
}

const getFormFieldData = (urls) => {
  // TODO: try catch reject error
  return new Promise(async (resolve, reject) => {
    let data = {};
    for(let field of urls) {
      data[field.name] = await fetchData(field.url);
    }
    resolve(data)
  });
}

const getDonationData = () => {
  // TODO: try catch reject error
  return new Promise((resolve, reject) => {

    resolve({title: "Dr.", test2: "test2"})

  });
}

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    ajaxRequest('GET', url, function(error, response) {
      if(error) {
        console.error(error);
        reject(error);
      }
      if(response) {
        resolve(response.json());
      }
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
