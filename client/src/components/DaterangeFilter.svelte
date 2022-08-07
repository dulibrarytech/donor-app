<script>
'use strict'

//import DatePicker from "./DatePicker.svelte";
import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';

export let data;
export let dateField;

const dispatch = createEventDispatcher();

var fromDate = "";
var toDate = "";
var fromDatePickerDisplay = "none";
var toDatePickerDisplay = "none";
var filteredData = [];

let validationRules = {
  fromDate: {
    required: true,
    maxlength: 10,
    pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    patternFormat: "yyyy-mm-dd"
  },
  toDate: {
    required: true,
    maxlength: 10,
    pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    patternFormat: "yyyy-mm-dd"
  }
}
let formValidator = new FormValidator('daterange', validationRules, "#ced4da");

const onClear = () => {
  fromDate = "";
  toDate = "";
  filteredData = [];
  dispatch('clear-daterange', null);
}

const onSet = () => {
  console.log("Validation:", formValidator.validate({fromDate, toDate}))
  if(formValidator.validate({fromDate, toDate})) {
    let filteredData = filterDaterange(data);
    dispatch('daterange-select', filteredData);
  }
}

export const filterDaterange = (currentData) => {
  if(fromDate?.length > 0 && toDate?.length > 0) {
    filteredData = [];

    let from = new Date(fromDate + "T00:00:00");
    let to = new Date(toDate + "T23:59:59");

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

<form id="daterange">
  <div class="form-group">
    <label class="group-label">Daterange:</label>

    <input type="text" id="fromDate" placeholder="From" bind:value={fromDate} on:click={onClickFromDateInput}/>
    <!-- <div class="datepicker" style="display:{fromDatePickerDisplay}">
      <DatePicker bind:value={fromDate}  on:date-select={onDateSelect} />
    </div> -->

    <input type="text" id="toDate" placeholder="To" bind:value={toDate} on:click={onClickToDateInput}/>
    <!-- <div class="datepicker" style="display:{toDatePickerDisplay}">
      <DatePicker bind:value={toDate}  on:date-select={onDateSelect} />
    </div> -->

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
