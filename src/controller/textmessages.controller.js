import { logger } from "../index.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/testMessagesProgress.js";

// import { fetchTextMessagesRecords } from "../service/studentLoan.service.js";
import {
  buildTextMessagePayload,
  buildTextMessagePayloadBatch,
} from "../utils/helper.js";

import { searchCustomObjectInHubSpotBasedonCustomeField } from "../services/studentLoan.service.js";
import {
  updateTextMessageInHubSpot,
  createTextMessageInHubSpot,
  searchTextMessageInHubSpot,
  makeBatchCall,
} from "../services/hubspot.service.js";
import { getHubspotClient } from "../configs/hubspot.config.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { buildLookupMap } from "./invoices.controller.js";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// Helper function for the 100-limit rule
function chunkArray(array, size = 100) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

// New TextMessage controller
async function syncTextMessages(sourceData) {
  try {
    const records = sourceData.filter((item) => item && item?.external_number);

    const notesPayload = [];

    // 🚀 Extract Unique Values
    const uniqueClients = [
      ...new Set(records.map((r) => r.external_number).filter(Boolean)),
    ];
    logger.info(`Pre-fetching IDs for ${uniqueClients.length} Clients...`);
    // 🚀 Pre-fetch Client IDs in bulk
    const clientMap = await buildLookupMap(
      "2-171843307",
      uniqueClients,
      "phone_1"
    );

    logger.info(
      `Client : ${JSON.stringify(clientMap, null, 2)} |\n
       ${JSON.stringify(Object.fromEntries(clientMap))}`
    );

    // --- Build Note Payloads ---
    for (const note of records) {
      try {
        // Instant lookup from the Map
        const clientId = clientMap.get(note.external_number);

        if (clientId) {
          const payload = buildTextMessagePayloadBatch(note, clientId);
          notesPayload.push(payload);
        }
      } catch (error) {
        logger.error(`Error creating note payload ${note.id || "unknown"}`, {
          message: error.message,
        });
      }
    }

    // 🚀 Strip out any null/undefined payloads
    const cleanNotesPayload = notesPayload.filter(Boolean);

    logger.info(`Payload : ${JSON.stringify(cleanNotesPayload, null, 2)}`);

    if (cleanNotesPayload.length > 0) {
      const noteChunks = chunkArray(cleanNotesPayload, 100);
      for (const [index, chunk] of noteChunks.entries()) {
        logger.info(`Sending Note Batch ${index + 1} of ${noteChunks.length}`);
        const res = await makeBatchCall(chunk, "notes");
        logger.info(
          `Note Payload ${JSON.stringify(
            chunk
          )}\n and Response ${JSON.stringify(res)}`
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
