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
    organization= "",
    address1= "",
    address2= "",
    city= "",
    state= "",
    postalCode= "",
    country= "",
    phone= "",
    email= ""
  } = data;
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <div class="form-fields">
    <div class="form-group">
      <label for="title">Title</label>
      <input type="text" class="form-control" id="title" bind:value={title}>

      <label for="lastName">Last Name</label>
      <input type="text" class="form-control" id="lastName" bind:value={lastName}>

      <label for="firstName">First Name</label>
      <input type="text" class="form-control" id="firstName" bind:value={firstName}>

      <label for="organization">Organization</label>
      <input type="text" class="form-control" id="organization" bind:value={organization}>
    </div>
    <div class="form-group">
      <label for="address1">Address 1</label>
      <input type="text" class="form-control" id="address1" bind:value={address1}>

      <label for="address2">Address 2</label>
      <input type="text" class="form-control" id="address2" bind:value={address2}>

      <label for="city">City</label>
      <input type="text" class="form-control" id="city" bind:value={city}>

      <label for="state">State</label>
      <input type="text" class="form-control" id="state" bind:value={state}>
    </div>
    <div class="form-group">
      <label for="postalCode">Postal Code</label>
      <input type="text" class="form-control" id="postalCode" bind:value={postalCode}>

      <label for="country">Country</label>
      <input type="text" class="form-control" id="country" bind:value={country}>

      <label for="phone">Phone</label>
      <input type="text" class="form-control" id="phone" bind:value={phone}>

      <label for="email">Email</label>
      <input type="text" class="form-control" id="email" bind:value={email}>
    </div>
  </div>

  <button class="btn btn-default" id="update-data-button" type="submit">{buttonText}</button> <!-- on:click|preventDefault={onSubmitDonorForm} to add validation -->
</form>

<style>
  form .form-fields {
    display: flex;
    justify-content: space-between;
  }

  form > div + * {
    margin-top: 10px;
  }
</style>
