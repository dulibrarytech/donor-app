<script>
  import {Configuration} from '../config';
  import {ajaxRequest} from '../libs/ajax.js';
  import {Session} from '../libs/session.js';
  import DataDisplay from "../components/DataDisplay.svelte";
  import NewDonationTable from "../components/NewDonationTable.svelte";
  import MessageDisplay from "../components/MessageDisplay.svelte";

  var donations = [];
  var donationDisplay = [];
  var userData = Session.getData("donor_db") || null;
  let messageDisplay;

  const init = async () => {
    donations = await getDonationList();

    /* If user role is 'admin' show the standard donations */
    if(userData.roleId == 2) {
      donationDisplay = donations.filter((item) => {
        return item.important == 0;
      });
    }

    /* If user role is 'external relations' show the important donations */
    else if(userData.roleId == 3) {
      donationDisplay = donations.filter((item) => {
        return item.important == 1;
      });
    }
  }

  const getDonationList = async () => {
    let list = []
    let url = `${$Configuration.donorApiDomain}/donation/pending/all`;

    return new Promise((resolve, reject) => {
      ajaxRequest('GET', url, function(error, response, status) {
        if(error) {
          console.error(error);
          resolve([]);
        }
        else if(status != 200) resolve([]);
        else resolve(response.json());
      });
    });
  }

  const completeLetterAction = (event) => {
    let donationId = event.detail;
    let url = `${$Configuration.donorApiDomain}/donation/${donationId}/letter`;

    messageDisplay.displayMessage("Updating status...");
    ajaxRequest("post", url, function(error, response, status) {
      if(error) {
        messageDisplay.displayMessage("Error", `Ajax error: ${error}`);
      }
      else if(status != 200) {
        messageDisplay.displayMessage("Error", `Response status: ${status}`);
      }
      else {
        messageDisplay.displayMessage("Donation record updated.");
        setTimeout(() => {
          messageDisplay.displayMessage("");
          init();
        }, 3000)
      }
    });
  }

  init()
</script>

<div class="page">
  <div class="page-section">
    <h1>Inbox</h1>
    <div>
      <DataDisplay items={donationDisplay} Table={NewDonationTable} on:message={completeLetterAction}/>
      <MessageDisplay bind:this={messageDisplay} />
    </div>
  </div>
</div>

<style>

</style>
