<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonationForm from "../components/DonationForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";

  export let params;

  var donationId = params.id ?? null;
  var donorId = params.donorId ?? null;
  var donationData = {};
  var pageLabel;
  var donorInfoLabel = null;

  const fetchDonationData = (id) => {
    return new Promise((resolve, reject) => {
      let url = `${$Configuration.donorApiDomain}/donation/${id}`;
      ajaxRequest('GET', url, function(error, response) {
        if(error) reject(error);
        if(response) {
          // TODO: Handle status != 200
          resolve(response.json());
        }
      });
    });
  }

  const fetchDonorData = (id) => {
    return new Promise((resolve, reject) => {
      let url = `${$Configuration.donorApiDomain}/donor/${id}`;
      ajaxRequest('GET', url, function(error, response) {
        if(error) reject(error);
        if(response) {
          // TODO: Handle status != 200
          resolve(response.json());
        }
      });
    });
  }

  const getDonorInfoLabel = ({lastName="", firstName="", organization=""}) => {
    let label = "No donor data available";
    if(donorId && donorId == 1) {
      label = "Anonymous Donor";
    }
    else if(lastName.length > 0) {
      label = `${lastName}`;
      if(firstName.length > 0) {
        label += `, ${firstName}`;
      }
    }
    else if(organization.length > 0) {
      label = `${organization}`;
    }
    return label;
  }

  const init = async () => {
    if(donationId) {
      pageLabel = "Donation";
      donationData = fetchDonationData(donationId);
    }
    else if(donorId) {
      pageLabel = "New Donation";
      donationData = fetchDonorData(donorId);
      // donationData = {donorId, ...donorData}
      // console.log("Donation data", donationData)
    }
    else {
      window.location.replace("/notfound");
    }
  }

  init();
</script>

<div class="page">
  <div class="donation-data-section">
    <h3>{pageLabel}</h3>

    {#await donationData}
      <h6>Loading data...</h6>
    {:then donationData}
      <h6>{getDonorInfoLabel(donationData)}</h6>
      <svelte:component this={DonationForm} {donationId} data={donationData} />
    {/await}
  </div>
</div>

<style>

</style>
