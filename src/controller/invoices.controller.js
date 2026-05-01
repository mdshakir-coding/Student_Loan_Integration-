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
import { buildHubSpotInvoicePayload } from "../utils/helper.js";

import { getHubspotClient } from "../configs/hubspot.config.js";

import {
  searchInvoiceInHubSpot,
  createInvoiceInHubSpot,
  updateInvoiceInHubSpot,
} from "../services/hubspot.service.js";

const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

async function syncInvoices(records) {
  try {
    // const timeLabel = "Invoices Records processing";
    // console.time(timeLabel);
    logger.info(` Invoices Records :${JSON.stringify(records.length)}`);

    const length = records.length;

    let startIndex = await loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processSingleInvoice(record, i, length);
      } catch (error) {
        logger.error("Error processing invoice index", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
      } finally {
        await saveProgress(i + 1);
        await saveFailedCollectionId(
          "invoiceCollectionId",
          records[i].collection_id
        );
      }
    }

    // console.endTime(timeLabel);
  } catch (error) {
    logger.error("Error fetching invoice records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processSingleInvoice(record, index, totalLength) {
  try {
    logger.info(
      `[Student Loan] Invoices at index: ${index}/${totalLength}, Record: ${JSON.stringify(
        record
      )}`
    );

    let invoice_record_id = null;

    // Build HubSpot payload
    const payload = buildHubSpotInvoicePayload(record);

    logger.info(`Invoices Payload : ${JSON.stringify(payload)}`);

    // 🔍 Search existing invoice using collection_id
    const searchResults = await searchInvoiceInHubSpot(record.collection_id);

    if (searchResults && searchResults.length > 0) {
      // Invoice exists → Update
      const existingInvoiceId = searchResults[0].id;
      logger.info(
        `[Hubspot] Invoice exists: ${JSON.stringify(
          existingInvoiceId
        )}, updating...`
      );

      const updated = await updateInvoiceInHubSpot(existingInvoiceId, payload);

      invoice_record_id = updated.id;
    } else {
      // Invoice does not exist → Create
      const created = await createInvoiceInHubSpot(payload);
      invoice_record_id = created.id;

      logger.info(`[Husbpot] Invoice created: ${JSON.stringify(created)}`);
    }
    const hs_client = getHubspotClient();
    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.related_client
    );
    const affiliate = await searchCustomObjectInHubSpot(
      record.related_affiliate
    );
    const inquirer = await searchCustomObjectInHubSpot(record.related_inquirer);

    if (client && client[0]?.id && invoice_record_id) {
      const associate = await hs_client.associations.associate(
        invoiceObject,
        invoice_record_id,
        clientObject,
        client[0].id,
        79,
        "USER_DEFINED"
      );
      logger.info(
        `[Hubspot] Invoice Id:${invoice_record_id} associated with Client Id ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
    if (affiliate && affiliate[0]?.id && invoice_record_id) {
      const associate = await hs_client.associations.associate(
        inquirerObject,
        invoice_record_id,
        affiliateObject,
        affiliate[0]?.id,
        72,
        "USER_DEFINED"
      );
      logger.info(
        `[hubspot] Invoice Id ${invoice_record_id} associated with affiliate Id ${
          affiliate[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
    if (inquirer && inquirer[0]?.id && invoice_record_id) {
      const associate = await hs_client.associations.associate(
        inquirerObject,
        invoice_record_id,
        inquirerObject,
        inquirer[0]?.id,
        3
      );

      logger.info(
        `[Hubspot] Invoice Id ${invoice_record_id} associated with inquirer Id ${
          inquirer[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
  } catch (error) {
    logger.error("Error processing invoice index", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncInvoices };
