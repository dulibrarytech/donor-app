<script>
import { Configuration } from '../../config';
import { getNormalDateString } from '../../libs/dateFormatter.js';

export let data;
const signatureName = $Configuration.letterSignatureName;
const signatureTitle = $Configuration.letterSignatureTitle;
const currentDate = getNormalDateString(new Date())

$: {
  if(data.dateOfGift) {
    data.dateOfGift = getNormalDateString(new Date(data.dateOfGift))
  }
}

</script>

<div class="letter-content">
  <div class="header-logo-image">
    <div class="float-right" style="height: 100%">
      <img src="/assets/img/private/lheader.png" alt="Dean's office logo" />
    </div>
  </div>
  <span>{currentDate}</span>
  <br>
  <br>
  {#if data.title?.length > 0}{data.title}{/if}
  {#if data.firstName?.length > 0}{data.firstName}{/if}
  {#if data.lastName?.length > 0}{data.lastName}{/if}
  {#if data.organization?.length > 0}<br><span>{data.organization}</span><br>{/if}
  {#if data.address1?.length > 0}<br><span>{data.address1}</span>{/if}
  {#if data.address2?.length > 0}<br><span>{data.address2}</span>{/if}
  <br>
  {#if data.city?.length > 0}{data.city},{/if}
  {#if data.state?.length > 0}{data.state}{/if}
  {#if data.postalCode?.length > 0}{data.postalCode}{/if}
  {#if data.country?.length > 0 && data.country.toLowerCase() != "usa"}<br><span>{data.country}</span>{/if}
  <br>
  <br>
  <br>
  {#if data.lastName}
    <span>Dear {data.title || ""} {data.lastName},</span>
  {:else}
    <span>Dear Sir or Madam,</span>
  {/if}
  <br>
  <br>
  <p>I would like to thank you for your generous donation to the University Library. Your gift of {data.giftDescription}, which we received on {data.dateOfGift}, is much appreciated. The University Library has not provided you with any payment, or services in exchange for your gift; we do, however, convey our sincere appreciation for your contribution - it has enhanced the library's resources.</p>

  <p>While academic departments in the University of Denver have support from parents and alumni, the University Library relies on its friends. We are pleased to count you among our friends, and we hope we can count on your friendship in future years.</p>
  <p>Again, I thank you for your generous support of the University of Denver Library.</p>

  <span>Sincerely,</span>
  <br>
  <div class="signature-image">
    <img src="/assets/img/private/{$Configuration.signatureImageFilename}" alt="Signature" />
  </div>
  <br>
  <span>{signatureName}</span>
  <br>
  <span>{signatureTitle}</span>
</div>

<style>
  .float-right {
    float: right;
  }

  .header-logo-image {
    height: 100px;
  }

  .header-logo-image img {
    height: 100%;
  }

  .letter-content {
    margin-top: 2em;
    margin-bottom: 12em;
  }
  .signature-image {
    padding: 18px 0 2px 0;
  }

  .signature-image img {
    width: 425px;
  }
</style>
