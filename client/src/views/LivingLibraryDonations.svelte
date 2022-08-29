<script>
'use-strict'
/*
 * Living Library Donations page
 * Display donation table and data filters
 */

import { ajaxRequest, fetchData } from '../libs/ajax.js';
import { Configuration } from '../config';
import DataDisplay from "../components/DataDisplay.svelte";
import NewItemLink from "../components/NewItemLink.svelte";
import LivingLibraryTable from "../components/LivingLibraryTable.svelte";
import DataFilterMultiField from "../components/DataFilterMultiField.svelte";
import DaterangeFilter from "../components/DaterangeFilter.svelte";
import TextFilter from "../components/TextFilter.svelte";
import MessageDisplay from "../components/MessageDisplay.svelte";
import DescriptionList from "../components/DescriptionList.svelte";

export let params;

var donations = [];
var donationDisplay = [];
var donationCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var textFilter;
var daterangeFilter;
var donationFilterFormDisplay = true;
var messageDisplay;

const apiKey  = $Configuration.livingLibraryApiKey;
var donationsUrl = `${$Configuration.livingLibraryApiDomain}/donations?api_key=${apiKey}`;

var sortOptions = {
  field: "donor_date_of_donation",
  type: "desc"
};

var textFilterFields = [
  "donor_date_of_donation",
  "id",
  "donor_first_name",
  "donor_last_name",
  "recipient_first_name",
  "recipient_last_name"
];

var filters = [
  {
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
      },
      {
        "field": "status",
        "value": "2",
        "label": "Show All",
        "function": (item) => {
          return 1;
        }
      }
    ]
  }
];

const init = () => {
  refreshData();
}

const refreshData = async () => {
  let data = await fetchData(donationsUrl);
  donations = parseViewData(data);
  setDataDisplay(dataFilter.filterData(donations));
}

const onDeleteRecord = async (event) => {
 let id = event.detail;
 deleteRecord(id);
}

const deleteRecord = (donationId) => {
 ajaxRequest("delete", donationsUrl, (error, response, status) => {
   if(error) {
     messageDisplay.displayTimeoutMessage("Error");
   }
   else if(status != 204) {
     messageDisplay.displayTimeoutMessage("Error");
   }
   else {
     messageDisplay.displayTimeoutMessage("Record deleted");
     refreshData();
   }
 }, null, null, {id: donationId});
}

/*
 * Data display functions
 */
const parseViewData = (data) => {
  let viewData = [], viewItem;
  for(let {id, is_completed, donor, recipient} of data) {
    viewItem = {id, is_completed, ...JSON.parse(donor), ...JSON.parse(recipient)}
    viewData.push(viewItem);
  }
  return viewData;
}

const setDataDisplay = (data=null) => {
  donationDisplay = data == null ? donations : data;
  sortDataDisplay();
  donationCount = donationDisplay.length;
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

/* Filter functions */
const onFilter = (event) => {
  donationDisplay = daterangeFilter.filterDaterange(event.detail);
  setDataDisplay(textFilter.filterText(donationDisplay) || donationDisplay);
}

const onDaterangeFilter = (event) => {
  donationDisplay = dataFilter.filterData(donations);
  donationDisplay = daterangeFilter.filterDaterange(donationDisplay);
  setDataDisplay(textFilter.filterText(donationDisplay) || donationDisplay);
}

const onClearDaterange = () => {
  donationDisplay = dataFilter.filterData(donations)
  setDataDisplay(textFilter.filterText(donationDisplay) || donationDisplay);
}

const onTextFilter = (event) => {
  donationDisplay = dataFilter.filterData(event.detail || donations);
  setDataDisplay(daterangeFilter.filterDaterange(donationDisplay));
}
/* End Filter functions */
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
          <DaterangeFilter data={donationDisplay} dateField="donor_date_of_donation" on:daterange-select={onDaterangeFilter} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
          <TextFilter data={donations} on:filter-text={onTextFilter} on:text-filter-change-option={onTextFilter} filterFields={textFilterFields} placeholderText="All Fields" bind:this={textFilter}/>
        </div>
      </div>

      <div class="col-md-9">
        <DescriptionList data={[{label: "Donations", value: donationCount || ""}]} displayClass="statistics-display" />
        <NewItemLink text="New donation" href="{$Configuration.basePath}/livingLibrary/donation" />
        <svelte:component this={DataDisplay} items={donationDisplay} Table={LivingLibraryTable} on:delete-record={onDeleteRecord}/>
        <MessageDisplay bind:this={messageDisplay} />
      </div>

    </div>
  </div>

</div>

<style>

</style>
