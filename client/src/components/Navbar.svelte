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
    //routes.push({"label": "Logout", "path": "/logout"}) // TODO: Add statically
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
        <div id="donor-nav">
          <div class="navbar navbar-header">
            <h6>Book and Material Donations</h6>
          </div>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="collapse navbar-collapse" id="navbar-nav">
              <ul class="navbar-nav" id="donor-nav">
                {#each donorRoutes as route}
                  <li class="nav-item">
                    <a class="nav-link" href="{BASE_PATH}{route.path}" on:click={onClickNavItem}>{route.label}</a>
                  </li>
                {/each}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div class="col-md-7">
        <div id="living-library-nav">
          <div class="navbar navbar-header">
            <h6>Living Library</h6>
          </div>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="collapse navbar-collapse" id="navbar-nav">
              <ul class="navbar-nav" id="livibg-library-nav">
                {#each livingLibraryRoutes as route}
                  <li class="nav-item">
                    <a class="nav-link" href="{BASE_PATH}{route.path}" on:click={onClickNavItem}>{route.label}</a>
                  </li>
                {/each}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-2">
    {#if userData}
      <UserDisplay {userData} on:logout-user={onLogout} />
    {/if}
  </div>
</div>


<style>
  .nav-section {
    background-color: #e5e3e1;
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
