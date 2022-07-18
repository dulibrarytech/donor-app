<script>
  import { onMount } from 'svelte';
  import { Configuration } from '../config';
  import { ajaxRequest } from '../libs/ajax.js';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";
  import TextFilter from "../components/TextFilter.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  var donors = [];
  var donorDisplay = [];

  /* Initializes page components */
  const init = async () => {
    // TODO: Feedback message "Retrieving donors..." in display window, then remove after getDonorList() returns
    donors = await getDonorList();
    showAllDonors();
  }

  const getDonorList = async () => {
    let list = [],
        url = `${$Configuration.donorApiDomain}/donor`;

    return new Promise((resolve, reject) => {
      ajaxRequest('GET', url, function(error, response) {
        if(error) {
          console.error(error);
          resolve([]);
        }
        if(response) resolve(response.json());
      });
    });
  }

  const onFilter = (event) => {
    donorDisplay = event.detail;
  }

  /* Removes any filters from the donor display */
  const showAllDonors = () => {
    donorDisplay = donors;
  }

  const onClickAddNewDonor = () => {
    window.location.replace("/donor");
  }

  init();
</script>

<div class="page">
  <h1>Donors</h1>

  <div class="data-display-form">
    <TextFilter data={donors} on:filter={onFilter} placeholderText="Search by any part of name or organization" />
  </div>

  <NewItemLink text="Add new donor" on:click-new-item-link={onClickAddNewDonor} />
  <div class="data-display">
    <svelte:component this={DataDisplay} items={donorDisplay} Table={DonorTable}/>
  </div>
</div>

<style>
  input#donor-searchbox {
    min-width: 21em;
  }
</style>
