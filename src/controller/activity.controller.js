import { logger } from "../index.js";
import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/activityProgress.js";

import { searchCustomObjectInHubSpotBasedonCustomeField } from "../services/studentLoan.service.js";
import {
  buildHubSpotActivityPayload,
  buildHubSpotTaskPayload,
} from "../utils/helper.js";

import {
  searchActivityInHubSpot,
  createTaskInHubSpot,
  createActivityInHubSpot,
  updateActivityInHubSpot,
} from "../services/hubspot.service.js";

import { getHubspotClient } from "../configs/hubspot.config.js";

const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

async function syncActivity(records) {
  try {
    const timeLabel = "Activity Records processing";
    console.time(timeLabel);
    logger.info(`Activity records:${JSON.stringify(records.length)}`);

    let startIndex = await loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];
        //  if date exists then it is task else it is note
        if (record.date) {
          return await processSingleTask(record);
        } else {
          await processSingleNote(record);
        }
      } catch (error) {
        logger.error("Error processing activity ", {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
      } finally {
        await saveProgress(i + 1);
      }
    }

    console.timeEnd(timeLabel);
  } catch (error) {
    logger.error("Error fetching activity records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

// async function processActivity(record) {
//   try {
//     //  if date exists then it is task else it is note
//     if (record.date) {
//       return await processSingleTask(record);
//     } else {
//       await processSingleNote(record);
//     }
//   } catch (error) {
//     logger.error("Error processing activity record", {
//       status: error?.status,
//       response: error.response?.data,
//       method: error?.method,
//       url: error?.config?.url,
//       message: error.message,
//       stack: error?.stack || error,
//     });
//   } finally {
//     await saveProgress(i + 1);
//   }
// }
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
    logger.error("Error processing activity record", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
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
    logger.error("Error processing activity record", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncActivity, processActivity };
