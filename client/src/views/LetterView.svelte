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
const donorTitlesUrl = `${$Configuration.donorApiDomain}/donor/titles/list`;

const init = async () => {
  let donationData = null;
  let donorData = null;
  let donorTitles = null;

  try {
    donationData = await fetchData(donationUrl);
    donorData = await fetchData(donorUrl);
    donorTitles = await fetchData(donorTitlesUrl);
  }
  catch(error) {
    console.error(`Error retrieving data for letter template: ${error}`)
  }

  if(donationData && donorData) {
    data = {...donationData, ...donorData};
  }

  if(data.title) {
    data.title = donorTitles.filter((item) => {
      return item.titleId == data.title;
    })[0].titleString;
  }
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

init();
</script>

<div id="letter-view">
  <svelte:component this={Letter} data={data}/>
</div>
