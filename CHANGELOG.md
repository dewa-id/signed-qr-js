# Change Log

## [0.2.1](https://github.com/dewa-id/signed-qr-js/compare/v0.2.0...v0.2.1) (2026-09-28)

Updated package description and roadmap.

## [0.2.0](https://github.com/dewa-id/signed-qr-js/compare/v0.1.6...v0.2.0) (2026-09-28)

Major changes:

- Support the latest version of AltID Signed QR (`AltID-1.0`) as described by
  https://lnk.dk/altid-integration-v101 . Old Signed QR codes are rejected.

Minor changes:

- Strict base64 validation added to `decodeSignedQrFrame()`.
- Strict `typ` validation added to `assembleSignedQrPayload()`.

Dependencies:

- Updated pako from v2 to v3.
- Updated uuid from v13 to v14.
- Updated uint8array-extras to latest patch.

Dev dependencies:

- Updated pnpm from v10 to v12.
- Updated typescript compiler from v5 to v7.
