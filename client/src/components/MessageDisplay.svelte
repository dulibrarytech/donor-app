<script>
  //export let messageText="";
  let messageText = "";

  //$: setTimeout(() => {message = ""}, 3000);
  export function displayMessage(message) {
    messageText = message;
    setTimeout(() => {messageText = ""}, 3000);
  }
</script>

<div class="feedback-message">
 <span>{messageText}</span>
</div>

<style>

</style>
