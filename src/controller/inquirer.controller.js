import { logger } from "../index.js";

import { buildHubSpotInquirerPayload } from "../utils/helper.js";
import { searchCustomObjectInHubSpot } from "../services/studentLoan.service.js";

import {
  createInquirerInHubSpot,
  searchInquirerInHubSpot,
  updateInquirerInHubSpot,
} from "../services/hubspot.service.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/inquirerProgress.js";

import { getHubspotClient } from "../configs/hubspot.config.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

async function syncInquirer(records) {
  try {
    // fetch all inquirer records
    // const records = await fetchInquirerRecords();
    // logger.debug(` Inquirer Records :${JSON.stringify(records.length)}`);

    let startIndex = await loadProgress();
    const length = records.length;

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processnquirer(record, i, length);
      } catch (error) {
        logger.error("Error processing record index", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
      } finally {
        // Save progress after success
        saveProgress(i + 1);
        saveFailedCollectionId(
          "inquirerCollectionId",
          records[i].collection_id
        );
      }
    }
  } catch (error) {
    logger.error("Error fetching inquirer records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processnquirer(record, index, recordlength) {
  try {
    // Build HubSpot payload
    const payload = buildHubSpotInquirerPayload(record);

    logger.info(
      `[Student Loan] Inquirer at index ${index}/${recordlength}, Record: ${JSON.stringify(
        record
      )}`
    );
    logger.info(`[Student Loan] Inquirer Payload: ${JSON.stringify(payload)}`);

    // 🔍 Search existing inquirer (example: by collection_id or name)
    let inquirer_record_id = null;
    let searchResults = null;
    searchResults = await searchInquirerInHubSpot(
      record?.collection_id,
      record?.email_1
    );

    logger.info(
      `[Hubspot] Search Inquirer results: ${JSON.stringify(searchResults)}`
    );

    if (searchResults && searchResults.length > 0) {
      // Inquirer exists → update

      inquirer_record_id = searchResults[0]?.id;

      // logger.info(`Inquirer exists with id ${JSON.stringify(existingInquirerId)}, updating...`);
      let updated = await updateInquirerInHubSpot(inquirer_record_id, payload);
      logger.info(`[Hubspot] Inquirer updated: ${JSON.stringify(updated)}`);
    } else {
      // Inquirer does not exist → create
      let created = await createInquirerInHubSpot(payload);
      inquirer_record_id = created?.id;

      logger.info(`[Hubspot] Inquirer created: ${JSON.stringify(created)}`);
    }
    // return;
    // let inquirer_record_id = null;
    // let searchResults = null;

    // searchResults = await searchInquirerInHubSpot(record.collection_id);

    // if (searchResults && searchResults.length > 0) {
    //   // ✅ SAFE now
    //   inquirer_record_id = searchResults[0].id;

    //   // Inquirer exists → update
    //   let existingInquirerId = searchResults[0].id;
    //   logger.info(`Inquirer exists with id ${existingInquirerId}, updating...`);

    //   let updated = await updateInquirerInHubSpot(existingInquirerId, payload);
    //   logger.info(`✅ Inquirer updated: ${updated?.id}`);
    // } else {
    //   // Inquirer does not exist → create
    //   let created = await createInquirerInHubSpot(payload);

    //   inquirer_record_id = created?.id;

    //   logger.info(`✅ Inquirer created: ${created?.id}`);
    // }
    // return; // todo remove after testing
    // Find client based on linked_client field in Hubspot ->(Client,affiliate,inquirer)
    const hs_client = getHubspotClient();

    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record?.client_referral
    );
    // logger.info(`Client: ${JSON.stringify(client[0])}`);
    const affiliate = await searchCustomObjectInHubSpot(
      affiliateObject,
      record?.affiliate_referral
    );
    // logger.info(`affiliate: ${JSON.stringify(affiliate[0])}`);

    const inquirer = await searchCustomObjectInHubSpot(
      record.inquirer_referral0
    );
    // logger.info(`inquirer: ${JSON.stringify(inquirer[0])}`);

    if (client && client[0]?.id && inquirer_record_id) {
      // logger.info(`Client: ${client[0]?.id} : Inquirer: ${inquirer_record_id}`);
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        clientObject,
        client[0].id,
        115,
        "USER_DEFINED"
      );
      logger.info(
        `[Hubspot] Inquirer Id: ${inquirer_record_id} associated with Client Id: ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
    if (affiliate && affiliate[0]?.id && inquirer_record_id) {
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        affiliateObject,
        affiliate[0]?.id,
        72,
        "USER_DEFINED"
      );
      logger.info(
        `[Hubspot] Inquirer ${inquirer_record_id} associated with affiliate ${
          affiliate[0]?.id
        }: Association ${JSON.stringify(associate.results[0])}`
      );
    }
    if (inquirer && inquirer[0]?.id && inquirer_record_id) {
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        inquirerObject,
        inquirer[0]?.id,
        449
      );

      logger.info(
        `[Hubspot] Inquirer ${inquirer_record_id} associated with inquirer ${
          inquirer[0]?.id
        }: Association ${JSON.stringify(associate)}`
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

export { syncInquirer, processnquirer };
