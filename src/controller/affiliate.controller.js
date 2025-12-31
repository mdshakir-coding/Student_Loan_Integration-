import { fetchAffiliateRecords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotAffiliatePayload } from "../utils/helper.js";
import { createAffiliateInHubSpot } from "../service/student.service.js";
import {updateAffiliateInHubSpot} from "../service/student.service.js";
import {searchAffiliateByInHubspot} from "../service/student.service.js";

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

// async function syncAffiliate() {
//   try {
//     const records = await fetchAffiliateRecords(); // call the function for All Affiliate Records  synced
//     console.log("Affiliate Records", records.length);

//     // if (records.length === 0) {
//     //   console.log("🎄 All Affiliated Processed");
//     //   return;
//     // }

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         let affiliateId = null;

//         const Payloads = buildHubSpotAffiliatePayload(record); // call the function for payload 

//         console.log(" Records", record);
//         console.log("Payloads", Payloads);
//         // return; // todo remove after testing

//         // await createAffiliateInHubSpot(Payloads);

//         // create Affiliate in hubspot
//         const create = await createAffiliateInHubSpot(Payloads);
//         console.log("✅ Affiliate created", affiliateId);
//         affiliateId = create?.id || null;
        

//         // Save progress after successful processing
//         // saveProgress(i + 1);
//       } catch (error) {
//         console.error(error);
//         // saveProgress(i);
//         break; // todo remove after testing
//       }
//     }

//     console.log("🎄 All Affiliated Processed");
//   } catch (error) {
//     console.error("Error Fecting Inquirer Records", error);
//     return;
//   }
// }

async function syncAffiliate() {
  try {
    const records = await fetchAffiliateRecords(); // fetch all affiliate records
    console.log("Affiliate Records", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i]; 

        // Build payload
        const Payloads = buildHubSpotAffiliatePayload(record);

        console.log("Record:", record);
        console.log("Payload:", Payloads);

        // First, search existing affiliate by first and last name
        const searchResults = await searchAffiliateByInHubspot(
          record.first_name,
          
        );

        if (searchResults && searchResults.length > 0) {
          // Affiliate exists, update it
          const existingAffiliateId = searchResults[0].id;
          console.log(`Affiliate exists with id ${existingAffiliateId}, updating...`);

          const updated = await updateAffiliateInHubSpot(existingAffiliateId, Payloads);
          console.log("✅ Affiliate updated:", updated.id);
          

        } else {
          // Affiliate does not exist, create new
          const created = await createAffiliateInHubSpot(Payloads);
          console.log("✅ Affiliate created:", created.id);
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

    console.log("🎄 All Affiliates Processed");
  } catch (error) {
    console.error("Error fetching affiliate records", error);
     return;
  }
}






export { syncAffiliate };
