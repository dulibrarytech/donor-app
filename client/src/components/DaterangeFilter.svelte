<script context="module">
  export function iso(date) {
    const pad = n => n < 10 ? "0" + n : n;
    return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
  }
</script>

<script>
'use strict'

//import DatePicker from "./DatePicker.svelte";
import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';

export let data;
export let dateField;

const dispatch = createEventDispatcher();
const INIT_FROM_DATE = "1970-01-01";

var fromDate = "";
var toDate = "";
var toDateDisplay = "";
var fromDateDisplay = "";
var fromDatePickerDisplay = "none";
var toDatePickerDisplay = "none";
var filteredData = [];

let validationRules = {
  fromDateDisplay: {
    name: "toDateDisplay",
    maxlength: 10,
    pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    patternFormat: "yyyy-mm-dd"
  },
  toDateDisplay: {
    name: "toDateDisplay",
    maxlength: 10,
    pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    patternFormat: "yyyy-mm-dd"
  }
}
let formValidator = new FormValidator('daterange', validationRules, "#ced4da");

const init = () => {
  fromDateDisplay = "";
  toDateDisplay = "";
  filteredData = [];
  fromDate = INIT_FROM_DATE;
  toDate = iso(new Date());
}

const onClear = () => {
  init();
  dispatch('clear-daterange', null);
}

const onSet = () => {
  if(formValidator.validate({fromDateDisplay, toDateDisplay})) {
    if(fromDateDisplay.length > 0) fromDate = fromDateDisplay;
    else fromDateDisplay = fromDate;
    if(toDateDisplay.length > 0) toDate = toDateDisplay;
    else toDateDisplay = toDate;
    let filteredData = filterDaterange(data);
    dispatch('daterange-select', {data: filteredData, daterange: {fromDate, toDate}});
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

init();
</script>

<form id="daterange">
  <div class="form-group">
    <label class="group-label">Daterange:</label>
    <input type="text" id="fromDateDisplay" placeholder="From" bind:value={fromDateDisplay} on:click={onClickFromDateInput}/>
    <input type="text" id="toDateDisplay" placeholder="To" bind:value={toDateDisplay} on:click={onClickToDateInput}/>
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
