<script>
  import { onMount } from 'svelte';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";
  import TextFilter from "../components/TextFilter.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  // Dev
  import { Donors } from '../stores';

  var donors = [];
  var donorDisplay = [];

  /* Initializes page components */
  const init = () => {
    // TODO: Feedback message "Retrieving donors..." in display window, then remove after getDonorList() returns
    //onMount(async () => {
      donors = getDonorList();
      console.log("Init donors page, donors:", donors)
      showAllDonors();
    //});
  }

  /* Fetches an array containing all donors from the backend api */
  const getDonorList = () => {
    // Dev: Fetch donor list from store
    return $Donors;

    // TODO: Prod: Fetch donor list from server
    // let list = [];
    // let endpoint = "https://jsonplaceholder.typicode.com/posts"; // Get from config
    //
    // const response = await fetch(endpoint);
    // list = await response.json();
    // return list;
  }

  const onFilter = (event) => {
    donorDisplay = event.detail;
  }

  /* Remove any filters from the donor display */
  const showAllDonors = () => {
    donorDisplay = donors;
  }

  const onClickAddNewDonor = () => {
    window.location.replace("/donor");
  }

  const onClickEditDonor = (event) => {
    // TODO: Get id from clicked item, redirect to url "/donor/{id}"
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
