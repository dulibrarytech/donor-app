<script>
/*
 * Living Library Donations page
 * Display donation table and data filters
 */

'use-strict'

import { ajaxRequest, fetchData } from '../libs/ajax.js';
import { Configuration } from '../config';
import { ExportToCsv } from 'export-to-csv';
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
var donationDisplay = null;
var donationCount = 0;
var searchBox;
var searchResults = [];
var searchField = "";
var dataFilter;
var textFilter;
var daterangeFilter;
var donationFilterFormDisplay;
var messageDisplay;
var dateRange = {
  from: null,
  to: null
}

const apiKey  = $Configuration.livingLibraryApiKey;
var donationsUrl = `${$Configuration.livingLibraryApiDomain}/donations?api_key=${apiKey}`;

var sortOptions = {
  field: "donor_date_of_donation",
  type: "desc"
};

var textFilterFields = [
  "donor_date_of_donation",
  "id",
  "donor_full_name",
  "recipient_full_name"
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
  donationFilterFormDisplay = true;
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

const parseViewData = (data) => {
  let viewData = [], viewItem;
  for(let {id, is_completed, donor, recipient} of data) {
    viewItem = {id, is_completed, ...JSON.parse(donor), ...JSON.parse(recipient)}
    viewItem['donor_full_name'] = `${viewItem.donor_title} ${viewItem.donor_first_name} ${viewItem.donor_last_name}`;
    viewItem['recipient_full_name'] = `${viewItem.recipient_title} ${viewItem.recipient_first_name} ${viewItem.recipient_last_name}`;
    viewData.push(viewItem);
  }
  return viewData;
}

const setDataDisplay = (data=null) => {
  donationDisplay = data == null ? donations : data;
  sortDataDisplay();
  donationCount = donationDisplay.length;
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

const onDaterangeFilter = (event) => {
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

const exportData = () => {
  let csvData = [];

  for(let item of donationDisplay) {
    csvData.push({
      id: item.id,
      donor: `${item.donor_title} ${item.donor_first_name} ${item.donor_last_name}`,
      recipient: `${item.recipient_title} ${item.recipient_first_name} ${item.recipient_last_name}`,
      amount: `${item.donor_amount_of_donation}`,
      date: `${item.donor_date_of_donation}`
    });
  }

  let filename = "living_library_donations";
  if(dateRange.from && dateRange.to) filename += `__${dateRange.from}_to_${dateRange.to}`;

  const csvExporter = new ExportToCsv({
    showLabels: true,
    showTitle: false,
    filename,
    title: 'Living Library Donations',
    useKeysAsHeaders: false,
    headers: ['ID', 'Donor Name', 'Recipient Name', 'Donation Amount', 'Date of Donation']
  });

  csvExporter.generateCsv(csvData);
}

init();
</script>

<div class="page">
  <h3>Living Library</h3>

  <div class="container page-section">
    <div class="row">
      <div class="col-md-3">
        <div class="filter-form" style="display:{donationFilterFormDisplay}">
          <h6>Search:</h6>
          <TextFilter data={donations} on:filter-text={onTextFilter} on:text-filter-change-option={onTextFilter} filterFields={textFilterFields} placeholderText="All Fields" bind:this={textFilter}/>
          <h6>Daterange:</h6>
          <DaterangeFilter data={donationDisplay} dateField="donor_date_of_donation" on:daterange-select={onDaterangeFilter} on:clear-daterange={onClearDaterange} bind:this={daterangeFilter}/>
          <h6>Filter:</h6>
          <DataFilterMultiField data={donations} {filters} on:filter={onFilter} bind:this={dataFilter}/>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div class="col-md-6">
            <DescriptionList data={[{label: "Donations", value: donationCount || ""}]} displayClass="statistics-display" />
          </div>
          <div class="col-md-6" style="position: relative">
            <div class="add-donation-link">
              <NewItemLink text="New donation" href="{$Configuration.basePath}/livingLibrary/donation" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <svelte:component this={DataDisplay} items={donationDisplay} Table={LivingLibraryTable} on:delete-record={onDeleteRecord}/>
            <MessageDisplay bind:this={messageDisplay} />
            {#if donationDisplay?.length > 0}<button id="export-records" type="button" on:click={exportData}>Export Records</button>{/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .add-donation-link {
    position: absolute;
    bottom: 0;
    right: 15px;
  }

  button#export-records {
    margin-top: 30px;
  }
</style>
