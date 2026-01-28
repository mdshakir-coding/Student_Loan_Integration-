import { fetchOrdersRecords } from "../service/student.loan.Hubspot.js";
import{buildHubspotOrderPayload} from "../utils/helper.js"
import{searchOrderInHubSpot} from "../service/student.service.js";
import{updateOderInHubSpot} from "../service/student.service.js";
import{createOrderInHubSpot} from "../service/student.service.js";

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
/*
async function syncOrders() {
  try {
    const response = await fetchOrdersRecords();
    console.log("Orders response", response.length);
  } catch (error) {
    console.error("Error feching records", error);
    return;
  }
}
export { syncOrders };

*/


// New Oorder controller 

async function syncOrders() {
  try {
    const records = await fetchOrdersRecords(); // fetch all order records
    console.log("Orders Records", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build payload
        const Payloads = buildHubspotOrderPayload(record);

        console.log("Record:", record);
        console.log("Payload:", Payloads);

        // First, search existing order by collection_id
        const searchResults = await searchOrderInHubSpot(record.collection_id);

        if (searchResults && searchResults.length > 0) {
          // Order exists, update it
          const existingOrderId = searchResults[0].id;
          console.log(`Order exists with id ${existingOrderId}, updating...`);

          const updated = await updateOderInHubSpot(existingOrderId, Payloads);
          console.log("✅ Order updated:", updated.id);

        } else {
          // Order does not exist, create new
          const created = await createOrderInHubSpot(Payloads);
          console.log("✅ Order created:", created.id);
        }
        break; // todo remove after testing

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        console.error("Error processing record index", i, error);
        break; // todo remove after testing
        // Save progress here to resume later if needed
        // saveProgress(i);
      }
    }

    console.log("📦 All Orders Processed");
  } catch (error) {
    console.error("Error fetching order records", error);
    return;
  }
}


export { syncOrders };
