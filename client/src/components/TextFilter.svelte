<script>
import {createEventDispatcher} from 'svelte';

export let data;
export let placeholderText;

let filteredData = [];
const dispatch = createEventDispatcher();

const onFilterInput = (event) => {
  if(event.target.value.length > 0 ) {
    // Any validation goes here
    filteredData = filterDataDisplay(event.target.value)
  }
  else {
    filteredData = data;
  }

  dispatch('filter', filteredData);
}

/* Culls the donors array upon entering search keywords in the search box */
const filterDataDisplay = (filter = "") => {
  filter = filter.toLowerCase();
  let filtered = data.filter((item) => {
    return (
      item.lastName?.toLowerCase().includes(filter) ||
      item.organization?.toLowerCase().includes(filter)
    )
  });

  return filtered;
}

</script>

<form>
  <div class="form-group search-form">
    <label for="text-filter">Filter:</label>
    <input id="text-filter" type="text" on:input={onFilterInput} placeholder={placeholderText} />
  </div>
</form>

<style>

</style>
