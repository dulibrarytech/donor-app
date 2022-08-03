<script>
import { onMount } from 'svelte';
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import DataDisplay from "../components/DataDisplay.svelte";
import DonorTable from "../components/DonorTable.svelte";
import TextFilter from "../components/TextFilter.svelte";
import NewItemLink from "../components/NewItemLink.svelte";

var donors = [];
var donorDisplay = [];

var donorsUrl = `${$Configuration.donorApiDomain}/donor`;

/*
 * Init page
 */
const init = async () => {
  donors = await getDonorList();
  setDataDisplay(donors);
}

/*
 * Data display init functions
 */
const getDonorList = async () => {
  return new Promise((resolve, reject) => {
    ajaxRequest('GET', donorsUrl, function(error, response, status) {
      if(error) {
        console.error(error);
        resolve([]);
      }
      else if(status != 200) resolve([]);
      else resolve(response.json());
    });
  });
}

const setDataDisplay = (data) => {
  donorDisplay = data;
  sortDataDisplay();
}
/*
 * End Data display init functions
 */

/*
 * Data display user options
 */
const sortDataDisplay = () => {
  // If last name has a value, sort descending on that value. If not, use the organization value
  donorDisplay = donorDisplay.sort(function(a, b) {
    let aVal = a.lastName.length > 1 ? a.lastName : a.organization;
    let bVal = b.lastName.length > 1 ? b.lastName : b.organization;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
}

/* Standard filter functions */
const onFilter = (event) => {
  setDataDisplay(event.detail ? event.detail : donors);
}
/* End standard filter functions */
/*
 * End Data display user options
 */

init();
</script>

<div class="page">
  <h1>Donors</h1>

  <div class="container page-section">
    <div class="row">
      <div class="col-md-3">
        <h6>Filter:</h6>
        <div class="filter-form">
          <TextFilter data={donors} on:filter-text={onFilter} on:text-filter-change-option={onFilter} filterFields={["lastName", "organization"]} placeholderText="Last name or organization" />
        </div>
      </div>

      <div class="col-md-9">
        <NewItemLink text="Add new donor" href="/donor"/>
        <svelte:component this={DataDisplay} items={donorDisplay} Table={DonorTable}/>
      </div>
    </div>
  </div>
</div>

<style>

</style>
