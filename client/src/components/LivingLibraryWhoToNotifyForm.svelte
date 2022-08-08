<script>
  import { fade } from 'svelte/transition';

  export let donationId;
  export let whoToNotifyData;
  export let fieldData;
  export let index=0;
</script>

<div transition:fade class="form-section notify-section" id="notify_section_{index+1}">
  <div class="form-group">
    <label for="notify_title_{index+1}">Title</label>
    {#if donationId }
      <input type="text" id="notify_title_{index+1}" bind:value="{whoToNotifyData[index].notify_title}"/>
    {:else}
      <select class="form-select" id="notify_title_{index+1}" bind:value={whoToNotifyData[index].notify_title}>
        <option value="" selected disabled hidden>-- Select a title --</option>
        {#each fieldData.titles as title}
          <option value="{title.term}" selected={donationId && whoToNotifyData[index].notify_title == title.term}>{title.term}</option>
        {/each}
      </select>
    {/if}

    <label for="notify_address_{index+1}">Address</label>
    <input type="text" id="notify_address_{index+1}" bind:value={whoToNotifyData[index].notify_address}/>

    <label for="notify_zipCode_{index+1}">Zip Code</label>
    <input type="text" id="notify_zipCode_{index+1}" bind:value={whoToNotifyData[index].notify_zip}/>
  </div>
  <div class="form-group">
    <label for="notify_firstName_{index+1}">First Name</label>
    <input type="text" id="notify_firstName_{index+1}" bind:value={whoToNotifyData[index].notify_first_name}/>

    <label for="notify_city_{index+1}">City</label>
    <input type="text" id="notify_city_{index+1}" bind:value={whoToNotifyData[index].notify_city}/>

    <label for="notify_relation_to_donor_{index+1}">Relation to donor</label>
    {#if donationId }
      <input type="text" id="notify_relation_to_donor_{index+1}" value="{whoToNotifyData[index].notify_relation_to_donor}"/>
    {:else}
      <select class="form-select" id="notify_relation_to_donor_{index+1}" bind:value={whoToNotifyData[index].notify_relation_to_donor}>
        <option value="" selected disabled hidden>-- Select a relation --</option>
        {#each fieldData.relationships as relationship}
          <option value="{relationship.term}" selected={donationId && whoToNotifyData[index].notify_relation_to_donor == relationship.term}>{relationship.term}</option>
        {/each}
      </select>
    {/if}
  </div>

  <div class="form-group">
    <label for="notify_lastName_{index+1}">Last Name</label>
    <input type="text" id="notify_lastName_{index+1}" bind:value={whoToNotifyData[index].notify_last_name}/>

    <label for="notify_state_{index+1}">State</label>
    {#if donationId }
      <input type="text" id="notify_state_{index+1}" value="{whoToNotifyData[index].notify_state}"/>
    {:else}
      <select class="form-select" id="notify_state_{index+1}" bind:value={whoToNotifyData[index].notify_state}>
        <option value="" selected disabled hidden>-- Select a state --</option>
        {#each fieldData.states as state}
          <option value="{state.term}" selected={donationId && whoToNotifyData[index].notify_state == state.term}>{state.term}</option>
        {/each}
      </select>
    {/if}
  </div>
</div>

<style>
.form-section {
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
