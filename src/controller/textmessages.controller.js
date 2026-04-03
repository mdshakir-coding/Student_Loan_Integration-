import { logger } from "../index.js";

import {
  fetchTextMessagesRecords,
  searchCustomObjectInHubSpotBasedonCustomeField,
} from "../service/student.loan.Hubspot.js";
import { buildTextMessagePayload } from "../utils/helper.js";
import { searchTextMessageInHubSpot } from "../service/student.service.js";
import { createTextMessageInHubSpot } from "../service/student.service.js";
import { updateTextMessageInHubSpot } from "../service/student.service.js";
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
async function syncTextMessages() {
  try {
    const response = await fetchTextMessagesRecrds(); // call the function
    logger.info("TextMessages response", response.length);
  } catch (error) {
    logger.error("Error feching records", error);
    return;
  }
}
export { syncTextMessages };
*/

// New TextMessage controller
async function syncTextMessages() {
  try {
    // fetch all text message records
    const records = await fetchTextMessagesRecords(); 
    logger.info(`TextMessages Records: ${JSON.stringify(records.length)}`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildTextMessagePayload(record);

        logger.info(`TextMessages Record: ${JSON.stringify(record, null, 2)}`);
        logger.info(
          `TextMessages Payload: ${JSON.stringify(payload, null, 2)}`
        );

        // 🔍 Search existing text message (example: by collection_id or message_id)
        let upsertTextMessage = null;
        upsertTextMessage = await searchTextMessageInHubSpot(
          record.collection_id // or record.message_id
        );

        if (upsertTextMessage) {
          // Text Message exists → update
          let existingMessageId = null;
          existingMessageId = upsertTextMessage[0].id || upsertTextMessage?.id;

          logger.info(
            `TextMessage exists with id ${JSON.stringify(existingMessageId)}, updating...`
          );

          upsertTextMessage = await updateTextMessageInHubSpot(
            existingMessageId,
            payload
          );

          logger.info(`✅ TextMessage updated: ${JSON.stringify(upsertTextMessage.id)}`);
        } else {
          // Text Message does not exist → create
          upsertTextMessage = await createTextMessageInHubSpot(payload);

          logger.info(`✅ TextMessage created: ${JSON.stringify(upsertTextMessage.id)}`);
        }

        // Find client based on linked_client field in Hubspot ->(Client)
        const hs_client = getHubspotClient();

        //  client affiliate inquirer
        const client = await searchCustomObjectInHubSpotBasedonCustomeField(
          "2-171843307",
          "phone_1_type_ivinex",
          record.external_number
        );

        logger.info(`✅ Client found: ${JSON.stringify(client, null, 2)}`);

        if (client && client[0]?.id && upsertTextMessage?.id) {
          // ➡️ associate here

          const associate = await hs_client.associations.associate(
            "notes",
            upsertTextMessage?.id,
            clientObject,
            client[0].id,
            26,
            "USER_DEFINED"
          );
          logger.info(
            `✅ upsertTextMessage Id ${
              upsertTextMessage?.id
            } associated with Client ${
              client[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
          return; // todo: remove after testing
        }

        // Save progress after success
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing TextMessage index", error);

        // Save progress to resume later
        // saveProgress(i);
      }
    }
  } catch (error) {
    logger.error("Error fetching text message records", error.message);
    return;
  }
}

export { syncTextMessages };
