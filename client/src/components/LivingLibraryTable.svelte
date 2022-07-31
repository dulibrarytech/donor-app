<script>
  export let items;
  export let args;

  console.log("Donation table items:", items)
</script>

<thead class="header">
  <tr>

    <th scope="col">Date of Donation</th>
    <th scope="col">Donor Name</th>
    <th scope="col">Recipient Name</th>

    <!-- Links -->
    <th scope="col"></th><!-- New Book Plate || View Record -->
    <th scope="col"></th><!-- Delete -->

  </tr>
</thead>
<tbody>
  {#if items.length > 0}
    {#each items as donation}
      <tr>
        <td>{donation.donor_date_of_donation}</td>
        <td>{`${donation.donor_title} ${donation.donor_first_name} ${donation.donor_last_name}`}</td>
        <td>{`${donation.recipient_title} ${donation.recipient_first_name} ${donation.recipient_last_name}`}</td>

        <!-- Links -->
        <!-- New Book Plate || View Record -->
        <td>
          {#if donation.is_completed == true}
            <a href="#">View Record</a>
          {:else}
            <a href="#">Book Plate Form</a>
          {/if}
        </td>

        <!-- Delete -->
        {#if donation.is_completed == true}
          <td>
            <a href="#">Delete</a>
          </td>
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
