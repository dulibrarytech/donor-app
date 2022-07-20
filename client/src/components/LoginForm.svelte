<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  var formData = {
    username: "",
    password: ""
  }

  const onSubmit = (event) => {
    dispatch('login-form-submit', formData);
  }
</script>

<div class="login-form">
  <form on:submit|preventDefault={onSubmit} >
    <div class="form-group">
      <label for="login-username">Username</label>
      <input type="text" class="form-control" id="login-username" bind:value={formData.username} placeholder="Username">
    </div>
    <div class="form-group">
      <label for="login-password">Password</label>
      <input type="password" class="form-control" id="login-password" bind:value={formData.password} placeholder="Password">
    </div>

    <button type="submit">Submit</button>
  </form>
</div>

<style>

</style>
