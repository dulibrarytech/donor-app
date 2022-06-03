<script>
  export let data;
  export let donationId;

  let method = "post";
  let action = "/donations";
  let buttonText = "Add Donation";

  if(donationId) {
    method = "put";
    buttonText = "Update";
  }

  console.log("Form data into DonationForm:", data)

  /* Init form fields from donation data */
  var {
    donorId= null,
    dateOfGift= "",
    lastName= "",
    organization= "",
    numberOfGifts= "",
    firstName= "",
    status= "pending",
    giftDescription= "",
    giftDetails= "",
    type= "standard"
  } = data;

  let statusDisplay = status == "pending" ? "Pending" : "Complete";
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <div class="form-fields container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="dateOfGift">Date</label>
        <input type="text" class="form-control" id="dateOfGift" bind:value={dateOfGift}>

        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" id="lastName" bind:value={lastName}>

        <label for="organization">Organization</label>
        <input type="text" class="form-control" id="organization" bind:value={organization}>
      </div>
      <div class="col-md-6">
        <label for="numberOfGifts">Item Count</label>
        <input type="text" class="form-control" id="numberOfGifts" bind:value={numberOfGifts}>

        <label for="firstName">First Name</label>
        <input type="text" class="form-control" id="firstName" bind:value={firstName}>
      </div>
      <div class="col-md-3">
        {#if donationId}
          <label for="status">Status</label>
          <input type="text" class="form-control" id="status" bind:value={statusDisplay}>
        {/if}
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-9">
        <label for="giftDescription">Description</label>
        <input type="text" class="form-control" id="giftDescription" bind:value={giftDescription}>
        <label for="giftDetails">Details</label>
        <input type="text" class="form-control" id="giftDetails" bind:value={giftDetails}>
      </div>
      <div class="col-md-3">
        <label class="form-check-label">Gift Type</label>
        <div class="form-check">
          <input class="form-check-input" type="radio" bind:group={type} value="standard" id="type-standard" checked={type=='standard'}>
          <label class="form-check-label" for="type-standard">
            Standard
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" bind:group={type} value="important" id="type-important" checked={type=='standard'}>
          <label class="form-check-label" for="type-important">
            Important
          </label>
        </div>
      </div>
    </div>
  </div>

  <button class="btn btn-default" type="submit">{buttonText}</button> <!-- on:click|preventDefault={onSubmitDonorForm} to add validation -->
  {#if donationId}
    <button class="btn btn-default" type="button">Letter</button>
    <button class="btn btn-default" type="button">View Donor Info</button>
  {/if}
</form>

<style>

</style>
