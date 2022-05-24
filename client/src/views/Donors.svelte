<script>
  import {Donors} from '../stores';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";

  /* Import Donors.js module */
  // import Donors from "../modules/Donors.js";
  // Fetch list Data
  let donors = $Donors;
  /* End Donors.js module */
</script>

<div class="page">
  <h1>Donors</h1>
  <div id="donor-list">
    <DataDisplay items={donors} Table={DonorTable} />
  </div>
</div>

<style>
  /* Styles specific to the donor page. Should not be many here */
</style>
