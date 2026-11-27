# SanKa security and privacy notes

This distribution runs as a standalone React/Vite app. Passport records are stored in localStorage; photos are stored in IndexedDB. It does not use Base44 authentication, server functions, platform analytics or private upload services. Google Fonts and Esri map tiles remain external resources.

Vite dev and preview responses set Content-Security-Policy, X-Content-Type-Options, Referrer-Policy and Permissions-Policy. The production CSP uses scripts from the app origin. Development additionally permits Vite’s inline refresh preamble, evaluation and WebSocket connection. Public HTTPS photo URLs are supported.

`public/_headers` carries production headers for static hosts that support that format. Other hosting services must configure equivalent response headers themselves. HTTPS, HSTS, routing fallback and any host-provided analytics depend on the deployment and are not configured by this repository.

Backups are shape-checked and limited in size. Image attachments are limited to known image types and 8 MB each; browser uploads must decode successfully. Stored browser data is not encrypted by the app. Private backup files should be kept outside this public repository.

The Privacy, Terms and Data declaration pages are supplied prototype text; operator identity and other flagged details still need to be filled in before launch.

Checks: `npm test`, `npm run build`, `npm run scan:secrets`. The scan reports possible credential locations without printing values.
