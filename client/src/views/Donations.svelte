<script>
'use strict'

import { onMount } from 'svelte';
import { Configuration } from '../config';
import DataDisplay from "../components/DataDisplay.svelte";
import DonationTable from "../components/DonationTable.svelte";
import DonationSearchResultsTable from "../components/DonationSearchResultsTable.svelte";
import NewItemLink from "../components/NewItemLink.svelte";
import DataFilter from "../components/DataFilter.svelte";
import DaterangeFilter from "../components/DaterangeFilter.svelte";
import SearchBox from "../components/SearchBox.svelte";

// Dev
import {Donations} from '../stores';

var donations = [];
var donationDisplay = [];
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var daterangeFilter;
var donationListDisplay = "block";
var donationFilterFormDisplay = "block";
var donationSearchResultsDisplay = "none";

const searchFields = [
  {fieldName: "giftDescription", fieldLabel: "Description"},
  {fieldName: "giftDetails", fieldLabel: "Details"}
]

// TODO: filter function defs. Remove other filter object
var filters = [
  {
    "field": "donorType",
    "value": "anonymous",
    "label": "Anonymous",
    "function": (item) => {
      return item.donorId == 1;
    }
  },
  {
    "field": "donationType",
    "value": "important",
    "label": "Important",
    "function": (item) => {
      return item.important == 1; // If this filter code is default, set null here
    }
  }
];

const init = async () => {
  // TODO: Use ajaxRequest()
  donations = await getDonationList();
  console.log("Init donations page, donations:", donations)
  showAllDonations();
}

const getDonationList = async () => {
  // Dev: Fetch donor list from store
  //return $Donations;

  let list = [],
      url = `${$Configuration.donorApiDomain}/donation`;

  const response = await fetch(url);
  list = await response.json();
  return list;
}

const showAllDonations = () => {
  // TODO: use dataFilter.resetFilters();
  donationDisplay = donations;
}

const onClickAddNewDonation = () => {
  window.location.replace("/donation");
}

const onClickEditDonation = (event) => {
  // TODO: Get id from clicked item, redirect to url "/donor/{id}"
}

const onKeywordSearch = (event) => {
  console.log("On search data rx:", event.detail)
  searchResults = event.detail.results;
  searchField = event.detail.field;
  showSearchResults();
}

const showSearchResults = () => {
  donationListDisplay = "none";
  donationFilterFormDisplay = "none";
  donationSearchResultsDisplay = "block";
}

const clearSearchResults = () => {
  searchBox.reset();
  searchResults = [];
  searchField = "";
  donationListDisplay = "block";
  donationFilterFormDisplay = "block";
  donationSearchResultsDisplay = "none";
}

const onFilter = (event) => {
  donationDisplay = event.detail;
  donationDisplay = daterangeFilter.filterDaterange(donationDisplay);
}

const onDaterangeSelect = (event) => {
  console.log("Donations on DaterangeSelect event: data from event:", console.dir(event.detail))
  donationDisplay = event.detail;
}

const onClearDaterange = () => {
  console.log("On clear:", dataFilter)
  donationDisplay = dataFilter.filterData(donations);
}

const sortDataDisplay = () => {
  if(sortType.field == "dateOfRecord") {

  }
}

init();
</script>

<div class="page">
  <h1>Donations</h1>

  <div class="container data-display-form">
    <div class="row">
      <div class="col-md">
        <div style="display:{donationFilterFormDisplay}">
          <label>Filter:</label>
          <DataFilter data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>

          <label>Daterange:</label>
          <DaterangeFilter data={donationDisplay} on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
        </div>
      </div>
      <div class="col-md">
        <SearchBox index={donationDisplay} searchFields={searchFields} on:search={onKeywordSearch} bind:this={searchBox} />
      </div>
    </div>
  </div>

  <div style="display:{donationListDisplay}">
    <DataDisplay items={donationDisplay} Table={DonationTable} />
  </div>

  <div style="display:{donationSearchResultsDisplay}">
    <button on:click={clearSearchResults}>Exit Search</button>
    <DataDisplay items={searchResults} Table={DonationSearchResultsTable} args={searchField} />
  </div>
</div>

<style>

</style>
