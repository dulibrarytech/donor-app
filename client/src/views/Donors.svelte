<script>
  import {Donors} from '../stores';
  import ListDisplay from "../components/ListDisplay.svelte";
  import DonorTable from "../components/DonorTable.svelte";

  // Fetch list Data
  let donors = $Donors;
</script>

<div class="page">
  <h1>Donors</h1>
  <div id="donor-list">
    <ListDisplay items={donors} Table={DonorTable} />
  </div>
</div>
