<script>
'use strict'

import {createEventDispatcher} from 'svelte';

export let data = [];
export let filters = [];

var filteredData = [];
var fields = {};
const dispatch = createEventDispatcher();

const init = () => {
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
    if(typeof fields[filter.field] != 'undefined' &&
      fields[filter.field].includes(filter.value)) {
        filteredData = filteredData.filter(filter.function);
    }
  }

  return filteredData;
}

const resetFilters = () => {
  filteredData = data;
  for(let filter of filters) {
    if(typeof fields[filter.field] == 'undefined') fields[filter.field] = [];
  }
}

init();
</script>

<form>
  <div class="form-group">
    {#each filters as {field, value, label} }
      <div class="form-check">
        <input id={`${field}-${value}`} class="form-check-input" type="checkbox" value={value} bind:group={fields[field]} on:change={onFilter}>
        <label class="form-check-label" for={`${field}-${value}`}>
          {label}
        </label>
      </div>
    {/each}
  </div>
</form>

<style>

</style>
