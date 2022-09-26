<script>
/*
 * Living Library Donation and Donor Data Form - 'Person to be Notifued' subform
 * For embedding in the LivingLibraryDonationForm to provide dynamic number of persons to be added to the donation form
 * Display data or enter new data
 */
'use strict'

import { fade } from 'svelte/transition';

export let args;
export let whoToNotifyData;
export let fieldData;

var donationId = args.donationId;
var inputPointerEvents = args.inputPointerEvents;
var validationLabelDisplay = args.validationLabelDisplay;
var index = args.index ?? 0;

var validationRules = {
  notify_title: {
    name: "notify_title",
    maxlength: 30
  },
  notify_first_name: {
    name: "notify_first_name",
    maxlength: 30
  },
  notify_last_name: {
    name: "notify_last_name",
    maxlength: 30
  },
  notify_address: {
    name: "notify_address",
    maxlength: 70
  },
  notify_city: {
    name: "notify_city",
    maxlength: 30
  },
  notify_state: {
    name: "notify_state",
    maxlength: 30
  },
  notify_zip: {
    name: "notify_zip",
    maxlength: 11,
    pattern: /^([0-9]{2,5})(-[0-9]{1,5})*$/,
    patternFormat: "12345 or 12345-6789 (second part can have 1-5 digits)"
  },
  notify_relation_to_donor: {
    name: "notify_relation_to_donor",
    maxlength: 30
  }
}

export const getValidationRules = () => {
  let ruleSet = {}, data;
  for(let index in whoToNotifyData) {
    data = whoToNotifyData[index] || {};
    for(let key in data) {
      if(key in validationRules) {
        ruleSet[ `${key}_${parseInt(index)+1}` ] = validationRules[key]
      }
    }
  }
  return ruleSet;
}
</script>

<form class="subform" id="living-library-donation-who-to-notify-form">
<h6>Person {index+1}</h6>
<div transition:fade class="form-group form-group-flex" id="notify_section_{index+1}">
  <div class="form-column">
    <label for="notify_title_{index+1}">Title</label>
    {#if donationId }
      <input type="text" id="notify_title_{index+1}" bind:value="{whoToNotifyData[index].last_name}" style="pointer-events:{inputPointerEvents}" tabindex="0"/>
    {:else}
      <select class="form-select" id="notify_title_{index+1}" bind:value={whoToNotifyData[index].notify_title} style="pointer-events:{inputPointerEvents}" tabindex="0">
        <option value="" selected disabled hidden>{#if fieldData.titles.length == 0}Error retrieving data{:else}-- Select a title --{/if}</option>
        {#each fieldData.titles as title}
          <option value="{title.term}" selected={donationId && whoToNotifyData[index].notify_title == title.term}>{title.term}</option>
        {/each}
      </select>
    {/if}

    <label for="notify_address_{index+1}">Address</label>
    <input type="text" id="notify_address_{index+1}" bind:value={whoToNotifyData[index].notify_address} style="pointer-events:{inputPointerEvents}" tabindex="0"/>

    <label for="notify_zip_{index+1}">Zip Code<span style="display:{validationLabelDisplay}">(e.g. 80210 or 80210-4711)</span></label>
    <input type="text" id="notify_zip_{index+1}" bind:value={whoToNotifyData[index].notify_zip} style="pointer-events:{inputPointerEvents}" tabindex="0"/>
  </div>
  <div class="form-column">
    <label for="notify_first_name_{index+1}">First Name</label>
    <input type="text" id="notify_first_name_{index+1}" bind:value={whoToNotifyData[index].notify_first_name} style="pointer-events:{inputPointerEvents}" tabindex="0"/>

    <label for="notify_city_{index+1}">City</label>
    <input type="text" id="notify_city_{index+1}" bind:value={whoToNotifyData[index].notify_city} style="pointer-events:{inputPointerEvents}" tabindex="0"/>

    <label for="notify_relation_to_donor_{index+1}">Relation to donor</label>
    {#if donationId }
      <input type="text" id="notify_relation_to_donor_{index+1}" value="{whoToNotifyData[index].notify_relation_to_donor}" style="pointer-events:{inputPointerEvents}" tabindex="0"/>
    {:else}
      <select class="form-select" id="notify_relation_to_donor_{index+1}" bind:value={whoToNotifyData[index].notify_relation_to_donor} style="pointer-events:{inputPointerEvents}" tabindex="0">
        <option value="" selected disabled hidden>{#if fieldData.relationships.length == 0}Error retrieving data{:else}-- Select a relationship --{/if}</option>
        {#each fieldData.relationships as relationship}
          <option value="{relationship.term}" selected={donationId && whoToNotifyData[index].notify_relation_to_donor == relationship.term}>{relationship.term}</option>
        {/each}
      </select>
    {/if}
  </div>

  <div class="form-column">
    <label for="notify_last_name_{index+1}">Last Name</label>
    <input type="text" id="notify_last_name_{index+1}" bind:value={whoToNotifyData[index].notify_last_name} style="pointer-events:{inputPointerEvents}" tabindex="0"/>

    <label for="notify_state_{index+1}">State</label>
    {#if donationId }
      <input type="text" id="notify_state_{index+1}" value="{whoToNotifyData[index].notify_state}" style="pointer-events:{inputPointerEvents}" tabindex="0"/>
    {:else}
      <select class="form-select" id="notify_state_{index+1}" bind:value={whoToNotifyData[index].notify_state} style="pointer-events:{inputPointerEvents}" tabindex="0">
        <option value="" selected disabled hidden>{#if fieldData.states.length == 0}Error retrieving data{:else}-- Select a state --{/if}</option>
        {#each fieldData.states as state}
          <option value="{state.term}" selected={donationId && whoToNotifyData[index].notify_state == state.term}>{state.term}</option>
        {/each}
      </select>
    {/if}
  </div>
</div>
</form>

<style>
  .form-column {
    width: 30%;
  }
</style>
