import { fetchInvoicesRecords } from "../service/student.loan.Hubspot.js";
import {buildHubSpotInvoicePayload} from "../utils/helper.js";
import{searchInvoiceInHubSpot} from "../service/student.service.js";
import{createInvoiceInHubSpot} from "../service/student.service.js";
import{updateInvoiceInHubSpot} from "../service/student.service.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
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

// async function syncInvoices() {
//   try {
//     const records = await fetchInvoicesRecords();
//     console.log("Invoices records", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         let inquirerId = null;

//         const Payloads = buildHubSpotInvoicePayload(record); // call the function

//         console.log(" Records", record);
//         console.log("Payloads", Payloads);
//         return; // todo remove after testing
//         // await createInquirerInHubSpot(Payloads);

//         // Save progress after successful processing
//         // saveProgress(i + 1);
//       } catch (error) {
//         console.error(error);
//         // saveProgress(i);
//         // break; // todo remove after testing
//       }
//     }
//     console.log(" All Invoices Processed");
//   } catch (error) {
//     console.error("Error feching records", error);
//     return;
//   }
// }


// New code Client Invoices 


async function syncInvoices() {
  try {
    const records = await fetchInvoicesRecords(); // fetch all invoice records
    console.log("Invoices Records:", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildHubSpotInvoicePayload(record);

        console.log("Record:", record);
        console.log("Payload:", payload);

        // 🔍 Search existing invoice using collection_id
        const searchResults = await searchInvoiceInHubSpot(
          record.collection_id
        );

        if (searchResults && searchResults.length > 0) {
          // Invoice exists → Update
          const existingInvoiceId = searchResults[0].id;
          console.log(
            `Invoice exists with id ${existingInvoiceId}, updating...`
          );

          const updated = await updateInvoiceInHubSpot(
            existingInvoiceId,
            payload
          );

          console.log("✅ Invoice updated:", updated.id);
        } else {
          // Invoice does not exist → Create
          const created = await createInvoiceInHubSpot(payload);
          console.log("✅ Invoice created:", created.id);
        }

        break; // 🔥 remove after testing

        // saveProgress(i + 1);

      } catch (error) {
        console.error("Error processing invoice index", i, error);
        break; // 🔥 remove after testing
        // saveProgress(i);
      }
    }

    console.log("🎄 All Invoices Processed");
  } catch (error) {
    console.error("Error fetching invoice records", error);
    return;
  }
}


export { syncInvoices };
