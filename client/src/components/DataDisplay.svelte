<script>
  import {createEventDispatcher} from 'svelte';

  export let items={items};
  export let Table={Table};
  export let args;
  let message = "Loading";

  const dispatch = createEventDispatcher();

  $: {
    if(items) {
      if(items.length == 0) message = args.emptySetMessage || "No results found.";
    }
    else items = [];
  }
</script>

<div class="data-display">
  {#if items.length > 0}
    <table class="table">
      <svelte:component this={Table} items={items} {args} on:message={(event) => dispatch(event.detail.eventName, event.detail.data)}/>
    </table>
  {:else}
    <div class="data-display-message"><h6>{message}</h6></div>
  {/if}
</div>

<style>
  .data-display {
    margin-top: 25px;
    max-height: 498px;
    overflow-y: auto;
    width: 100%;
  }

  table {
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
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
