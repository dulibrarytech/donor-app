<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import {Session} from '../libs/session.js';
  import {createEventDispatcher} from 'svelte';
  import LoginForm from "../components/LoginForm.svelte";
  import MessageDisplay from "../components/MessageDisplay.svelte";

  const dispatch = createEventDispatcher();
  var sessionData = null;
  var messageDisplay;

  const init = () => {
    if(Session.isSession()) window.location.replace("/donors")
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

      dispatch('login', sessionData);
    }, data);
  }

  init();
</script>

<div class="page">
  <h1>Login</h1>

  <div class="login-form-wrapper">
    <LoginForm on:login-form-submit={onSubmitLogin} />
    <MessageDisplay bind:this={messageDisplay} />
  </div>
</div>

<style>
  .login-form-wrapper {

  }
</style>
