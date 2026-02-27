import { logger } from "../index.js";

import {
  fetchOrdersRecords,
  searchCustomObjectInHubSpot,
} from "../service/student.loan.Hubspot.js";
import { buildHubspotOrderPayload } from "../utils/helper.js";
import { searchOrderInHubSpot } from "../service/student.service.js";
import { updateOderInHubSpot } from "../service/student.service.js";
import { createOrderInHubSpot } from "../service/student.service.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

import { getHubspotClient } from "../configs/hubspot.config.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";
const orderObject = "0-5";
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
async function syncOrders() {
  try {
    const response = await fetchOrdersRecords();
    logger.info("Orders response", response.length);
  } catch (error) {
    logger.error("Error feching records", error);
    return;
  }
}
export { syncOrders };

*/

// New Oorder controller

async function syncOrders() {
  try {
    const records = await fetchOrdersRecords(); // fetch all order records
    logger.info(`Orders Records : ${records.length}`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];
        let order_record_id = null;

        // Build payload
        const Payloads = buildHubspotOrderPayload(record);


        logger.info(`Orders Record: ${JSON.stringify(record, null, 2)}`);

        logger.info(`Orders Payload: ${JSON.stringify(Payloads, null, 2)}`);

        // First, search existing order by collection_id
        const searchResults = await searchOrderInHubSpot(record.collection_id);

        if (searchResults && searchResults.length > 0) {
          // Order exists, update it
          const existingOrderId = searchResults[0].id;
          order_record_id = searchResults[0].id;
          logger.info(`Order exists with id ${existingOrderId}, updating...`);

          const updated = await updateOderInHubSpot(existingOrderId, Payloads);
          logger.info(`✅ Order updated: ${updated.id}`);
        } else {
          // Order does not exist, create new
          const created = await createOrderInHubSpot(Payloads);
          order_record_id = created?.id;
          logger.info(`✅ Order created: ${created.id}`);
        }
        // return; // todo remove after testing
        // Associate client and order
        const hs_client = getHubspotClient();
        const client = await searchCustomObjectInHubSpot(
          "2-171843307",
          record.client
        );

        logger.info(`Client: ${JSON.stringify(client, null, 2)}`);

        if (client[0]?.id && order_record_id) {
          logger.info(
            `Client: ${client[0]?.id} : Inquirer: ${order_record_id}`
          );
         
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "2-171843307", // Inquirer
          //   fromObjectId: client[0].id,
          //   toObjectType: "0-1", // Contact
          //   toObjectId: inquirer_record_id,
          //   associationLabel: "inquirers_to_clients",
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            orderObject,
            order_record_id,
            clientObject,
            client[0].id,
            109,
            "USER_DEFINED"
          );
          logger.info(
            `✅ order_record_id ${order_record_id} associated with Client ${
              client[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
          return; // todo remove after testing
        }

       
        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing record index",i, error);
        // Save progress here to resume later if needed
        // saveProgress(i);
      }
    }
  } catch (error) {
    logger.error("Error fetching order records", error);
  }
}




export { syncOrders };
