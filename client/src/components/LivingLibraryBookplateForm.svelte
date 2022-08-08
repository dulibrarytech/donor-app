<script>
/*
 * Living Library bookplate request form
 */
import {createEventDispatcher} from 'svelte';

export let data;
export let args;

console.log("Args in", args)

const dispatch = createEventDispatcher();
var submitButtonVisible = args.submitButtonVisible || true;

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

    <!-- <div class="form-group">
      <label for="book_publisher">Book Publisher</label>
      <input type="text" id="book_publisher" bind:value={data.book_publisher}/>

      <label for="book_date_published">Date Published</label>
      <input type="text" id="book_date_published" bind:value={data.book_date_published}/>
    </div> -->
  </div>
  <button type="button" on:click={onSubmit} style="display:{args.submitButtonVisible ? "block" : "none"}">Save Book Plate</button>
</form>

<style>
  form {
    padding: 12px;
  }

  form .form-section {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
  }

  form > div + * {
    margin-top: 10px;
  }

  .form-group {
    border-style: none;
    width: 400px
  }
</style>
