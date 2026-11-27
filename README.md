# SanKa

The latest SanKa design, café directory, map, browser-local passport, photo attachments and coffee journal run as a standalone React application. No Base44 login, Cloudflare Worker, or backend is required for these features.

## Run in VS Code

1. Open the **SanKa** folder in VS Code.
2. Use Node.js 22.12 or newer. In the terminal, run `npm install` (or `npm ci` when the lockfile is present).
3. Run `npm run dev`.
4. Open http://127.0.0.1:8080. Keep the terminal running.

Press F5 and choose **SanKa — start and open** to start the server and launch Chrome from VS Code. If a server is already running on port 8080, use that browser URL instead of starting another.

`npm run serve` and `npm start` also start the development server. Opening index.html directly or using VS Code Live Server does not compile React; use the commands above.

## Build and checks

- `npm run build` writes a production build to `dist/`.
- `npm run preview` previews that build on port 8080.
- `npm test` checks passport persistence and migration.
- `npm run test:browser` exercises the real app in installed Google Chrome.
- `npm run check` runs unit checks and the production build.

The production app uses client-side routing. A static host must send unknown routes back to `index.html`. Legacy `/maps` and `/user` links redirect to `/map` and `/passport`.

## Journal and photos

The Passport page includes a Coffee tab with calendar, scrapbook and timeline views. Add or edit a coffee, tasting notes, visit date, optional rating and up to six image attachments. Profile photos and café review photos use the same local image store. Files must be images of up to 8 MB each. No photo is uploaded to Base44 or another server.

The local photo store replaces the export’s Base44 private-file dependency. Previously hosted private Base44 image references cannot be resolved without that original service; attach those images again from your device. Public HTTP image references remain supported. Removing an attachment detaches it from the entry; resetting the passport clears the local image store. Clearing this site’s browser data also removes photos.

## Local data and external resources

The café listings and contact details are illustrative placeholders from the supplied design. Passport names, avatars, visits, reviews, stamps and coffee journal entries stay in this browser. Photos are stored as blobs in IndexedDB; the passport stores only references, so images do not fill localStorage. The map uses external Esri tiles; the fonts use Google Fonts. These resources require internet access. Location permission is optional; denying it keeps the default map centre.

An existing legacy passport is migrated once from `luckys-atlas:state:v1` when the app is opened on the **same browser origin** (scheme, hostname and port). The original storage entry is retained as a backup. Old city, owner contact and revisit details are retained in migration metadata; the new UI exposes the new export’s passport fields. Browsers treat `localhost` and `127.0.0.1`, and different ports, as separate storage. Use the old hostname and port if you need existing browser data, for example `npm run dev -- --host localhost --port 4173`.

The repository contains the current app at its root. The earlier nested `Lucky’s Atlas` folder remains recoverable through Git history. The docs describe the earlier prototype; this README describes the current app. Local backups and migration notes are retained separately.

## Latest features

Save cafés to Favorites or Want to visit, share café links, record coffee prices and currencies, and view spending totals without currency conversion. Data & privacy on the Passport page exports or imports a JSON backup with local photos. Privacy, Terms and Data declaration pages describe the prototype and identify missing operator details.

Run `npm run scan:secrets` to scan Git-tracked source for credential patterns.
