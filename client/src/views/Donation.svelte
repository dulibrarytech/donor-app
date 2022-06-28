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
  var donationData = {};
  var pageLabel = "";

  const fetchDonationData = (id) => {
    return new Promise((resolve, reject) => {
      let data = null;
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

  const getPageLabel = ({lastName="", firstName="", organization=""}) => {
    let label = "Donation";

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
    if(donationId) {
      donationData = await fetchDonationData(donationId);
      if(Object.keys(donationData).length > 0) {
        pageLabel = getPageLabel(donationData);
      }
      else {
        window.location.replace("/notfound");
      }
    }
    else {
      pageLabel = "New Donation";
    }
  }

  init();
</script>

<div class="page">
  <div class="donation-data-section">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonationForm} {donationId} data={donationData} />
  </div>
</div>

<style>

</style>
