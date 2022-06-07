<script>
  export let items={items};
  console.log("DT items", items)
  export let Table={Table};
  export let args;
</script>

<div class="data-display">
  <table class="table">
    <svelte:component this={Table} items={items} {args}/>
  </table>
</div>

<style>
  :global(tbody tr:nth-child(even)) {
    background: #e5e3e1;
  }

  :global(table thead) {
    background-color: #e5e3e1;
  }

  .data-display {
    margin-top: 25px;
  }

  table {
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
