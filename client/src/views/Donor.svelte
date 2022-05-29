<script>
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonorForm from "../components/DonorForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorDonationTable from "../components/DonorDonationTable.svelte";

  // Dev - test data
  import { Donors } from '../stores';
  import { Donations } from '../stores';

  export let params;

  const donorId = params.donorId ?? null;
  var donorData = {};
  var donationDisplay = [];
  var donationDisplayStyle = "none";
  var pageLabel = "";

  const fetchDonorData = (id) => {
    let data = null;

    // Dev
    let tmpArray = $Donors.filter(donor => {
      return donor.id == id;
    })
    data = tmpArray[0] || null;

    // Prod TODO: fetch data assn to data [] Server sends this data structure (crosswalk from db fields done on backend) GET donor/:id

    return data;
  }

  const fetchDonorDonations = (id) => {
    let data = null;

    // Dev
    return $Donations;

    // Prod TODO: fetch gift data from server GET /donor/:id/gifts

    return data;
  }

  const getPageLabel = (donorData) => {
    let label = "Donor";

    if(donorData.lastName.length > 0) {
      label = `${donorData.lastName}`;
      if(donorData.firstName.length > 0) {
        label += `, ${donorData.firstName}`;
      }
    }
    else if(donorData.organization.length > 0) {
      label = `${donorData.organization}`;
    }

    return label;
  }

  const init = () => {
    if(donorId) {
      donorData = fetchDonorData(donorId);

      if(donorData) {
        /* show the donations display */
        donationDisplayStyle = "block";

        /* Set page label to donor name or organization */
        pageLabel = getPageLabel(donorData);

        /* Get donations recieved from this donor, add to display */
        let donationData = fetchDonorDonations(donorId);
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
  <div class="donor-info-section">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonorForm} {donorId} data={donorData} />
  </div>

  <div class="donor-donations-section" style="display:{donationDisplayStyle}">
    <h5>Donations</h5>
    <svelte:component this={DataDisplay} items={donationDisplay} Table={DonorDonationTable}/>
  </div>
</div>

<style>

</style>
