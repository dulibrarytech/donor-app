<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let donorId;
  export let data = {};
  export let titles = [];

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donor`;
  let buttonText = "Add Donor";
  let messageDisplay;

  const validateFormFields = () => {
    let isValid = true;

    document.querySelectorAll(".fail-message").forEach((label) => {
      label.remove();
    });

    document.querySelectorAll("#donor-form input").forEach((input) => {
      input.style.borderColor = "#ced4da";
    });

    if(!data.lastName && !data.organization) {
      isValid = false;
      fail('lastName', "Must specify either a last name or an organization");
      fail('organization', "Must specify either a last name or an organization");
    }

    if(data.lastName?.length > 20) isValid = fail('lastName', "Exceeds max length of 20 characters");
    if(data.firstName?.length > 20) isValid = fail('firstName', "Exceeds max length of 20 characters");
    if(data.address1?.length > 50) isValid = fail('address1', "Exceeds max length of 50 characters");
    if(data.address2?.length > 50) isValid = fail('address2', "Exceeds max length of 50 characters");
    if(data.city?.length > 20) isValid = fail('city', "Exceeds max length of 20 characters");
    if(data.state?.length > 20) isValid = fail('state', "Exceeds max length of 20 characters");
    if(data.postalCode?.length > 10) isValid = fail('postalCode', "Exceeds max length of 10 characters");
    if(data.country?.length > 20) isValid = fail('country', "Exceeds max length of 20 characters");
    if(data.phone?.length > 20) isValid = fail('phone', "Exceeds max length of 20 characters");

    if(data.email) {
      if(data.email.length > 50) isValid = fail('phone', "Exceeds max length of 50 characters");
      if(data.email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, "gi") == null) isValid = fail('email', "Must be of format 'test@example.com'");
    }

    return isValid;
  }

  const fail = (id, message) => {
    // Get the input that failed validation
    let input = document.getElementById(id);
    input.style.borderColor = "red";

    // Create message label, append after the input
    let label = document.createElement("span");
    label.classList.add("fail-message");
    label.innerHTML = message;
    label.style.color = "red";

    // Insert the message label
    let formGroup = input.parentNode;
    formGroup.insertBefore(label, input);

    return false;
  }

  const onSubmitForm = () => {
    if(validateFormFields()) {
      messageDisplay.displayMessage("Submitting data...");
      ajaxRequest(method, action, function(error, response, status) {
        if(error) {
          messageDisplay.displayMessage("Error", `Ajax error: ${error}`);
        }
        else if(status != 200) {
          messageDisplay.displayMessage("Error", `Response status: ${status}`);
        }
        else {
          let message = method == "post" ? "New donor created" : "Donor record updated";
          messageDisplay.displayTimeoutMessage(message);
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

      <label for="titleSelect">Title</label>
      <select class="form-select" name="title" id="titleSelect" bind:value={data.title}>
        <option value="none" selected disabled hidden>No title</option>
        {#each titles as title}
          <option value="{title.titleId}">{title.titleString}</option>
        {/each}
      </select>

      <label for="organization">Organization</label>
      <input type="text" class="form-control" id="organization" name="organization" bind:value={data.organization}>

      <label for="city">City</label>
      <input type="text" class="form-control" id="city" name="city" bind:value={data.city}>

      <label for="country">Country</label>
      <input type="text" class="form-control" id="country" name="country" bind:value={data.country}>
    </div>
    <div class="form-group">
      <label for="lastName">Last Name</label>
      <input type="text" class="form-control" id="lastName" name="lastName" bind:value={data.lastName}>

      <label for="address1">Address 1</label>
      <input type="text" class="form-control" id="address1" name="address1" bind:value={data.address1}>

      <label for="state">State</label>
      <input type="text" class="form-control" id="state" name="state" bind:value={data.state}>

      <label for="phone">Phone</label>
      <input type="text" class="form-control" id="phone" name="phone" bind:value={data.phone}>
    </div>
    <div class="form-group">
      <label for="firstName">First Name</label>
      <input type="text" class="form-control" id="firstName" name="firstName" bind:value={data.firstName}>

      <label for="address2">Address 2</label>
      <input type="text" class="form-control" id="address2" name="address2" bind:value={data.address2}>

      <label for="postalCode">Postal Code</label>
      <input type="text" class="form-control" id="postalCode" name="postalCode" bind:value={data.postalCode}>

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

  .form-group {
    border-style: none;
    width: 400px
  }
</style>
