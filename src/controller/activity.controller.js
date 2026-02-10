import { logger } from "../index.js";

import { fetchActivityReords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotActivityPayload } from "../utils/helper.js";
import { searchActivityInHubSpot } from "../service/student.service.js";
import { updateActivityInHubSpot } from "../service/student.service.js";
import { createActivityInHubSpot } from "../service/student.service.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";
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
async function syncActivity() {
  try {

    const records = await fetchActivityReords(); // call the function 
    console.log("Activity records", records.length);


 let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        let affiliateId = null;

        const Payloads =  buildHubSpotActivityPayload(record); // call the function 

        console.log(" Records", record);
        console.log("Payloads", Payloads);
        return; // todo remove after testing
        

        

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        console.error(error);
        // saveProgress(i);
        // break; // todo remove after testing
      }
    }


  } catch (error) {
    console.error("Error feching records", error);
    return;
  }
}
*/

// new code Activity controller

async function syncActivity() {
  try {
    const records = await fetchActivityReords(); // fetch activity records
    console.log("Activity records:", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildHubSpotActivityPayload(record);

        logger.info(`Activity Record: ${JSON.stringify(record, null, 2)}`);
        logger.info(`Activity Payload: ${JSON.stringify(Payloads, null, 2)}`);

        // 🔍 Search existing activity (by collection_id or email_id)
        let searchResults = null;
        searchResults = await searchActivityInHubSpot(
          record.collection_id // or record.email_id
        );

        if (searchResults && searchResults.length > 0) {
          // Activity exists → update
          let existingActivityId = null;
          existingActivityId = searchResults[0].id;

          console.log(
            `Activity exists with id ${existingActivityId}, updating...`
          );

          let updated = null;
          updated = await updateActivityInHubSpot(existingActivityId, payload);

          console.log("✅ Activity updated:", updated.id);
        } else {
          // Activity does not exist → create
          let created = null;
          created = await createActivityInHubSpot(payload);

          console.log("✅ Activity created:", created.id);
        }

        // Save progress after success
        // saveProgress(i + 1);

        break; // ❗ remove after testing
      } catch (error) {
        console.error("Error processing activity index", i, error);

        // Save progress to resume later
        // saveProgress(i);

        break; // ❗ remove after testing
      }
    }

    console.log("📅 All Activities Processed");
  } catch (error) {
    console.error("Error fetching activity records", error);
    return;
  }
}

export { syncActivity };
