<script>

	import router from "page.js";
	import lscache from 'client-cache';

	import { Configuration } from './config';
	import { Session } from './libs/session.js';

	// Template Components
  import Header from "./views/partials/Header.svelte";
  import Footer from "./views/partials/Footer.svelte";

	// Views
	import Login from "./views/Login.svelte";
	import Donors from "./views/Donors.svelte";
	import Donor from "./views/Donor.svelte";
	import Donations from "./views/Donations.svelte";
	import Donation from "./views/Donation.svelte";
	import LetterView from "./views/LetterView.svelte";
	import Inbox from "./views/Inbox.svelte";
	import LivingLibraryDonations from "./views/LivingLibraryDonations.svelte";
	import LivingLibraryDonation from "./views/LivingLibraryDonation.svelte";
	import LivingLibraryBookPlate from "./views/LivingLibraryBookPlate.svelte";
	import NotFound from "./views/NotFound.svelte";

  // View Components
  import Navbar from "./components/Navbar.svelte";

	let page;
	let params;

	const onNavigate = (event) => {
		lscache.flush();
	}

	/*
	 * Session control functions
	 */
	const login = (data) => {
		Session.create("donor_db", data.sessionData.token, data.sessionData.userData);
		let {roleId} = data.sessionData.userData;
		if(roleId == 2 || roleId == 3) window.location.replace(data.loginRedirectPath || "/inbox");
		else window.location.replace(data.loginRedirectPath || "/");
	}

	const logout = (requestPath = null) => {
		if(Session.isSession("donor_db")) Session.destroy("donor_db");
		lscache.flush();
		window.location.replace(requestPath ? `/login?redirect=${requestPath}` : "/login");
	}

	const onLogin = (event) => {
		if(event.detail) login(event.detail);
  }

	const onLogout = (event) => {
		logout();
	}
	/*
	 * End Session control functions
	 */

	/*
	 * Session validation middleware
	 */
	const validateSession = async (ctx, next) => {
		if($Configuration.runtimeEnv == "production"|| $Configuration.runtimeEnv == "testing") {
			let path = null;
			if(ctx.path != '/' && ctx.path != $Configuration.landingPagePath) path = ctx.path;
			if(Session.isSession("donor_db")) {
				let data = {
					headers: {
						'authorization': Session.getToken("donor_db") || ""
					}
				}

				let response = await fetch(`${$Configuration.donorApiDomain}/user/validate`, data);
				if(response.status == 200) next()
				else logout(path)
			}
			else logout(path)
		}
		else next()
	}
	/*
	 * End Session validation middleware
	 */

  /*
 	 * Router
 	 */
	router('/', () => {
		window.location.replace($Configuration.landingPagePath);
	});

	router('/login', (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Login);

	router('/logout', (ctx, next) => {
		logout();
		next();
	}, () => page = Login);

	router('/donors', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donors); // <-- next()

	router('/donor', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor); // <-- next()

	router('/donor/:id', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor);

	router('/donations', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donations);

	router('/donation/donor/:donorId', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router('/donation/:id', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router('/letter/:donorId/:donationId', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LetterView);

	router('/inbox', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Inbox);

	router('/livingLibrary/donations', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonations);

	router('/livingLibrary/donation', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router('/livingLibrary/donation/:id', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router('/livingLibrary/donation/:donationId/bookPlate', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryBookPlate);

	router('/*', (ctx, next) => {
		page = NotFound;
	});

	router.start();
	/*
 	 * End Router
 	 */
</script>

<Header />
<Navbar on:navigate={onNavigate} on:logout-user={onLogout} />

<main class="container">
	<svelte:component this={page} {params} on:login={onLogin}/>
</main>
<Footer />

<style>
/*
 * TODO: Move the global styles to global.css
 */
@media (min-width: 1600px) {
	:global(.container) {
	    max-width: 1500px;
	}
}
@media (min-width: 1500px) {
	:global(.container) {
	    max-width: 1400px;
	}
}

:global(.filter-form label.group-label) {
	font-weight: 500;
}

:global(.form-group) {
	border-style: solid;
	border-width: 1px;
	border-color: #e5e3e1;
	border-radius: 3px;
	margin-bottom: 10px;
	padding: 7px 12px 7px 12px;
}

:global(.filter-form .form-group) {
	padding-left: 12px;
	padding-right: 12px;
}

:global(.page-section) {
	margin-top: 25px;
}

:global(.page-section > h3) {
	margin-bottom: 30px;
}

:global(form label span) {
	margin-left: 15px;
	font-size: 0.85em;
	font-style: italic;
	color: #808080;
}

:global(form label:not(> span)) {
	font-weight: bold;
}

:global(.data-display td) {
	vertical-align: middle;
}
/*
 * End global styles
 */
</style>
