import { logger } from "../index.js";

import { fetchEmailsRecords } from "../services/studentLoan.service.js";
import { buildEmailPayload } from "../utils/helper.js";

import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/emailProgress.js";
import {
  searchEmailInHubSpot,
  createEmailInHubSpot,
  updateEmailInHubSpot,
} from "../services/hubspot.service.js";

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

async function syncEmails(records) {
  try {
    // fetch all email records
    // const records = await fetchEmailsRecords();
    logger.info(`Emails Records :${JSON.stringify(records.length)}`);
    const length = records.length;

    let startIndex = await loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processSingleEmail(record, i, length);
      } catch (error) {
        logger.error("Error processing Email ", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
      } finally {
        await saveProgress(i + 1);
      }
    }
  } catch (error) {
    logger.error("Error fetching email records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processSingleEmail(record, index, totalLength) {
  try {
    // Build HubSpot payload
    const payload = buildEmailPayload(record);

    logger.info(
      `[Student Loan] Email at index ${index}/${totalLength}, Record: ${JSON.stringify(
        record,
        null,
        2
      )}`
    );
    logger.info(`[Student Loan] Emails Payload: ${JSON.stringify(payload)}`);

    // 🔍 Search existing email (example: by collection_id or external_id)
    let searchResults = null;
    searchResults = await searchEmailInHubSpot(
      record.collection_id // or record.external_id
    );

    if (searchResults && searchResults.length > 0) {
      // Email exists → update
      let existingEmailId = null;
      existingEmailId = searchResults[0].id;

      logger.info(
        `[Hubspot] Email exists with id ${JSON.stringify(
          existingEmailId,
          null,
          2
        )}, updating...`
      );

      const updated = await updateEmailInHubSpot(existingEmailId, payload);

      logger.info(`[Hubspot] Email updated: ${JSON.stringify(updated)}`);
    } else {
      // Email does not exist → create
      const created = await createEmailInHubSpot(payload);

      logger.info(`[Hubspot] Email created: ${JSOn.stringify(created)}`);
    }
  } catch (error) {
    logger.error(`Error procesing email in processSingleEmail`, {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncEmails };
