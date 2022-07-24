<script>
'use strict'

import { onMount } from 'svelte';
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import DataDisplay from "../components/DataDisplay.svelte";
import DonationTable from "../components/DonationTable.svelte";
import DonationSearchResultsTable from "../components/DonationSearchResultsTable.svelte";
import NewItemLink from "../components/NewItemLink.svelte";

// DEV
import DataFilter from "../components/DataFilter.svelte";
import DataFilterMultiField from "../components/DataFilterMultiField.svelte";

import DaterangeFilter from "../components/DaterangeFilter.svelte";
import SearchBox from "../components/SearchBox.svelte";

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

var filters = [];
filters.push({
  "groupLabel": "Donor Type:",
  "options": [
  {
    "field": "donorType",
    "value": "0",
    "label": "Show All",
    "function": (item) => {
      return true;
    },
    "isDefault": true
  },
  {
    "field": "donorType",
    "value": "1",
    "label": "Known",
    "function": (item) => {
      return item.donorId != 1;
    }
  },
  {
    "field": "donorType",
    "value": "2",
    "label": "Anonymous",
    "function": (item) => {
      return item.donorId == 1;
    }
  }
]});
filters.push({
  "groupLabel": "Donation Type:",
  "options": [
  {
    "field": "donationType",
    "value": "0",
    "label": "Show All",
    "function": (item) => {
      return true;
    },
    "isDefault": true
  },
  {
    "field": "donationType",
    "value": "1",
    "label": "Standard",
    "function": (item) => {
      return item.important == 0;
    }
  },
  {
    "field": "donationType",
    "value": "2",
    "label": "Important",
    "function": (item) => {
      return item.important == 1;
    }
  }
]});

const init = async () => {
  donations = await getDonationList();
  showAllDonations();
}

const getDonationList = async () => {
  let list = [],
      url = `${$Configuration.donorApiDomain}/donation`;

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

const showAllDonations = () => {
  // TODO: use dataFilter.resetFilters();
  donationDisplay = donations;
}

const onClickEditDonation = (event) => {
  // TODO: Get id from clicked item, redirect to url "/donor/{id}"
}

const onKeywordSearch = (event) => {
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
  donationDisplay = event.detail;
}

const onClearDaterange = () => {
  donationDisplay = dataFilter.filterData(donations);
}

const sortDataDisplay = () => {
  if(sortType.field == "dateOfRecord") {

  }
}

const onClickAddAnonymousDonation = () => {
  window.location.replace("/donation/donor/1");
}

init();
</script>

<div class="page">
  <h1>Donations</h1>

  <div class="container data-display-form">
    <div class="row">
      <div class="col-md">
        <div style="display:{donationFilterFormDisplay}">
          <h6>Filter:</h6>
          <!-- <DataFilter data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/> -->
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>

          <DaterangeFilter data={donationDisplay} on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
        </div>
      </div>
      <div class="col-md">
        <SearchBox index={donationDisplay} searchFields={searchFields} on:search={onKeywordSearch} bind:this={searchBox} />
      </div>
    </div>
  </div>

  <NewItemLink text="Add anonymous donation" on:click-new-item-link={onClickAddAnonymousDonation} />
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
