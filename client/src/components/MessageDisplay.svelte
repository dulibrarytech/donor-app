<script>
  const timeout = 3000;
  let messageText = "";

  export const displayMessage = (message, consoleMessage=null) => {
    messageText = message;
    if(consoleMessage) console.log(consoleMessage);
  }

  export const displayTimeoutMessage = (message) => {
    messageText = message;
    setTimeout(() => {messageText = ""}, timeout);
  }
</script>

<div class="feedback-message">
 <span>{messageText}</span>
</div>

<style>

</style>
