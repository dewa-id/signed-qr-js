import {
  decodeSignedQrFrame,
  assembleSignedQrPayload,
  decodeSignedQrFrames,
} from "../dist/signed-qr.js";

describe("SignedQR", () => {
  // Test frames from the sample data
  const testFrames = [
    `o2FpAGFuA2FwWQIypGFtdmk3RzlQcUo5MGNmZzBiTnNmdWo5Z2dhZhppnvhjYXQaaZ74gWFkWQZpo2dkb2NUeXBlcWV1LmV1cm9wYS5lYy5hdi4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6FxZXUuZXVyb3BhLmVjLmF2LjGB2BhYT6RoZGlnZXN0SUQIZnJhbmRvbVC7-Qnbx5OqHfRw76qPANnacWVsZW1lbnRJZGVudGlmaWVya2FnZV9vdmVyXzI3bGVsZW1lbnRWYWx1ZfVqaXNzdWVyQXV0aIRDoQEmoRghWQJOMIICSjCCAfCgAwIBAgIUQkfIkGJcupTqa_SxzW0Bl4Nsvc8wCgYIKoZIzj0EAwIwbTELMAkGA1UEBhMCREsxEzARBgNVBAcMCkvDuGJlbmhhdm4xITAfBgNVBAoMGERpZ2l0YWxpc2VyaW5nc3N0eXJlbHNlbjEMMAoGA1UECwwDS0VBMRgwFgYDVQQDDA9ES1RCIElzc3VpbmcgQ0EwHhcNMjUwNjE4MTQyMzUxWhcNMjYwNjE4MTQyMzUxWjB0MQswCQYDVQQGEwJESzETMBEGA1UEBwwKS8O4YmVuaGF2bjEhMB8GA1UECgwYRGlnaXRhbGlzZXJpbmdzc3R5cmVsc2VuMQwwCgYDVQQLDANLRUExHzAdBgNVBAMMFkRLVEIgQ3JlZGVudGlhbCBJc3N1ZXIwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASkcFWfqQ`,
    `o2FpAmFuA2FwWQIyrBBsEtImDuF-1SYIWCBqzyHZtt_Exh8q51zspDjQl1ileoy3a5hW-NEStUb1nAlYIIW2GD1QxLZfGb71JIbpZp4FraUU-Jj7juGcky4oGwqDbWRldmljZUtleUluZm-iaWRldmljZUtleaUBAiABIVggaXU7y2kPBRQ-_Mu-2rBtWBJHIGZJVMKwVQJPycJv964iWCC-ilsM2s0uxSPlIwIjDKXsvrAXLTMmAdOCSJbQIUmMVgMmcWtleUF1dGhvcml6YXRpb25zoWpuYW1lU3BhY2VzgXFldS5ldXJvcGEuZWMuYXYuMWdkb2NUeXBlcWV1LmV1cm9wYS5lYy5hdi4xbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHQyMDI2LTAyLTI1VDAwOjAwOjAwWml2YWxpZEZyb23AdDIwMjYtMDItMjVUMDA6MDA6MDBaanZhbGlkVW50aWzAdDIwMjYtMDMtMjdUMDA6MDA6MDBaWEDYV5YsR9Ka2l9Z2Ql6QgxT8FedVkPCGqIjac3lbDSKBLQ7vwVeLUg3YOhGmtDgwTzMSLl1C-bHSWHx3eX4XjNNbGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhAa5BQYiJAI4kIxnHohdyotw7XkjolzKiSQ33HF0vW9LFN-ghVjc17sEoy9QH9h2dvPlfyAddDtNLxyaHLdIIaEg`,
    `o2FpAWFuA2FwWQIyELuWSp80hazyy3x1xF-mcVpYXxEuTFG7DjMT3hRM9MzzkC7yVNu_DPpgR3CRdWVMtveKmLOw9j2nCB-jZzBlMA4GA1UdDwEB_wQEAwIHgDAfBgNVHSMEGDAWgBSiKVXp9UpUNppu3lsQ17AQ4Jb94jAdBgNVHQ4EFgQUMFKABCIl7EHzdm3C93P7ihVJ8rQwEwYDVR0lBAwwCgYIKwYBBQUHAwMwCgYIKoZIzj0EAwIDSAAwRQIhAM-nBsorYAx0GAX5_O5FtlsOLCciWoEz9ohJamHO0MmsAiAVKkFhzzRUcf6ahWCV5FUMXqM5VVr05Tj_zJw951OSsFkCo9gYWQKepmd2ZXJzaW9uYzEuMG9kaWdlc3RBbGdvcml0aG1nU0hBLTI1Nmx2YWx1ZURpZ2VzdHOhcWV1LmV1cm9wYS5lYy5hdi4xqQFYIGmMyrXdwyd5w-MeRZa3_42r-KZTphNqBSbL8mAcrMZAAlggbhovoJxq_-ptweOuMn5DBrMRPkTfVcPd8WpXRrWJahsDWCAl3WsxR8oVQFHDgAEoWYlx5yApyUIFhzZzbdkc70QvnARYIOefmrhD37pE5tnux0UEM3cmt1V-8i2Rao8BqBaMKCHzBVggGEbnToLMGx2hp7GjiWD27l1RQTvvM8JUZnl-cElK7_cGWCA72SnufNpTNLHNT3LYk0AcVP8jkF-vn0X5Ps5jo_umXgdYIBwViMQNbflJ27h7_ZVEAVHVkrFcRg`,
  ];

  describe("decodeSignedQrFrame", () => {
    it("should decode a valid frame", () => {
      const frame = decodeSignedQrFrame(testFrames[0]!);

      expect(frame).toBeDefined();
      expect(typeof frame.i).toBe("number");
      expect(typeof frame.n).toBe("number");
      expect(frame.p).toBeInstanceOf(Uint8Array);
    });

    it("should decode frame with correct structure", () => {
      const frame = decodeSignedQrFrame(testFrames[0]!);

      expect(frame.i).toBe(0); // First frame
      expect(frame.n).toBe(3); // Total 3 frames
      expect(frame.p.length).toBeGreaterThan(0);
    });

    it("should throw error for invalid base64", () => {
      expect(() => decodeSignedQrFrame("invalid-base64")).toThrow(
        "invalid base64 encoding",
      );
    });

    it("should throw error for invalid CBOR", () => {
      // Valid base64 but invalid CBOR
      expect(() => decodeSignedQrFrame("aGVsbG8=")).toThrow(
        "invalid CBOR encoding",
      );
    });
  });

  describe("decodeSignedQrFrames", () => {
    it("should decode multiple frames", () => {
      const frames = decodeSignedQrFrames(testFrames);

      expect(frames).toHaveLength(3);
      expect(frames[0]!.i).toBe(0);
      expect(frames[1]!.i).toBe(2);
      expect(frames[2]!.i).toBe(1);
    });
  });

  describe("assembleSignedQrPayload", () => {
    it("should assemble frames into payload", () => {
      const frames = decodeSignedQrFrames(testFrames);
      const payload = assembleSignedQrPayload(frames);

      expect(payload).toBeDefined();
      expect(payload.d).toBeInstanceOf(Uint8Array);
      expect(typeof payload.f).toBe("number");
      expect(typeof payload.t).toBe("number");
      expect(typeof payload.m).toBe("string");
    });

    it("should handle frames in any order", () => {
      const frames = decodeSignedQrFrames(testFrames);
      const shuffledFrames = [...frames].reverse(); // Reverse order

      const payload1 = assembleSignedQrPayload(frames);
      const payload2 = assembleSignedQrPayload(shuffledFrames);

      expect(payload1.d).toEqual(payload2.d);
      expect(payload1.f).toBe(payload2.f);
      expect(payload1.t).toBe(payload2.t);
      expect(payload1.m).toBe(payload2.m);
    });

    it("should throw error for empty frames", () => {
      expect(() => assembleSignedQrPayload([])).toThrow(
        "insufficient frame count",
      );
    });

    it("should work with strict mode", () => {
      const frames = decodeSignedQrFrames(testFrames);
      expect(() =>
        assembleSignedQrPayload(frames, { strict: true }),
      ).not.toThrow();
    });

    it("should throw error in strict mode for duplicate frames", () => {
      const frames = decodeSignedQrFrames(testFrames);
      const framesWithDuplicate = [...frames, frames[0]!]; // Add duplicate

      expect(() =>
        assembleSignedQrPayload(framesWithDuplicate, { strict: true }),
      ).toThrow("duplicate frames");
    });
  });
});
