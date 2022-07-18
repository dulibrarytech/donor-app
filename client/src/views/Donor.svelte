<script>
  import { ajaxRequest } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonorForm from "../components/DonorForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonationTable from "../components/DonationTable.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  export let params;

  const donorId = params.id ?? null;
  var donorData = {};
  var donorTitles = [];
  var donationDisplay = [];
  var pageLabel = "";

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

  const fetchDonorDonations = (id) => {
    return new Promise((resolve, reject) => {
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

  const fetchDonorTitles = (id) => {
    return new Promise((resolve, reject) => {
      let url = `${$Configuration.donorApiDomain}/donor/titles/list`;
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

  const onClickAddNewDonation = () => {
    if(donorId) {
      window.location.replace(`/donation/donor/${donorId}`);
    }
  }

  const init = async () => {
    /* If there is a donor ID, get the data for that donor in the form and get the donation list */
    if(donorId && donorId > 1) {
      donorData = await fetchDonorData(donorId);
      donorTitles = await fetchDonorTitles();

      if(Object.keys(donorData).length > 0) {
        pageLabel = getPageLabel(donorData);
        let donationData = await fetchDonorDonations(donorId);
        if(donationData) donationDisplay = donationData;
      }

      /* No data for this donor was found */
      else {
        window.location.replace("/notfound");
      }
    }

    /* Do not load anonymous donor */
    else if(donorId == 1) {
      window.location.replace("/notfound");
    }

    /* If no ID, show the new donor form */
    else {
      pageLabel = "New Donor";
      donorTitles = await fetchDonorTitles();
    }
  }

  init();
</script>

<div class="page">
  <div class="donor-data-section">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonorForm} {donorId} data={donorData} titles={donorTitles}/>
  </div>
  {#if donorId}
    <NewItemLink text="Add new donation" on:click-new-item-link={onClickAddNewDonation} />
    <div class="donor-donations-section">
      <h5>Donations</h5>
      <svelte:component this={DataDisplay} items={donationDisplay} Table={DonationTable} args={donorId}/>
    </div>
  {/if}
</div>

<style>

</style>
