<script>
'use-strict'

import {Configuration} from '../config';
import {ajaxRequest} from '../libs/ajax.js';
import FormValidator from '../libs/FormValidator.js';
import MessageDisplay from "../components/MessageDisplay.svelte";

export let donorId;
export let data = {};
export let titles = [];

let method;
let action;
let buttonText;
let buttonDisabled;
let validationLabelDisplay = "inline";
let messageDisplay;

let validationRules = {
  firstName: {
    name: "firstName",
    maxlength: 20
  },
  address1: {
    name: "address1",
    maxlength: 70
  },
  address2: {
    name: "address2",
    maxlength: 70
  },
  city: {
    name: "city",
    maxlength: 20
  },
  state: {
    name: "state",
    maxlength: 20
  },
  postalCode: {
    name: "postalCode",
    maxlength: 10
  },
  country: {
    name: "country",
    maxlength: 20
  },
  phone: {
    name: "phone",
    maxlength: 20
  },
  email: {
    name: "email",
    maxlength: 50,
    pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    patternFormat: "test@example.com"
  }
}
let formValidator = new FormValidator('donor-form', validationRules, "#ced4da");

const init = () => {
  /* If there is an active donaor, use the 'PUT' configuration (update donor form) */
  if(donorId) {
    method = "put";
    action = `${$Configuration.donorApiDomain}/donor/${donorId}`;
    buttonText = "Update";
    buttonDisabled = true;
  }
  /* If there is no active donor, use the default 'POST' configuration (new donor form) */
  else {
    method = "post";
    action = `${$Configuration.donorApiDomain}/donor`;
    buttonText = "Add Donor";
    buttonDisabled = false;
  }
}

const showValidationLabels = (isVisible) => {
  validationLabelDisplay = isVisible ? "inline" : "none";
}

const onSubmitForm = () => {
  /*
   * Need this code to adjust the validation rules based on the presence of either lastName or organization values
   * Either a last name or an organization is required. If there is an organization, last name is not required, and vice versa
   */
  if(!data.lastName && !data.organization) {
    validationRules['lastName'] = {
      name: "lastName",
      required: true,
      fail: "Must specify a last name or an organization"
    };
    validationRules['organization'] = {
      name: "organization",
      required: true,
      fail: "Must specify a last name or an organization"
    };
  }
  else if(data.lastName) {
    validationRules['lastName'] = {
      name: "lastName",
      maxlength: 50
    };
    validationRules['organization'] = {
      name: "organization",
      required: false,
      maxlength: 100
    };
  }
  else if(data.organization) {
    validationRules['organization'] = {
      name: "organization",
      maxlength: 100
    };
    validationRules['lastName'] = {
      name: "lastName",
      required: false,
      maxlength: 50
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
        if(method == 'post') data = {};
      }
    }, data);
  }
  else messageDisplay.displayTimeoutMessage("Form has validation errors");
}

const onChangeFormValue = (event) => {
  buttonDisabled = false;
}

init();
</script>

<form id="donor-form" class="form" method="{method}" action="{action}">
  <p class="required">Required field</p><br>
  <div class="form-fields">
    <div class="form-group">

      <label for="titleSelect">Title</label>
      <select class="form-select" name="title" id="titleSelect" bind:value={data.title} on:input={onChangeFormValue}>
        <option value="0" selected disabled hidden>No title</option>
        {#each titles as title}
          <option value="{title.titleId}">{title.titleString}</option>
        {/each}
      </select>

      <label for="organization" class="required">Organization<span style="display:{validationLabelDisplay}">(Required if no last name)</span></label>
      <input type="text" class="form-control" id="organization" name="organization" bind:value={data.organization} on:input={onChangeFormValue}>

      <label for="city">City</label>
      <input type="text" class="form-control" id="city" name="city" bind:value={data.city} on:input={onChangeFormValue}>

      <label for="country">Country</label>
      <input type="text" class="form-control" id="country" name="country" bind:value={data.country} on:input={onChangeFormValue}>
    </div>
    <div class="form-group">
      <label for="lastName" class="required">Last Name<span style="display:{validationLabelDisplay}">(Required if no organization)</span></label>
      <input type="text" class="form-control" id="lastName" name="lastName" bind:value={data.lastName} on:input={onChangeFormValue}>

      <label for="address1">Address 1</label>
      <input type="text" class="form-control" id="address1" name="address1" bind:value={data.address1} on:input={onChangeFormValue}>

      <label for="state">State</label>
      <input type="text" class="form-control" id="state" name="state" bind:value={data.state} on:input={onChangeFormValue}>

      <label for="phone">Phone</label>
      <input type="text" class="form-control" id="phone" name="phone" bind:value={data.phone} on:input={onChangeFormValue}>
    </div>
    <div class="form-group">
      <label for="firstName">First Name</label>
      <input type="text" class="form-control" id="firstName" name="firstName" bind:value={data.firstName} on:input={onChangeFormValue}>

      <label for="address2">Address 2</label>
      <input type="text" class="form-control" id="address2" name="address2" bind:value={data.address2} on:input={onChangeFormValue}>

      <label for="postalCode">Postal Code</label>
      <input type="text" class="form-control" id="postalCode" name="postalCode" bind:value={data.postalCode} on:input={onChangeFormValue}>

      <label for="email">Email<span style="display:{validationLabelDisplay}">(e.g. test@example.com)</span></label>
      <input type="email" class="form-control" id="email" name="email" bind:value={data.email} on:input={onChangeFormValue}>
    </div>
  </div>

  <button class="btn btn-default" id="update-data-button" type="submit" on:click|preventDefault={onSubmitForm} disabled={buttonDisabled}>{buttonText}</button> <!-- TODO: on:click|preventDefault={onSubmitDonorForm} to add validation -->
</form>
<MessageDisplay bind:this={messageDisplay} />

<style>
  form .form-fields {
    display: flex;
    justify-content: space-between;
    border-style: solid;
    border-width: 1px;
    border-color: #e5e3e1;
    border-radius: 5px;
    padding: 12px;
  }

  form > div + * {
    margin-top: 10px;
  }

  .form-group {
    border-style: none;
    width: 400px
  }

  p.group-label {
    font-weight: 500;
    margin-bottom: 5px;
  }
</style>
