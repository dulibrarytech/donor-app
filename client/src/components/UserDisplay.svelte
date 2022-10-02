<script>
  import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte'

  export let userData = {
    firstName: "User",
    lastName: "Name"
  };

  const init = () => {
    if(!userData) console.error("Data not available for user display");
  }

  const onLogout = () => {
    dispatch('logout-user', {});
  }

  init();
</script>

<div class="user-display">
  <div class="username">
    {#if userData}
      <span class="icon"><FaUserAlt /></span><span class="user-display-name">{userData.firstName} {userData.lastName}</span>
    {/if}
  </div>
</div>

<style>
  .user-display {
    width: 100%;
    padding: 10px;
  }

  .user-display .username {
    float: right;
    display: inline-flex;
    margin-right: 15px;
  }

  .user-display .icon {
    color: green;
    position: relative;
    bottom: 2px;
    right: 9px;
  }

  .icon {
    width: 18px;
    height: 18px;
  }
</style>
