# @dewa-id/signed-qr

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

A Node.js / Web package written in Typescript for decoding and parsing QR codes
according to the Digitaliseringsstyrelsen _Signed QR_<sup>[1]</sup> and dewa _SecureQR_<sup>[2]</sup> specifications,
which are commonly used for device-to-device presentations of digital proofs between wallets.

## Roadmap

### CBOR/mDoc based "Signed QR" (used by AltID)

- [X] **Basic QR Frame Decoding** - Parse individual QR code frames with parameters
- [X] **Multi-QR Assembly** - Combine multiple QR codes into complete payload (mDoc as Uint8Array)
- [ ] **Documentation** - Comprehensive API documentation and usage guides
- [ ] **Tests** - Unit tests and integration tests
  - [X] Basic unit testing added
- [ ] **Examples** - Working examples and sample code

Currently out of scope:

- [ ] **Signature Verification** - Verify cryptographic signatures of decoded payload
- [ ] **Trust Anchor Validation** - Validate against trusted certificate authorities

### SDJWT-based "SecureQR" (used by e-Boks ID)

- [x] **Basic QR Frame Decoding** - Parse individual QR code frames with parameters
- [x] **Multi-QR Assembly** - Combine multiple QR codes into complete payload (SD-JWT as string)
  - [X] Basic unit testing added
- [ ] **Documentation** - Comprehensive API documentation and usage guides
- [ ] **Tests** - Unit tests and integration tests
- [ ] **Examples** - Working examples and sample code

Currently out of scope:

- [ ] **Signature Verification** - Verify cryptographic signatures of decoded payload
- [ ] **Trust Anchor Validation** - Validate against trusted certificate authorities

## References

- [1] [Implementing Age Verification With Danish Digital Identity Wallet (DKTB)](https://digst.dk/media/5gybwsaq/implementing-age-verification-with-danish-digital-identity-wallet-dktb-09.pdf)
- [2] [Documentation dewa SecureQR](https://docs.dewa-id.com/docs/e-wallet/qr-code/)

## License

Apache-2.0 requires you to:

- Include Copyright
- Include License
- State Changes
- Include Notice

[Apache Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
