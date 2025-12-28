import {fetchActivityReords} from "../service/student.loan.Hubspot.js";
import {createActivityInHubSpot} from "../service/student.service.js";
import{buildHubSpotActivityPayload} from "../utils/helper.js";








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


async function syncActivity() {
  try {

    const records = await fetchActivityReords(); // call the function 
    console.log("Activity records", records.length);


 let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        let affiliateId = null;

        const Payloads = buildHubSpotActivityPayload(record); // call the function 

        console.log(" Records", record);
        console.log("Payloads", Payloads);
        return; // todo remove after testing
        // await createInquirerInHubSpot(Payloads);

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        console.error(error);
        // saveProgress(i);
        // break; // todo remove after testing
      }
    }


  } catch (error) {
    console.error("Error feching records", error);
    return;
  }
}

export { syncActivity };
