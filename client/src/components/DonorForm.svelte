<script>
  export let data;
  export let donorId;

  let method = "post";
  let action = "/donor";
  let buttonText = "Add Donor";

  if(donorId) {
    method = "put";
    buttonText = "Update";
  }

  console.log("Form data into DonorForm:", data)

  /* Init form fields from donor data */
  var {
    title= "",
    lastName= "",
    firstName= "",
    address1= "",
    address2= "",
    city= "",
    state= "",
    postalCode= "",
    phone= "",
    email= "",
    organization= null,
    country= ""
  } = data;
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <div class="form-group">
    <label for="title">Title:</label>
    <input type="text" class="form-control" id="title" bind:value={title}>

    <label for="lastName">Last Name:</label>
    <input type="text" class="form-control" id="lastName" bind:value={lastName}>
  </div>

  <button class="btn btn-default" id="update-data-button" type="submit">{buttonText}</button> <!-- on:click|preventDefault={onSubmitDonorForm} to add validation -->
</form>
