<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonorForm from "../components/DonorForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonationTable from "../components/DonationTable.svelte";

  export let params;

  const donorId = params.id ?? null;
  var donorData = {};
  var donationDisplay = [];
  var pageLabel = "";

  const fetchDonorData = (id) => {
    return new Promise((resolve, reject) => {
      let data = null;
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

  const fetchDonorDonations = (id) => {
    return new Promise((resolve, reject) => {
      let data = null;
      let url = `${$Configuration.donorApiDomain}/donation/donor/${id}`;

      ajaxRequest('GET', url, function(error, response) {
        if(error) reject(error);
        if(response) {
          // TODO: Handle status != 200
          resolve(response.json());
        }
      });
    });
  }

  const getPageLabel = ({firstName="", lastName="", organization=""}) => {
    let label = "Donor";

    if(lastName.length > 0) {
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
    if(donorId) {
      donorData = await fetchDonorData(donorId);
      if(Object.keys(donorData).length > 0) {
        pageLabel = getPageLabel(donorData);

        let donationData = await fetchDonorDonations(donorId);
        if(donationData) donationDisplay = donationData;
      }
      else {
        window.location.replace("/notfound");
      }
    }
    else {
      pageLabel = "New Donor";
    }
  }

  init();
</script>

<div class="page">
  <div class="donor-data-section">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonorForm} {donorId} data={donorData} />
  </div>
  {#if donorId}
    <div class="donor-donations-section">
      <h5>Donations</h5>
      <svelte:component this={DataDisplay} items={donationDisplay} Table={DonationTable} args={donorId}/>
    </div>
  {/if}
</div>

<style>

</style>
