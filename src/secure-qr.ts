// Copyright 2026 dewa ApS
// SPDX-License-Identifier: Apache-2
import { base64 } from "@hexagon/base64";
import { groupBy, sortBy, keys, every, sortedUniqBy } from "lodash-es";
import pako from "pako";

export interface SecureQrFrame {
  id: string; // unique presentation ID
  n: number; // index of frames
  m: number; // total number of frames
  d: string; // payload
}

// work in progress
export function decodeSecureQrFrame(frameUri: string): SecureQrFrame {
  const url = new URL(frameUri);

  if (url.pathname !== "v2") throw new Error('URI path not equal to "v2"');

  const frameData = {
    id: url.searchParams.get("id") || "",
    n: Number.parseInt(url.searchParams.get("n") || "-1"),
    m: Number.parseInt(url.searchParams.get("m") || "-1"),
    d: url.searchParams.get("d") || "",
  } satisfies SecureQrFrame;

  if (frameData.id.length === 0)
    throw new Error("bad QR frame: 'id' (ID) is invalid");
  else if (frameData.n < 0)
    throw new Error("bad QR frame: 'n' (index) is invalid");
  else if (frameData.m <= 0)
    throw new Error("bad qr frame: 'm' (count) is invalid");
  else if (frameData.d.length == 0)
    throw new Error("bad QR frame: 'd' (payload) is invalid");

  return frameData;
}

export interface SecureQrPayload {
  vc1: string;
  vc2: string;
  vc3: string;
}

export interface AssembleSecureQrPayloadOptions {
  strict: boolean;
}

/**
 * Assemble SecureQR frames into SD-JWT.
 * @param frames Sequence of decoded QR frames, MUST contain frames from n=0 until n=m.
 * @returns SD-JWT VC compact serialization.
 */
export function assembleSecureQrPayload(
  frames: SecureQrFrame[],
  { strict }: AssembleSecureQrPayloadOptions = { strict: false },
): string {
  const framesGrouped = sortBy(
    groupBy(frames, (f) => f.id),
    (group) => group.length,
  );

  // check all frames belong to same presentation "ID"
  if (keys(framesGrouped).length === 0)
    throw new Error("bad frames: insufficient frame count");
  else if (strict && keys(framesGrouped).length !== 1)
    throw new Error("bad frames (strict): incompatible frame IDs");

  // ...otherwise choose the biggest group, sort by index "n"
  frames = sortBy(framesGrouped.at(-1)!, (frame) => frame.n);

  if (frames.length === 0)
    throw new Error("bad frames: insufficient frame count");
  const frame0 = frames[0]!;
  if (frame0.n !== 0)
    throw new Error("bad frames: first frame must start at n=0");

  // check all frames' count match
  if (!every(frames, (f) => f.m == frame0.m))
    throw new Error("bad frames: inconsistent frame count");

  // filter off duplicate frames
  const framesLength = frames.length;
  const framesUnique = sortedUniqBy(frames, (f) => f.n);
  if (framesUnique.length < frame0.m)
    throw new Error("bad frames: insufficient unique frame count");
  if (strict && framesUnique.length !== framesLength)
    throw new Error("bad frames (strict): duplicate frames");

  // combine payload
  const payloadDeflated = framesUnique.map((f) => f.d).join("");
  let payloadInflated: Uint8Array;
  try {
    payloadInflated = pako.inflate(
      new Uint8Array(base64.toArrayBuffer(payloadDeflated, true)),
    );
  } catch (ex) {
    throw new Error("bad frames: error inflating", { cause: ex });
  }

  let payloadString: string;
  try {
    payloadString = new TextDecoder().decode(payloadInflated);
  } catch (ex) {
    throw new Error("bad frames: error decoding", { cause: ex });
  }

  const payload = JSON.parse(payloadString) as SecureQrPayload;

  const { vc1, vc2: vc2String, vc3 } = payload;
  const vc2 = base64.fromString(vc2String);

  const credential = vc1 + "." + vc2 + "." + vc3;
  return credential;
}
