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

        await processInvoice(record);

        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing invoice index", error);
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

async function processInvoice(
  record = {
            "collection_id": "453",
            "site_id": "1",
            "fields_changed": "0,0",
            "dont_use_setter_if_25_": "0",
            "hours_spent": "0.00",
            "created_by": "46",
            "project_description": "",
            "amount_of_expense_receip": "0.00",
            "expense_description": "",
            "review_bonuses__processi": "13199",
            "marketing_bonuses": "13204",
            "advanced_planning_activit": "0",
            "affiliate_bonus": "13213",
            "related_client": "0",
            "no_sale_bonus_to_setter_": "0",
            "hourly_rate": "0.00",
            "setter_name": "0",
            "sale_financing___recurri": "0",
            "special_details": "",
            "amount_charged_today": "0.00",
            "commission_": "1",
            "sales_commission": "1",
            "clients_tutor__only_sel": "0",
            "related_affiliate": "0",
            "additional_work_completed": "0",
            "clients_tutor__only_sel1": "0",
            "payment_type": "13175",
            "date_reconciled": null,
            "related_inquirer": "16099",
            "related_client_processin": "0",
            "special_notes": "",
            "related_client_recertifc": "0",
            "aar_sale_amount": "13170",
            "payment_arrangementtrade": "",
            "modified_date": "2020-08-31 16:35:23",
            "modified_by": "46",
            "tutor_sale_amount": "13191",
            "payment_arrangement": "13193",
            "dont_use__setter_if_50_": "44",
            "special_arrangements_deta": "$1200 REHAB",
            "created_date": "2020-08-31 16:34:19",
            "date_of_activity": "2020-08-31",
            "contractor_name": "46",
            "sales_category_report_cc": "0",
            "invoice_category": "13181",
            "total_sale_amount": "0.00",
            "total_invoice_amount": "150.00",
            "first_name": "",
            "last_name": "",
            "aar_activity_commission": "13169",
            "processing_activity": "13194",
            "clients_tutor__only_sel0": "0"
        },
) {
  try {
    logger.info(`Invoices Record: ${JSON.stringify(record, null, 2)}`);

    let invoice_record_id = null;

    // Build HubSpot payload
    const payload = buildHubSpotInvoicePayload(record);

    logger.info(`Invoices Payload : ${JSON.stringify(payload, null, 2)}`);

    // 🔍 Search existing invoice using collection_id
    const searchResults = await searchInvoiceInHubSpot(record.collection_id);

    if (searchResults && searchResults.length > 0) {
      // Invoice exists → Update
      const existingInvoiceId = searchResults[0].id;
      logger.info(`Invoice exists with id ${existingInvoiceId}, updating...`);

      const updated = await updateInvoiceInHubSpot(existingInvoiceId, payload);

      invoice_record_id = updated.id;

      logger.info("✅ Invoice updated:", updated.id);
    } else {
      // Invoice does not exist → Create
      const created = await createInvoiceInHubSpot(payload);
      invoice_record_id = created.id;

      logger.info("✅ Invoice created:", $(created.id) );
      // logger.info(`✅ Invoice created: ${JSON.stringify(created, null, 2)} id: ${created.id}`);

    }
    const hs_client = getHubspotClient();
    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.related_client,
    );
    const affiliate = await searchCustomObjectInHubSpot(
      "2-171942530",
      record.related_affiliate,
    );
    const inquirer = await searchCustomObjectInHubSpot(
      "0-1",
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
        "USER_DEFINED",
      
      );
      logger.info(
        `✅ Invoice ${invoice_record_id} associated with Client ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`,
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
        "USER_DEFINED",
      );
      logger.info(
        `✅ Invoice ${invoice_record_id} associated with affiliate ${
          affiliate[0]?.id
        }: Association ${JSON.stringify(associate)}`,
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
        inquirer[0]?.id,
        invoiceObject,
        invoice_record_id,
        4,
        "HUBSPOT_DEFINED",
      );

      logger.info(
        `✅ Invoice ${invoice_record_id} associated with inquirer ${
          inquirer[0]?.id
        }: Association ${JSON.stringify(associate)}`,
      );
    }
  } catch (error) {
    logger.error("Error processing invoice record", error);
  }
}

export { syncInvoices, processInvoice };
