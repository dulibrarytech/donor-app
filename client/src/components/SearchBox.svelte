<script>
'use strict'

import MiniSearch from 'minisearch';
import {createEventDispatcher} from 'svelte';

export let index = [];
export let searchFields = [];
export let resultFields = ['id'];
export let multiFieldSearch=false;

var keywords = "";
var searchField = "";
var placeholder = "";
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
  if(multiFieldSearch === false) placeholder = `Search ${searchFields[0].fieldLabel}`;
}

const onSelectSearchField = (event) => {
  let index = event.target.getAttribute("data-index");
  if(multiFieldSearch === false) placeholder = `Search ${searchFields[index].fieldLabel}`;
}

const getSearchFieldArray = (searchFields) => {
  let fieldArray = [];
  for(let {fieldName} of searchFields) {
    fieldArray.push(fieldName);
  }
  console.log("Field array", fieldArray)
  return fieldArray;
}

const search = () => {
  console.log("search()", multiFieldSearch)
  try {
    let fields = multiFieldSearch === true ? getSearchFieldArray(searchFields) : [searchField];
    console.log("Fields", fields)
    let miniSearch = new MiniSearch({
      fields: fields,
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
  <div class="form-group">
    <div class="search-form">
      <input id="searchbox" type="search" bind:value={keywords} placeholder={placeholder}/>
      <button type="button" on:click|preventDefault={search}>Search</button>
    </div>

    <div class="radio-group">
      {#if multiFieldSearch === false && searchFields.length > 1}
        {#each searchFields as {fieldName, fieldLabel}, index}
          <div class="form-check">
            <input class="form-check-input" type="radio" name="searchField" value="{fieldName}" data-index={index} bind:group={searchField} on:change={onSelectSearchField} data-label id="search-{fieldName}" checked={searchField==fieldName}>
            <label class="form-check-label" for="search-{fieldName}">
              {fieldLabel}
            </label>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</form>

<style>
  .radio-group {
    display: inline-flex;
  }

  .radio-group .form-check:not(:first-child) {
    margin-left: 2em;
  }

  .form-group {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 3px;
    padding-top: 12px;
  }
</style>
