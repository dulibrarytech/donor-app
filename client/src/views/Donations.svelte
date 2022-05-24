<script>
  import {Donations} from '../stores';
  import DataDisplay from "../components/DataDisplay.svelte";
  import DonationTable from "../components/DonationTable.svelte";

  // Fetch list Data
  let donations = $Donations;
</script>

<div class="page">
  <h1>Donations</h1>
  <div id="donation-list">
    <DataDisplay items={donations} Table={DonationTable} />
  </div>
</div>
