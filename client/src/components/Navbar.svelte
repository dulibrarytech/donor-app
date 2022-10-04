<script>
  import UserDisplay from "./UserDisplay.svelte";
  import { Session } from '../libs/session.js';
  import { Configuration } from '../config';
  import {createEventDispatcher} from 'svelte';

  export let userData;

  var donorRoutes = [];
  var livingLibraryRoutes = [];
  const dispatch = createEventDispatcher();
  const BASE_PATH = $Configuration.basePath || "";

  if(Session.isSession("donor_db")) userData = Session.getData("donor_db");
  else userData = null;

  if(userData) {
    if(userData.roleId == 2 || userData.roleId == 3) {
        donorRoutes.push({"label": "Inbox", "path": "/inbox"})
    }
  }

  if(userData || $Configuration.runtimeEnv == "development") {
    donorRoutes.push({"label": "Donors", "path": "/donors", "default": true})
    donorRoutes.push({"label": "Donations", "path": "/donations"})
    livingLibraryRoutes.push({"label": "Home", "path": "/livingLibrary/donations"})
  }
  else {
    donorRoutes = null;
    livingLibraryRoutes = null;
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

<div class="row nav-section">
  <div class="col-md-10">
    <div class="row">
      <div class="col-md-5">
        {#if donorRoutes}
          <div id="donor-nav">
            <div class="navbar navbar-header">
              <h6>Book and Material Donations</h6>
            </div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <ul class="navbar-nav" id="donor-nav">
                {#each donorRoutes as route}
                  <li class="nav-item">
                    <a class="nav-link" href="{BASE_PATH}{route.path}" on:click={onClickNavItem}>{route.label}</a>
                  </li>
                {/each}
              </ul>
            </nav>
          </div>
        {:else}
          <nav class="navbar navbar-expand-lg navbar-light bg-light"></nav>
        {/if}
      </div>

      <div class="col-md-7">
        {#if livingLibraryRoutes}
          <div id="living-library-nav">
            <div class="navbar navbar-header">
              <h6>Living Library</h6>
            </div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <ul class="navbar-nav" id="livibg-library-nav">
                {#each livingLibraryRoutes as route}
                  <li class="nav-item">
                    <a class="nav-link" href="{BASE_PATH}{route.path}" on:click={onClickNavItem}>{route.label}</a>
                  </li>
                {/each}
              </ul>
            </nav>
          </div>
        {:else}
          <nav class="navbar navbar-expand-lg navbar-light bg-light"></nav>
        {/if}
      </div>
    </div>
  </div>

  <div class="col-md-2">
    <div class="row">
      <div class="col-md-12 nav-section">
        {#if userData}
          <div id="user-nav">
            <div class="navbar navbar-header">
              <UserDisplay {userData} on:logout-user={onLogout} />
            </div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <ul class="navbar-nav" id="living-library-nav">
                <li class="nav-item">
                  <a class="nav-link" href="{BASE_PATH}/logout">Logout</a>
                </li>
              </ul>
            </nav>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .nav-section {
    background-color: #e5e3e1;
  }

  .row.nav-section {
    width: 100%;
  }

  .navbar {
    background-color: #e5e3e1 !important;
		min-height: 50px;
		padding: 0 0.7em;
  }

  .navbar-header h6 {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
  }

  a.nav-link {
    color: #383838;
  	text-decoration: none;
    font-weight: bold;
  }

  a.nav-link:hover {
    text-decoration: underline;
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

  .navbar-light .navbar-nav .nav-link {
    color: rgba(0,0,0,.55);
  }

  ul.navbar-nav {
    margin-bottom: 30px;
  }

  ul.navbar-nav li.nav-item {
    margin-left: 10px;
  }

  @media (min-width: 992px) {
    ul.navbar-nav li.nav-item {
      margin-left: 0;
    }

    ul.navbar-nav li.nav-item:not(:first-child) {
      margin-left: 10px;
    }
  }

  @media (min-width: 768px) {
    #user-nav {
      position: absolute;
      right: 0px;
    }

    ul.navbar-nav {
      margin-bottom: 0;
    }
  }
</style>
