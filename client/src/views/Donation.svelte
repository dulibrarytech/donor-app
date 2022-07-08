<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonationForm from "../components/DonationForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";

  // Dev - test data
  import { Donations } from '../stores';

  export let params;

  const donationId = params.id ?? null;
  var donorId = params.donorId ?? null;
  var donationData = {};
  var pageLabel = "";
  var donorLabel = null;

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

  const getPageLabel = ({lastName="", firstName="", organization=""}) => {
    let label = "Donation";
    if(donorId && donorId == 1) {
      label = "Anonymous Donation";
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
      donationData = await fetchDonationData(donationId);
      if(Object.keys(donationData).length > 0) {
        donorId = donationData.donorId ?? null;
        pageLabel = getPageLabel(donationData);
      }
      else {
        window.location.replace("/notfound");
      }
    }
    else if(donorId) {
      pageLabel = "New Donation";
      let donorData = await fetchDonorData(donorId);
      donorLabel = getPageLabel(donorData);
      donationData.donorId = donorId;
    }
    else {
      window.location.replace("/notfound"); // TODO: Error specific page. Need donorId
    }
  }

  init();
</script>

<div class="page">
  <div class="donation-data-section">
    <h3>{pageLabel}</h3>
    {#if donorLabel}
      <h6>{donorLabel}</h6>
    {/if}
    <svelte:component this={DonationForm} {donationId} {donorId} data={donationData} />
  </div>
</div>

<style>

</style>
