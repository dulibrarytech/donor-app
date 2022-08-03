<script>
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import Letter from "./partials/Letter.svelte";

export let params;

var data={};
var donorId = params.donorId ?? null;
var donationId = params.donationId ?? null;

const donorUrl = `${$Configuration.donorApiDomain}/donor/${donorId ?? ""}`;
const donationUrl = `${$Configuration.donorApiDomain}/donation/${donationId ?? ""}`;

const init = async () => {
  let donationData = null;
  let donorData = null;

  try {
    donationData = await fetchDonationData(donationId);
    donorId = donationData.donorId ?? null;
    donorData = await fetchDonorData(donorId);
  }
  catch(error) {
    console.error(`Error retrieving data for letter template: ${error}`)
  }

  if(donationData && donorData) {
    data = {...donationData, ...donorData};
  }
}

const fetchDonationData = (id) => {
  return new Promise((resolve, reject) => {
    let url = `${$Configuration.donorApiDomain}/donation/${id}`;
    ajaxRequest('GET', url, function(error, response, status) {
      if(error) reject(error);
      if(response) {
        if(status == 200) resolve(response.json());
        else reject(`Donation data request received a status of ${status}`)
      }
    });
  });
}

const fetchDonorData = (id) => {
  return new Promise((resolve, reject) => {
    let url = `${$Configuration.donorApiDomain}/donor/${id}`;
    ajaxRequest('GET', url, function(error, response, status) {
      if(error) reject(error);
      if(response) {
        if(status == 200) resolve(response.json());
        else reject(`Donor data request received a status of ${status}`)
      }
    });
  });
}

// const fetchData = (url) => {
//   return new Promise((resolve, reject) => {
//     ajaxRequest('GET', url, function(error, response) {
//       if(error) {
//         console.error(error);
//         resolve([]);
//       }
//       else if(status != 200) resolve([]);
//       else resolve(response.json());
//     });
//   });
// }

init();
</script>

<div id="letter-view">
  <!-- TODO: Letter partial. Pass in data variable -->
  <!-- <Letter {data} /> -->
  <svelte:component this={Letter} data={data}/>
</div>
