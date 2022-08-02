<script>
'use-strict'
/*
 * Living Library Donation page
 * Display donation form and book plate form
 */
import { ajaxRequest } from '../libs/ajax.js';
import { Configuration } from '../config';

export let params;
const donationId = params.id ?? null;

const baseUrl = `${$Configuration.livingLibraryApiDomain}/donations`;
const apiKey  = $Configuration.livingLibraryApiKey;

var donationData;
var fieldData = {};

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

const init = () => {
  console.log("Init: donationId:", donationId)

  // Populate form field elements
  getFormFieldData(fieldDataUrls);

  // Fetch donor data if id is present
  if(donationId) {
    // TODO: await fetchData, set donationData (passed into form via param)
  }

}

const getFormFieldData = async (urls) => {
  for(let field of urls) {
    fieldData[field.name] = await fetchData(field.url);
  }
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

<form>

</form>

<style>

</style>
