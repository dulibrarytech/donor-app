<script>
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonationForm from "../components/DonationForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";

  // Dev - test data
  import { Donations } from '../stores';

  export let params;

  const donationId = params.donationId ?? null;
  var donationData = {};
  var pageLabel = "";

  const fetchDonationData = (id) => {
    let data = null;

    // Dev
    let tmpArray = $Donations.filter(donation => {
      return donation.id == id;
    })
    data = tmpArray[0] || null;

    // Prod TODO: fetch data assn to data [] Server sends this data structure (crosswalk from db fields done on backend) GET donor/:id

    return data;
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

  const init = () => {
    if(donationId) {
      donationData = fetchDonationData(donationId);
      console.log("Donation data:", donationData)

      if(donationData) {
        //donorId = donationData.donorId ?? null;

        /* Set page label to donor name or organization */
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
