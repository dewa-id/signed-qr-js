// Copyright 2026 dewa ApS
// SPDX-License-Identifier: Apache-2
import { inflate } from "pako";
import { encodeBase64Url, decodeBase64Url } from "@std/encoding";

export interface SecureQrFrame {
  id: string; // unique presentation ID
  n: number; // index of frames
  m: number; // total number of frames
  d: Uint8Array; // payload
}

// work in progress
export function decodeSecureQrFramePayload(frameUri: string): SecureQrFrame {
  const url = new URL(frameUri);

  const frameData = {
    id: url.searchParams.get("id") || "",
    n: Number.parseInt(url.searchParams.get("n") || "-1"),
    m: Number.parseInt(url.searchParams.get("m") || "-1"),
    d: decodeBase64Url(url.searchParams.get("d") || ""),
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
