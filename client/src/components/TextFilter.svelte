<script>
/*
 * Executes filterFunction() each time a character is input to the box.
 * Dispatches a 'filter' event along with the filtered string returned from the filter function
 */
import {createEventDispatcher} from 'svelte';

export let data;
export let filterFields=[];
export let placeholderText;

const dispatch = createEventDispatcher();
let filteredData = [];
let filterValue;
let filterOption = "contains";
let options = [
  {
    label: "Contains",
    value: "contains"
  },
  {
    label: "Begins with",
    value: "begins_with"
  }
]

export const filterText = (data, filter = filterValue, option = filterOption) => {
  let filtered = data;

  if(filterValue) {
    let testString = "";

    filter = filter.toLowerCase();
    if(option == "begins_with") filter = '^' + filter;

    filtered = data.filter((item) => {
      let re = new RegExp(filter, "gi");
      let hasMatch=false, matches = [];

      for(let field of filterFields) {
        testString = item[field];
        if(typeof testString !='string') testString = String(testString);

        if(testString.length > 0) {
          matches = testString.toLowerCase().match(re);
          if(matches?.length > 0) hasMatch = true
        }

      }

      return hasMatch;
    });
  }

  return filtered;
}

export const reset = () => {
  filterOption = "begins_with";
  filterValue = "";
  dispatch('filter-text', null);
}

const onFilterInput = (event) => {
  if(event.target.value.length > 0 ) {
    filteredData = filterText(data, event.target.value, filterOption)
  }
  else {
    filteredData = [];
  }
  dispatch('filter-text', filterValue.length > 0 ? filteredData : null);
}

const onChangeOption = (event) => {
  if(filterValue && filterValue.length > 0) {
    filterOption = event.target.value;
    dispatch('text-filter-change-option', filterText(data, filterValue, filterOption))
  }
}

</script>

<form class="form-group" id="text-filter">
  <div class="row">
    <div class="search-form col-md-12">
      <input type="text" on:keyup={onFilterInput} bind:value="{filterValue}" placeholder={placeholderText} />
    </div>
  </div>

  <div class="row filter-controls">
    <div class="radio-group col-md-6">
      {#each options as option}
        <div class="form-check">
          <input class="form-check-input" type="radio" name="filterOption" value="{option.value}" on:change="{onChangeOption}" bind:group={filterOption}>
          <label class="form-check-label">{option.label}</label>
        </div>
      {/each}
    </div>

    <div class="col-md-6" id="reset-button" style="position: relative">
      <button type="button" on:click={reset}>Reset</button>
    </div>
  </div>
</form>

<style>
  div.search-form input {
    width: 100%;
  }

  div#reset-button button {
    float: right;
    margin-top: 10px;
    margin-right: 1px;
  }

  #text-filter {
    padding: 15px 15px 0 15px;
  }

  button {
    margin: 0 0 1em 0;
  }
</style>
