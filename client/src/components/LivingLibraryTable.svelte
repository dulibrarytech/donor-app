<script>
  import {createEventDispatcher} from 'svelte';

  export let items;
  export let args;

  const dispatch = createEventDispatcher();

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

    <!-- Links -->
    <th scope="col"></th><!-- View Record -->
    <!-- {#if donation.is_completed == false} -->
      <th scope="col"></th><!-- Book Plate Form -->
      <th scope="col"></th><!-- Delete -->
    <!-- {/if} -->

  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td>{donation.donor_date_of_donation}</td>
        <td>{donation.id}</td>
        <td>{`${donation.donor_title} ${donation.donor_first_name} ${donation.donor_last_name}`}</td>
        <td>{`${donation.recipient_title} ${donation.recipient_first_name} ${donation.recipient_last_name}`}</td>

        <!-- View Record -->
        <td><a href="/livingLibrary/donation/{donation.id}">View Record</a></td>
        <!-- New Book Plate, Delete -->
        {#if donation.is_completed == false}
          <td>
            <a href="/livingLibrary/donation/{donation.id}/bookPlate">Book Plate Form</a>
          </td>
          <td>
            <a href="#" data-record-id={donation.id} on:click|preventDefault={onDeleteRecord}>Delete</a>
          </td>
        {:else}
          <td></td>
          <td></td>
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
