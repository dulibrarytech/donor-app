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
let filterOption = "begins_with";
let options = [
  {
    label: "Begins with",
    value: "begins_with"
  },
  {
    label: "Contains",
    value: "contains"
  }
]

export const filterText = (data, filter = filterValue, option = filterOption) => {
  let filtered = data;

  if(filterValue) {
    let testString = "";
    filter = filter.toLowerCase();
    if(option == "begins_with") filter = '^' + filter;

    filtered = data.filter((item) => {
      let re = new RegExp(filter, "gi"), values="", matches = [];

      for(let field of filterFields) {
        testString = item[field];
        if(typeof testString !='string') testString = String(testString)

        if(testString.length > 0) {
          testString = testString.split(" ");

          for(let word of testString) {
            matches = word.toLowerCase().match(re);
            if(matches) {
              values = values.concat(matches);
            }
          }
        }
      }
      return values;
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

<form>
  <div class="form-group">
    <div class="search-form">
      <input id="text-filter" type="text" on:keyup={onFilterInput} bind:value="{filterValue}" placeholder={placeholderText} />
      <!-- <button type="button" on:click={reset}>Clear</button> -->
    </div>

    <div class="radio-group">
      {#each options as option}
        <div class="form-check">
          <input class="form-check-input" type="radio" name="filterOption" value="{option.value}" on:change="{onChangeOption}" bind:group={filterOption}>
          <label class="form-check-label">{option.label}</label>
        </div>
      {/each}
    </div>
  </div>
</form>

<style>
  div.search-form input {
    width: 100%
  }
</style>
