import { logger } from "../index.js";

// import { fetchAffiliateRecords } from "../service/studentLoan.service.js";
import { buildHubSpotAffiliatePayload } from "../utils/helper.js";
import {
  searchAffiliateByInHubspot,
  updateAffiliateInHubSpot,
  createAffiliateInHubSpot,
} from "../services/hubspot.service.js";

import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/affiliateProgress.js";

const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// Process Bulk Affiliate Records
async function syncAffiliate(records) {
  try {
    const timerLabel = "Affiliate Records processing";
    console.time(timerLabel);
    logger.info(`Affiliate Records : ${JSON.stringify(records.length)}`);
    const length = records.length;

    let startIndex = await loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];
        // Process Each record independently
        await processAffiliate(record, i, length);
      } catch (error) {
        logger.error("Error processing record index", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
        // Save progress here to resume later if needed
      } finally {
        saveProgress(i + 1);
        saveFailedCollectionId(
          "affiliateCollectionId",
          records[i].collection_id
        );
      }
    }
    console.timeEnd(timerLabel);
  } catch (error) {
    logger.error("Error fetching affiliate records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processAffiliate(record, i, length) {
  try {
    // Build payload
    const Payloads = buildHubSpotAffiliatePayload(record);

    logger.info(
      `[Student Loan] , Index: ${i}/${length}, Affilaite Record: ${JSON.stringify(
        record
      )}`
    );
    logger.info(
      `[Student Loan] Affiliate Payload: ${JSON.stringify(Payloads)}`
    );

    // First, search existing affiliate by collection_id
    const searchResults = await searchAffiliateByInHubspot(
      record.collection_id
    );

    if (searchResults && searchResults.length > 0) {
      // Affiliate exists, update it
      const existingAffiliateId = searchResults[0].id;
      logger.info(
        `Affiliate exists with id ${existingAffiliateId}, updating...`
      );

      const updated = await updateAffiliateInHubSpot(
        existingAffiliateId,
        Payloads
      );

      logger.info(`[Hubspot] Affiliate updated: ${JSON.stringify(updated)}`);
    } else {
      // Affiliate does not exist, create new
      const created = await createAffiliateInHubSpot(Payloads);
      logger.info(
        `[Hubspot] Affiliate Record created: ${JSON.stringify(created)}`
      );
    }
  } catch (error) {
    logger.error("Error processing record index", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncAffiliate, processAffiliate };
