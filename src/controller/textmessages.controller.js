import { logger } from "../index.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/testMessagesProgress.js";

// import { fetchTextMessagesRecords } from "../service/studentLoan.service.js";
import { buildTextMessagePayload } from "../utils/helper.js";

import { searchCustomObjectInHubSpotBasedonCustomeField } from "../services/studentLoan.service.js";
import {
  updateTextMessageInHubSpot,
  createTextMessageInHubSpot,
  searchTextMessageInHubSpot,
} from "../services/hubspot.service.js";
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

// New TextMessage controller
async function syncTextMessages(records) {
  try {
    // fetch all text message records
    // const records = await fetchTextMessagesRecords();
    logger.info(`TextMessages Records: ${JSON.stringify(records.length)}`);
    const length = records.length;

    let startIndex = await loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processSIngleTextMessage(record, i, length);

        // Save progress after success
      } catch (error) {
        logger.error("Error processing TextMessage index", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });

        // Save progress to resume later
        // saveProgress(i);
      } finally {
        await saveProgress(i + 1);
        await saveFailedCollectionId(
          "textMessageCollectionId",
          records[i].collection_id
        );
      }
    }
  } catch (error) {
    logger.error("Error fetching text message records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processSIngleTextMessage(record, index, totalRecords) {
  try {
    // Build HubSpot payload
    const payload = buildTextMessagePayload(record);

    logger.info(
      `[Student Loan] TextMessages at index ${index}/${totalRecords}, Record: ${JSON.stringify(
        record
      )}`
    );
    logger.info(
      `[Student Loan] TextMessages Payload: ${JSON.stringify(payload)}`
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
        `TextMessage exists with id ${JSON.stringify(
          existingMessageId
        )}, updating...`
      );

      upsertTextMessage = await updateTextMessageInHubSpot(
        existingMessageId,
        payload
      );

      logger.info(
        `[Hubspot] TextMessage updated: ${JSON.stringify(upsertTextMessage)}`
      );
    } else {
      // Text Message does not exist → create
      upsertTextMessage = await createTextMessageInHubSpot(payload);

      logger.info(
        `[Hubspot] TextMessage created: ${JSON.stringify(upsertTextMessage)}`
      );
    }

    // Find client based on linked_client field in Hubspot ->(Client)
    const hs_client = getHubspotClient();

    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpotBasedonCustomeField(
      "2-171843307",
      "phone_1_type_ivinex",
      record.external_number
    );

    // logger.info(
    //   `[Hubspot] Client found: ${JSON.stringify(client, null, 2)}`
    // );

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
        `[Hubspot] upsertTextMessage Id ${
          upsertTextMessage?.id
        } associated with Client ${client[0]?.id}: Association ${JSON.stringify(
          associate
        )}`
      );
    }
  } catch (error) {
    logger.error("Error processing TextMessage index", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncTextMessages };
