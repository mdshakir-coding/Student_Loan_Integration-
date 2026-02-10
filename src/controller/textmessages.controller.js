import { logger } from "../utils/winston.logger.js";

import { fetchTextMessagesRecords } from "../service/student.loan.Hubspot.js";
import { buildTextMessagePayload } from "../utils/helper.js";
import { searchTextMessageInHubSpot } from "../service/student.service.js";
import { createTextMessageInHubSpot } from "../service/student.service.js";
import { updateTextMessageInHubSpot } from "../service/student.service.js";

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
    const records = await fetchTextMessagesRecords(); // fetch all text message records
    logger.info(`TextMessages Records: ${records.length}`);

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
        let searchResults = null;
        searchResults = await searchTextMessageInHubSpot(
          record.collection_id // or record.message_id
        );

        if (searchResults && searchResults.length > 0) {
          // Text Message exists → update
          let existingMessageId = null;
          existingMessageId = searchResults[0].id;

          logger.info(
            `TextMessage exists with id ${existingMessageId}, updating...`
          );

          let updated = null;
          updated = await updateTextMessageInHubSpot(
            existingMessageId,
            payload
          );

          logger.info(`✅ TextMessage updated: ${updated.id}`);
        } else {
          // Text Message does not exist → create
          let created = null;
          created = await createTextMessageInHubSpot(payload);

          logger.info(`✅ TextMessage created: ${created.id}`);
        }

        // Save progress after success
        // saveProgress(i + 1);

        break; // ❗ remove after testing
      } catch (error) {
        logger.error("Error processing TextMessage index", error);

        // Save progress to resume later
        // saveProgress(i);

        break; // ❗ remove after testing
      }
    }
  } catch (error) {
    logger.error("Error fetching text message records", error);
    return;
  }
}

export { syncTextMessages };
