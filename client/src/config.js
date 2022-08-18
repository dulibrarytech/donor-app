import { writable } from 'svelte/store'

export const Configuration = writable({
  runtimeEnv: process.env.RUNTIME_ENV,
  donorApiDomain: process.env.DONORDB_API_DOMAIN,
  livingLibraryApiDomain: process.env.LIVINGLIBRARY_API_DOMAIN,
  livingLibraryApiKey: process.env.LIVINGLIBRARY_API_KEY,
  signatureImageFilename: process.env.DONOR_LETTER_SIGNATURE_IMAGE_FILENAME,
  letterSignatureName: process.env.LETTER_SIGNATURE_NAME,
  letterSignatureTitle: process.env.LETTER_SIGNATURE_TITLE,
  landingPagePath: process.env.LANDING_PAGE_PATH
})
