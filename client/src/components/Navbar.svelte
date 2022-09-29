<script>
  import UserDisplay from "./UserDisplay.svelte";
  import { Session } from '../libs/session.js';
  import { Configuration } from '../config';
  import {createEventDispatcher} from 'svelte';

  export let userData;

  var routes = [];
  const dispatch = createEventDispatcher();
  const BASE_PATH = $Configuration.basePath || "";

  if(Session.isSession("donor_db")) userData = Session.getData("donor_db");
  else userData = null;

  if(userData) {
    if(userData.roleId == 2 || userData.roleId == 3) {
        routes.push({"label": "Inbox", "path": "/inbox"})
    }
  }

  if(userData || $Configuration.runtimeEnv == "development") {
    routes.push({"label": "Donors", "path": "/donors", "default": true})
    routes.push({"label": "Donations", "path": "/donations"})
    routes.push({"label": "Living Library", "path": "/livingLibrary/donations"})
    routes.push({"label": "Logout", "path": "/logout"})
  }

  /* Sets the clicked nav link to active, remove active state from previously active link */
  const onClickNavItem = function(event) {
    let activeLink = document.querySelector(".nav-item.active");
    if(activeLink) { activeLink.classList.remove("active") }
    event.srcElement.parentElement.classList.add("active");
    dispatch('navigate', {})
  }

  const onLogout = () => {
    dispatch('logout-user', {})
  }
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      {#each routes as route}
        <li class="nav-item">
          <a class="nav-link" href="{BASE_PATH}{route.path}" on:click={onClickNavItem}>{route.label}</a>
        </li>
      {/each}
    </ul>

    {#if userData}
      <UserDisplay {userData} on:logout-user={onLogout} />
    {/if}
  </div>
</nav>

<style>
  nav.navbar {
      background-color: #e5e3e1;
  		height: 50px;
  		padding: 0 0.7em;
  }

  a.nav-link {
    color: #383838;
  	text-decoration: none;
    font-weight: bold;
  }

  .nav-item.active {
  	color: #383838;
  	text-decoration: underline;
  	pointer-events: none;
  }

  .logout-nav-item {
    display: none;
  }

  .user-display-wrapper {
    width: 19.5;
  }

  ul.navbar-nav {
    width: 79.5%;
  }

  ul.navbar-nav li.nav-item:not(:first-child) {
    margin-left: 10px;
  }

  .navbar-light .navbar-nav .nav-link {
    color: rgba(0,0,0,.55);
  }
</style>
