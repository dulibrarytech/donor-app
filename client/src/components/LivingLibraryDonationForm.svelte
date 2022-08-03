<script>
/*
 * Living Library Donation and Donor Data Form
 * Donor, recipient, person to be notified, donation info`
 * Display data or enter new data
 */

export let args;
export let data;

const donationId = args.donationId || null;
let {donationData, fieldData} = data;
</script>

<form>
  <div class="form-section">
    <div class="form-group">
      <h5>Person making donation</h5>

      <label for="titleSelect">Title</label>
      {#if donationId }
        <input type="text" value="{donationData.title}"/>
      {:else}
        <select class="form-select" name="title" id="titleSelect" bind:value={data.title}>
          <option value="0" selected disabled hidden>-- Select a title --</option>
          {#each fieldData.titles as title}
            <option value="{title.id}" selected={donationId && donationData?.titleId == title.id}>{title.term}</option>
          {/each}
        </select>
      {/if}



    </div>
  </div>
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
