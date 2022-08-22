<script>
  import { onMount } from 'svelte';
  import { ajaxRequest, fetchData } from '../libs/ajax.js';
  import { Configuration } from '../config';
  import { Session } from '../libs/session.js';
  import PageTitleLabel from "../components/PageTitleLabel.svelte";
  import DonorForm from "../components/DonorForm.svelte";
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonationTable from "../components/DonationTable.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  export let params;

  const donorId = params.id ?? null;
  const roleId = Session.getDataItem("donor_db", 'roleId');
  const addDonationPath = `/donation/donor/${donorId}`;

  const donorUrl = `${$Configuration.donorApiDomain}/donor/${donorId ?? ""}`;
  const donorDonationUrl = `${$Configuration.donorApiDomain}/donation/donor/${donorId ?? ""}`;
  const donorTitlesUrl = `${$Configuration.donorApiDomain}/donor/titles/list`;

  var donorData = {};
  var donorTitles = [];
  var donationDisplay = [];
  var pageLabel = "";
  var sortOptions = {
    field: "dateOfGift",
    type: "desc"
  }

  const init = async () => {
    /* If there is a donor ID, get the data for that donor in the form and get the donation list */
    if(donorId && donorId > 1) {
      donorData = await fetchData(donorUrl);
      donorTitles = await fetchData(donorTitlesUrl);

      /* Create page label displaying donor name/info, and fetch the donations from the donor */
      if(Object.keys(donorData).length > 0) {
        pageLabel = getPageLabel(donorData);
        let donationData = await fetchData(donorDonationUrl);
        if(donationData) donationDisplay = donationData;
        sortDataDisplay();
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
      donorTitles = await fetchData(donorTitlesUrl);
    }
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

  const sortDataDisplay = () => {
    let {type, field} = sortOptions;
    if(type == "asc") {
      donationDisplay = donationDisplay.sort(function(a, b) {
        return a[field]?.localeCompare(b[field]);
      });
    }
    else if(type == "desc") {
      donationDisplay = donationDisplay.sort(function(b, a) {
        return a[field]?.localeCompare(b[field]);
      });
    }
  }

  const completeLetterAction = (event) => {
    let donationId = event.detail;
    let url = `${$Configuration.donorApiDomain}/donation/${donationId}/letter`;

    console.log("Updating donation status...");
    ajaxRequest("post", url, function(error, response, status) {
      if(error) console.error(`Ajax error: ${error}`);
      else if(status != 200) console.error(`Response status: ${status}`);
      else {
        console.log("Donation record updated.");
        init();
      }
    });
  }

  onMount(() => {
    init();
  })
</script>

<div class="page">
  <div class="page-section donor-form">
    <h3>{pageLabel}</h3>
    <svelte:component this={DonorForm} {donorId} data={donorData} titles={donorTitles}/>
  </div>
  {#if donorId}
    <div class="page-section">
      <h3>Donations</h3>
      <NewItemLink text="Add new donation" href={addDonationPath} />
      <svelte:component this={DataDisplay} items={donationDisplay} Table={DonationTable} args={{donorId, roleId}} on:complete-action={completeLetterAction}/>
    </div>
  {/if}
</div>

<style>
 .donor-form {
   max-width: 1260px;
 }
</style>
