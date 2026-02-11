import { logger } from "../index.js";

import {
  fetchActivityReords,
  searchCustomObjectInHubSpot,
  searchCustomObjectInHubSpotBasedonCustomeField,
} from "../service/student.loan.Hubspot.js";
import { buildHubSpotActivityPayload } from "../utils/helper.js";
import { searchActivityInHubSpot } from "../service/student.service.js";
import { updateActivityInHubSpot } from "../service/student.service.js";
import { createActivityInHubSpot } from "../service/student.service.js";
import { getHubspotClient } from "../configs/hubspot.config.js";

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
    logger.info("Activity records", records.length);


 let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        let affiliateId = null;

        const Payloads =  buildHubSpotActivityPayload(record); // call the function 

        logger.info(" Records", record);
        logger.info("Payloads", Payloads);
        return; // todo remove after testing
        

        

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        logger.error(error);
        // saveProgress(i);
        // break; // todo remove after testing
      }
    }


  } catch (error) {
    logger.error("Error feching records", error);
    return;
  }
}
*/

// new code Activity controller

async function syncActivity() {
  try {
    const records = await fetchActivityReords(); // fetch activity records
    logger.info(`Activity records:${records.length}`);
    // return;

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildHubSpotActivityPayload(record);

        logger.info(`Activity Record: ${JSON.stringify(record, null, 2)}`);
        logger.info(`Activity Payload: ${JSON.stringify(payload, null, 2)}`);

        // 🔍 Search existing activity (by collection_id or email_id)
        let upsertActivity = null;
        upsertActivity = await searchActivityInHubSpot(
          record.collection_id // or record.email_id
        );

        if (upsertActivity) {
          // Activity exists → update
          let existingActivityId = null;
          existingActivityId = upsertActivity?.id;

          logger.info(
            `Activity exists with id ${existingActivityId}, updating...`
          );

          upsertActivity = await updateActivityInHubSpot(
            existingActivityId,
            payload
          );

          logger.info(`✅ Activity updated:${upsertActivity.id}`);
        } else {
          // Activity does not exist → create
          // let created = null;
          upsertActivity = await createActivityInHubSpot(payload);

          logger.info(`✅ Activity created:${upsertActivity.id}`);
        }

        // Find client based on linked_client field in Hubspot ->(Client)
        const hs_client = getHubspotClient();

        //  client affiliate inquirer
        const client = await searchCustomObjectInHubSpotBasedonCustomeField(
          "2-171843307",
          "email_address",
          record.email_id
        );

        logger.info(`✅ Client found: ${JSON.stringify(client, null, 2)}`);

        if (client[0]?.id && upsertActivity?.id) {
          // ➡️ associate here

          const associate = await hs_client.associations.associate(
            "notes",
            upsertActivity?.id,
            clientObject,
            client[0].id,
            26,
            "USER_DEFINED"
          );
          logger.info(
            `✅ upsertActivity Id ${
              upsertActivity?.id
            } associated with Client ${
              client[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }

        // Save progress after success
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing activity ", error);
        // Save progress to resume later
        // saveProgress(i);
        break; // ❗ remove after testing
      }
    }
  } catch (error) {
    logger.error("Error fetching activity records", error);
    return;
  }
}

export { syncActivity };
