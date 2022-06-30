<script>
  // TODO Add to app config file
  const routes = [
    {"label": "Donors", "path": "/donors", "default": true},
    {"label": "Donations", "path": "/donations"}
  ]

  // Set the clicked nav link to active, remove active state from previously active link
  let onClickNavItem = function(event) {
    let activeLink = document.querySelector(".nav-item.active");
    if(activeLink) { activeLink.classList.remove("active") }
    event.srcElement.parentElement.classList.add("active");
  }

  // Initialize the nav menu links, set the link to the current page as active
  // window.addEventListener('load', (event) => {
  //   document.querySelectorAll(".active").forEach(link => {
  //     let path = link.firstElementChild.href;
  //     if(path != window.location.href) {
  //       link.classList.remove("active");
  //     }
  //   });
  // });
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      {#each routes as route}
        <li class="nav-item">
          <a class="nav-link" href="{route.path}" on:click={onClickNavItem}>{route.label}</a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<style>
  nav.navbar {
      background-color: #e5e3e1;
  		height: 50px;
  		padding-left: 0.7em;
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
</style>
