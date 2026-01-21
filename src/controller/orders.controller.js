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

// async function syncOrders() {
//   try {
//     const records = await fetchOrdersRecords(); // fetch all order records
//     console.log("Orders Records:", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         // Build HubSpot payload
//         const payload = buildHubspotOrderPayload(record);

//         console.log("Order Record:", record);
//         console.log("Order Payload:", payload);

//         // 🔍 Search existing order (example: by order_id or collection_id)
//         let searchResults = null;
//         searchResults = await searchOrderInHubSpot(
//           record.collection_id // or order_id
//         );

//         if (searchResults && searchResults.length > 0) {
//           // Order exists → update
//           let existingOrderId = null;
//           existingOrderId = searchResults[0].id;

//           console.log(
//             `Order exists with id ${existingOrderId}, updating...`
//           );

//           let updated = null;
//           updated = await updateOderInHubSpot(
//             existingOrderId,
//             payload
//           );

//           console.log("✅ Order updated:", updated.id);
//         } else {
//           // Order does not exist → create
//           let created = null;
//           created = await createOrderInHubSpot(payload);

//           console.log("✅ Order created:", created.id);
//         }

//         // Save progress after success
//         // saveProgress(i + 1);

//         break; // ❗ remove after testing
//       } catch (error) {
//         console.error("Error processing order index", i, error);

//         // Save progress to resume later
//         // saveProgress(i);

//         break; // ❗ remove after testing
//       }
//     }

//     console.log("📦 All Orders Processed");
//   } catch (error) {
//     console.error("Error fetching order records", error);
//     return;
//   }
// }


async function syncOrders() {
  try {
    const records = await fetchOrdersRecords();
    console.log("Orders Records:", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      const record = records[i];

      try {
        const properties = buildHubspotOrderPayload(record);

        if (!properties || Object.keys(properties).length === 0) {
          throw new Error("Payload empty after cleanProps");
        }

        console.log("Order Record:", record);
        console.log("Order Properties:", properties);

        // 🔍 Search order
        const searchResults = await searchOrderInHubSpot(
          record.collection_id
        );

        // 🔁 UPDATE
        if (searchResults?.length > 0) {
          const orderId = searchResults[0].id;

          console.log(`Order exists with id ${orderId}, updating...`);

          const updatePayload = {
            properties
          };

          console.log(
            "FINAL UPDATE PAYLOAD:",
            JSON.stringify(updatePayload, null, 2)
          );

          const updated = await updateOderInHubSpot(
            orderId,
            updatePayload
          );

          console.log("✅ Order updated:", updated?.id);
        }
        // ➕ CREATE
        else {
          console.log("Order not found, creating...");

          const createPayload = {
            properties
          };

          console.log(
            "FINAL CREATE PAYLOAD:",
            JSON.stringify(createPayload, null, 2)
          );

          const created = await createOrderInHubSpot(createPayload);

          console.log("✅ Order created:", created?.id);
        }

        // saveProgress(i + 1);
        break; // remove after testing
      } catch (err) {
        console.error(`❌ Error processing order index ${i}`, err);
        // saveProgress(i);
        break;
      }
    }

    console.log("📦 Orders sync completed");
  } catch (error) {
    console.error("❌ Error fetching orders", error);
  }
}


export { syncOrders };
