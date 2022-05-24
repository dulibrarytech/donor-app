<script>
	import router from "page.js";

	// Template Components
  import Header from "./views/partials/Header.svelte";
  import Footer from "./views/partials/Footer.svelte";

	// Views
	import Donors from "./views/Donors.svelte";
	import Donations from "./views/Donations.svelte";
	import NotFound from "./views/NotFound.svelte";

  // View Components
  import Navbar from "./components/Navbar.svelte";

	let page;
	let params;

	/* Import Router.svelte */

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
