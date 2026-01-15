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
    console.log("Orders Records:", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build HubSpot payload
        const payload = buildHubspotOrderPayload(record);

        console.log("Order Record:", record);
        console.log("Order Payload:", payload);

        // 🔍 Search existing order (example: by order_id or collection_id)
        let searchResults = null;
        searchResults = await searchOrderInHubSpot(
          record.collection_id // or order_id
        );

        if (searchResults && searchResults.length > 0) {
          // Order exists → update
          let existingOrderId = null;
          existingOrderId = searchResults[0].id;

          console.log(
            `Order exists with id ${existingOrderId}, updating...`
          );

          let updated = null;
          updated = await updateOderInHubSpot(
            existingOrderId,
            payload
          );

          console.log("✅ Order updated:", updated.id);
        } else {
          // Order does not exist → create
          let created = null;
          created = await createOrderInHubSpot(payload);

          console.log("✅ Order created:", created.id);
        }

        // Save progress after success
        // saveProgress(i + 1);

        break; // ❗ remove after testing
      } catch (error) {
        console.error("Error processing order index", i, error);

        // Save progress to resume later
        // saveProgress(i);

        break; // ❗ remove after testing
      }
    }

    console.log("📦 All Orders Processed");
  } catch (error) {
    console.error("Error fetching order records", error);
    return;
  }
}

export { syncOrders };
