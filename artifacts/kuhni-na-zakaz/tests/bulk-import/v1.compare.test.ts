import test from "node:test";
import assert from "node:assert/strict";

test("comparePayload treats JSON objects with different key order as unchanged", async () => {
  process.env.DATABASE_URL ||= "postgresql://test:test@127.0.0.1:5432/test";

  const mod = await import("../../lib/bulk-import/v1");
  const comparePayload = mod.__bulkImportV1Internal.comparePayload;

  const diff = comparePayload(
    {
      features: [
        { text: "Keeps the aisle open", title: "Layout" },
        { text: "Safe storage for kids", title: "Storage" },
      ],
      faq: [
        { a: "Usually 14 days", q: "How long does delivery take?" },
        { a: "Yes, after measurement", q: "Do you visit on-site?" },
      ],
      uniquePoints: [{ text: "Fast local routing", emoji: "🚚", title: "Local crew" }],
      contentBlocks: [{ text: "We bring samples", type: "highlight", title: "On-site visit" }],
    },
    {
      features: [
        { title: "Layout", text: "Keeps the aisle open" },
        { title: "Storage", text: "Safe storage for kids" },
      ],
      faq: [
        { q: "How long does delivery take?", a: "Usually 14 days" },
        { q: "Do you visit on-site?", a: "Yes, after measurement" },
      ],
      uniquePoints: [{ emoji: "🚚", title: "Local crew", text: "Fast local routing" }],
      contentBlocks: [{ type: "highlight", title: "On-site visit", text: "We bring samples" }],
    }
  );

  assert.equal(diff.operation, "unchanged");
  assert.deepEqual(diff.changedFields, []);
});

test("comparePayload still reports updates when array item order changes", async () => {
  process.env.DATABASE_URL ||= "postgresql://test:test@127.0.0.1:5432/test";

  const mod = await import("../../lib/bulk-import/v1");
  const comparePayload = mod.__bulkImportV1Internal.comparePayload;

  const diff = comparePayload(
    {
      features: [
        { title: "Layout", text: "Keeps the aisle open" },
        { title: "Storage", text: "Safe storage for kids" },
      ],
    },
    {
      features: [
        { title: "Storage", text: "Safe storage for kids" },
        { title: "Layout", text: "Keeps the aisle open" },
      ],
    }
  );

  assert.equal(diff.operation, "update");
  assert.deepEqual(diff.changedFields, ["features"]);
});
