import { fetchClientsRecords } from "../service/student.loan.Hubspot.js";
import{buildHubSpotClientPayload} from "../utils/helper.js";
import { searchClientInHubSpot } from "../service/student.service.js";
import {createClientInHubSpot} from "../service/student.service.js";
import { updateClientInHubSpot } from "../service/student.service.js";



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

// async function syncClients() {
//   try {
//     const records = await fetchClientsRecords(); // call the function
//     console.log("Clients records", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         let clientsId = null;

//         const Payloads = buildHubSpotClientPayload(record); // call the function

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

//     console.log("🎄 All Clients Processed");
//   } catch (error) {
//     console.error("Error feching records", error);
//     return;
//   }
// }


// New code Client Function

async function syncClients() {
  try {
    const records = await fetchClientsRecords(); // fetch all client records
    console.log("Clients Records", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        // Build payload
        const Payloads = buildHubSpotClientPayload(record);

        console.log("Record:", record);
        console.log("Payload:", Payloads);

        // 🔍 Search existing client (example: by email)
        const searchResults = await searchClientInHubSpot(
          record.email
        );

        if (searchResults && searchResults.length > 0) {
          // Client exists → Update
          const existingClientId = searchResults[0].id;
          console.log(`Client exists with id ${existingClientId}, updating...`);

          const updated = await updateClientInHubSpot(
            existingClientId,
            Payloads
          );

          console.log("✅ Client updated:", updated.id);
        } else {
          // Client does not exist → Create
          const created = await createClientInHubSpot(Payloads);
          console.log("✅ Client created:", created.id);
        }

        break; // 🔥 remove after testing

        // Save progress after successful processing
        // saveProgress(i + 1);

      } catch (error) {
        console.error("Error processing record index", i, error);
        break; // 🔥 remove after testing

        // Save progress if needed
        // saveProgress(i);
      }
    }

    console.log("🎄 All Clients Processed");
  } catch (error) {
    console.error("Error fetching client records", error);
    return;
  }
}





export { syncClients };
