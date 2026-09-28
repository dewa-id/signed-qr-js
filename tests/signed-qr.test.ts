import {
  decodeSignedQrFrame,
  assembleSignedQrPayload,
  decodeSignedQrFrames,
} from "../dist/signed-qr.js";

describe("SignedQR", () => {
  // Test frames from the sample data
  const testFrames = [
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeABjY250DWRwYXJ0WOimY3R5cGlBbHRJRC0xLjBjdHhueCQxNjVkYWRjMy0zNjU2LTQ4MTgtOGM4Ni1hNDBjODBmM2I3NTJmbW5vbmNldldGRWVlTnZWOEpSU19qM2pxZGRiT0FjbmJmGmq6L5pjZXhwGmq6MBJjZG9jWQtbo2dkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6J4GmV1LmV1cm9wYS5lYy5ldWRpLnBpZC5kay4xgdgYWF2kaGRpZ2VzdElEAWZyYW5kb21Qn0RV4Yce5EzQ`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAFjY250DWRwYXJ0WOhXdUCS7CRFcWVsZW1lbnRJZGVudGlmaWVyaWZ1bGxfbmFtZWxlbGVtZW50VmFsdWVwU2lndXJkIEhlbnJpa3NlbndldS5ldXJvcGEuZWMuZXVkaS5waWQuMYrYGFhYpGhkaWdlc3RJRAJmcmFuZG9tUDqjNF8yyeXTlYSY76RnURJxZWxlbWVudElkZW50aWZpZXJrZmFtaWx5X25hbWVsZWxlbWVudFZhbHVlaUhlbnJpa3NlbtgYWFSkaGRpZ2VzdElEA2ZyYW5kb21Qr9DJ6zs12lrex6IS4KCxrXFlbGVtZW50SWRl`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAJjY250DWRwYXJ0WOhudGlmaWVyamdpdmVuX25hbWVsZWxlbWVudFZhbHVlZlNpZ3VyZNgYWFikaGRpZ2VzdElEBGZyYW5kb21QQlHHDpB0FxXF8hkqvSUxdnFlbGVtZW50SWRlbnRpZmllcmpiaXJ0aF9kYXRlbGVsZW1lbnRWYWx1ZWoxOTY5LTA4LTE22BhYVaRoZGlnZXN0SUQFZnJhbmRvbVC795W_BIchRi_OuWiDUboScWVsZW1lbnRJZGVudGlmaWVya2JpcnRoX3BsYWNlbGVsZW1lbnRWYWx1ZWbDhXJodXPYGFiBpGhkaWdlc3RJ`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeANjY250DWRwYXJ0WOhEBmZyYW5kb21QTwINuormweCaIfMkyaoz_nFlbGVtZW50SWRlbnRpZmllcnByZXNpZGVudF9hZGRyZXNzbGVsZW1lbnRWYWx1ZXgsR2FsdGVuIExpbGxlc3Ryw6ZkZSA1MUIsIDEuIHR2CjgwMDAgw4VyaHVzIEPYGFhupGhkaWdlc3RJRAdmcmFuZG9tUMqt6qR2QcFuajJKLpOrvqlxZWxlbWVudElkZW50aWZpZXJ4HnBlcnNvbmFsX2FkbWluaXN0cmF0aXZlX251bWJlcmxlbGVtZW50VmFsdWVrMTYwODY5LTAw`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeARjY250DWRwYXJ0WOg0OdgYWFKkaGRpZ2VzdElECGZyYW5kb21QK4mCP5z2IX9mBd2SLyi2bHFlbGVtZW50SWRlbnRpZmllcmtuYXRpb25hbGl0eWxlbGVtZW50VmFsdWWBYkRL2BhYY6RoZGlnZXN0SUQJZnJhbmRvbVC4vRvROUf1BuIarCEDSq74cWVsZW1lbnRJZGVudGlmaWVya2V4cGlyeV9kYXRlbGVsZW1lbnRWYWx1ZXQyMDI3LTA5LTI4VDA5OjEyOjU4WtgYWG6kaGRpZ2VzdElECmZyYW5kb21QWwn26OSOC4xSIuc-J_G-zHFl`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAVjY250DWRwYXJ0WOhsZW1lbnRJZGVudGlmaWVycWlzc3VpbmdfYXV0aG9yaXR5bGVsZW1lbnRWYWx1ZXgYRGlnaXRhbGlzZXJpbmdzc3R5cmVsc2Vu2BhYVaRoZGlnZXN0SUQLZnJhbmRvbVDgFrDI5l8RKMej-W6SMKAMcWVsZW1lbnRJZGVudGlmaWVyb2lzc3VpbmdfY291bnRyeWxlbGVtZW50VmFsdWViREtqaXNzdWVyQXV0aIRDoQEmoRghWQJnMIICYzCCAgigAwIBAgIQam1CjiRwQMa3bmkJSRkU6DAKBggqhkjOPQQDAjB0MQsw`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAZjY250DWRwYXJ0WOgJBgNVBAYTAkRLMRMwEQYDVQQHDApLw7hiZW5oYXZuMSEwHwYDVQQKExhEaWdpdGFsaXNlcmluZ3NzdHlyZWxzZW4xDDAKBgNVBAsTA0tFQTEfMB0GA1UEAxMWREtUQiBDcmVkZW50aWFsIElzc3VlcjAeFw0yNjA2MDgxMzI3NDlaFw0yOTA2MDgxMzM3NDlaMHQxCzAJBgNVBAYTAkRLMRMwEQYDVQQHDApLw7hiZW5oYXZuMSEwHwYDVQQKExhEaWdpdGFsaXNlcmluZ3NzdHlyZWxzZW4xDDAKBgNVBAsTA0tFQTEf`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAdjY250DWRwYXJ0WOgwHQYDVQQDExZES1RCIENyZWRlbnRpYWwgSXNzdWVyMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFrUFL_XBx9ivktaq7QbAJSBSYg0hSGMEFzNSgDWQONMvI3QNe6bvRm07xn_W6QpPJm27_wNjpMZuIc_i701zCaN8MHowDgYDVR0PAQH_BAQDAgbAMAkGA1UdEwQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMB8GA1UdIwQYMBaAFLcX4SpJI2Pp7saa1kwMDYiI_CC1MB0GA1UdDgQWBBS3F-Eq`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAhjY250DWRwYXJ0WOhJI2Pp7saa1kwMDYiI_CC1MAoGCCqGSM49BAMCA0kAMEYCIQDdG85iHPnCUfG7l25bix_jb5dZxu_CnaJfsITtm3RgiAIhAJfxEK9MmKQrjO0DyDIfgMq4Ao0HnI96qVkKr6kNmmAYWQNd2BhZA1inZ3ZlcnNpb25jMS4wb2RpZ2VzdEFsZ29yaXRobWdTSEEtMjU2bHZhbHVlRGlnZXN0c6J4GmV1LmV1cm9wYS5lYy5ldWRpLnBpZC5kay4xoQFYIHeX7GUROx_HSw3dVporPjKD8sJ-8QdAKqg2LBSVB-1Pd2V1LmV1`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAljY250DWRwYXJ0WOhyb3BhLmVjLmV1ZGkucGlkLjGqAlgggRzcDWfXi6TY27dqQV4IUtbYff4nTEJcZWDDsufsemMDWCAdqWA6r4iALjO0LvrZkXvUm35brCCGd8lqDb9aiNfuzwRYIMjea4UgDYoJUwczr6palUvP531ZWB3ZyXS1vtpeA5RjBVggdiuBthCKMUYGJCB0hPZ2GAbwu8QJNUkzZF5IXKeqJj8GWCBZe6o4jbgfNgN7ccnpkc0O345WpobS9GkV1OZhdMpb5gdYIM22F5L0eYXMNcKqXen4owxlFNpJ9z1yt-kl7gICVq4iCFgg`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeApjY250DWRwYXJ0WOgY3uMeYt3e2I_17Ict1JB9A_QnMA0XPCdEqyD9_eq_1QlYIAMNp6gMTV0mN--JwmYWzk3BRaMKB3XDieHgYTEaCtZZClggy19GYUAyXncdzZ1ERo_5MNLd02kwtApX5vGOy3yDgWMLWCB6tArrefCdBkYkUS5Pcv0afwsxzuPwDOXXLBP0jBxft21kZXZpY2VLZXlJbmZvoWlkZXZpY2VLZXmlAQIgASFYIJVRew5iPSthnOoFdU0EodFX3Y3GQslabmsClLlITVMJIlggz9KEilDxLFR3g1NG2_Ul4gGG6Q35Wx8e4Y3n`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAtjY250DWRwYXJ0WOhhjRBBxAMmZ2RvY1R5cGV3ZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjFsdmFsaWRpdHlJbmZvo2ZzaWduZWTAdDIwMjYtMDktMjhUMDA6MDA6MDBaaXZhbGlkRnJvbcB0MjAyNi0wOS0yOFQwMDowMDowMFpqdmFsaWRVbnRpbMB0MjAyNy0wOS0yOFQwMDowMDowMFpmc3RhdHVzoWtzdGF0dXNfbGlzdKJjaWR4GfbVY3VyaXhaaHR0cHM6Ly9ka3RiLWlzc3Vlci1jZG4udGVzdC5teXJhY2RuLmNvbS9zdGF0dXMtbGlz`,
    `pWN0eXBpQWx0SUQtMS4wY3R4bngkMTY1ZGFkYzMtMzY1Ni00ODE4LThjODYtYTQwYzgwZjNiNzUyY2lkeAxjY250DWRwYXJ0WOt0cy8zYTk1MmExMy1kZjRhLTRmZjYtOTY1Ny1lNDBiZWY0MDE3N2ZYQPXL6KzFlrZXELu7YW-JbS98ApasbGgUFjj-mgrXo3izJKzVsUuKlkE1DOmI60uU7IpytH87bCBG_wd_txQ-uW5sZGV2aWNlU2lnbmVkompuYW1lU3BhY2Vz2BhBoGpkZXZpY2VBdXRooW9kZXZpY2VTaWduYXR1cmWEQ6EBJqD2WEDvxHj7QsfRcvpL_4uylVijlXkQdJogeSNkMuTK7C8-fn8mBogjlRjRT6rrqpeGjDF8fATyjS6AkjM6BBDw1W-B`,
  ];

  const testTxn = "165dadc3-3656-4818-8c86-a40c80f3b752";

  describe("decodeSignedQrFrame", () => {
    it("should decode a valid frame", () => {
      const frame = decodeSignedQrFrame(testFrames[0]!);

      expect(frame).toBeDefined();
      expect(typeof frame.typ).toBe("string");
      expect(typeof frame.txn).toBe("string");
      expect(typeof frame.idx).toBe("number");
      expect(typeof frame.cnt).toBe("number");
      expect(frame.part).toBeInstanceOf(Uint8Array);
    });

    it("should decode frame with correct structure", () => {
      const frame = decodeSignedQrFrame(testFrames[0]!);

      expect(frame.typ).toBe("AltID-1.0");
      expect(frame.txn).toBe(testTxn);
      expect(frame.idx).toBe(0); // First frame
      expect(frame.cnt).toBe(13); // Total 13 frames
      expect(frame.part.length).toBeGreaterThan(0);
    });

    it("should throw error for invalid base64", () => {
      expect(() => decodeSignedQrFrame("invalid base64!")).toThrow(
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

      expect(frames).toHaveLength(13);
      frames.forEach((frame, i) => {
        expect(frame.idx).toBe(i);
        expect(frame.cnt).toBe(13);
        expect(frame.txn).toBe(testTxn);
      });
    });
  });

  describe("assembleSignedQrPayload", () => {
    it("should assemble frames into payload", () => {
      const frames = decodeSignedQrFrames(testFrames);
      const payload = assembleSignedQrPayload(frames);

      expect(payload).toBeDefined();
      expect(payload.typ).toBe("AltID-1.0");
      expect(payload.txn).toBe(testTxn);
      expect(payload.doc).toBeInstanceOf(Uint8Array);
      expect(typeof payload.nbf).toBe("number");
      expect(typeof payload.exp).toBe("number");
      expect(typeof payload.mnonce).toBe("string");
    });

    it("should handle frames in any order", () => {
      const frames = decodeSignedQrFrames(testFrames);
      const shuffledFrames = [...frames].reverse(); // Reverse order

      const payload1 = assembleSignedQrPayload(frames);
      const payload2 = assembleSignedQrPayload(shuffledFrames);

      expect(payload1.doc).toEqual(payload2.doc);
      expect(payload1.nbf).toBe(payload2.nbf);
      expect(payload1.exp).toBe(payload2.exp);
      expect(payload1.mnonce).toBe(payload2.mnonce);
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
