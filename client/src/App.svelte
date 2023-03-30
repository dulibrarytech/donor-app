<script>
	import router from "page.js";
	import lscache from 'client-cache';

	import { Configuration } from './config';
	import { Session } from './libs/session.js';
	import {JWTDecode} from './libs/jwt-decode.js';

	// Template Components
  	import Header from "./views/partials/Header.svelte";
  	import Footer from "./views/partials/Footer.svelte";
	import Navbar from "./components/Navbar.svelte";

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

	let page;
	let params;

	let{ssoUrl, ssoResponseUrl, ssoLogoutUrl} = $Configuration;

	const BASE_PATH = $Configuration.basePath || "";

	const onNavigate = (event) => {
		lscache.flush();
	}

	// creates the local session and redirects to landing page
	const login = (data) => {
		Session.create("donor_db", data.sessionData.token, data.sessionData.userData);

		if (data.loginRedirectPath) {
			window.location.replace(`${BASE_PATH}${data.loginRedirectPath}`);
		}
		else {
			let {roleId} = data.sessionData.userData;
			let homeRoute = (roleId == 2 || roleId == 3) ? "/inbox" : "/";
			window.location.replace(`${BASE_PATH}${homeRoute}`);
		}
	}

	// destroys the local session and redirects to login page
	const logout = (requestPath=null) => {
		console.log("Logout")
		if(Session.isSession("donor_db")) Session.destroy("donor_db");
		lscache.flush();
		window.location.replace(ssoLogoutUrl);
	}

	// called by Login.svelte form
	const onLogin = (event) => {
		if(event.detail) login(event.detail);
  	}

	// called by 'logout' button click
	const onLogout = (event) => {
		logout();
	}

	// router request middleware
	const validateSession = async (ctx, next) => {
		if($Configuration.runtimeEnv == "production" || $Configuration.runtimeEnv == "testing") {
			let loginRedirect = null;

			if(ctx.path != '/' && ctx.path != $Configuration.landingPagePath) {
				loginRedirect = ctx.path.replace(BASE_PATH, "");
			}

			if(Session.isSession("donor_db")) {
				let token = Session.getToken("donor_db") || "";

				let response = await fetch(`${$Configuration.donorApiDomain}/user/token/${token}`);
				response = await response.json();

				if(response.isValid) next()
				else logout()
			}
			else {
				let url = `${ssoUrl}?app_url=${ssoResponseUrl || "null_sso_redirect_url"}`;
				if(loginRedirect) url += `&path=${loginRedirect}`;
				window.location.replace(url);
			}
		}
		else next()
	}

  	/*
 	 * Router
 	 */
	router(`${BASE_PATH}/`, () => {
		window.location.replace(`${BASE_PATH}${$Configuration.landingPagePath}`);
	});

	router(`${BASE_PATH}/login`, async (ctx, next) => {
		let token = null;
		let redirect = null;
		
		let queryparams = ctx.querystring.split('&');
		for(let param of queryparams) {
			if(param.indexOf("token") >= 0) token = param.replace("token=", "");
			if(param.indexOf("redirect") >= 0) redirect = param.replace("redirect=", "");
		}

		if(token) {
			let url = `${$Configuration.donorApiDomain}/user/token/${token}`;
			let response = await fetch(url);

			response = await response.json();
			if(response.isValid) {
				let data = {
					sessionData: {
						token,
						userData: response.data || JWTDecode.jwtDecode(token)
					},
					loginRedirectPath: redirect
				}
				login(data);
			}
			else window.location.replace('/');
		}
		else window.location.replace('/');
	});

	router(`${BASE_PATH}/logout`, (ctx, next) => {
		logout();
	});

	router(`${BASE_PATH}/donors`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donors);

	router(`${BASE_PATH}/donor`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor);

	router(`${BASE_PATH}/donor/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donor);

	router(`${BASE_PATH}/donations`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donations);

	router(`${BASE_PATH}/donation/donor/:donorId`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router(`${BASE_PATH}/donation/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Donation);

	router(`${BASE_PATH}/letter/:donorId/:donationId`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LetterView);

	router(`${BASE_PATH}/inbox`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Inbox);

	router(`${BASE_PATH}/livingLibrary/donations`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonations);

	router(`${BASE_PATH}/livingLibrary/donation`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router(`${BASE_PATH}/livingLibrary/donation/:id`, validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LivingLibraryDonation);

	router(`${BASE_PATH}/livingLibrary/bookplate/:donationId`, validateSession, (ctx, next) => {
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
