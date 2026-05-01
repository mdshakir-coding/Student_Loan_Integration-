import { logger } from "../index.js";
import { saveProgress, loadProgress } from "../utils/helper.js";
import { fetchClientsRecords } from "../services/studentLoan.service.js";
import { buildHubSpotClientPayload } from "../utils/helper.js";
import { searchClientInHubSpot } from "../services/hubspot.service.js";
import { createClientInHubSpot } from "../services/hubspot.service.js";
import { updateClientInHubSpot } from "../services/hubspot.service.js";

const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// code Client Function

async function syncClients(records, offset) {
  try {
    // fetch all client records
    // const records = await fetchClientsRecords();
    // The labels must be identical
    const timerLabel = "Clients Records processing";
    console.time(timerLabel);

    logger.info(`Clients Records processing Started....`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processClient(record);

        // Save progress after successful processing
        saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing record index", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });

        saveProgress(i);
      }
    }

    logger.info(
      `Processed Client Records in Hubspot: ${records.length}/${offset + 100}`
    );

    console.timeEnd(timerLabel);
  } catch (error) {
    logger.error("Error fetching client records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processClient(record) {
  try {
    // Build payload
    const Payloads = buildHubSpotClientPayload(record);

    logger.info(`Clients Record: ${JSON.stringify(record)}`);
    logger.info(`Clients Payload: ${JSON.stringify(Payloads)}`);

    // 🔍 Search existing client by collection_id
    const searchResults = await searchClientInHubSpot(record.collection_id);

    logger.info(`Search results: ${JSON.stringify(searchResults)}`);

    if (searchResults && searchResults.length > 0) {
      // Client exists → Update
      const existingClientId = searchResults[0].id;
      logger.info(
        `Client exists with id ${JSON.stringify(
          existingClientId,
          null,
          2
        )}, updating...`
      );

      const updated = await updateClientInHubSpot(existingClientId, Payloads);

      logger.info(`✅ Client updated:${JSON.stringify(updated.id)}`);
    } else {
      // Client does not exist → Create
      const created = await createClientInHubSpot(Payloads);
      logger.info(`✅ Client created: ${JSON.stringify(created.id)}`);
    }

    // work order, task and note associate with client
  } catch (error) {
    logger.error("Error processing client record", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncClients, processClient };
