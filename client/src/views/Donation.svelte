<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import { Session } from '../libs/session.js';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonationForm from "../components/DonationForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";

  export let params;

  const donationId = params.id ?? null;
  const donorId = params.donorId ?? null;
  const roleId = Session.getDataItem("donor_db", 'roleId');

  var donationData = {};
  var pageLabel;
  var donorInfoLabel = null;

  const init = async () => {
    if(donationId) {
      pageLabel = "Donation";
      donationData = fetchDonationData(donationId);
    }
    else if(donorId) {
      pageLabel = "New Donation";
      donationData = fetchDonorData(donorId);
    }
    else {
      window.location.replace("/notfound");
    }
  }

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

  // const fetchData = (url) => {
  //   return new Promise((resolve, reject) => {
  //     ajaxRequest('GET', url, function(error, response) {
  //       if(error) reject(error);
  //       if(response) {
  //         // TODO: Handle status != 200
  //         resolve(response.json());
  //       }
  //     });
  //   });
  // }

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

  init();
</script>

<div class="page">
  <div class="page-section donation-form">
    <h3>{pageLabel}</h3>

    {#await donationData}
      <h6>Loading data...</h6>
    {:then donationData}
      <h6>{getDonorInfoLabel(donationData)}</h6>
      <svelte:component this={DonationForm} args={{donationId, donorId, roleId}} data={donationData} />
    {/await}
  </div>
</div>

<style>
  .donation-form {
    max-width: 75%;
  }
</style>
