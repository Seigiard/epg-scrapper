# Anti-slop baseline

The settings enable all 18 generic anti-slop rules and native `oxc/no-accumulating-spread` as errors. Run `npm ci` and `npm run lint` with Node 24 or newer.

On the unchanged source at `a29f1ba6ac9dfa99cb74f144d872294a3f899c25`, lint exits 1 with seven `require-readable-spacing` findings:

- `index.js:2`
- `src/generateEpgXml-backup.js:30,46,49,57,60,106`

The cleanup adds the seven missing blank lines. `npm run lint` now passes with zero findings across all three owned source files. The backup stays in scope, and all rule severities are unchanged. A second autofix pass leaves the source unchanged. The repository has no configured formatter.

There is no configured typecheck. The existing `test` script is a placeholder that always fails and is preserved. Verification used lint and `node --check` on all three source files, without running the network scraper.
