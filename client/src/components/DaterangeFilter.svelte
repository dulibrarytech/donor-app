<script>
'use strict'

import DatePicker from "./DatePicker.svelte";
import {createEventDispatcher} from 'svelte';

export let data;
export let dateField;

const dispatch = createEventDispatcher();

var fromDate = "";
var toDate = "";
var fromDatePickerDisplay = "none";
var toDatePickerDisplay = "none";
var filteredData = [];

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
  if(fromDate?.length > 0 && toDate?.length > 0) {
    filteredData = [];
    // TODO: Validate date format, AND to date > from date

    // DEV: Remove after date selector implemented
    let from = new Date(fromDate + "T00:00:00");
    let to = new Date(toDate + "T23:59:59");

    // TEST: Performance, if issues, convert date string to numeric and compare, or string compare
    let itemDate;
    filteredData = currentData.filter((item) => {
      if(item[dateField]) {
        itemDate = new Date(item[dateField]);

        return (
          itemDate >= from &&
          itemDate <= to
        )
      }
    });

    return filteredData;
  }
  else {
    /* Bypass the date filter if one or both values are not present */
    return currentData;
  }
}

const onClickToDateInput = (event) => {
  toDatePickerDisplay = "block";
}

const onClickFromDateInput = (event) => {
  fromDatePickerDisplay = "block";
}

const onDateSelect = (event) => {
  fromDatePickerDisplay = "none";
  toDatePickerDisplay = "none";
}

</script>

<form>
  <div class="form-group">
    <label class="group-label">Daterange:</label>

    <input type="text" placeholder="From" bind:value={fromDate} on:click={onClickFromDateInput}/>
    <div class="datepicker" style="display:{fromDatePickerDisplay}">
      <DatePicker bind:value={fromDate}  on:date-select={onDateSelect} />
    </div>

    <input type="text" placeholder="To" bind:value={toDate} on:click={onClickToDateInput}/>
    <div class="datepicker" style="display:{toDatePickerDisplay}">
      <DatePicker bind:value={toDate}  on:date-select={onDateSelect} />
    </div>

    <button type="button" on:click|preventDefault={onSet}>Apply</button>
    <button type="button" on:click|preventDefault={onClear}>Clear</button>
  </div>
</form>

<style>
  input {
    max-width: 37%;
  }
  .form-group {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 3px;
  }

  .datepicker {
    position: absolute;
    background-color: #e5e3e1;
    padding: 8px;
    border-radius: 5px;
  }

  :global(td.btn) {
    display: table-cell !important;
  }
</style>
