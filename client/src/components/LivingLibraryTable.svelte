<script>
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();
  let status;

  const formatStatusField = (value=false) => {
    return value == true ? "Completed" : "Queued";
  }

  const onDeleteRecord = (event) => {
    dispatch('message', {data: event.target.getAttribute("data-record-id"), eventName: "delete-record"});
  }
</script>

<thead class="header">
  <tr>

    <th scope="col">Date of Donation</th>
    <th scope="col">ID</th>
    <th scope="col">Donor Name</th>
    <th scope="col">Recipient Name</th>
    <th scope="col">Status</th>

    <!-- Links -->
    <th scope="col"></th><!-- View Record -->
    <th scope="col"></th><!-- Book Plate Form -->
    <th scope="col"></th><!-- Delete -->

  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td width="12%">{donation.donor_date_of_donation}</td>
        <td width="5%">{donation.id}</td>
        <td width="18%">{`${donation.donor_title} ${donation.donor_first_name} ${donation.donor_last_name}`}</td>
        <td width="18%">{`${donation.recipient_title} ${donation.recipient_first_name} ${donation.recipient_last_name}`}</td>
        <td width="7%">{formatStatusField(donation.is_completed)}</td>

        <!-- View Record -->
        <td width="14%"><a href="/livingLibrary/donation/{donation.id}">View Record</a></td>

        <!-- New Book Plate, Delete -->
        {#if donation.is_completed == false}
          <td width="15%">
            <a href="/livingLibrary/donation/{donation.id}/bookPlate">Book Plate Form</a>
          </td>
          <td width="11%">
            <a href="#" data-record-id={donation.id} on:click|preventDefault={onDeleteRecord}>Delete</a>
          </td>
        {:else}
          <td width="15%"></td>
          <td width="11%"></td>
        {/if}
      </tr>
    {/each}
  {:else}
    <h6>No results found.</h6>
  {/if}
</tbody>

<style>
  td {
    max-width: 250px;
  }
</style>
