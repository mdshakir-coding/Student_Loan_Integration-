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
  buildHubSpotActivityPayloadBatch,
  buildHubSpotTaskPayloadBatch,
} from "../utils/helper.js";

import {
  searchActivityInHubSpot,
  createTaskInHubSpot,
  createActivityInHubSpot,
  updateActivityInHubSpot,
  makeBatchCall,
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
        await saveFailedCollectionId("activityCollectionId", records[i].id);
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

    logger.info(`[Hubspot] Task created:${JSON.stringify(upsertActivity)}`);
    // }

    // Find client based on linked_client field in Hubspot ->(Client)
    const hs_client = getHubspotClient();

    //  client affiliate inquirer
    const client = await searchCustomObjectInHubSpotBasedonCustomeField(
      "2-171843307",
      "collection_id",
      record.assigned
    );

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
        `[Hubspot] Association Completed | upsertActivity Id ${
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

    logger.info(`[Student Loan] Activity Record: ${JSON.stringify(record)}`);
    logger.info(`[Student Loan] Activity Payload: ${JSON.stringify(payload)}`);

    // 🔍 Search existing activity (by collection_id or email_id)
    let upsertActivity = null;
    upsertActivity = await searchActivityInHubSpot(
      record.collection_id // or record.email_id
    );

    if (upsertActivity) {
      // Activity exists → update
      let existingActivityId = null;
      existingActivityId = upsertActivity?.id;

      // logger.info(
      //   `Activity exists with id ${JSON.stringify(
      //     existingActivityId
      //   )}, updating...`
      // );

      upsertActivity = await updateActivityInHubSpot(
        existingActivityId,
        payload
      );

      logger.info(
        `[Hubspot] Activity updated:${JSON.stringify(
          upsertActivity.id,
          null,
          2
        )}`
      );
    } else {
      // Activity does not exist → create
      // let created = null;
      upsertActivity = await createActivityInHubSpot(payload);

      logger.info(
        `[Hubspot] Activity created:${JSON.stringify(
          upsertActivity.id,
          null,
          2
        )}`
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

    // logger.info(`✅ Client found: ${JSON.stringify(client, null, 2)}`);

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
        `[Hubspot] Association Completed | upsertActivity Id ${
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

//  Make batch call to hubspot for notes

async function syncActivityBatch(records) {
  try {
    const timeLabel = "Activity Records processing";
    console.time(timeLabel);
    logger.info(`Activity records received: ${records?.length || 0}`);

    if (!records || records.length === 0) return;

    // Separate tasks and notes
    const tasks = records.filter((rec) => rec && rec?.date && rec?.assigned);
    const notes = records.filter((rec) => rec && !rec?.date && rec?.assigned);

    const tasksPayload = [];
    const notesPayload = [];

    // --- CACHE TO PREVENT API RATE LIMITS ---
    const clientCache = new Map();

    async function getClientId(assignedValue) {
      if (!assignedValue) return null;
      if (clientCache.has(assignedValue)) {
        return clientCache.get(assignedValue); // Return instantly if already searched
      }

      const client = await searchCustomObjectInHubSpotBasedonCustomeField(
        "2-171843307",
        "collection_id",
        assignedValue
      );

      const clientId = client && client[0]?.id ? client[0].id : null;
      if (clientId) {
        clientCache.set(assignedValue, clientId); // Save for the next record
      }
      return clientId;
    }

    // --- Build Task Payloads ---
    for (const task of tasks) {
      try {
        const clientId = await getClientId(task.assigned);

        if (clientId) {
          const payload = buildHubSpotTaskPayloadBatch(task, clientId);
          tasksPayload.push(payload);
        }
      } catch (error) {
        logger.error(`Error creating task payload ${task.id || "unknown"}`, {
          status: error?.status,
          response: error.response?.data,
          method: error?.config?.method,
          url: error?.config?.url,
          message: error.message,
        });
      }
    }

    // --- Build Note Payloads ---
    for (const note of notes) {
      try {
        const clientId = await getClientId(note.assigned);

        if (clientId) {
          const payload = buildHubSpotActivityPayloadBatch(note, clientId);
          notesPayload.push(payload);
        }
      } catch (error) {
        logger.error(`Error creating note payload ${note.id || "unknown"}`, {
          status: error?.status,
          response: error.response?.data,
          method: error?.config?.method,
          url: error?.config?.url,
          message: error.message,
        });
      }
    }

    // --- Execute Batch Calls Directly (Max 100 Guaranteed) ---
    if (tasksPayload.length > 0) {
      logger.info(`Sending batch of ${tasksPayload.length} tasks to HubSpot`);
      await makeBatchCall(tasksPayload, "tasks");
    }

    if (notesPayload.length > 0) {
      logger.info(`Sending batch of ${notesPayload.length} notes to HubSpot`);
      await makeBatchCall(notesPayload, "notes");
    }

    console.timeEnd(timeLabel);
  } catch (error) {
    logger.error("Error in syncActivityBatch execution", {
      status: error?.status,
      response: error.response?.data,
      method: error?.config?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

// Helper function for the 100-limit rule
function chunkArray(array, size = 100) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

async function syncActivityBatchwithChunks(records) {
  try {
    if (!records || records.length === 0) return;

    // Separate tasks and notes
    const tasks = records.filter((rec) => rec && rec?.date && rec?.assigned);
    const notes = records.filter((rec) => rec && !rec?.date && rec?.assigned);

    const tasksPayload = [];
    const notesPayload = [];

    // --- CACHE TO PREVENT API RATE LIMITS ---
    const clientCache = new Map();

    async function getClientId(assignedValue) {
      if (!assignedValue) return null;
      if (clientCache.has(assignedValue)) {
        return clientCache.get(assignedValue); // Return instantly if already searched
      }

      const client = await searchCustomObjectInHubSpotBasedonCustomeField(
        "2-171843307",
        "collection_id",
        assignedValue
      );

      const clientId = client && client[0]?.id ? client[0].id : null;
      if (clientId) {
        clientCache.set(assignedValue, clientId); // Save for the next record
      }
      return clientId;
    }

    // --- Build Task Payloads ---
    for (const task of tasks) {
      try {
        const clientId = await getClientId(task.assigned);

        if (clientId) {
          const payload = buildHubSpotTaskPayloadBatch(task, clientId);
          tasksPayload.push(payload);
        }
      } catch (error) {
        logger.error(`Error creating task payload ${task.id || "unknown"}`, {
          status: error?.status,
          response: error.response?.data,
          method: error?.config?.method, // Fixed duplicate
          url: error?.config?.url,
          message: error.message,
        });
      }
    }

    // --- Build Note Payloads ---
    for (const note of notes) {
      try {
        const clientId = await getClientId(note.assigned);

        if (clientId) {
          const payload = buildHubSpotActivityPayloadBatch(note, clientId);
          notesPayload.push(payload);
        }
      } catch (error) {
        logger.error(`Error creating note payload ${note.id || "unknown"}`, {
          status: error?.status,
          response: error.response?.data,
          method: error?.config?.method, // Fixed duplicate
          url: error?.config?.url,
          message: error.message,
        });
      }
    }

    // --- Execute Batch Calls in Chunks of 100 ---
    if (tasksPayload.length > 0) {
      const taskChunks = chunkArray(tasksPayload, 100);
      for (const [index, chunk] of taskChunks.entries()) {
        logger.info(`Sending Task Batch ${index + 1} of ${taskChunks.length}`);
        await makeBatchCall(chunk, "tasks");
      }
    }

    if (notesPayload.length > 0) {
      const noteChunks = chunkArray(notesPayload, 100);
      for (const [index, chunk] of noteChunks.entries()) {
        logger.info(`Sending Note Batch ${index + 1} of ${noteChunks.length}`);
        await makeBatchCall(chunk, "notes");
      }
    }

    console.timeEnd(timeLabel);
  } catch (error) {
    logger.error("Error fetching activity records", {
      status: error?.status,
      response: error.response?.data,
      method: error?.config?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export {
  syncActivity,
  processActivity,
  syncActivityBatch,
  syncActivityBatchwithChunks,
};
