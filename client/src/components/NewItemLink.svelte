<svelte:head>
  <script type="module" src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons/ionicons.esm.js"></script>
</svelte:head>

<script>
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  export let text;
  export let href;

  const onClick = (e) => {
    if(!href) e.preventDefault();
    dispatch('click-new-item-link', e.currentTarget);
  }
</script>

<div class="add-item-link float-right">
  <ion-icon name="add-circle-outline"></ion-icon>
  <a {href} on:click={onClick}>{text}</a>
</div>

<style>
  /* Remove the styles from global.css */
  .add-item-link {
  	float: right;
  	color: rgb(0,80,160);
  	margin-bottom: 5px;
    margin-left: 25px;
  }

  .add-item-link a {
  	position: relative;
  	bottom: 2px;
  }
</style>
