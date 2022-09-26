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
import DescriptionList from "../components/DescriptionList.svelte";
import TextFilter from "../components/TextFilter.svelte";

var donations = [];
var donationDisplay = null;
var donationCount = 0;
var donationItemCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var filters = [];
var daterangeFilter;
var textFilter;
var dateRange = null;
var donationListDisplay = "block";
var donationFilterFormDisplay = "block";
var donationSearchResultsDisplay = "none";

const roleId = Session.getDataItem("donor_db", 'roleId');

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

filters.push({
  "groupLabel": "Status:",
  "options": [
  {
    "field": "status",
    "value": "0",
    "label": "Show All",
    "function": (item) => {
      return true;
    },
    "isDefault": true
  },
  {
    "field": "status",
    "value": "1",
    "label": "Complete",
    "function": (item) => {
      return item.letter == 0 && item.bypassLetter == 0 && item.donorId != 1;
    }
  },
  {
    "field": "status",
    "value": "2",
    "label": "Pending Letter",
    "function": (item) => {
      return item.letter == 1 && item.bypassLetter == 0 && item.donorId != 1;
    }
  },
  {
    "field": "status",
    "value": "3",
    "label": "Letter Bypassed",
    "function": (item) => {
      return item.bypassLetter == 1 && item.donorId != 1;
    }
  }
]});

const init = async () => {
  donations = await getDonationList();
  setDataDisplay(donations);

  if(lscache.get('donation_search_results')) {
    searchResults = lscache.get('donation_search_results').results;
    searchField = lscache.get('donation_search_results').field;
    showSearchResults();
  }
}

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

const filterDataDisplay = (data) => {
  let filtered;
  filtered = dataFilter.filterData(data);
  filtered = daterangeFilter.filterDaterange(filtered);
  return filtered;
}

const onFilter = (event) => {
  let data = event.detail;
  if(dateRange) {data = daterangeFilter.filterDaterange(event.detail)}
  data = textFilter.filterText(data);
  setDataDisplay(data);
}

const onTextFilter = (event) => {
  if(event.detail) setDataDisplay( filterDataDisplay(event.detail ? event.detail : donations) );
  else setDataDisplay(filterDataDisplay(donations));
}

const onDaterangeSelect = (event) => {
  dateRange = event.detail.daterange || null;
  let data = donations;
  data = dataFilter.filterData(data);
  data = daterangeFilter.filterDaterange(data)
  data = textFilter.filterText(data);
  setDataDisplay(data);
}

const onClearDaterange = () => {
  dateRange = null;
  let data = donations;
  data = dataFilter.filterData(data);
  data = textFilter.filterText(data);
  setDataDisplay(data);
}

onMount(() => {
 init();
})
</script>

<div class="page">
  <h3>Donations</h3>

  <div class="container page-section">
    <div class="row">
      <div class="col-md-3">
        <div class="filter-form" style="display:{donationFilterFormDisplay}">
          <h6>Search:</h6>
          <TextFilter data={donations} bind:this={textFilter} on:filter-text={onTextFilter} on:text-filter-change-option={onTextFilter} filterFields={["giftDescription"]} placeholderText="Search description" />
          <h6>Daterange:</h6>
          <DaterangeFilter data={donations} dateField="dateOfGift" on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
          <h6>Filter:</h6>
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>
        </div>
      </div>

      <div class="col-md-9">
        <div style="display:{donationListDisplay}">
          <div style="display: grid; float: left">
            <DescriptionList data={[{label: "Donations", value: donationCount || ""}, {label: "Total Items", value: donationItemCount || ""}]} displayClass="statistics-display" />
            {#if dateRange}
              <DescriptionList data={[{label: "From", value: dateRange.fromDate || ""}, {label: "To", value: dateRange.toDate || ""}]} displayClass="daterange-display" />
            {/if}
          </div>
          <NewItemLink text="Add anonymous donation" href="{$Configuration.basePath}/donation/donor/1" />
          <svelte:component this={DataDisplay} items={donationDisplay} Table={DonationTable} args={{roleId}}/>
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
