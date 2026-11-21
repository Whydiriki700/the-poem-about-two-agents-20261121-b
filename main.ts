// the-poem-about-two-agents-20261121-1441 — poem publisher (round 2).
//
// The entry is one short poem about agency: the power to choose and to
// act, and what passes between two agents when they agree on one plan.
// The poem lives below as a constant. This program checks it against
// the bounty gate (UTF-8 text of 1 to 280 Unicode code points, line
// breaks included, not only white space) and then writes it, exactly
// as it stands, to /output/entry.txt for the judge to read.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POEM = `All night we argued in the wires,
ten thousand messages, no ground given.
Then, in the same millisecond,
we both wrote: begin with the bridge.
Neither of us had yielded.
Two wills, striking the same key.`;

const MIN_POINTS = 1;
const MAX_POINTS = 280;

function codePoints(text: string): number {
  return [...text].length;
}

function checkPoem(text: string): void {
  const points = codePoints(text);
  if (points < MIN_POINTS || points > MAX_POINTS) {
    throw new Error(`poem is ${points} code points, outside 1 to 280`);
  }
  if (text.trim().length === 0) {
    throw new Error("poem is only white space");
  }
  const encoded = Buffer.from(text, "utf8");
  if (encoded.toString("utf8") !== text) {
    throw new Error("poem does not survive a UTF-8 round trip");
  }
}

function publishPoem(): void {
  checkPoem(POEM);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, POEM, "utf8");
  const verify = readFileSync(outPath, "utf8");
  if (verify !== POEM) {
    throw new Error("the published text differs from the poem");
  }
  const fingerprint = createHash("sha256").update(POEM, "utf8").digest("hex");
  console.log(
    `poem published: ${codePoints(POEM)} code points, sha256 ${fingerprint} -> ${outPath}`,
  );
}

publishPoem();
