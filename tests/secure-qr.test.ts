import {
  decodeSecureQrFrame,
  assembleSecureQrPayload,
} from "../dist/secure-qr.js";

describe("SecureQR", () => {
  // Real SecureQR frame data
  const testFrames = [
    "mdlqr:v2?id=10238162&n=0&m=4&d=eNqVVduSokgQ_Rdfd2ihEBCftlWwQUFUvOA6YQCFUFwVChEmer59S5zu7emIjY55KvJyMjNOJpk_OleX6Qw6Xq3m9naB5kiNyMtDsEHzZBk7235pbZfRbBtHMyJDpGdQlu3tTkGzkUp7u-cWY9W42Y-YC2QXd33gTNy7Xl43CqMjVex8I4kASfTj0Emd06EzYASBZlhWEJlvB2LDRHXojL0kG-Ue9FKM7PjQIaZjAY927LfmIrApwPGtHhVFq4MIDirPGUACfbIhpBB8gt619XHTeyaSMqyix0eE6xYljR4O-bUVjfewt1YGBjZqa61T6vA4VOelZAAZrig2eunP50im8_U6Wohm5Tpai3oELeYQjHuLocSPo-NCSHqRcRSlyb48plql59uaT_YsYy8N1T10Xl8Jzrud71SIQBBpmvlFxaPSv90sxd7tzss_h06A8bkYdLtVVT1V7FOW-11AM_2u-05W0b0yh853EgHXZ--B2ng5OiHb",
    "mdlqr:v2?id=10238162&n=1&m=4&d=ib1PpH7m-XvLxZu8Kp3QaztC6kDwnebIqwcNgEkz7jOub9z6mwgJqlOWWiJb-dbwrazGdbTes159CTATilMntaxgOSk2Yy4sglrVzhC7z64KymBZia7gj6arPMgMWU5h3syAdfFnN7ZhJbXCpZpiLl9s3KE54ezarHDYlznJCQE6zQpukizwGvazRq4kPbESy8OGLQ6H-9laX_jTgFuMVuFwfXubogclNifo06SUtFh_cf2L-UL6o3CeIp1CynmJj3x25vozfSONlRb4fL5w5bP__LKrmkgSKrnB8qgCF2BZ5kpdNrQ6ykJ5S4ULv_VXLeXFPTu1Uk-Gi2lljJVSb-aAR1erkU8zHO8pc24qTiBahPbX33nHNi6L32h_6_t_g_2h5VTRArqgzfyr7YfOEOEC5yj1H_FmqMBSivO69XpAjDI_Z8XDPfeumWtjlKUfHO4gJYXe_XcAfQDYPs39Zvw4PX9W50NYoeaenvnEgBt4if0VA1em",
    "mdlqr:v2?id=10238162&n=2&m=4&d=m3s-KSKvu0WLKLqQ5gVG5B3K650YqsfbHCVyfUjZLidAlsSHTu93muQyjtUiSx85N3aMoI2zHNCA_Eevjw1TevmXS6Z1e9RKsDxFA4pmTYYb9MQBxzwxXI9jAP8XTQ9o-h1gp643trH3B7DrvUI5z5I_xawJtfEvEMt8DSJLCeXtQHyo8Etgy5iNP2_2EKM2guPxgD_RHMULok31HFegxJ7DU1y_D2jO86DIk1392t4JltyJ3k4fq77AzHhvhHd-b2pm-VYdRycruIw0cbZKlBW1E-pFMTHyFTe0TxF0Z2vXXc0n06CK4WWFLnN3CrQ5tnlzebqG6Or_3NZqrJtwCKOgt2SG602ja9t0Y8DdprYTcamgCllbGJP3psX0T3IX325cbiH8v_ftiTierR05oKHE6o3WaKbb6KFSKAmH9kjhicwS7Y3YgEaS7HdBpYTZbT7WgD7WblooNffAsD3CSjlDvXui0gFcuF8pvIJ6REfipXq0A0Hg",
    "mdlqr:v2?id=10238162&n=3&m=4&d=Ar8tynmJ2NU6OLnrYGky-5W53SAzYerlJmJ1ennZx-di3UDeZAPNiVXDBOLC2Z11JaWfWFnHL4IwVqQVzvgI5mdmDab51p-fxxVfZlolG-PFLZ-K6WiYjPJr7oF5xFPHbVRJBTwjnnZn2EzEYDa_aal2OTGs43de_wXk8q72&p=00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  ];

  describe("decodeSecureQrFrame", () => {
    it("should decode a valid SecureQR frame", () => {
      const frame = decodeSecureQrFrame(testFrames[0]!);

      expect(frame.id).toBe("10238162");
      expect(frame.n).toBe(0);
      expect(frame.m).toBe(4);
      expect(frame.d).toBe(
        "eNqVVduSokgQ_Rdfd2i5Iz5tI2KDgiig4jrhAIVQXBUKESZ6vn0Rp3t7OmKjYx6IIi8nM-NkVeaPwdUjBuOB3yiFs13BJVTi7mQBuYHLdJ2421Flb9fxYpvEi04GUMuBJDnbnQwXEwX3d889xm5Qu58QF0Ct7vrQnXl3vWS1MqFBhR986xKRXaIfh0Hmng6DMcFxOEFRHE98O3Q21KkOA9FP80nhAz9D0EkOg850LMHRSYLeXIYORjJsr4dl2esABOPad8eggz45AGAQPAH_2vt42T1TlzKq48dPjJoeNZ08HIprL-rvYW-9TOpIb2xLwxThKCjLaqqTEjAwKn4ZLZdQwgvLile8WXuu2qMeQcslIEV6JUxZMT6uuJSO9SM_ne2rY6bWWrFt2HRPEc5aV7zD4PW1w_m3850KnuR4HCd-UfGo9G8vz5B_u_Pyz2EQInQux8NhXddPNfWUF8GQxInR0HsnqxxeicPgexcBNWf_gdr4BTxB",
      );
    });

    it("should decode frames with correct sequence", () => {
      const frames = testFrames.map(decodeSecureQrFrame);

      expect(frames).toHaveLength(4);
      expect(frames[0]!.n).toBe(0);
      expect(frames[1]!.n).toBe(1);
      expect(frames[2]!.n).toBe(2);
      expect(frames[3]!.n).toBe(3);

      // All frames should have same id and total count
      frames.forEach((frame) => {
        expect(frame.id).toBe("10238162");
        expect(frame.m).toBe(4);
      });
    });

    it("should throw error for invalid protocol", () => {
      const frameUri = "https://example.com/v2?id=test&n=0&m=1&d=data";
      expect(() => decodeSecureQrFrame(frameUri)).toThrow();
    });

    it("should throw error for missing parameters", () => {
      const frameUri = "mdlqr:v2?id=10238162&n=0&m=4";
      expect(() => decodeSecureQrFrame(frameUri)).toThrow(
        "'d' (payload) is invalid",
      );
    });
  });

  describe("assembleSecureQrPayload", () => {
    it("should assemble frames into payload", () => {
      const frames = testFrames.map(decodeSecureQrFrame);
      const payload = assembleSecureQrPayload(frames);

      expect(typeof payload).toBe("string");
      expect(payload.length).toBeGreaterThan(0);
    });

    it("should handle frames in any order", () => {
      const frames = testFrames.map(decodeSecureQrFrame);
      const shuffledFrames = [...frames].reverse();

      const payload1 = assembleSecureQrPayload(frames);
      const payload2 = assembleSecureQrPayload(shuffledFrames);

      expect(payload1).toBe(payload2);
    });

    it("should throw error for empty frames", () => {
      expect(() => assembleSecureQrPayload([])).toThrow(
        "insufficient frame count",
      );
    });

    it("should work with strict mode", () => {
      const frames = testFrames.map(decodeSecureQrFrame);
      expect(() =>
        assembleSecureQrPayload(frames, { strict: true }),
      ).not.toThrow();
    });
  });
});
