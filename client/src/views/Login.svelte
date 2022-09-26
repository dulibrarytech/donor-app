<script>
  import { onMount } from 'svelte';
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import {Session} from '../libs/session.js';
  import {createEventDispatcher} from 'svelte';
  import LoginForm from "../components/LoginForm.svelte";
  import MessageDisplay from "../components/MessageDisplay.svelte";

  export let params;

  const dispatch = createEventDispatcher();
  const urlParams = new URLSearchParams(window.location.search);
  var loginRedirectPath = null;
  var sessionData = null;
  var messageDisplay;

  const init = () => {
    loginRedirectPath = urlParams.get('redirect');
    if(Session.isSession("donor_db")) window.location.replace($Configuration.landingPagePath)
  }

  const onSubmitLogin = (event) => {
    let data = event.detail;
    let url = `${$Configuration.donorApiDomain}/user/authenticate`;

    ajaxRequest('POST', url, async function(error, response) {
      if(error) {
        console.log(`Authentication error: ${error}`);
        messageDisplay.displayTimeoutMessage("Error");
      }
      else if(response.status == 200) {
        console.log("Login successful");
        let responseData = await response.json();
        sessionData = responseData;
      }
      else if(response.status == 401){
        console.log("Invalid credentials");
        messageDisplay.displayTimeoutMessage("Invalid username or password");
      }
      else {
        console.log("Authentication response status ", response.status);
        messageDisplay.displayTimeoutMessage("Error");
      }

      dispatch('login', {sessionData, loginRedirectPath});
    }, data);
  }

  onMount(() => {
    init();
  })
</script>

<div class="page">
  <h3>Login</h3>
  <div class="page-section">
    <div class="login-form-wrapper">
      <LoginForm on:login-form-submit={onSubmitLogin} />
      <MessageDisplay bind:this={messageDisplay} />
    </div>
  </div>
</div>

<style>
  .login-form-wrapper {

  }
</style>
