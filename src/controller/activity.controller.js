import { logger } from "../index.js";

import {
  fetchActivityReords,
  searchCustomObjectInHubSpot,
  searchCustomObjectInHubSpotBasedonCustomeField,
} from "../service/student.loan.Hubspot.js";
import {
  buildHubSpotActivityPayload,
  buildHubSpotTaskPayload,
} from "../utils/helper.js";
import {
  searchActivityInHubSpot,
  createTaskInHubSpot,
} from "../service/student.service.js";
import { updateActivityInHubSpot } from "../service/student.service.js";
import { createActivityInHubSpot } from "../service/student.service.js";
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

/*
async function syncActivity() {
  try {

    const records = await fetchActivityReords(); // call the function 
    logger.info("Activity records", records.length);


 let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        let affiliateId = null;

        const Payloads =  buildHubSpotActivityPayload(record); // call the function 

        logger.info(" Records", record);
        logger.info("Payloads", Payloads);
        return; // todo remove after testing
        

        

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        logger.error(error);
        // saveProgress(i);
        // break; // todo remove after testing
      }
    }


  } catch (error) {
    logger.error("Error feching records", error);
    return;
  }
}
*/

// new code Activity controller

async function syncActivity() {
  try {
    // fetch activity records
    const records = await fetchActivityReords();
    logger.info(`Activity records:${JSON.stringify(records.length)}`);
    // return; // todo remove after testing

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];
        await processActivity(record);
        return;
        // Save progress after success
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing activity ", error.message);
        // Save progress to resume later
        // saveProgress(i);
        // break;  //todo remove after testing
      }
    }
  } catch (error) {
    logger.error("Error fetching activity records", error);
    return;
  }
}

async function processActivity(
  record = {
    collection_id: "423771",
    site_id: "1",
    fields_changed: "ALL",
    location: "",
    date_email_opened: null,
    email_id: null,
    subject: "",
    bcc: "",
    cc: "",
    field_from: "",
    email_to: "",
    recurrence: null,
    all_day_event: "false",
    end_time: null,
    start_time: null,
    priority: "0",
    modified_date: "2026-03-24 10:10:31",
    modified_by: "70",
    status: "10003",
    activity: "10001",
    description: "Lets get walter's loans taken care of ASAP. ",
    assigned: "70",
    created_date: "2026-03-24 10:10:31",
    created_by: "70",
    date: "2026-04-07",
  }
) {
  try {
    //  if date exists then it is task else it is note
    if (record.date) {
      return await processSingleTask(record);
    } else {
      await processSingleNote(record);
    }
  } catch (error) {
    logger.error("Error processing activity record", error.message);
  }
}
async function processSingleTask(record) {
  try {
    // Build HubSpot payload
    const payload = buildHubSpotTaskPayload(record);

    logger.info(
      `[Student Loan] Avticity Record: ${JSON.stringify(record, null, 2)}`
    );
    logger.info(
      `[Student Loan] Activity Payload: ${JSON.stringify(payload, null, 2)}`
    );

    // 🔍 Search existing activity (by collection_id or email_id)
    let upsertActivity = null;
    // upsertActivity = await searchActivityInHubSpot(
    //   record.collection_id // or record.email_id
    // );

    // if (upsertActivity) {
    //   // Activity exists → update
    //   let existingActivityId = null;
    //   existingActivityId = upsertActivity?.id;

    //   logger.info(
    //     `Activity exists with id ${JSON.stringify(
    //       existingActivityId
    //     )}, updating...`
    //   );

    //   upsertActivity = await updateActivityInHubSpot(
    //     existingActivityId,
    //     payload
    //   );

    //   logger.info(
    //     `✅ Activity updated:${JSON.stringify(upsertActivity.id, null, 2)}`
    //   );
    // } else {
    // Activity does not exist → create
    // let created = null;
    upsertActivity = await createTaskInHubSpot(payload);

    logger.info(
      `[Hubspot] Task created:${JSON.stringify(upsertActivity.id, null, 2)}`
    );
    // }

    // Find client based on linked_client field in Hubspot ->(Client)
    const hs_client = getHubspotClient();

    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpotBasedonCustomeField(
      "2-171843307",
      "collection_id",
      record.assigned
    );

    logger.info(`✅ Client found: ${JSON.stringify(client, null, 2)}`);

    if (client[0]?.id && upsertActivity?.id) {
      // ➡️ associate here

      const associate = await hs_client.associations.associate(
        "tasks",
        upsertActivity?.id,
        clientObject,
        client[0].id,
        32,
        "USER_DEFINED"
      );
      logger.info(
        `✅ Association Completed | upsertActivity Id ${
          upsertActivity?.id
        } associated with Client ${client[0]?.id}: Association ${JSON.stringify(
          associate
        )}`
      );
    }
  } catch (error) {
    logger.error("Error processing activity record", error);
  }
}

async function processSingleNote(record) {
  try {
    // Build HubSpot payload
    const payload = buildHubSpotActivityPayload(record);

    logger.info(`Activity Record: ${JSON.stringify(record, null, 2)}`);
    logger.info(`Activity Payload: ${JSON.stringify(payload, null, 2)}`);

    // 🔍 Search existing activity (by collection_id or email_id)
    let upsertActivity = null;
    upsertActivity = await searchActivityInHubSpot(
      record.collection_id // or record.email_id
    );

    if (upsertActivity) {
      // Activity exists → update
      let existingActivityId = null;
      existingActivityId = upsertActivity?.id;

      logger.info(
        `Activity exists with id ${JSON.stringify(
          existingActivityId
        )}, updating...`
      );

      upsertActivity = await updateActivityInHubSpot(
        existingActivityId,
        payload
      );

      logger.info(
        `✅ Activity updated:${JSON.stringify(upsertActivity.id, null, 2)}`
      );
    } else {
      // Activity does not exist → create
      // let created = null;
      upsertActivity = await createActivityInHubSpot(payload);

      logger.info(
        `✅ Activity created:${JSON.stringify(upsertActivity.id, null, 2)}`
      );
    }

    // Find client based on linked_client field in Hubspot ->(Client)
    const hs_client = getHubspotClient();

    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpotBasedonCustomeField(
      "2-171843307",
      "collection_id",
      record.assigned
    );

    logger.info(`✅ Client found: ${JSON.stringify(client, null, 2)}`);

    if (client[0]?.id && upsertActivity?.id) {
      // ➡️ associate here

      const associate = await hs_client.associations.associate(
        "notes",
        upsertActivity?.id,
        clientObject,
        client[0].id,
        26,
        "USER_DEFINED"
      );
      logger.info(
        `✅ Association Completed | upsertActivity Id ${
          upsertActivity?.id
        } associated with Client ${client[0]?.id}: Association ${JSON.stringify(
          associate
        )}`
      );
    }
  } catch (error) {
    logger.error("Error processing activity record", error);
  }
}

export { syncActivity, processActivity };
