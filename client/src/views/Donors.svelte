<script>
  import {Donors} from '../stores';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";

  /* Import Donors.js module */
  // import Donors from "../modules/Donors.js";
  // Fetch list Data
  var donors = $Donors;
  /* End Donors.js module */
</script>

<div class="page">
  <h1>Donors</h1>

  <div class="search-form">
    <label for="donor-searchbox">Search Donors:</label>
    <input id="donor-searchbox" type="text" placeholder="Search by any part of name or organization"/>
  </div>

  <div id="add-new-donor-link" class="add-item-link float-right">
    <ion-icon name="add-circle-outline"></ion-icon>
    <a href="/">Add new donor</a>
  </div>
  <div id="donor-list">
    <DataDisplay items={donors} Table={DonorTable} />
  </div>
</div>

<style>
  /* Styles specific to the donor page. Should not be many here */
  input#donor-searchbox {
    min-width: 21em;
  }
</style>
