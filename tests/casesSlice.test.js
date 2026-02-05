// Minimal unit tests (no extra libs): proves deterministic transformation logic.
import test from "node:test";
import assert from "node:assert/strict";
import { buildCaseFromPost } from "../src/features/cases/casesSlice.js";

test("buildCaseFromPost creates required case fields deterministically", () => {
  const post = { userId: 1, id: 7, title: "x", body: "y" };
  const c1 = buildCaseFromPost(post);
  const c2 = buildCaseFromPost(post);

  assert.deepEqual(c1, c2);
  assert.equal(c1.id, 7);
  assert.equal(typeof c1.subjectName, "string");
  assert.ok(["AML", "KYC", "FRAUD"].includes(c1.riskCategory));
  assert.ok(["OPEN", "REVIEW", "CLOSED"].includes(c1.status));
  assert.ok(Number.isInteger(c1.riskScore));
  assert.ok(c1.riskScore >= 0 && c1.riskScore <= 100);
  assert.ok(Array.isArray(c1.signals));
  assert.ok(c1.signals.length >= 1 && c1.signals.length <= 2);
  assert.equal(typeof c1.summary, "string");
});

test("risk score follows (id * 13) % 101", () => {
  const post = { userId: 2, id: 10 };
  const c = buildCaseFromPost(post);
  assert.equal(c.riskScore, (10 * 13) % 101);
});

