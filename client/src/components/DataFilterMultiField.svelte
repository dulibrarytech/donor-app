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

export const resetFilters = () => {
  filteredData = data;
  for(let filter of filters) {
    for(let filterOption of filter.options) {
      if(typeof fields[filterOption.field] == 'undefined') fields[filterOption.field] = [];
    }
  }
}

init();
</script>

<form class="data-filter-multi-field">
  {#each filters as filter }
  <div class="form-group">
    {#if filter.groupLabel}<p class="group-label">{filter.groupLabel}</p>{/if}
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
    padding: 15px;
  }

  p.group-label {
    font-weight: 500;
    margin-bottom: 5px;
  }
</style>
