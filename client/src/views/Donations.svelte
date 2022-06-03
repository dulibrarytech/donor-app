<script>
  import { onMount } from 'svelte';
  import MiniSearch from 'minisearch';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonationTable from "../components/DonationTable.svelte";
  import DonationSearchResultsTable from "../components/DonationSearchResultsTable.svelte";
  import NewItemLink from "../components/NewItemLink.svelte";

  // Dev
  import {Donations} from '../stores';

  var donations = [];
  var donationDisplay = [];
  var searchKeywords = "";
  var searchField = 'giftDescription';
  var searchResults = [];
  var donationListDisplay = "block";
  var donationFilterFormDisplay = "block";
  var donationSearchResultsDisplay = "none";
  var filter = {
    fromDate: null,
    toDate: null,
    donorType: [],
    donationType: []
  }

  /* Initializes page components */
  const init = () => {
    // TODO: Feedback message "Retrieving donation..." in display window, then remove after getDonationList() returns
    //onMount(async () => {
      donations = getDonationList();
      console.log("Init donations page, donations:", donations)
      showAllDonations();
    //});
  }

  const resetFilters = () => {
    console.log("Resetting filters")
    filter = {
      fromDate: null,
      toDate: null,
      donorType: [],
      donationType: []
    }
  }

  /* Fetches an array containing all donors from the backend api */
  const getDonationList = () => {
    // Dev: Fetch donor list from store
    return $Donations;

    // TODO: Prod: Fetch donation list from server
    // let list = [];
    // let endpoint = "https://jsonplaceholder.typicode.com/posts"; // Get from config
    //
    // const response = await fetch(endpoint);
    // list = await response.json();
    // return list;
  }

  /* Remove any filters from the donor display */
  const showAllDonations = () => {
    resetFilters();
    donationDisplay = donations;
  }

  const onClickAddNewDonation = () => {
    window.location.replace("/donation");
  }

  const onClickEditDonation = (event) => {
    // TODO: Get id from clicked item, redirect to url "/donor/{id}"
  }

  const onKeywordSearch = (event) => {
    console.log("onKeywordSearch terms:", searchKeywords)
    console.log("onKeywordSearch searchField group:", searchField)

    // To initSearchIndex()
    let miniSearch = new MiniSearch({
      fields: [searchField],
      storeFields: ['id']
    })
    // To initSearchIndex()
    miniSearch.addAll(donationDisplay)

    let results = miniSearch.search(searchKeywords, {prefix: true, fuzzy: 0.2})
    searchResults = donationDisplay.filter((item) => {
      return results.some(e => e.id === item.id);
    });

    showSearchResults();
  }

  const clearSearchResults = () => {
    searchResults = [];
    searchKeywords = "";
    donationListDisplay = "block";
    donationFilterFormDisplay = "block";
    donationSearchResultsDisplay = "none";
  }

  const showSearchResults = () => {
    donationListDisplay = "none";
    donationFilterFormDisplay = "none";
    donationSearchResultsDisplay = "block";
  }

  const onDaterangeSearch = (event) => {
    filterDataDisplay(filter);
  }

  const onSelectFilterOption = (event) => {
    filterDataDisplay(filter);
  }

  const filterDataDisplay = (filter) => {
    donationDisplay = donations;

    /* Donor type filter */
    if(filter.donorType.length > 0) {
      for(let type of filter.donorType) {
        donationDisplay = donationDisplay.filter((item) => {

          // TODO: Implement radio group, if 'known donor' return item.donorId != 1
          return item.donorId == 1;
        });
      }
    }

    /* Donation type filter */
    if(filter.donationType.length > 0) {
      for(let type of filter.donationType) {
        donationDisplay = donationDisplay.filter((item) => {
          return item.important == 1;
        });
      }
    }

    /* Daterange filter */
    if(filter.fromDate && filter.toDate) {
      console.log("Daterange filter selected:", filter.fromDate, filter.toDate)

      // TODO: Validate date format, AND to date > from date

      let from = new Date(filter.fromDate + "T00:00:00");
      let to = new Date(filter.toDate + "T23:59:59");

      // TEST: Performance, if issues, convert date string to numeric and compare, or string compare
      let itemDate;
      donationDisplay = donationDisplay.filter((item) => {
        if(item.dateOfGift) {
          itemDate = new Date(item.dateOfGift);
          return (
            itemDate >= from &&
            itemDate <= to
          )
        }
      });
    }
  }

  const sortDataDisplay = () => {
    if(sortType.field == "dateOfRecord") {

    }
  }

  init();
</script>

<div class="page">
  <h1>Donations</h1>

  <div class="container data-display-controls">
    <div class="row">
      <div class="col-md">

        <!-- Filter form -->
        <form id="donation-filter" style="display:{donationFilterFormDisplay}">
          <label>Filter:</label>
          <div class="form-group">
            <div class="form-check">
              <input id="donor-type-anonymous" class="form-check-input" type="checkbox" value="anonymous" bind:group={filter.donorType} on:change={onSelectFilterOption}>
              <label class="form-check-label" for="donor-type-anonymous">
                Anonymous Donors
              </label>
            </div>
            <div class="form-check">
              <input id="donation-type-important" class="form-check-input" type="checkbox" value="important" bind:group={filter.donationType} on:change={onSelectFilterOption}>
              <label class="form-check-label" for="donation-type-important">
                Hand Typed Letter
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Daterange:</label>
            <input type="text" placeholder="From" bind:value={filter.fromDate}/>
            <input type="text" placeholder="To" bind:value={filter.toDate}/>
            <button on:click|preventDefault={onDaterangeSearch}>Apply</button>
          </div>
        </form>
      </div>
      <div class="col-md">

        <!-- Search form -->
        <form id="donations-keyword-search">
          <div class="form-group search-form">
            <label for="donation-searchbox">Keyword Search:</label>
            <input id="donation-searchbox" type="text" bind:value={searchKeywords} placeholder="Search descriptions"/>
            <button on:click|preventDefault={onKeywordSearch}>Search</button>
          </div>

          <div class="form-group radio-group">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchField" value="giftDescription" bind:group={searchField} on:change={onKeywordSearch} id="search-donation-description-option" checked={searchField=='giftDescription'}>
              <label class="form-check-label" for="search-donation-description-option">
                Search Description
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchField" value="giftDetails" bind:group={searchField} on:change={onKeywordSearch} id="search-donation-details-option" checked={searchField=='giftDetails'}>
              <label class="form-check-label" for="search-donation-details-option">
                Search Details
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="donation-list" style="display:{donationListDisplay}">
    <DataDisplay items={donationDisplay} Table={DonationTable} />
  </div>

  <div id="donation-search-results" style="display:{donationSearchResultsDisplay}">
    <button on:click={clearSearchResults}>Exit Search</button>
    <DataDisplay items={searchResults} Table={DonationSearchResultsTable} args={searchField} />
  </div>
</div>

<style>
  .radio-group {
    display: inline-flex;
  }

  .radio-group .form-check:not(:first-child) {
    margin-left: 2em;
  }

  input#donation-searchbox {
    min-width: 21em;
  }
</style>
