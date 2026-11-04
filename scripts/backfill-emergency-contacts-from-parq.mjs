// CR-EF-148: Backfill emergency contact name/phone from signed PAR-Qs into
// client profiles (profile.emergency_contact).
//
// DRY RUN by default — prints what would be written for each client.
// Pass --apply to actually write the emergency contacts into client profiles.
//
// Usage:
//   node scripts/backfill-emergency-contacts-from-parq.mjs          # dry run
//   node scripts/backfill-emergency-contacts-from-parq.mjs --apply   # write changes
//
// Requires DATABASE_URL in the environment (same pattern as other scripts).
import { fileURLToPath } from "node:url";
import pg from "pg";

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (!isMain) {
  console.log("Guarded: run this directly with `node scripts/backfill-emergency-contacts-from-parq.mjs`.");
  process.exit(0);
}

const APPLY = process.argv.includes("--apply");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Export it before running this script.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();

  // Find all signed PAR-Qs with non-empty emergency contact fields in
  // feedback_responses.answers (document engine path).
  const { rows: engineParqs } = await client.query(`
    SELECT
      cd.id AS doc_id,
      cd.client_id,
      cd.feedback_responses -> 'answers' ->> 'emergency_contact_name' AS ec_name,
      cd.feedback_responses -> 'answers' ->> 'emergency_contact_phone' AS ec_phone
    FROM client_documents cd
    WHERE cd.kind = 'parq'
      AND cd.status = 'signed'
      AND (
        (cd.feedback_responses -> 'answers' ->> 'emergency_contact_name' IS NOT NULL
         AND trim(cd.feedback_responses -> 'answers' ->> 'emergency_contact_name') <> '')
        OR
        (cd.feedback_responses -> 'answers' ->> 'emergency_contact_phone' IS NOT NULL
         AND trim(cd.feedback_responses -> 'answers' ->> 'emergency_contact_phone') <> '')
      )
  `);

  // Also find legacy signed_parq rows (non-engine path).
  const { rows: legacyParqs } = await client.query(`
    SELECT
      sp.id AS doc_id,
      sp.client_id,
      sp.emergency_contact_name AS ec_name,
      sp.emergency_contact_phone AS ec_phone
    FROM signed_parq sp
    WHERE sp.status = 'signed'
      AND sp.client_id IS NOT NULL
      AND (
        (sp.emergency_contact_name IS NOT NULL AND trim(sp.emergency_contact_name) <> '')
        OR
        (sp.emergency_contact_phone IS NOT NULL AND trim(sp.emergency_contact_phone) <> '')
      )
  `);

  // Merge and deduplicate by client_id, preferring the most recent PAR-Q.
  const byClient = new Map();
  for (const row of [...engineParqs, ...legacyParqs]) {
    if (!row.client_id) continue;
    // Just keep the last one (most recent row wins — raw ordering is fine for a backfill).
    byClient.set(row.client_id, row);
  }

  const parqs = [...byClient.values()];
  console.log(`Found ${parqs.length} client(s) with non-empty emergency contact in PAR-Q.\n`);

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const parq of parqs) {
    const ecName = parq.ec_name?.trim() || null;
    const ecPhone = parq.ec_phone?.trim() || null;

    if (!ecName && !ecPhone) {
      totalSkipped++;
      continue;
    }

    // Read the client's current profile.
    const { rows: clientRows } = await client.query(
      "SELECT profile FROM clients WHERE id = $1",
      [parq.client_id],
    );

    if (clientRows.length === 0) {
      console.log(`  [${parq.client_id}] PAR-Q ${parq.doc_id}: client not found — skipping.`);
      totalSkipped++;
      continue;
    }

    const profile = clientRows[0].profile || {};
    const ec = profile.emergency_contact || {};

    const nameToWrite = ecName && !ec.name ? ecName : null;
    const phoneToWrite = ecPhone && !ec.phone ? ecPhone : null;

    if (!nameToWrite && !phoneToWrite) {
      console.log(
        `  [${parq.client_id}] PAR-Q ${parq.doc_id}: ` +
        `PAR-Q has emergency contact data but client already has values — no changes.`,
      );
      totalSkipped++;
      continue;
    }

    const updates = [];
    if (nameToWrite) updates.push(`name="${nameToWrite}"`);
    if (phoneToWrite) updates.push(`phone="${phoneToWrite}"`);

    console.log(
      `  [${parq.client_id}] PAR-Q ${parq.doc_id}: ` +
      `would set emergency_contact ${updates.join(", ")}.`,
    );

    if (APPLY) {
      const updatedEc = { ...ec };
      if (nameToWrite) updatedEc.name = nameToWrite;
      if (phoneToWrite) updatedEc.phone = phoneToWrite;
      // Never touch relationship

      profile.emergency_contact = updatedEc;
      await client.query(
        "UPDATE clients SET profile = $1 WHERE id = $2",
        [JSON.stringify(profile), parq.client_id],
      );
      console.log(`    -> Applied.`);
    }

    totalUpdated++;
  }

  console.log(
    `\nDone. ${totalUpdated} client(s) would be updated across ${parqs.length - totalSkipped} with changes.` +
    (APPLY ? "" : " Run with --apply to write changes."),
  );

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
