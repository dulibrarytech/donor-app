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

const filterText = (data, filter = "", option = "begins_with") => {
  filter = filter.toLowerCase();
  if(option == "begins_with") filter = '^' + filter;

  let filtered = data.filter((item) => {
    let re = new RegExp(filter, "gi"), values="";
    for(let field of filterFields) {
      if(item[field].length > 1) {
        values = item.lastName?.toLowerCase().match(re);
        break;
      }
    }
    return values;
  });

  return filtered;
}

const onFilterInput = (event) => {
  if(event.target.value.length > 0 ) {
    filteredData = filterText(data, event.target.value, filterOption)
  }
  else {
    filteredData = data;
  }

  dispatch('filter', filteredData);
}

</script>

<form>
  <div class="form-group">
    <div class="search-form">
      <input id="text-filter" type="text" on:input={onFilterInput} placeholder={placeholderText} />
    </div>

    <div class="radio-group">
      {#each options as option}
        <div class="form-check">
          <input class="form-check-input" type="radio" name="filterOption" value="{option.value}" bind:group={filterOption}>
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

  .form-group {
    padding-top: 12px;
  }
</style>
