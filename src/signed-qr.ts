// Copyright 2026 dewa ApS
// SPDX-License-Identifier: Apache-2
import { base64 } from "@hexagon/base64";
import * as cbor from "cbor2";
import { concatUint8Arrays } from "uint8array-extras";
import { groupBy, sortBy, keys, every, sortedUniqBy } from "lodash-es";

export interface SignedQrFrame {
  typ: string; // "AltID-1.0"
  txn: string; // Transaction identifier
  idx: number; // Frame index
  cnt: number; // Frame count
  part: Uint8Array; // Frame partial payload
}

/**
 * Decode a single Signed QR frame from a base64-encoded string.
 * @param frameData Base64-encoded frame data
 * @returns Decoded SignedQrFrame
 */
export function decodeSignedQrFrame(frameData: string): SignedQrFrame {
  // toArrayBuffer silently skips invalid characters, so validate explicitly
  if (!base64.validate(frameData.replace(/=+$/, ""), true)) {
    throw new Error("bad QR frame: invalid base64 encoding");
  }

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

  // typ
  if (typeof frame.typ !== "string" || frame.typ !== "AltID-1.0")
    throw new Error("bad QR frame: 'typ' not equal to \"AltID-1.0\"");
  // txn
  if (typeof frame.txn !== "string" || frame.txn.length === 0)
    throw new Error("bad QR frame: 'txn' (transaction identifier) is invalid");
  // idx
  if (typeof frame.idx !== "number" || frame.idx < 0)
    throw new Error("bad QR frame: 'idx' (index) is invalid");
  // cnt
  if (typeof frame.cnt !== "number" || frame.cnt <= 0)
    throw new Error("bad QR frame: 'cnt' (count) is invalid");
  // part
  if (!frame.part || !(frame.part instanceof Uint8Array))
    throw new Error("bad QR frame: 'part' (payload) is invalid");

  return frame;
}

export interface SignedQrPayload {
  typ: "AltID-1.0";
  txn: string; // transaction ID
  mnonce: string; // nonce
  nbf: number; // from timestamp
  exp: number; // to timestamp
  doc: Uint8Array; // message data
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

  // Sort frames into correct order
  const framesGrouped = sortBy(
    groupBy(frames, (f) => f.cnt),
    (group) => group.length,
  );

  // Check frame count consistency
  if (keys(framesGrouped).length === 0) {
    throw new Error("bad frames: insufficient frame count");
  } else if (strict && keys(framesGrouped).length !== 1) {
    throw new Error("bad frames (strict): inconsistent frame counts");
  }

  // Choose the biggest group, sort by index
  const selectedFrames = sortBy(framesGrouped.at(-1)!, (frame) => frame.idx);

  if (selectedFrames.length === 0) {
    throw new Error("bad frames: insufficient frame count");
  }

  const expectedFrameCount = selectedFrames[0]!.cnt;

  // Check all frames have consistent count
  if (!every(selectedFrames, (f) => f.cnt === expectedFrameCount)) {
    throw new Error("bad frames: inconsistent frame count");
  }

  // Filter duplicate frames and ensure we have complete set
  const framesUnique = sortedUniqBy(selectedFrames, (f) => f.idx);
  if (framesUnique.length < expectedFrameCount) {
    throw new Error("bad frames: insufficient unique frame count");
  }
  if (strict && framesUnique.length !== selectedFrames.length) {
    throw new Error("bad frames (strict): duplicate frames");
  }

  // Check for missing frames in sequence
  for (let i = 0; i < expectedFrameCount; i++) {
    if (!framesUnique.some((f) => f.idx === i)) {
      throw new Error(`bad frames: missing frame at index ${i}`);
    }
  }

  // Combine payload parts in correct order
  const sortedFrames = framesUnique.sort((a, b) => a.idx - b.idx);
  const payloadBytes = concatUint8Arrays(sortedFrames.map((f) => f.part));

  let payload: SignedQrPayload;
  try {
    payload = cbor.decode(payloadBytes) as SignedQrPayload;
  } catch (ex) {
    throw new Error("bad frames: error decoding payload CBOR", { cause: ex });
  }

  // Validate payload structure
  if (strict && payload.typ !== "AltID-1.0") {
    throw new Error("bad payload (strict): 'typ' not equal to \"AltID-1.0\"");
  }
  if (!payload.doc || !(payload.doc instanceof Uint8Array)) {
    throw new Error("bad payload: 'doc' (message data) is invalid");
  }
  if (typeof payload.nbf !== "number") {
    throw new Error("bad payload: 'nbf' (from timestamp) is invalid");
  }
  if (typeof payload.exp !== "number") {
    throw new Error("bad payload: 'exp' (to timestamp) is invalid");
  }
  if (typeof payload.mnonce !== "string") {
    throw new Error("bad payload: 'mnonce' (nonce) is invalid");
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
