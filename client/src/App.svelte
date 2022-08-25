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
	 * Session functions
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
	 * End Session functions
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
	let basePath = $Configuration.basePath || "";
	router(`${basePath}/`, () => {
		window.location.replace(`${basePath}${$Configuration.landingPagePath}`);
	});

	router(`${basePath}/login`, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Login);

	router(`${basePath}/logout`, (ctx, next) => {
		logout();
		next();
	}, () => page = Login);

	router(`${basePath}/donors`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donors); // <-- next()

	router(`${basePath}/donor`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor); // <-- next()

	router(`${basePath}/donor/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor);

	router(`${basePath}/donations`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donations);

	router(`${basePath}/donation/donor/:donorId`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router(`${basePath}/donation/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router(`${basePath}/letter/:donorId/:donationId`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LetterView);

	router(`${basePath}/inbox`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Inbox);

	router(`${basePath}/livingLibrary/donations`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonations);

	router(`${basePath}/livingLibrary/donation`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router(`${basePath}/livingLibrary/donation/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router(`${basePath}/livingLibrary/donation/:donationId/bookPlate`, validateSession, (ctx, next) => {
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

</style>
