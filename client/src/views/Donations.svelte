<script>
'use strict'

import { onMount } from 'svelte';
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import { Session } from '../libs/session.js';
import DataDisplay from "../components/DataDisplay.svelte";
import DonationTable from "../components/DonationTable.svelte";
import DonationSearchResultsTable from "../components/DonationSearchResultsTable.svelte";
import NewItemLink from "../components/NewItemLink.svelte";
import DataFilterMultiField from "../components/DataFilterMultiField.svelte";
import DaterangeFilter from "../components/DaterangeFilter.svelte";
import SearchBox from "../components/SearchBox.svelte";

const roleId = Session.getDataItem('roleId');
var donations = [];
var donationDisplay = [];
var donationCount = 0;
var donationItemCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var daterangeFilter;
var donationListDisplay = "block";
var donationFilterFormDisplay = "block";
var donationSearchResultsDisplay = "none";
var sortType = "dateOfGift";

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
  sortDataDisplay();
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
  // TODO: Use dataFilter.resetFilters();
  setDataDisplay(donations);
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
  setDataDisplay(daterangeFilter.filterDaterange(donationDisplay));
}

const onDaterangeSelect = (event) => {
  setDataDisplay(event.detail);
}

const onClearDaterange = () => {
  setDataDisplay(dataFilter.filterData(donations));
}

const sortDataDisplay = () => {
  if(sortType == "dateOfGift") {
    donationDisplay = donationDisplay.sort(function(a, b) {
      return a[sortType].localeCompare(b[sortType]);
    });
  }
}

const setDataDisplay = (data) => {
  donationDisplay = data;
  donationCount = donationDisplay.length;

  let totalItems = 0;
  donationDisplay.forEach((donationItem) => {
    totalItems += donationItem.numberOfGifts ?? 0;
  })
  donationItemCount = totalItems;
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
      <div class="col-md-3">
        <div class="filter-form" style="display:{donationFilterFormDisplay}">
          <h6>Filter:</h6>
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>
          <DaterangeFilter data={donationDisplay} on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
          <SearchBox index={donationDisplay} searchFields={searchFields} on:search={onKeywordSearch} bind:this={searchBox} />
        </div>
        <button id="exit-search" on:click={clearSearchResults} style="display:{donationSearchResultsDisplay}">Exit Search</button>
      </div>

      <div class="col-md-9">
        <div style="display:{donationListDisplay}">
          <span class="statistics-display">
            <label>Donations:</label><span>{donationCount}</span><label>Total Items:</label><span>{donationItemCount}</span>
          </span>
          <NewItemLink text="Add anonymous donation" on:click-new-item-link={onClickAddAnonymousDonation} />
          <DataDisplay items={donationDisplay} Table={DonationTable} args={{roleId}}/>
          <!-- <DataDisplay items={donationDisplay} Table={DonationTable} args={{searchResultsDisplay: searchResultsDisplay}}/> -->
        </div>

        <div style="display:{donationSearchResultsDisplay}">
          <!-- <button on:click={clearSearchResults}>Exit Search</button> -->
          <DataDisplay items={searchResults} Table={DonationSearchResultsTable} args={searchField} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .statistics-display {
    float: left;
    margin-bottom: 10px;
  }

  .statistics-display * {
    display: inline-flex;
    flex-direction: row;
  }

  .statistics-display > span {
    margin: 0 8px;
  }

  .statistics-display label {
    font-weight: 500;
  }

  .statistics-display label:not(:first-child) {
    margin-left: 30px
  }

  #exit-search {
    margin-top: 25px;
  }
</style>
