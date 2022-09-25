<script>
import { onMount } from 'svelte';
import { Configuration } from '../config';
import { ajaxRequest } from '../libs/ajax.js';
import DataDisplay from "../components/DataDisplay.svelte";
import DonorTable from "../components/DonorTable.svelte";
import TextFilter from "../components/TextFilter.svelte";
import NewItemLink from "../components/NewItemLink.svelte";
import DescriptionList from "../components/DescriptionList.svelte";

var donors = [];
var donorDisplay = null;

var donorsUrl = `${$Configuration.donorApiDomain}/donor`;

const init = async () => {
  donors = await getDonorList();
  setDataDisplay(donors);
}

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

const onFilter = (event) => {
  setDataDisplay(event.detail ? event.detail : donors);
}

onMount(() => {
  init();
})
</script>

<div class="page">
  <h1>Donors</h1>

  <div class="container page-section">
    <div class="row">
      <div class="col-md-3">
        <h6>Search:</h6>
        <div class="filter-form">
          <TextFilter data={donors} on:filter-text={onFilter} on:text-filter-change-option={onFilter} filterFields={["lastName", "organization", "firstName"]} placeholderText="Last name, organization, first name" />
        </div>
      </div>

      <div class="col-md-9">
        <div>
          <div style="float: left">
            <DescriptionList data={[{label: "Donors", value: donorDisplay?.length ?? "0"}]} displayClass="statistics-display" />
          </div>
          <NewItemLink text="Add anonymous donation" href="{$Configuration.basePath}/donation/donor/1"/>
          <NewItemLink text="Add new donor" href="{$Configuration.basePath}/donor"/>
        </div>
        <svelte:component this={DataDisplay} items={donorDisplay} Table={DonorTable}/>
      </div>
    </div>
  </div>
</div>

<style>

</style>
