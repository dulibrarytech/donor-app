<script>
	//import page from "page.js";
	import router from "page.js";

	// Views
	import Donors from "./views/Donors.svelte";
	import Donations from "./views/Donations.svelte";
	import NotFound from "./views/NotFound.svelte";

	// Template Components
  import Header from "./views/partials/Header.svelte";
  import Footer from "./views/partials/Footer.svelte";

  // View Components
  import Navbar from "./components/Navbar.svelte";

	let page;
	let params;

	router('/', () => {
		window.location.replace("/donors");
	});

	router('/donors', (ctx, next) => {
		params = ctx.params;
			console.log("/donors Params:", params)
		next();
	}, () => page = Donors); // <-- next()

	router('/donors/:donorId', (ctx, next) => {
		params = ctx.params;
			console.log("/donors/:donorId Params:", params)
		next();
	}, () => page = Donors);

	router('/donations', (ctx, next) => {
		params = ctx.params;
			console.log("/donations Params:", params)
		next();
	}, () => page = Donations);

	router('/donations/:donationId', (ctx, next) => {
		params = ctx.params;
			console.log("/donations/:donationId Params:", params)
		next();
	}, () => page = Donations);

	router('/*', () => {
		page = NotFound;
	});

	router.start();

</script>

<main>
	<Header />
	<Navbar />

	<svelte:component this={page} {params} />

	<Footer />

	<!-- {#if page === Home} {
		<Home />
	} -->
</main>
