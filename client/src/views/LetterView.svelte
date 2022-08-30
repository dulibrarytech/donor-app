<script>
import { onMount } from 'svelte';
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import Letter from "./partials/Letter.svelte";

import Html2Pdf from 'html2pdf.js'

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

const generatePdf = () => {
  let filenameIdentifier = data.lastName.length > 0 ? data.lastName.replace(/[^a-zA-Z ]/g, '').replace(/ /g, '-') : data.organization.replace(/[^a-zA-Z ]/g, '').replace(/ /g, '-');
  if(filenameIdentifier.length < 1) filenameIdentifier = "no-donor-data";
  filenameIdentifier += ("_" + donationId);
  Html2Pdf(document.getElementById("letter-content")).save(`${filenameIdentifier}.pdf`);
}

onMount(() => {
  init();
})
</script>

<div class="letter-view">
  <svelte:component this={Letter} data={data} args={{basePath: $Configuration.basePath || ""}}/>
</div>

<button type="button" on:click={generatePdf}>Download PDF</button>

<style>
.letter-view {
  width: 816px; /* 8.5 inches */
  height: 1056px; /* 11 inches */
  border-style: solid;
  border-color: #e5e3e1;
  margin: 1em auto;
}
</style>
