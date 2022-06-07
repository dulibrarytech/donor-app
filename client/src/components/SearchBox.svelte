<script>
'use strict'

import MiniSearch from 'minisearch';
import {createEventDispatcher} from 'svelte';

export let index = [];
export let searchFields = [];
export let resultFields = ['id'];

var keywords = "";
var searchField = "";
let placeholder = "";
const dispatch = createEventDispatcher();

const init = () => {
  if(searchFields[0]) {
    reset();
  }
  else {
    dispatch('error', "Failed to initialize search box. At least one search field is required");
  }
}

export const reset = () => {
  keywords = "";
  searchField = searchFields[0].fieldName || "";
  placeholder = `Search ${searchFields[0].fieldLabel}`;
}

const onSelectSearchField = (event) => {
  let index = event.target.getAttribute("data-index");
  placeholder = `Search ${searchFields[index].fieldLabel}`;
}

const search = () => {
  try {
    let miniSearch = new MiniSearch({
      fields: [searchField],
      storeFields: [resultFields]
    })
    miniSearch.addAll(index)

    let results = miniSearch.search(keywords, {prefix: true, fuzzy: 0.2});
    let resultData = index.filter((item) => {
      return results.some(e => e.id === item.id);
    });

    dispatch('search', {
      field: searchField,
      results: resultData
    });
  }
  catch(e) {
    dispatch('error', `Search error: ${e}`);
  }
}

init();
</script>

<form>
  <div class="form-group search-form">
    <label for="searchbox">Keyword Search:</label>
    <input id="searchbox" type="text" bind:value={keywords} placeholder={placeholder}/>
    <button type="button" on:click|preventDefault={search}>Search</button>
  </div>

  <div class="form-group radio-group">
    {#each searchFields as {fieldName, fieldLabel}, index}
      <div class="form-check">
        <input class="form-check-input" type="radio" name="searchField" value="{fieldName}" data-index={index} bind:group={searchField} on:change={onSelectSearchField} data-label id="search-{fieldName}" checked={searchField==fieldName}>
        <label class="form-check-label" for="search-{fieldName}">
          {fieldLabel}
        </label>
      </div>
    {/each}
  </div>
</form>

<style>
  .radio-group {
    display: inline-flex;
  }

  .radio-group .form-check:not(:first-child) {
    margin-left: 2em;
  }

  input#searchbox {
    min-width: 21em;
  }
</style>
