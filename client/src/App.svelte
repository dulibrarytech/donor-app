<script>

	import router from "page.js";
	import { Configuration } from './config';

	// Template Components
  import Header from "./views/partials/Header.svelte";
  import Footer from "./views/partials/Footer.svelte";

	// Views
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

	const validateSession = async (ctx, next) => {
		if($Configuration.runtimeEnv == "production") {
			let response = await fetch(`${$Configuration.donorApiDomain}/user/validate`);
			if(response.status == 200) next()
			else logout()
		}
		else next()
	}

	router('/', () => {
		window.location.replace("/donors");
	});

	router('/donors', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donors Params:", params)
		next();
	}, () => page = Donors); // <-- next()

	router('/donor', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donor Params:", params)
		next();
	}, () => page = Donor); // <-- next()

	router('/donor/:id', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donor/:id Params:", params)
		next();
	}, () => page = Donor);

	router('/donations', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donations Params:", params)
		next();
	}, () => page = Donations);

	router('/donation/donor/:donorId', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donation/donor/:donorId Params:", params)
		next();
	}, () => page = Donation);

	router('/donation/:id', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/donation/:donationId Params:", params)
		next();
	}, () => page = Donation);

	router('/letter/:donationId', validateSession, (ctx, next) => {
		params = ctx.params;
			console.log("/letter/:donationId Params:", params)
		next();
	}, () => page = LetterView);

	router('/*', () => {
		page = NotFound;
	});

	router.start();
	/* End Router.svelte */

	let userData = {
		firstName: "Duff",
		lastName: "Booery"
	};

	/* Login stuff Catch event thrown thru navbar from loginform Pass NavBar updates userData{} But here, store it in session */
	const onLogin = (event) => {
		console.log("App onLogin() data:", event.detail || " none");

		// TODO: Update userData object
		// TODO: Store user data in session, store token in session
  }

	const onLogout = () => {
		console.log("App onLogout()")
		logout();
	}

	const logout = () => {
		console.log("App logout()")
		// TODO: Set userData to null
		// TODO: remove session data
		// TODO: redirect to /login
		//window.location.replace("/login");
	}

</script>

<Header />
<Navbar {userData} on:logout-user={onLogout}/>

<main class="container">
	<svelte:component this={page} {params} on:login={onLogin}/>
</main>
<Footer />
