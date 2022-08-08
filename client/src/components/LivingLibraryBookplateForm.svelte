<script>
/*
 * Living Library bookplate request form
 */
import {createEventDispatcher} from 'svelte';

export let data;

const dispatch = createEventDispatcher();

const onSubmit = (event) => {
  console.log("Form data submitted:", data)
  dispatch('form-submit', data);
}
</script>

<form>
  <div class="form-section">
    <div class="form-group">
      <label for="book_author_name">Author Name</label>
      <input type="text" id="book_author_name" bind:value={data.book_author_name}/>

      <label for="book_bibliographic_number">Bibliographic Number</label>
      <input type="text" id="book_bibliographic_number" bind:value={data.book_bibliographic_number}/>
    </div>

    <div class="form-group">
      <label for="book_title">Book title</label>
      <input type="text" id="book_title" bind:value={data.book_title}/>

      <label for="book_call_number">Call Number</label>
      <input type="text" id="book_call_number" bind:value={data.book_call_number}/>
    </div>
  </div>
</form>

<style>

</style>
