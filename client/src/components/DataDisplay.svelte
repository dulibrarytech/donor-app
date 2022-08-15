<script>
  import {createEventDispatcher} from 'svelte';

  export let items={items};
  export let Table={Table};
  export let args;

  const dispatch = createEventDispatcher();
</script>

<div class="data-display">
  <table class="table">
    <svelte:component this={Table} items={items} {args} on:message={(event) => dispatch(event.detail.eventName, event.detail.data)}/>
  </table>
</div>

<style>
  .data-display {
    margin-top: 25px;
    max-height: 498px;
    overflow-y: auto;
    width: 100%;
  }

  table {
    /* max-height: 375px; */
    /* overflow: hidden;
    overflow-y: scroll; */
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
    /* width: 100% */
  }

  :global(.table:not(:first-child)) {
    border-top: none;
  }

  :global(.data-display tbody tr:nth-child(even)) {
    background: #e5e3e1;
  }

  :global(.data-display table thead) {
    background-color: #e5e3e1;
  }

  :global(.data-display thead.header) {
    position: sticky;
    top: 0;
  }
</style>
