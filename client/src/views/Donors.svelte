<script>
  import { onMount } from 'svelte';
  import { Donors } from '../stores';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  /* Option: Import Donors.js module */
  // import Donors from "../modules/Donors.js";
  // Move functions to external module
  /* End option Donors.js module */

  var donors = [];
  var donorDisplay = [];

  /* Fetches an array containing all donors from the backend api */
  const getDonorList = () => {
    // Dev: Fetch donor list from store
    return $Donors;

    // TODO: Fetch donor list from server
    // let list = [];
    // let endpoint = "https://jsonplaceholder.typicode.com/posts";
    //
    // const response = await fetch(endpoint);
    // list = await response.json();
    // return list;
  }

  /* Culls the donors array upon entering search keywords in the search box */
  const filterDataDisplay = (filter = "") => {
    filter = filter.toLowerCase();
    donorDisplay = donorDisplay.filter((item) => {
      return item.lastName.toLowerCase().includes(filter);
    });
  }

  /* Remove any filters from the donor display */
  const showAllDonors = () => {
    donorDisplay = donors;
  }

  const onClickAddNewDonor = () => {
    /* Called on NewItemLink click event */
    console.log("Click add new donor. Display pre-array reset:", donorDisplay)
    donorDisplay = donorDisplay.splice(2,2);
    console.log("Display after array reset:", donorDisplay)
  }

  const onFilterInput = (event) => {
    if(event.target.value.length > 0) {
      /* Any validation goes here */
      filterDataDisplay(event.target.value)
    }
    else {
      donorDisplay = donors;
    }
  }

  /* Initializes page components */
  const init = () => {
    // TODO: Feedback message "Retrieving donors..." in display window, then remove after getDonorList() returns
    //onMount(async () => {
      donors = getDonorList();
      console.log("Init donors page, donors:", donors)
      showAllDonors();
    //});
  }

  init();
</script>

<div class="page">
  <h1>Donors</h1>

  <div class="search-form">
    <label for="donor-searchbox">Filter:</label>
    <input id="donor-searchbox" type="text" on:input={onFilterInput} placeholder="Search by any part of name or organization"/>
  </div>

  <NewItemLink text="Add new donor" on:click-new-item-link={onClickAddNewDonor} />

  <div id="donor-list">
    <svelte:component this={DataDisplay} items={donorDisplay} Table={DonorTable}/>
    <!-- <DataDisplay bind:items={donorDisplay} Table={DonorTable} /> -->
  </div>
</div>

<style>
  /* Styles specific to the donor page. Should not be many here */
  input#donor-searchbox {
    min-width: 21em;
  }
</style>
