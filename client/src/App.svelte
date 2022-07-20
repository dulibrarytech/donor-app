<script>

	import router from "page.js";
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
	import NotFound from "./views/NotFound.svelte";

  // View Components
  import Navbar from "./components/Navbar.svelte";

	let page;
	let params;

	const login = (data) => {
		Session.create(data.token, data.userData);
		window.location.replace("/");
	}

	const logout = () => {
		if(Session.isSession()) Session.destroy();
		window.location.replace("/login");
	}

	const onLogin = (event) => {
		if(event.detail) login(event.detail);
  }

	const onLogout = () => {
		logout();
	}

	const validateSession = async (ctx, next) => {
		console.log("Validating session...", $Configuration.runtimeEnv)
		if($Configuration.runtimeEnv == "production") {
			if(Session.isSession()) {
				let data = {
					headers: {
						'authorization': Session.getToken() || ""
					}
				}

				let response = await fetch(`${$Configuration.donorApiDomain}/user/validate`, data);
				if(response.status == 200) next()
				else logout()
			}
			else logout()
		}
		else next()
	}

	router('/', () => {
		window.location.replace("/donors");
	});

	router('/login', (ctx, next) => {
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
			console.log("/donor/:id Params:", params)
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

	router('/letter/:donationId', validateSession, (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = LetterView);

	router('/*', () => {
		page = NotFound;
	});

	router.start();
	/* End Router.svelte */
</script>

<Header />
<Navbar on:logout-user={onLogout}/>

<main class="container">
	<svelte:component this={page} {params} on:login={onLogin}/>
</main>
<Footer />
