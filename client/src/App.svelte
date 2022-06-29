<script>
	import router from "page.js";
	//import Routes from "./Routes.svelte";

	// Template Components
  import Header from "./views/partials/Header.svelte";
  import Footer from "./views/partials/Footer.svelte";

	// Views
	import Donors from "./views/Donors.svelte";
	import Donor from "./views/Donor.svelte";
	import Donations from "./views/Donations.svelte";
	import Donation from "./views/Donation.svelte";
	import NotFound from "./views/NotFound.svelte";

  // View Components
  import Navbar from "./components/Navbar.svelte";

	let page;
	let params;

	/* TODO: Import Router.svelte, remove router defs below */
	router('/', () => {
		window.location.replace("/donors");
	});

	router('/donors', (ctx, next) => {
		params = ctx.params;
			console.log("/donors Params:", params)
		next();
	}, () => page = Donors); // <-- next()

	router('/donor', (ctx, next) => {
		params = ctx.params;
			console.log("/donor Params:", params)
		next();
	}, () => page = Donor); // <-- next()

	router('/donor/:id', (ctx, next) => {
		params = ctx.params;
			console.log("/donor/:id Params:", params)
		next();
	}, () => page = Donor);

	router('/donations', (ctx, next) => {
		params = ctx.params;
			console.log("/donations Params:", params)
		next();
	}, () => page = Donations);

	router('/donation/donor/:donorId', (ctx, next) => {
		params = ctx.params;
			console.log("/donation/donor/:donorId Params:", params)
		next();
	}, () => page = Donation);

	router('/donation/:id', (ctx, next) => {
		params = ctx.params;
			console.log("/donation/:donationId Params:", params)
		next();
	}, () => page = Donation);

	router('/*', () => {
		page = NotFound;
	});

	router.start();

	/* End Router.svelte */

</script>

<Header />
<Navbar />
<main class="container">
	<svelte:component this={page} {params} />
	<!-- {#if page === Home} {
		<Home />
	} -->
</main>
<Footer />
