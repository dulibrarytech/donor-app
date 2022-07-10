<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let donorId;
  export let data = {};

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donor`;
  let buttonText = "Add Donor";
  let messageDisplay;

  const validateFormFields = () => {
    let isValid = false;
    // TODO: Custom validation for each data field. If fail, set field input red and add feedback.
    return true;
  }

  const formatFormFields = () => {

  }

  // TODO Move out to Donor page, dispatch event here
  const onSubmitForm = () => {
    if(validateFormFields()) {
      // TODO dispatch event: form-submit (message only, still going to submit data here). This will show message
      messageDisplay.displayMessage("Adding donor...");
      ajaxRequest(method, action, function(error, response, status) {
        if(error) {
          console.error("Error:", error);
          messageDisplay.displayMessage("Error");
        }
        else if(status != 200) {
          console.log("Response status: ", status);
          messageDisplay.displayMessage("Error");
        }
        else {
          // TODO Dispatch event: submit-success. (Timeout is in parent)
          messageDisplay.displayTimeoutMessage("New donor created");
        }
      }, data);
    }
  }

  const init = () => {
    if(donorId) {
      method = "put";
      action = `${$Configuration.donorApiDomain}/donor/${donorId}`;
      buttonText = "Update";
    }
  }

  init();
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <div class="form-fields">
    <div class="form-group">
      <label for="title">Title</label>
      <input type="text" class="form-control" id="title" name="title" bind:value={data.title}>

      <label for="lastName">Last Name</label>
      <input type="text" class="form-control" id="lastName" name="lastName" bind:value={data.lastName}>

      <label for="firstName">First Name</label>
      <input type="text" class="form-control" id="firstName" name="firstName" bind:value={data.firstName}>

      <label for="organization">Organization</label>
      <input type="text" class="form-control" id="organization" name="organization" bind:value={data.organization}>
    </div>
    <div class="form-group">
      <label for="address1">Address 1</label>
      <input type="text" class="form-control" id="address1" name="address1" bind:value={data.address1}>

      <label for="address2">Address 2</label>
      <input type="text" class="form-control" id="address2" name="address2" bind:value={data.address2}>

      <label for="city">City</label>
      <input type="text" class="form-control" id="city" name="city" bind:value={data.city}>

      <label for="state">State</label>
      <input type="text" class="form-control" id="state" name="state" bind:value={data.state}>
    </div>
    <div class="form-group">
      <label for="postalCode">Postal Code</label>
      <input type="text" class="form-control" id="postalCode" name="postalCode" bind:value={data.postalCode}>

      <label for="country">Country</label>
      <input type="text" class="form-control" id="country" name="country" bind:value={data.country}>

      <label for="phone">Phone</label>
      <input type="text" class="form-control" id="phone" name="phone" bind:value={data.phone}>

      <label for="email">Email</label>
      <input type="email" class="form-control" id="email" name="email" bind:value={data.email}>
    </div>
  </div>

  <button class="btn btn-default" id="update-data-button" type="submit" on:click|preventDefault={onSubmitForm}>{buttonText}</button> <!-- TODO: on:click|preventDefault={onSubmitDonorForm} to add validation -->
</form>
<MessageDisplay bind:this={messageDisplay} />

<style>
  form .form-fields {
    display: flex;
    justify-content: space-between;
  }

  form > div + * {
    margin-top: 10px;
  }
</style>
