import { logger } from "../index.js";

import { buildHubspotOrderPayload } from "../utils/helper.js";
import {
  searchOrderInHubSpot,
  updateOderInHubSpot,
  createOrderInHubSpot,
  // searchCustomObjectInHubSpot,
} from "../services/hubspot.service.js";
// import { createOrderInHubSpot } from "../service/student.service.js";
import { getHubspotClient } from "../configs/hubspot.config.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/saveOrderProgress.js";
import { searchCustomObjectInHubSpot } from "../services/studentLoan.service.js";
// import { fetchOrdersRecords } from "../service/studentLoan.Hubspot.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";
const orderObject = "0-5";

// New Oorder controller

async function syncOrders(records) {
  try {
    // fetch all order records
    const timerLabel = "Orders Records processing";
    console.time(timerLabel);
    // const records = await fetchOrdersRecords();
    logger.info(` Work Orders Records : ${JSON.stringify(records.length)}`);
    const length = records.length;

    let startIndex = await loadProgress();
    // let startIndex = 0;

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processOrder(record, i, length);

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
        saveFailedCollectionId(
          "workOrderCollectionId",
          records[i].collection_id
        );
      }
    }

    console.timeEnd(timerLabel);
  } catch (error) {
    logger.error("Error fetching order records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processOrder(record, i, length) {
  try {
    let order_record_id = null;

    // Build payload
    const Payloads = buildHubspotOrderPayload(record);

    logger.info(
      `[Student Loan] , Index: ${i}/${length}, Work Orders Record: ${JSON.stringify(
        record
      )}`
    );

    logger.info(`Work Orders Payload: ${JSON.stringify(Payloads)}`);

    // First, search existing order by collection_id
    const searchResults = await searchOrderInHubSpot(record.collection_id);

    logger.info(
      `[Hubspot] Search Work Order results: ${JSON.stringify(searchResults)}`
    );

    if (searchResults && searchResults.length > 0) {
      // Order exists, update it
      const existingOrderId = searchResults[0].id;
      order_record_id = searchResults[0].id;
      // logger.info(`Order exists with id ${JSON.stringify(existingOrderId)}, updating...`);

      const updated = await updateOderInHubSpot(existingOrderId, Payloads);
      logger.info(
        `[Hubspot] Work Order updated: ${JSON.stringify(updated.id)}`
      );
    } else {
      // Order does not exist, create new
      const created = await createOrderInHubSpot(Payloads);
      order_record_id = created?.id;
      logger.info(`[hubspot] Work Order created: ${JSON.stringify(created)}`);
    }
    // Associate client and order
    const hs_client = getHubspotClient();
    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.client
    );

    // logger.info(`Client: ${JSON.stringify(client)}`);

    if (client[0]?.id && order_record_id) {
      // logger.info(
      //   `Client: ${client[0]?.id} : order_record_id: ${order_record_id}`
      // );

      const associate = await hs_client.associations.associate(
        orderObject,
        order_record_id,
        clientObject,
        client[0].id,
        109,
        "USER_DEFINED"
      );
      logger.info(
        `order_record_id ${order_record_id} associated with Client Id ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
  } catch (error) {
    logger.error("Error processing order", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncOrders, processOrder };
