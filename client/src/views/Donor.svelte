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

  const init = () => {
    if(donorId) {
      donorData = fetchDonorData(donorId);

      if(donorData) {
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
  <div class="donor-data-section">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonorForm} {donorId} data={donorData} />
  </div>
  {#if donorId}
    <div class="donor-donations-section">
      <h5>Donations</h5>
      <svelte:component this={DataDisplay} items={donationDisplay} Table={DonorDonationTable}/>
    </div>
  {/if}
</div>

<style>

</style>
