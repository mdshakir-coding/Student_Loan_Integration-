import { fetchEmailsRecords } from "../service/student.loan.Hubspot.js";
import{buildEmailPayload} from "../utils/helper.js";
import{searchEmailInHubSpot} from "../service/student.service.js";
import{createEmailInHubSpot} from "../service/student.service.js";
import{updateEmailInHubSpot} from "../service/student.service.js";


import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

function saveProgress(index) {
  fs.writeFileSync(progressFile, JSON.stringify({ index }), "utf-8");
}

function loadProgress() {
  if (fs.existsSync(progressFile)) {
    try {
      const data = fs.readFileSync(progressFile, "utf-8");
      const obj = JSON.parse(data);
      return typeof obj.index === "number" ? obj.index : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

/*
async function syncEmails() {
  try {
    const response = await fetchEmailsRecords();
    console.log("Emails respoce", response.length);
  } catch (error) {
    console.error("Error feching records", error);
    return;
  }
}
export { syncEmails };
*/

async function syncEmails() {
  try {
    const records = await fetchEmailsRecords(); // fetch all email records
    console.log("Emails Records:", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildEmailPayload(record);

        console.log("Email Record:", record);
        console.log("Email Payload:", payload);

        // 🔍 Search existing email (example: by collection_id or external_id)
        let searchResults = null;
        searchResults = await searchEmailInHubSpot(
          record.collection_id // or record.external_id
        );

        if (searchResults && searchResults.length > 0) {
          // Email exists → update
          let existingEmailId = null;
          existingEmailId = searchResults[0].id;

          console.log(
            `Email exists with id ${existingEmailId}, updating...`
          );

          let updated = null;
          updated = await updateEmailInHubSpot(
            existingEmailId,
            payload
          );

          console.log("✅ Email updated:", updated.id);
        } else {
          // Email does not exist → create
          let created = null;
          created = await createEmailInHubSpot(payload);

          console.log("✅ Email created:", created.id);
        }

        // Save progress after success
        // saveProgress(i + 1);

        break; // ❗ remove after testing
      } catch (error) {
        console.error("Error processing Email index", i, error);

        // Save progress to resume later
        // saveProgress(i);

        break; // ❗ remove after testing
      }
    }

    console.log("📧 All Emails Processed");
  } catch (error) {
    console.error("Error fetching email records", error);
    return;
  }
}

export { syncEmails };




