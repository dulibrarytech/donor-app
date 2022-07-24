<script>
'use strict'

import {createEventDispatcher} from 'svelte';

export let data;

var fromDate = "";
var toDate = "";
var filteredData = [];
const dispatch = createEventDispatcher();

const onClear = () => {
  fromDate = "";
  toDate = "";
  filteredData = [];
  dispatch('clear-daterange', null);
}

const onSet = () => {
  let filteredData = filterDaterange(data); // TODO: Try to pass this function into dispatch()
  dispatch('daterange-select', filteredData);
}

export const filterDaterange = (currentData) => {
  if(fromDate?.length == 0) {
    // TODO: Give Feedback
    console.log("No from date")
    return currentData;
  }
  else if(toDate?.length == 0) {
    // TODO: Give Feedback
    console.log("No to date")
    return currentData;
  }
  else {
    filteredData = [];
    // TODO: Validate date format, AND to date > from date

    // DEV: Remove after date selector implemented
    let from = new Date(fromDate + "T00:00:00");
    let to = new Date(toDate + "T23:59:59");

    // TEST: Performance, if issues, convert date string to numeric and compare, or string compare
    let itemDate;
    filteredData = currentData.filter((item) => {
      if(item.dateOfGift) {
        itemDate = new Date(item.dateOfGift);

        return (
          itemDate >= from &&
          itemDate <= to
        )
      }
    });

    return filteredData;
  }
}

</script>

<form>
  <div class="form-group">
    <h6>Daterange:</h6>
    <!-- TODO Date selector inputs, output standardized datestring 'yyyy-mm-ddTnn:nn:nn' -->
    <input type="text" placeholder="From" bind:value={fromDate}/>
    <input type="text" placeholder="To" bind:value={toDate}/>
    <button type="button" on:click|preventDefault={onSet}>Apply</button>
    <button type="button" on:click|preventDefault={onClear}>Clear</button>
  </div>
</form>

<style>
  input {
    max-width: 30%;
  }
  .form-group {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 3px;
  }
</style>
