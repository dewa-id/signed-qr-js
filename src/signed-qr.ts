// Copyright 2026 dewa ApS
// SPDX-License-Identifier: Apache-2
import { base64 } from "@hexagon/base64";
import * as cbor from "cbor2";
import { concatUint8Arrays } from "uint8array-extras";
import { groupBy, sortBy, keys, every, sortedUniqBy } from "lodash-es";

export interface SignedQrFrame {
  i: number; // index of frames
  n: number; // total number of frames
  p: Uint8Array; // payload
}

/**
 * Decode a single Signed QR frame from a base64-encoded string.
 * @param frameData Base64-encoded frame data
 * @returns Decoded SignedQrFrame
 */
export function decodeSignedQrFrame(frameData: string): SignedQrFrame {
  let frameBytes: Uint8Array;
  try {
    frameBytes = new Uint8Array(base64.toArrayBuffer(frameData, true));
  } catch (ex) {
    throw new Error("bad QR frame: invalid base64 encoding", { cause: ex });
  }

  let frame: SignedQrFrame;
  try {
    frame = cbor.decode(frameBytes) as SignedQrFrame;
  } catch (ex) {
    throw new Error("bad QR frame: invalid CBOR encoding", { cause: ex });
  }

  if (typeof frame.i !== "number" || frame.i < 0) {
    throw new Error("bad QR frame: 'i' (index) is invalid");
  }
  if (typeof frame.n !== "number" || frame.n <= 0) {
    throw new Error("bad QR frame: 'n' (count) is invalid");
  }
  if (!frame.p || !(frame.p instanceof Uint8Array)) {
    throw new Error("bad QR frame: 'p' (payload) is invalid");
  }

  return frame;
}

export interface SignedQrPayload {
  d: Uint8Array; // message data
  f: number; // from timestamp
  t: number; // to timestamp
  m: string; // nonce
}

export interface AssembleSignedQrPayloadOptions {
  strict: boolean;
}

/**
 * Assemble Signed QR frames into the final payload.
 * @param frames Sequence of decoded QR frames
 * @param options Assembly options
 * @returns Decoded payload object
 */
export function assembleSignedQrPayload(
  frames: SignedQrFrame[],
  { strict }: AssembleSignedQrPayloadOptions = { strict: false },
): SignedQrPayload {
  if (frames.length === 0) {
    throw new Error("bad frames: insufficient frame count");
  }

  const framesGrouped = sortBy(
    groupBy(frames, (f) => f.n),
    (group) => group.length,
  );

  // Check frame count consistency
  if (keys(framesGrouped).length === 0) {
    throw new Error("bad frames: insufficient frame count");
  } else if (strict && keys(framesGrouped).length !== 1) {
    throw new Error("bad frames (strict): inconsistent frame counts");
  }

  // Choose the biggest group, sort by index
  const selectedFrames = sortBy(framesGrouped.at(-1)!, (frame) => frame.i);

  if (selectedFrames.length === 0) {
    throw new Error("bad frames: insufficient frame count");
  }

  const expectedFrameCount = selectedFrames[0]!.n;

  // Check all frames have consistent count
  if (!every(selectedFrames, (f) => f.n === expectedFrameCount)) {
    throw new Error("bad frames: inconsistent frame count");
  }

  // Filter duplicate frames and ensure we have complete set
  const framesUnique = sortedUniqBy(selectedFrames, (f) => f.i);
  if (framesUnique.length < expectedFrameCount) {
    throw new Error("bad frames: insufficient unique frame count");
  }
  if (strict && framesUnique.length !== selectedFrames.length) {
    throw new Error("bad frames (strict): duplicate frames");
  }

  // Check for missing frames in sequence
  for (let i = 0; i < expectedFrameCount; i++) {
    if (!framesUnique.some((f) => f.i === i)) {
      throw new Error(`bad frames: missing frame at index ${i}`);
    }
  }

  // Combine payload parts in correct order
  const sortedFrames = framesUnique.sort((a, b) => a.i - b.i);
  const payloadBytes = concatUint8Arrays(sortedFrames.map((f) => f.p));

  let payload: SignedQrPayload;
  try {
    payload = cbor.decode(payloadBytes) as SignedQrPayload;
  } catch (ex) {
    throw new Error("bad frames: error decoding payload CBOR", { cause: ex });
  }

  // Validate payload structure
  if (!payload.d || !(payload.d instanceof Uint8Array)) {
    throw new Error("bad payload: 'd' (message data) is invalid");
  }
  if (typeof payload.f !== "number") {
    throw new Error("bad payload: 'f' (from timestamp) is invalid");
  }
  if (typeof payload.t !== "number") {
    throw new Error("bad payload: 't' (to timestamp) is invalid");
  }
  if (typeof payload.m !== "string") {
    throw new Error("bad payload: 'm' (nonce) is invalid");
  }

  return payload;
}

/**
 * Decode multiple Signed QR frame strings into SignedQrFrame objects.
 * @param frameStrings Array of base64-encoded frame strings
 * @returns Array of decoded frames
 */
export function decodeSignedQrFrames(frameStrings: string[]): SignedQrFrame[] {
  return frameStrings.map(decodeSignedQrFrame);
}
