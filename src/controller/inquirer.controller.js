import { logger } from "../index.js";
// import { fetchInquirerRecords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotInquirerPayload } from "../utils/helper.js";
import { searchInquirerInHubSpot } from "../service/student.service.js";
import { updateInquirerInHubSpot } from "../service/student.service.js";
import { createInquirerInHubSpot } from "../service/student.service.js";
import {
  fetchAffiliateById,
  fetchInvoiceById,
  fetchInquirerById,
  fetchClientById,
  associateObjects,
  fetchInquirerRecords,
  searchCustomObjectInHubSpot,
} from "../service/student.loan.Hubspot.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

import { getHubspotClient } from "../configs/hubspot.config.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

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

// function call logic here

// async function syncInquirer() {
//   try {
//     const records = await fetchInquirerRecords(); // call the function
//     logger.info("inquirerRecords", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {

//       try {

//         const record = records[i];

//         let inquirerId = null;

//        const Payloads = buildHubSpotInquirerPayload(record); // call the function

//         logger.info (" Records", record);
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
//     logger.info ("👨‍🎓 All Inquirer Processed");
//   } catch (error) {
//     logger.error("Error Fecting Inquirer Records", error);
//     return;
//   }
// }

// new Code

async function syncInquirer() {
  try {
    const records = await fetchInquirerRecords(); // fetch all inquirer records
    logger.info("Inquirer Records:", records.length);

    // let startIndex = loadProgress();
    let startIndex = 0;

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildHubSpotInquirerPayload(record);

        logger.info(`Inquirer Record: ${JSON.stringify(record, null, 2)}`);
        logger.info(`Inquirer Payload: ${JSON.stringify(payload, null, 2)}`);

        // 🔍 Search existing inquirer (example: by collection_id or name)
        let inquirer_record_id = null;
        let searchResults = null;
        searchResults = await searchInquirerInHubSpot(record.collection_id);
        inquirer_record_id = searchResults[0].id;

        if (searchResults && searchResults.length > 0) {
          // Inquirer exists → update
          let existingInquirerId = null;
          existingInquirerId = searchResults[0].id;
          logger.info(
            `Inquirer exists with id ${existingInquirerId}, updating...`
          );
          let updated = null;
          updated = await updateInquirerInHubSpot(existingInquirerId, payload);
          logger.info(`✅ Inquirer updated: ${updated.id}`);
        } else {
          // Inquirer does not exist → create
          let created = null;
          created = await createInquirerInHubSpot(payload);
          inquirer_record_id = created.id;

          logger.info(`✅ Inquirer created: ${created.id}`);
        }
        // return;
        // Find client based on linked_client field in Hubspot ->(Client,affiliate,inquirer)
        const hs_client = getHubspotClient();

        const client = await searchCustomObjectInHubSpot(
          "2-171843307",
          record.client_referral
        );
        logger.info(`Client: ${JSON.stringify(client[0], null, 2)}`);
        const affiliate = await searchCustomObjectInHubSpot(
          affiliateObject,
          record?.affiliate_referral
        );
        logger.info(`affiliate: ${JSON.stringify(affiliate[0], null, 2)}`);

        const inquirer = await searchCustomObjectInHubSpot(
          record.inquirer_referral0
        );
        logger.info(`inquirer: ${JSON.stringify(inquirer[0], null, 2)}`);

        if (client[0]?.id && inquirer_record_id) {
          logger.info(
            `Client: ${client[0]?.id} : Inquirer: ${inquirer_record_id}`
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
            inquirerObject,
            inquirer_record_id,
            clientObject,
            client[0].id,
            115,
            "USER_DEFINED"
          );
          logger.info(
            `✅ Inquirer ${inquirer_record_id} associated with Client ${
              client[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }
        if (affiliate[0]?.id && inquirer_record_id) {
          logger.info(
            `Affiliate: ${affiliate[0]?.id} : Inquirer: ${inquirer_record_id}`
          );
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "2-171942530",
          //   fromObjectId: affiliate[0]?.id,
          //   toObjectType: "0-1",
          //   toObjectId: inquirer_record_id,
          //   associationTypeId: 71,
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            inquirerObject,
            inquirer_record_id,
            affiliateObject,
            affiliate[0]?.id,
            72,
            "USER_DEFINED"
          );
          logger.info(
            `✅ Inquirer ${inquirer_record_id} associated with affiliate ${
              affiliate[0]?.id
            }: Association ${JSON.stringify(associate.results[0], null, 2)}`
          );
        }
        if (inquirer[0]?.id && inquirer_record_id) {
          // ➡️ associate here
          // const associate = await associateObjects({
          //   fromObjectType: "0-1",
          //   fromObjectId: inquirer[0]?.id,
          //   toObjectType: "0-1",
          //   toObjectId: inquirer_record_id,
          //   associationTypeId: 449,
          //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
          // });
          const associate = await hs_client.associations.associate(
            inquirerObject,
            inquirer_record_id,
            inquirerObject,
            inquirer[0]?.id,
            449
          );

          logger.info(
            `✅ Inquirer ${inquirer_record_id} associated with inquirer ${
              inquirer[0]?.id
            }: Association ${JSON.stringify(associate)}`
          );
        }

        // Assocaited Client and Inquirer in hubspot

        // Save progress after success
        // saveProgress(i + 1);

        // return; // ❗ remove after testing
      } catch (error) {
        logger.error("Error processing record index", error);

        // Save progress to resume later
        // saveProgress(i);

        // return; // ❗ remove after testing
      }
    }
  } catch (error) {
    logger.error("Error fetching inquirer records", error);
    return;
  }
}

export { syncInquirer };
