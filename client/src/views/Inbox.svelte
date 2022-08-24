<script>
  import { onMount } from 'svelte';
  import {Configuration} from '../config';
  import {ajaxRequest, fetchData} from '../libs/ajax.js';
  import {Session} from '../libs/session.js';
  import DataDisplay from "../components/DataDisplay.svelte";
  import NewDonationTable from "../components/NewDonationTable.svelte";
  import MessageDisplay from "../components/MessageDisplay.svelte";

  var donations = [];
  var donationDisplay = [];
  var userData = Session.getData("donor_db") || null;
  var isAdminUser;
  var isExtRelUser;
  let messageDisplay;

  const donationsUrl = `${$Configuration.donorApiDomain}/donation/pending/all`;

  var sortOptions = {
    field: "dateOfRecord",
    type: "desc"
  };

  const init = async () => {
    isAdminUser = userData.roleId == 2;
    isExtRelUser = userData.roleId == 3;
    donations = await fetchData(donationsUrl);

    /* If user role is 'admin' show the standard donations */
    if(isAdminUser) {
      donationDisplay = donations.filter((item) => {
        return item.important == 0;
      });
    }

    /* If user role is 'external relations' show the important donations */
    else if(isExtRelUser) {
      donationDisplay = donations.filter((item) => {
        return item.important == 1;
      });
    }

    sortDataDisplay();
  }

  const completeLetterAction = (event) => {
    let donationId = event.detail;
    let url = `${$Configuration.donorApiDomain}/donation/${donationId}/letter`;

    console.log("Updating donation status...");
    ajaxRequest("post", url, function(error, response, status) {
      if(error) console.error(`Ajax error: ${error}`);
      else if(status != 200) console.error(`Response status: ${status}`);
      else {
        console.log("Donation record updated.");
        init();
      }
    });
  }

  const sortDataDisplay = () => {
    let {type, field} = sortOptions;
    if(type == "asc") {
      donationDisplay = donationDisplay.sort(function(a, b) {
        return a[field]?.localeCompare(b[field]);
      });
    }
    else if(type == "desc") {
      donationDisplay = donationDisplay.sort(function(b, a) {
        return a[field]?.localeCompare(b[field]);
      });
    }
  }

  onMount(() => {
   init();
  })
</script>

<div class="page">
  <div class="page-section">
    <h1>Inbox</h1>
    <div>
      <DataDisplay items={donationDisplay} Table={NewDonationTable} args={{roleId: userData.roleId}} on:complete-action={completeLetterAction}/>
      <MessageDisplay bind:this={messageDisplay} />
    </div>
  </div>
</div>

<style>

</style>
