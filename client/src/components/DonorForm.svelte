<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import FormValidator from '../libs/FormValidator.js';
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let donorId;
  export let data = {};
  export let titles = [];

  let method = "post";
  let action = `${$Configuration.donorApiDomain}/donor`;
  let buttonText = "Add Donor";
  let messageDisplay;

  let validationRules = {
    firstName: {
      maxlength: 20
    },
    address1: {
      maxlength: 70
    },
    address2: {
      maxlength: 70
    },
    city: {
      maxlength: 20
    },
    state: {
      maxlength: 20
    },
    postalCode: {
      maxlength: 10
    },
    country: {
      maxlength: 20
    },
    phone: {
      maxlength: 20
    },
    email: {
      maxlength: 50,
      pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
      patternFormat: "test@example.com"
    }
  }
  let formValidator = new FormValidator('#donor-form', validationRules, "#ced4da");

  const onSubmitForm = () => {
    /*
     * Need this code to adjust the validation rules based on the presence of either lastName or organization values
     * Either a last name or an organization is required. If there is an organization, last name is not required, and vice versa
     */
    if(!data.lastName && !data.organization) {
      validationRules['lastName'] = {
        required: true,
        fail: "Must specify a last name or an organization"
      };
      validationRules['organization'] = {
        required: true,
        fail: "Must specify a last name or an organization"
      };
    }
    else if(data.lastName) {
      validationRules['lastName'] = {
        maxlength: 20
      };
      validationRules['organization'] = {
        required: false,
        maxlength: 20
      };
    }
    else if(data.organization) {
      validationRules['organization'] = {
        maxlength: 20
      };
      validationRules['lastName'] = {
        required: false,
        maxlength: 20
      };
    }
    //formValidator.setRules(validationRules);

    if(formValidator.validate(data)) {
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
