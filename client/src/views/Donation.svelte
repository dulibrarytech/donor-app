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
  var pageLabel = "";
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
      /* Do not await the promise, the unresolved promise must be assigned to donationData here in order for the {#await donationData} blocks to function properly */
      donationData = fetchDonationData(donationId)
    }
    else if(donorId) {
      pageLabel = "New Donation";
      donationData.donorId = donorId;

      /* Set the donor info label if the donor is not anonymous */
      if(donorId != 1) {
        let donorData = await fetchDonorData(donorId);
        donorInfoLabel = getPageLabel(donorData);
      }
    }
    else {
      window.location.replace("/notfound"); // TODO: Error specific page. Need donorId
    }
  }

  init();
</script>

<div class="page">
  <div class="donation-data-section">
    {#await donationData}
      <h3>{pageLabel}</h3>
    {:then donationData}
      <h3>{getPageLabel(donationData)}</h3>
    {/await}

    {#if donorInfoLabel}
      <h6>{donorInfoLabel}</h6>
    {/if}

    {#await donationData}
      <h6>Loading data...</h6>
    {:then donationData}
      <svelte:component this={DonationForm} {donationId} {donorId} data={donationData} />
    {/await}
  </div>
</div>

<style>

</style>
