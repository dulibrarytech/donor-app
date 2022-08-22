<script>
'use strict'

import { onMount } from 'svelte';
import lscache from 'client-cache';

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
import StateDisplay from "../components/StateDisplay.svelte";

var roleId;
var donations = [];
var donationDisplay = [];
var donationCount = 0;
var donationItemCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var filters = [];
var daterangeFilter;
var dateRange = null;
var donationListDisplay = "block";
var donationFilterFormDisplay = "block";
var donationSearchResultsDisplay = "none";

/*
 * Page configuration
 */
var sortOptions = {
  field: "dateOfGift",
  type: "desc"
};

var searchFields = [
  {fieldName: "giftDescription", fieldLabel: "Description"},
  {fieldName: "giftDetails", fieldLabel: "Details"}
];

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
      return item.important == 0 && item.donorId != 1;
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
/*
 * End Page configuration
 */

/*
 * Init page
 */
const init = async () => {
  roleId = Session.getDataItem("donor_db", 'roleId');
  donations = await getDonationList();
  setDataDisplay(donations);

  if(lscache.get('donation_search_results')) {
    searchResults = lscache.get('donation_search_results').results;
    searchField = lscache.get('donation_search_results').field;
    showSearchResults();
  }
}
/*
 * End Init page
 */

/*
 * Data display init functions
 */
const getDonationList = async () => {
  let list = [],
      url = `${$Configuration.donorApiDomain}/donation`;

  return new Promise((resolve, reject) => {
    ajaxRequest('GET', url, function(error, response, status) {
      if(error) {
        console.error(error);
        resolve([]);
      }
      else if(status != 200) resolve([]);
      else resolve(response.json());
    });
  });
}

/* Update data display and item count display */
const setDataDisplay = (data) => {
  donationDisplay = data;
  sortDataDisplay();

  let totalItems = 0;
  donationCount = donationDisplay.length;
  donationDisplay.forEach((donationItem) => {
    totalItems += donationItem.numberOfGifts ?? 0;
  })
  donationItemCount = totalItems;
}
/*
 * End Data display init functions
 */

/*
 * Data display user options
 */
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

/* Keyword search functions */
const onKeywordSearch = (event) => {
  searchResults = event.detail.results;
  searchField = event.detail.field;
  lscache.set('donation_search_results', {
    results: searchResults,
    field: searchField
  });
  showSearchResults();
}

const showSearchResults = () => {
  donationListDisplay = "none";
  donationFilterFormDisplay = "none";
  donationSearchResultsDisplay = "block";
}

const clearSearchResults = () => {
  lscache.flush();
  searchBox.reset();
  searchResults = [];
  searchField = "";
  donationListDisplay = "block";
  donationFilterFormDisplay = "block";
  donationSearchResultsDisplay = "none";
}
/* End keyword search functions */

/* Standard filter functions */
const onFilter = (event) => {
  let data = event.detail;
  if(dateRange) {data = daterangeFilter.filterDaterange(event.detail)}
  setDataDisplay(data);
}
/* End standard filter functions */

/* Daterange filter functions */
const onDaterangeSelect = (event) => {
  dateRange = event.detail.daterange || null;
  donationDisplay = dataFilter.filterData(donations)
  //setDataDisplay(event.detail.data);
  setDataDisplay(daterangeFilter.filterDaterange(donationDisplay));
}

const onClearDaterange = () => {
  dateRange = null;
  setDataDisplay(dataFilter.filterData(donations));
}
/* End daterange filter functions */
/*
 * End Data display user options
 */

onMount(() => {
 init();
})
</script>

<div class="page">
  <h1>Donations</h1>

  <div class="container page-section">
    <div class="row">
      <div class="col-md-3">
        <div class="filter-form" style="display:{donationFilterFormDisplay}">
          <h6>Filter:</h6>
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>
          <DaterangeFilter data={donationDisplay} dateField="dateOfGift" on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>

          <h6>Keyword Search:</h6>
          <SearchBox index={donationDisplay} searchFields={searchFields} on:search={onKeywordSearch} bind:this={searchBox} />
        </div>
        <button id="exit-search" on:click={clearSearchResults} style="display:{donationSearchResultsDisplay}">Exit Search</button>
      </div>

      <div class="col-md-9">
        <div style="display:{donationListDisplay}">
          <div style="display: grid">
            <StateDisplay data={[{label: "Donations", value: donationCount || ""}, {label: "Total Items", value: donationItemCount || ""}]} displayClass="statistics-display" />
            {#if dateRange}
              <StateDisplay data={[{label: "From", value: dateRange.fromDate || ""}, {label: "To", value: dateRange.toDate || ""}]} displayClass="daterange-display" />
            {/if}
          </div>
          <NewItemLink text="Add anonymous donation" href="/donation/donor/1" />
          <DataDisplay items={donationDisplay} Table={DonationTable} args={{roleId}}/>
        </div>

        <div style="display:{donationSearchResultsDisplay}">
          <DataDisplay items={searchResults} Table={DonationSearchResultsTable} args={{searchField}} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .state-data {
    float: left;
    margin-bottom: 10px;
  }

  .state-data * {
    display: inline-flex;
    flex-direction: row;
  }

  .state-data > span {
    margin: 0 8px;
  }

  .state-data label {
    font-weight: 500;
  }

  .state-data label:not(:first-child) {
    margin-left: 30px
  }

  #exit-search {
    margin-top: 25px;
  }

  :global(.form-group > label) {
    margin-bottom: 5px;
  }
</style>
