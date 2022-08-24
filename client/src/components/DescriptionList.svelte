<script>
  export let data;
  export let displayClass = "";
</script>

<dl class="description-list {displayClass}">
  {#each data as {label, value}}
    <dt>{label}</dt>
    <dd>{value}</dd>
  {/each}
</dl>

<style>
  .description-list {
    float: left;
    margin-bottom: 10px;
  }

  .description-list * {
    display: inline-flex;
    flex-direction: row;
  }

  .description-list > dl {
    margin: 0 8px;
  }

  .description-list label {
    font-weight: 500;
  }

  .description-list dt:not(:first-child) {
    margin-left: 20px;
  }

  .description-list dd {
    margin-left: 7px
  }

  .description-list dt:after {
    content: ':';
  }
</style>
