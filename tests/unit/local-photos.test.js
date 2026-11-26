import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { clearLocalPhotos, MAX_BYTES, photoError, readPhoto, uploadPhoto } from "../../src/lib/local-photos.js";

test("saves image bytes outside localStorage, reads them again, and clears them on reset", async () => {
  const image = new File([Uint8Array.of(137, 80, 78, 71)], "coffee.png", { type: "image/png" });
  const uri = await uploadPhoto(image);
  assert.match(uri, /^sanka-photo:/);
  const stored = await readPhoto(uri);
  assert.equal(stored.type, image.type);
  assert.deepEqual(new Uint8Array(await stored.arrayBuffer()), new Uint8Array(await image.arrayBuffer()));
  assert.deepEqual(await (await readPhoto(uri)).arrayBuffer(), await image.arrayBuffer());
  await clearLocalPhotos();
  await assert.rejects(readPhoto(uri), /no longer stored/);
});

test("rejects non-images, empty images, oversized images and missing hosted photos", async () => {
  assert.match(photoError({ name: "large.jpg", type: "image/jpeg", size: MAX_BYTES + 1 }), /over 8 MB/);
  assert.match(photoError({ name: "file.txt", type: "text/plain", size: 12 }), /not an image/);
  assert.match(photoError({ name: "empty.png", type: "image/png", size: 0 }), /empty/);
  await assert.rejects(uploadPhoto(new File(["hello"], "file.txt", { type: "text/plain" })), /not an image/);
  await assert.rejects(readPhoto("private/old-platform-photo"), /original hosting service/);
});
