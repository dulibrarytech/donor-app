<script context="module">
  export function iso(date) {
    const pad = n => n < 10 ? "0" + n : n;
    return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
  }
</script>

<script>
'use strict'

import {createEventDispatcher} from 'svelte';
import FormValidator from '../libs/FormValidator.js';
import { DateInput } from '../libs/date-picker-svelte';

export let data;
export let dateField;

const dispatch = createEventDispatcher();
const INIT_FROM_DATE = "1970-01-01";

var fromDate = "";
var toDate = "";
var toDateMin = new Date(INIT_FROM_DATE);
var toDateDisplay = "";
var fromDateDisplay = "";
var filteredData = [];
var toInput;

let validationRules = {
  fromDateDisplay: {
    name: "fromDateDisplay",
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
  fromDateDisplay = null;
  toDateDisplay = null;
  filteredData = [];
  fromDate = INIT_FROM_DATE;
  toDate = iso(new Date());
}

// $: {
//   fromDate = fromDateDisplay ? iso(fromDateDisplay) : INIT_FROM_DATE;
//   toDate = toDateDisplay ? iso(toDateDisplay) : iso(new Date());
//   console.log("Converted dates:", fromDate, toDate)
// }

const onClear = () => {
  init();
  dispatch('clear-daterange', null);
}

const onSet = () => {
  if(formValidator.validate({fromDateDisplay: fromDate, toDateDisplay: toDate})) {
    if(fromDate.length > 0) fromDate = fromDateDisplay ? iso(fromDateDisplay) : INIT_FROM_DATE;
    else fromDateDisplay = new Date(fromDate);

    if(toDate.length > 0) toDate = toDateDisplay ? iso(toDateDisplay) : iso(new Date());
    else toDateDisplay = new Date(toDate);

    let filteredData = filterDaterange(data);
    dispatch('daterange-select', {data: filteredData, daterange: {fromDate, toDate}});
  }
}

const onSelectFromDate = () => {
  toDateMin = fromDateDisplay;
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

const onTabFrom = (event) => {
  if(event.detail.shift) dispatch('reverse-tab', {});
  else document.querySelector('#fromDateInput input').focus();
}

const onTabTo = (event) => {
  if(event.detail.shift) document.querySelector('#toDateInput input').focus();
  else document.getElementById('applyButton').focus();
}

/* Use the selected 'from' date as the minimum allowed date in the 'to' date datepicker to prevent to < from */
$: toDateMin = fromDateDisplay || new Date(INIT_FROM_DATE);

init();
</script>

<form id="daterange">
  <div class="form-group">
    <input type="hidden" id="fromDateString" bind:value={fromDate} />
    <input type="hidden" id="toDateString" bind:value={toDate} />

    <div class="date-inputs">
      <div class="input" id="toDateInput"><DateInput id="fromDateDisplay" format="yyyy-MM-dd" placeholder="From" min={new Date(INIT_FROM_DATE)} bind:value={fromDateDisplay} on:tab={onTabFrom} /></div>
      <div class="input" id="fromDateInput"><DateInput id="toDateDisplay" format="yyyy-MM-dd" placeholder="To" min={toDateMin} bind:value={toDateDisplay} on:tab={onTabTo} bind:this={toInput}/></div>
    </div>

    <button type="button" id="applyButton" on:click|preventDefault={onSet}>Apply</button>
    <button type="button" on:click|preventDefault={onClear}>Clear</button>
  </div>
</form>

<style>
  .date-inputs {
    display: inline-flex;
    margin-bottom: 20px;
  }

  .input {
    margin-right: 10px;
  }

  :global(.input input) {
    width: 100%;
  }

  .form-group {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 3px;
  }

  :global(td.btn) {
    display: table-cell !important;
  }

  p.group-label {
    font-weight: 500;
    margin-bottom: 5px;
  }
</style>
