<script>
  export let lname;
  export let fname;
  export let org;

  let text = "";

  /* Set page label text. Display the donor name if it is present, or the organization if the last name is not present */
  if(lname.length > 0) {
    text = `${lname}`;
    if(fname.length > 0) {
      text += `, ${fname}`;
    }
  }
  else if(org.length > 0) {
    text = `${org}`;
  }
</script>

<h3>{text}</h3>

<style>

</style>
