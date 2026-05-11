import { logger } from "../utils/winston.logger.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/invoicesProgress.js";
import {
  fetchInvoicesRecords,
  searchCustomObjectInHubSpot,
} from "../services/studentLoan.service.js";
import {
  buildHubSpotInvoicePayload,
  buildHubSpotInvoicePayloadNew,
} from "../utils/helper.js";

import axios from "axios";

import { getHubspotClient } from "../configs/hubspot.config.js";

import {
  searchInvoiceInHubSpot,
  createInvoiceInHubSpot,
  updateInvoiceInHubSpot,
} from "../services/hubspot.service.js";
import { hubspotExecutor } from "../utils/executors.js";

const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// Helper to pre-fetch IDs and return a Map for instant lookups
// async function buildLookupMap(objectTypeId, uniqueValues) {
//   const map = new Map();
//   if (!uniqueValues || uniqueValues.length === 0) return map;

//   // Ideally, use a HubSpot Batch Search API here (e.g., filtering with the "IN" operator).
//   // For now, we will concurrently search the unique values to save time.
//   const searchPromises = uniqueValues.map(async (val) => {
//     try {
//       const result = await searchCustomObjectInHubSpot(objectTypeId, val);
//       if (result && result[0]?.id) {
//         map.set(val, result[0].id);
//       }
//     } catch (error) {
//       logger.error(
//         `Error pre-fetching custom object ${objectTypeId} for value ${val}`
//       );
//     }
//   });

//   await Promise.all(searchPromises);
//   return map;
// }

// Helper to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function buildLookupMap(objectTypeId, uniqueValues, searchPropertyName) {
  const map = new Map();
  if (!uniqueValues || uniqueValues.length === 0) return map;

  logger.info(
    `Batch fetching ${uniqueValues.length} unique values for object ${objectTypeId}...`
  );

  // HubSpot's "IN" operator allows up to 100 values per request
  const BATCH_SIZE = 100;
  const url = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}/search`;

  for (let i = 0; i < uniqueValues.length; i += BATCH_SIZE) {
    const chunk = uniqueValues.slice(i, i + BATCH_SIZE);

    // Build the HubSpot Search API payload
    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: searchPropertyName,
              operator: "IN",
              values: chunk.map(String), // Ensure all values are strings
            },
          ],
        },
      ],
      limit: 100,
      properties: ["hs_object_id", searchPropertyName],
    };

    try {
      // Use your existing hubspotExecutor and axios setup
      const response = await hubspotExecutor(
        () => {
          return axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
        },
        {
          name: `batchSearchInHubSpot for ${objectTypeId}`,
        }
      );

      const results = response.data?.results || [];

      // Map the returned records back into our local Map
      results.forEach((record) => {
        const externalId = record.properties[searchPropertyName];
        if (externalId && record.id) {
          map.set(externalId, record.id);
        }
      });
    } catch (error) {
      logger.error(`❌ Error in batch fetching ${objectTypeId}:`, {
        status: error?.status,
        response: error.response?.data,
        method: error?.method,
        url: error?.config?.url,
        message: error.message,
        stack: error?.stack || error,
      });
      // Decide if you want to throw the error or continue to the next batch
      // throw error;
    }
  }

  return map;
}

const BATCH_SIZE = 3;

async function syncInvoices(records) {
  try {
    const length = records.length;
    logger.info(`Invoices Records: ${length}`);

    // 🚀 NEW OPTIMIZATION: Extract Unique Values
    const uniqueClients = [
      ...new Set(records.map((r) => r.related_client).filter(Boolean)),
    ];
    const uniqueAffiliates = [
      ...new Set(records.map((r) => r.related_affiliate).filter(Boolean)),
    ];
    const uniqueInquirers = [
      ...new Set(records.map((r) => r.related_inquirer).filter(Boolean)),
    ];

    logger.info(
      `Pre-fetching IDs for ${uniqueClients.length} Clients, ${uniqueAffiliates.length} Affiliates, ${uniqueInquirers.length} Inquirers...`
    );

    // 🚀 NEW OPTIMIZATION: Build Lookup Maps Concurrently Before the Loop
    // Replace "affiliate_type_id" and "inquirer_type_id" with your actual HubSpot Object Type IDs
    // const [clientMap, affiliateMap, inquirerMap] = await Promise.allSettled([
    //   buildLookupMap("2-171843307", uniqueClients),
    //   buildLookupMap(affiliateObject, uniqueAffiliates),
    //   buildLookupMap(inquirerObject, uniqueInquirers),
    // ]);

    const clientMap = await buildLookupMap(
      "2-171843307",
      uniqueClients,
      "collection_id"
    );
    const affiliateMap = await buildLookupMap(
      affiliateObject,
      uniqueAffiliates,
      "collection_id"
    );
    const inquirerMap = await buildLookupMap(
      inquirerObject,
      uniqueInquirers,
      "collection_id"
    );

    logger.info(
      `Client : ${clientMap.size} | ${JSON.stringify(
        Object.fromEntries(clientMap)
      )}`
    );
    logger.info(
      `Affiliate : ${affiliateMap.size} | ${JSON.stringify(
        Object.fromEntries(affiliateMap)
      )}`
    );
    logger.info(
      `Inquirer : ${inquirerMap.size} | ${JSON.stringify(
        Object.fromEntries(inquirerMap)
      )}`
    );

    let startIndex = 0;
    // let startIndex = await loadProgress();

    // Process records in batches
    for (let i = startIndex; i < length; i += BATCH_SIZE) {
      const chunk = records.slice(i, i + BATCH_SIZE);

      const chunkPromises = chunk.map(async (record, indexOffset) => {
        const actualIndex = i + indexOffset;
        try {
          // Pass the pre-fetched maps into the processor
          await processSingleInvoice(record, actualIndex, length, {
            clientMap,
            affiliateMap,
            inquirerMap,
          });
        } catch (error) {
          logger.error(`Error processing invoice index ${actualIndex}`, {
            message: error.message,
          });
          await saveFailedCollectionId(
            "invoiceCollectionId",
            record.collection_id
          );
        }
      });

      await Promise.all(chunkPromises);
      await saveProgress(Math.min(i + BATCH_SIZE, length));
    }
  } catch (error) {
    logger.error("Error fetching invoice records", { message: error.message });
  }
}

async function processSingleInvoice(record, index, totalLength, maps) {
  const { clientMap, affiliateMap, inquirerMap } = maps;

  // 1. Get IDs from your pre-fetched Maps
  const clientId = clientMap.get(record.related_client);
  const affiliateId = affiliateMap.get(record.related_affiliate);
  const inquirerId = inquirerMap.get(record.related_inquirer);

  let invoice_record_id = null;

  // 2. Search existing invoice FIRST so we know which path to take
  const searchResults = await searchInvoiceInHubSpot(record.collection_id);

  if (searchResults && searchResults.length > 0) {
    const existingInvoiceId = searchResults[0].id;
    logger.info(`[Hubspot] Invoice exists: ${existingInvoiceId}, updating...`);

    // Build payload WITHOUT associations (do not pass the IDs)
    const updatePayload = buildHubSpotInvoicePayloadNew(record);

    logger.info(`Invoices Payload : ${JSON.stringify(updatePayload)}`);

    const updated = await updateInvoiceInHubSpot(
      existingInvoiceId,
      updatePayload
    );
    invoice_record_id = updated.id;
    logger.info(`[Hubspot] Invoice updated: ${JSON.stringify(updated)}`);

    // 🚀 Manually associate ONLY for updates
    const hs_client = getHubspotClient();

    if (clientId && invoice_record_id) {
      try {
        const association = await hs_client.associations.associate(
          invoiceObject,
          invoice_record_id,
          clientObject,
          clientId,
          79,
          "USER_DEFINED"
        );
        logger.info(
          `Associated Invoice ${invoice_record_id} to Client ${clientId} | Result : ${JSON.stringify(
            association
          )}`
        );
      } catch (err) {
        logger.error(
          `❌ Error creating Client association for Invoice ${invoice_record_id}: ${err.message}`
        );
      }
    }

    // if (affiliateId && invoice_record_id) {
    //   try {
    //     const association = await hs_client.associations.associate(
    //       invoiceObject,
    //       invoice_record_id,
    //       affiliateObject,
    //       affiliateId,
    //       72, // Verify this is the Invoice -> Affiliate direction
    //       "USER_DEFINED"
    //     );
    //     logger.info(
    //       `Associated Invoice ${invoice_record_id} to Affiliate ${affiliateId} | Result : ${JSON.stringify(
    //         association
    //       )}`
    //     );
    //   } catch (err) {
    //     logger.error(
    //       `❌ Error creating Affiliate association for Invoice ${invoice_record_id}: ${err.message}`
    //     );
    //   }
    // }

    if (inquirerId && invoice_record_id) {
      try {
        const association = await hs_client.associations.associate(
          invoiceObject,
          invoice_record_id,
          inquirerObject,
          inquirerId,
          3 // Verify this is the Invoice -> Inquirer direction
        );
        logger.info(
          `Associated Invoice ${invoice_record_id} to Inquirer ${inquirerId} | Result : ${JSON.stringify(
            association
          )}`
        );
      } catch (err) {
        logger.error(
          `❌ Error creating Inquirer association for Invoice ${invoice_record_id}: ${err.message}`
        );
      }
    }
  } else {
    // Build payload WITH associations included directly
    const createPayload = buildHubSpotInvoicePayloadNew(
      record,
      clientId,
      affiliateId,
      inquirerId
    );
    logger.info(`Invoices Payload : ${JSON.stringify(createPayload)}`);
    const created = await createInvoiceInHubSpot(createPayload);
    invoice_record_id = created.id;

    // Associations are handled automatically by the create payload!
    logger.info(
      `[Hubspot] Invoice created with associations: ${JSON.stringify(created)}`
    );
  }
}
export { syncInvoices, buildLookupMap };
