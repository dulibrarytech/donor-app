<script>
/*
 * Executes filterFunction() each time a character is input to the box.
 * Dispatches a 'filter' event along with the filtered string returned from the filter function
 */
import {createEventDispatcher} from 'svelte';

export let data;
export let filterFunction;
export let placeholderText;

const dispatch = createEventDispatcher();
let filteredData = [];
let filterOption = "1";
let options = [
  {
    label: "Begins with",
    value: "1"
  },
  {
    label: "Contains",
    value: "2"
  }
]

const onFilterInput = (event) => {
  if(event.target.value.length > 0 ) {
    filteredData = filterFunction(data, event.target.value, filterOption)
  }
  else {
    filteredData = data;
  }

  dispatch('filter', filteredData);
}

</script>

<form>
  <div class="form-group search-form">
    <label for="text-filter">Filter:</label>
    <input id="text-filter" type="text" on:input={onFilterInput} placeholder={placeholderText} />
  </div>

  <div class="form-group radio-group search-form">
    {#each options as option}
      <div class="form-check">
        <input class="form-check-input" type="radio" name="filterOption" value="{option.value}" bind:group={filterOption}>
        <label class="form-check-label">{option.label}</label>
      </div>
    {/each}
  </div>
</form>

<style>
  div.search-form input#text-filter{
    width: 360px;
  }
</style>
