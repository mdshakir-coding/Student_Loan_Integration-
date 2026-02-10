import { logger } from "../utils/winston.logger.js";

import {
  fetchInvoicesRecords,
  searchCustomObjectInHubSpot,
} from "../service/student.loan.Hubspot.js";
import { buildHubSpotInvoicePayload } from "../utils/helper.js";
import { searchInvoiceInHubSpot } from "../service/student.service.js";
import { createInvoiceInHubSpot } from "../service/student.service.js";
import { updateInvoiceInHubSpot } from "../service/student.service.js";
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

// async function syncInvoices() {
//   try {
//     const records = await fetchInvoicesRecords();
//     logger.info("Invoices records", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         let inquirerId = null;

//         const Payloads = buildHubSpotInvoicePayload(record); // call the function

//         logger.info(" Records", record);
//         logger.info("Payloads", Payloads);
//         return; // todo remove after testing
//         // await createInquirerInHubSpot(Payloads);

//         // Save progress after successful processing
//         // saveProgress(i + 1);
//       } catch (error) {
//         logger.error(error);
//         // saveProgress(i);
//         // break; // todo remove after testing
//       }
//     }
//     logger.info(" All Invoices Processed");
//   } catch (error) {
//     logger.error("Error feching records", error);
//     return;
//   }
// }

// New code Client Invoices

async function syncInvoices() {
  try {
    const records = await fetchInvoicesRecords(); // fetch all invoice records
    logger.info(`Invoices Records: ${records.length}`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];
        logger.info(`Invoices Record: ${JSON.stringofy(record, null, 2)}`);

        let invoice_record_id = null;

        // Build HubSpot payload
        const payload = buildHubSpotInvoicePayload(record);

        logger.info(`Invoices Payload : ${JSON.stringify(payload, null, 2)}`);

        // 🔍 Search existing invoice using collection_id
        const searchResults = await searchInvoiceInHubSpot(
          record.collection_id
        );

        if (searchResults && searchResults.length > 0) {
          // Invoice exists → Update
          const existingInvoiceId = searchResults[0].id;
          logger.info(
            `Invoice exists with id ${existingInvoiceId}, updating...`
          );

          const updated = await updateInvoiceInHubSpot(
            existingInvoiceId,
            payload
          );

          invoice_record_id = updated.id;

          logger.info("✅ Invoice updated:", updated.id);
        } else {
          // Invoice does not exist → Create
          const created = await createInvoiceInHubSpot(payload);
          invoice_record_id = created.id;

          logger.info("✅ Invoice created:", created.id);
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
        const inquirer = await searchCustomObjectInHubSpot(
          record.related_inquirer
        );

        if (client[0]?.id && invoice_record_id) {
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "2-171843307",
          //   fromObjectId: client[0]?.id,
          //   toObjectType: "0-3",
          //   toObjectId: invoice_record_id,
          //   associationTypeId: 78,
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            invoiceObject,
            invoice_record_id,
            clientObject,
            client[0].id,
            79,
            "USER_DEFINED"
          );
          logger.info(
            `✅ Invoice ${invoice_record_id} associated with Client ${
              client[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }
        if (affiliate[0]?.id && invoice_record_id) {
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "2-171942530",
          //   fromObjectId: affiliate[0]?.id,
          //   toObjectType: "0-3",
          //   toObjectId: invoice_record_id,
          //   associationTypeId: 78,
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            inquirerObject,
            invoice_record_id,
            affiliateObject,
            affiliate[0]?.id,
            72,
            "USER_DEFINED"
          );
          logger.info(
            `✅ Invoice ${invoice_record_id} associated with affiliate ${
              affiliate[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }
        if (inquirer[0]?.id && invoice_record_id) {
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "0-3",
          //   fromObjectId: inquirer[0]?.id,
          //   toObjectType: "0-3",
          //   toObjectId: invoice_record_id,
          //   associationTypeId: 451,
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            inquirerObject,
            invoice_record_id,
            inquirerObject,
            inquirer[0]?.id,
            3
          );

          logger.info(
            `✅ Invoice ${invoice_record_id} associated with inquirer ${
              inquirer[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }

        break; // 🔥 remove after testing

        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing invoice index", i, error);
        break; // 🔥 remove after testing
        // saveProgress(i);
      }
    }

    logger.info("🎄 All Invoices Processed");
  } catch (error) {
    logger.error("Error fetching invoice records", error);
    return;
  }
}

export { syncInvoices };
