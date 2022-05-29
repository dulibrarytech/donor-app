<script>
  export let items={items};
  export let Table={Table};
</script>

<div class="data-display">
  <table class="table">
    <svelte:component this={Table} items={items} />
  </table>
</div>

<style>
  div.data-display :global(tbody tr:nth-child(even)) {
    background: #e5e3e1;
  }

  div.data-display :global(table thead) {
    background-color: #e5e3e1;
  }

  div.data-display {
    max-height: 375px;
    overflow: hidden;
    overflow-y: scroll;
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
    width: 100%
  }
</style>
