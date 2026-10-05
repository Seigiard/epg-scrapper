# Anti-slop baseline

The settings enable all 18 generic anti-slop rules and native `oxc/no-accumulating-spread` as errors. Run `npm ci` and `npm run lint` with Node 24 or newer.

On the unchanged source at `a29f1ba6ac9dfa99cb74f144d872294a3f899c25`, lint exits 1 with seven `require-readable-spacing` findings:

- `index.js:2`
- `src/generateEpgXml-backup.js:30,46,49,57,60,106`

The active generator, `src/generateEpgXml.js`, has no findings. The backup is owned source and stays in scope. No source cleanup or rule suppression is included. A separate spacing change can resolve this baseline before the draft is made ready.

There is no configured typecheck. The existing `test` script is a placeholder that always fails and is preserved. Verification used lint and `node --check` on all three source files, without running the network scraper.
