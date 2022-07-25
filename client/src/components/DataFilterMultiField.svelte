<script>
'use strict'

import {createEventDispatcher} from 'svelte';

export let data = [];
export let filters = [];

var filteredData = [];
var fields = {};
const dispatch = createEventDispatcher();

const init = () => {
  for(let filter of filters) {
    for(let option of filter.options) {
      if(option.isDefault == true) {
        fields[option.field] = option.value
      }
    }
  }
  resetFilters();
}

const onFilter = (event) => {
  let filteredData = filterData(data);
  dispatch('filter', filteredData);
}

export const filterData = (currentData) => {
  filteredData = currentData;

  /* Filter the current data set on the selected filter functions */
  for(let filter of filters) {
    for(let filterOption of filter.options) {

      if(typeof fields[filterOption.field] != 'undefined' &&
        fields[filterOption.field].includes(filterOption.value)) {
          filteredData = filteredData.filter(filterOption.function);
      }

    }
  }

  return filteredData;
}

const resetFilters = () => {
  filteredData = data;
  for(let filter of filters) {
    for(let filterOption of filter.options) {
      if(typeof fields[filterOption.field] == 'undefined') fields[filterOption.field] = [];
    }
  }
}

init();
</script>

<form>
  {#each filters as filter }
  <div class="form-group">
  <label class="group-label">{filter.groupLabel}</label>
    {#each filter.options as {field, value, label} }
      <div class="form-check">
        <input id={`${field}-${value}`} class="form-check-input" type="radio" value={value} bind:group={fields[field]} on:change={onFilter} >
        <label class="form-check-label" for={`${field}-${value}`}>
          {label}
        </label>
      </div>
    {/each}
  </div>
  {/each}
</form>

<style>
  .form-group {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 3px;
  }
</style>
