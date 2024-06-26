import { writable } from 'svelte/store'

export const Configuration = writable({
  runtimeEnv: process.env.RUNTIME_ENV,
  domain: process.env.DONOR_APP_DOMAIN,
  basePath: process.env.DONOR_APP_BASE_PATH,
  donorApiDomain: process.env.DONOR_APP_API_URL,
  donorAppAuthRoute: process.env.DONOR_APP_AUTH_ROUTE,
  authTokenSecretKey: process.env.AUTH_TOKEN_SECRET_KEY,
  ssoUrl: process.env.SSO_URL,
  ssoResponseUrl: process.env.SSO_RESPONSE_URL,
  ssoLogoutUrl: process.env.SSO_LOGOUT_URL,
  livingLibraryApiDomain: process.env.LIVINGLIBRARY_API_URL,
  livingLibraryApiKey: process.env.LIVINGLIBRARY_API_KEY,
  signatureImageFilename: process.env.DONOR_LETTER_SIGNATURE_IMAGE_FILENAME,
  letterHeadImageFilename: process.env.DONOR_LETTER_HEAD_IMAGE_FILENAME,
  letterSignatureName: process.env.LETTER_SIGNATURE_NAME,
  letterSignatureTitle: process.env.LETTER_SIGNATURE_TITLE,
  landingPagePath: process.env.LANDING_PAGE_PATH
})
