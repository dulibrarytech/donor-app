import { writable } from 'svelte/store'

export const Configuration = writable({
  donorApiDomain: process.env.DONORDB_API_DOMAIN,
  signatureImageFilename: process.env.SIGNATURE_IMAGE_FILENAME
})
