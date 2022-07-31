<script>
import { ajaxRequest } from '../libs/ajax.js';
import { Configuration } from '../config';
import DataDisplay from "../components/DataDisplay.svelte";
import NewItemLink from "../components/NewItemLink.svelte";
import LivingLibraryTable from "../components/LivingLibraryTable.svelte";
import LivingLibraryForm from "../components/LivingLibraryForm.svelte";
import DataFilterMultiField from "../components/DataFilterMultiField.svelte";

export let params;

var donations = [];
var donationDisplay = [];
var donationCount = 0;
var donationItemCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var daterangeFilter;
var filters = [];
var sortOptions = {};
var donationFilterFormDisplay = true;
// var donationListDisplay = "block";
// var donationFilterFormDisplay = "block";
// var donationSearchResultsDisplay = "none";

/*
 * Init page
 */
const init = async () => {
  sortOptions = {
    field: "donor_date_of_donation",
    type: "desc"
  }

  filters.push({
    "groupLabel": "Label:",
    "options": [
    {
      "field": "status",
      "value": "0",
      "label": "Queued",
      "function": (item) => {
        return item.is_completed == 0;
      },
      "isDefault": true
    },
    {
      "field": "status",
      "value": "1",
      "label": "Completed",
      "function": (item) => {
        return item.is_completed == 1;
      }
    }
  ]});

  let data = await getDonationList();
  donations = parseViewData(data);
  setDataDisplay( dataFilter.filterData(donations) );
}
/*
 * End Init page
 */

/*
 * Data display init functions
 */
const getDonationList = async () => {
  let list = [],
      url = `${$Configuration.livingLibraryApiDomain}/donations`;

  let queryData = {
    'api_key': $Configuration.livingLibraryApiKey
  }

  return new Promise((resolve, reject) => {
    ajaxRequest('GET', url, function(error, response) {
      if(error) {
        console.error(error);
        resolve([]);
      }
      if(response) resolve(response.json());
    }, null, null, queryData);
  });
}

const parseViewData = (data) => {
  let viewData = [], viewItem;
  for(let {id, is_completed, donor, recipient} of data) {
    viewItem = {id, is_completed, ...JSON.parse(donor), ...JSON.parse(recipient)}
    viewData.push(viewItem);
  }
  return viewData;
}

const setDataDisplay = (data) => {
  donationDisplay = data;
  sortDataDisplay();
  donationCount = donationDisplay.length;

  // let totalItems = 0;
  // donationDisplay.forEach((donationItem) => {
  //   totalItems += donationItem.numberOfGifts ?? 0;
  // })
  //donationItemCount = totalItems;
}
/*
 * End Data display init functions
 */

/*
 * Data display user options
 */
const sortDataDisplay = () => {
  console.log("Sorting")
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

/* Standard filter functions */
const onFilter = (event) => {
  // Set data display to data from standard filter
  setDataDisplay(event.detail);

  // Filter current daterange
  //setDataDisplay(daterangeFilter.filterDaterange( event.detail ));
}
/* End standard filter functions */

/* Daterange filter functions */
const onDaterangeSelect = (event) => {
  setDataDisplay(event.detail);
}

const onClearDaterange = () => {
  setDataDisplay(dataFilter.filterData(donations));
}
/* End daterange filter functions */
/*
 * End Data display user options
 */

init();
</script>

<div class="page">
  <h1>Living Library</h1>

  <div class="container page-section">
    <div class="row">

      <div class="col-md-3">

        <div class="filter-form" style="display:{donationFilterFormDisplay}">
          <h6>Filter:</h6>
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>
          <!-- <DaterangeFilter data={donationDisplay} on:daterange-select={onDaterangeSelect} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/> -->
          <!-- <SearchBox index={donationDisplay} searchFields={searchFields} on:search={onKeywordSearch} bind:this={searchBox} /> -->
        </div>

      </div>

      <div class="col-md-9">

        <!-- <span class="statistics-display">
          <label>Donations:</label><span>{donationCount}</span><label>Total Items:</label><span>{donationItemCount}</span>
        </span> -->
        <NewItemLink text="New donation" href="#" />
        <!-- <DataDisplay items={donationDisplay} Table={LivingLibraryTable} args={{is_completed}} /> -->
        <svelte:component this={DataDisplay} items={donationDisplay} Table={LivingLibraryTable} />

        <!-- <div style="display:{donationSearchResultsDisplay}">
          <button on:click={clearSearchResults}>Exit Search</button>
          <DataDisplay items={searchResults} Table={DonationSearchResultsTable} args={searchField} />
        </div> -->
      </div>

    </div>
  </div>

</div>

<style>

</style>
