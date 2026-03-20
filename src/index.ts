// Copyright 2026 dewa ApS
// SPDX-License-Identifier: Apache-2
export * from "./secure-qr.js";
export * from "./signed-qr.js";

const frame1 = `o2FpAGFuA2FwWQIypGFtdmk3RzlQcUo5MGNmZzBiTnNmdWo5Z2dhZhppnvhjYXQaaZ74gWFkWQZpo2dkb2NUeXBlcWV1LmV1cm9wYS5lYy5hdi4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6FxZXUuZXVyb3BhLmVjLmF2LjGB2BhYT6RoZGlnZXN0SUQIZnJhbmRvbVC7-Qnbx5OqHfRw76qPANnacWVsZW1lbnRJZGVudGlmaWVya2FnZV9vdmVyXzI3bGVsZW1lbnRWYWx1ZfVqaXNzdWVyQXV0aIRDoQEmoRghWQJOMIICSjCCAfCgAwIBAgIUQkfIkGJcupTqa_SxzW0Bl4Nsvc8wCgYIKoZIzj0EAwIwbTELMAkGA1UEBhMCREsxEzARBgNVBAcMCkvDuGJlbmhhdm4xITAfBgNVBAoMGERpZ2l0YWxpc2VyaW5nc3N0eXJlbHNlbjEMMAoGA1UECwwDS0VBMRgwFgYDVQQDDA9ES1RCIElzc3VpbmcgQ0EwHhcNMjUwNjE4MTQyMzUxWhcNMjYwNjE4MTQyMzUxWjB0MQswCQYDVQQGEwJESzETMBEGA1UEBwwKS8O4YmVuaGF2bjEhMB8GA1UECgwYRGlnaXRhbGlzZXJpbmdzc3R5cmVsc2VuMQwwCgYDVQQLDANLRUExHzAdBgNVBAMMFkRLVEIgQ3JlZGVudGlhbCBJc3N1ZXIwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASkcFWfqQ`;
const frame2 = `o2FpAmFuA2FwWQIyrBBsEtImDuF-1SYIWCBqzyHZtt_Exh8q51zspDjQl1ileoy3a5hW-NEStUb1nAlYIIW2GD1QxLZfGb71JIbpZp4FraUU-Jj7juGcky4oGwqDbWRldmljZUtleUluZm-iaWRldmljZUtleaUBAiABIVggaXU7y2kPBRQ-_Mu-2rBtWBJHIGZJVMKwVQJPycJv964iWCC-ilsM2s0uxSPlIwIjDKXsvrAXLTMmAdOCSJbQIUmMVgMmcWtleUF1dGhvcml6YXRpb25zoWpuYW1lU3BhY2VzgXFldS5ldXJvcGEuZWMuYXYuMWdkb2NUeXBlcWV1LmV1cm9wYS5lYy5hdi4xbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHQyMDI2LTAyLTI1VDAwOjAwOjAwWml2YWxpZEZyb23AdDIwMjYtMDItMjVUMDA6MDA6MDBaanZhbGlkVW50aWzAdDIwMjYtMDMtMjdUMDA6MDA6MDBaWEDYV5YsR9Ka2l9Z2Ql6QgxT8FedVkPCGqIjac3lbDSKBLQ7vwVeLUg3YOhGmtDgwTzMSLl1C-bHSWHx3eX4XjNNbGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhAa5BQYiJAI4kIxnHohdyotw7XkjolzKiSQ33HF0vW9LFN-ghVjc17sEoy9QH9h2dvPlfyAddDtNLxyaHLdIIaEg`;
const frame3 = `o2FpAWFuA2FwWQIyELuWSp80hazyy3x1xF-mcVpYXxEuTFG7DjMT3hRM9MzzkC7yVNu_DPpgR3CRdWVMtveKmLOw9j2nCB-jZzBlMA4GA1UdDwEB_wQEAwIHgDAfBgNVHSMEGDAWgBSiKVXp9UpUNppu3lsQ17AQ4Jb94jAdBgNVHQ4EFgQUMFKABCIl7EHzdm3C93P7ihVJ8rQwEwYDVR0lBAwwCgYIKwYBBQUHAwMwCgYIKoZIzj0EAwIDSAAwRQIhAM-nBsorYAx0GAX5_O5FtlsOLCciWoEz9ohJamHO0MmsAiAVKkFhzzRUcf6ahWCV5FUMXqM5VVr05Tj_zJw951OSsFkCo9gYWQKepmd2ZXJzaW9uYzEuMG9kaWdlc3RBbGdvcml0aG1nU0hBLTI1Nmx2YWx1ZURpZ2VzdHOhcWV1LmV1cm9wYS5lYy5hdi4xqQFYIGmMyrXdwyd5w-MeRZa3_42r-KZTphNqBSbL8mAcrMZAAlggbhovoJxq_-ptweOuMn5DBrMRPkTfVcPd8WpXRrWJahsDWCAl3WsxR8oVQFHDgAEoWYlx5yApyUIFhzZzbdkc70QvnARYIOefmrhD37pE5tnux0UEM3cmt1V-8i2Rao8BqBaMKCHzBVggGEbnToLMGx2hp7GjiWD27l1RQTvvM8JUZnl-cElK7_cGWCA72SnufNpTNLHNT3LYk0AcVP8jkF-vn0X5Ps5jo_umXgdYIBwViMQNbflJ27h7_ZVEAVHVkrFcRg`;

// Test decoding of individual frames
import { decodeSignedQrFrame, assembleSignedQrPayload } from "./signed-qr.js";
import * as cbor from "cbor2";

console.log("=== Decoding individual frames ===");

const decodedFrame1 = decodeSignedQrFrame(frame1);
console.log(
  "Frame 1:",
  JSON.stringify(
    decodedFrame1,
    (_key, value) =>
      value instanceof Uint8Array ? `[Uint8Array(${value.length})]` : value,
    2,
  ),
);

const decodedFrame2 = decodeSignedQrFrame(frame2);
console.log(
  "Frame 2:",
  JSON.stringify(
    decodedFrame2,
    (_key, value) =>
      value instanceof Uint8Array ? `[Uint8Array(${value.length})]` : value,
    2,
  ),
);

const decodedFrame3 = decodeSignedQrFrame(frame3);
console.log(
  "Frame 3:",
  JSON.stringify(
    decodedFrame3,
    (_key, value) =>
      value instanceof Uint8Array ? `[Uint8Array(${value.length})]` : value,
    2,
  ),
);

console.log("\n=== Assembling all frames ===");

const allFrames = [decodedFrame1, decodedFrame2, decodedFrame3];
const assembledPayload = assembleSignedQrPayload(allFrames);
console.log(
  "Assembled payload:",
  JSON.stringify(
    assembledPayload,
    (_key, value) =>
      value instanceof Uint8Array ? `[Uint8Array(${value.length})]` : value,
    2,
  ),
);

console.log("\n=== Payload data details ===");
console.log("Payload data bytes length:", assembledPayload.d.length);
console.log(
  "From timestamp:",
  assembledPayload.f,
  "(",
  new Date(assembledPayload.f * 1000).toISOString(),
  ")",
);
console.log(
  "To timestamp:",
  assembledPayload.t,
  "(",
  new Date(assembledPayload.t * 1000).toISOString(),
  ")",
);
console.log("Nonce:", assembledPayload.m);

console.log("\n=== Decoding message data (CBOR) ===");
try {
  const decodedMessage = cbor.decode(assembledPayload.d);
  console.log("Message data:", JSON.stringify(decodedMessage, null, 2));
} catch (ex) {
  console.log("Error decoding message data:", ex);
}
