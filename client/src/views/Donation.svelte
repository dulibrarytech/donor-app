<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import { Session } from '../libs/session.js';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonationForm from "../components/DonationForm.svelte";

  export let params;

  const donationId = params.id ?? null;
  const donorId = params.donorId ?? null;
  const roleId = Session.getDataItem("donor_db", 'roleId');

  const donationUrl = `${$Configuration.donorApiDomain}/donation/${donationId ?? ""}`;
  const donorUrl = `${$Configuration.donorApiDomain}/donor/${donorId ?? ""}`;

  var donationData;
  var pageLabel;
  var donorInfoLabel = null;

  const init = async () => {
    if(donationId) {
      pageLabel = "Donation";
      // TODO: Combine donor and donation data into one object, as on LivingLibrary page
      donationData = fetchData(donationUrl);
    }
    else if(donorId) {
      pageLabel = "New Donation";
      // TODO: Combine donor and donation data into one object, as on LivingLibrary page
      donationData = fetchData(donorUrl);
    }
    else {
      window.location.replace("/notfound");
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
        else resolve(response.json())
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

  const onDeleteDonation = (event) => {
    setTimeout(() => {
      ajaxRequest('DELETE', donationUrl, function(error, response, status) {
        if(error) console.error(error);
        else if(status != 200) console.error(`Delete donation request receives response status of ${status}`);
        else history.back();
      });
    }, 2000);
  }

  init();
</script>

<div class="page">
  <div class="page-section donation-form">
    <h3>{pageLabel}</h3>

    {#await donationData}
      <h6>Loading data...</h6>
    {:then donationData}
      <div id="donor-info"><h6>{getDonorInfoLabel(donationData)}</h6></div>
      <svelte:component this={DonationForm} args={{donationId, donorId, roleId}} data={donationData} on:delete-donation={onDeleteDonation}/>
    {/await}
  </div>
</div>

<style>
  .donation-form {
    max-width: 75%;
  }

  #donor-info {
    margin-bottom: 30px;
  }
</style>
