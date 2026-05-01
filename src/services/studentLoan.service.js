import axios from "axios";
import { cleanProps } from "../utils/helper.js";
import { logger } from "../index.js";
import { syncClients } from "../controller/clients.controller.js";
import { syncOrders } from "../controller/orders.controller.js";
import { syncInquirer } from "../controller/inquirer.controller.js";

import { syncAffiliate } from "../controller/affiliate.controller.js";

import { syncInvoices } from "../controller/invoices.controller.js";

// import { syncActivity } from "../controllers/activity.controller.js";

import { syncEmails } from "../controller/emails.controller.js";

import { hubspotExecutor, studentLoan } from "../utils/executors.js";

// Fecth Inquirer Records with pagination

async function fetchInquirerRecords(perPage = 100) {
  let page = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10103&Offset=${page}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchInquirerRecords` }
      );
      const records = response.data?.Records || [];

      logger.info(
        `[Student Loan] Inquirer records: ${page}/${allRecords.length}, processed`
      );
      allRecords.push(...records);

      // Sync current before fetching new records to avoid large memory consumption
      await syncInquirer(allRecords);

      // Stop if less than perPage records are returned => last page
      if (records.length < perPage) {
        break;
      }

      page += perPage; // Increment offset for next page
    }

    logger.info(`Total inquirer records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching student loan records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords; // return what was fetched before error
  }
}

// fetch Affiliated Rescords with Add pagenation logic

async function fetchAffiliateRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10156&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              // Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchAffiliateRecords` }
      );

      const records = response.data?.Records || [];

      logger.info(
        `[Student Loan] Affiliate records: ${offset}/${allRecords.length}, processed`
      );

      allRecords.push(...records);

      await syncAffiliate(allRecords);

      // stop when last batch reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total affiliate records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching records (10156):", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// fetch Activity Records

// Add pagenation logic here

async function fetchActivityReords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=50&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchActivityReords` }
      );

      const records = response.data?.Records || [];

      logger.info(
        `[Student Loan] Activity records: ${offset}/${allRecords.length}, processed`
      );

      allRecords.push(...records);
      // await syncActivity(allRecords, page);

      // stop if last page
      if (records.length < perPage) {
        break;
      }

      offset += perPage; // next batch
    }

    logger.info(`Total activity records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching activity records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// Fetch Invoices Records

// Add pagenation logic

async function fetchInvoicesRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10151&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchInvoicesRecords` }
      );

      const records = response.data?.Records || [];

      logger.info(
        `[Student Loan] Invoice records: ${offset}/${allRecords.length}, processed`
      );

      allRecords.push(...records);

      await syncInvoices(allRecords);

      // Stop when last batch is reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total invoice records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching invoice records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// fetch Clients Records

// Add pagenation logic here

async function fetchClientsRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10116&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchClientsRecords` }
      );

      const records = response.data?.Records || [];

      allRecords.push(...records);
      // return allRecords; //todo remove after testing
      logger.info(
        `[Student Loan] Client records: ${offset}/${allRecords.length}, processed`
      );

      await syncClients(allRecords, offset);

      // allRecords = [];

      // stop when last batch reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total client records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching client records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// fetch Orders Records

// Add pagenation logic

async function fetchOrdersRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10130&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchOrdersRecords` }
      );

      const records = response.data?.Records || [];

      allRecords.push(...records);
      logger.info(
        `[Student Loan] Order records: ${offset}/${allRecords.length}, processed`
      );
      await syncOrders(allRecords);

      // stop when last batch reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total order records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching records (CollectionTypeID=10130):", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// fetch Text Messages Records

// Add pagenation logic
async function fetchTextMessagesRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10129&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { nanme: `fetchTextMessagesRecords` }
      );

      const records = response.data?.Records || [];

      logger.info(
        `Fetched offset ${offset}, text message records: ${records.length}`
      );

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // stop when last batch is reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total text message records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching text message records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return allRecords;
  }
}

// fetch Emails Records
async function fetchEmailsRecords(perPage = 100) {
  let offset = 0;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10141&Offset=${offset}&Limit=${perPage}`;

      const response = await studentLoan(
        () => {
          return axios.get(url, {
            headers: {
              Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
              Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
            },
          });
        },
        { name: `fetchEmailsRecords` }
      );

      const records = response.data?.Records || [];

      logger.info(`Fetched offset ${offset}, email records: ${records.length}`);

      allRecords.push(...records);
      await syncEmails(allRecords);

      // stop when last batch is reached
      if (records.length < perPage) {
        break;
      }

      offset += perPage;
    }

    logger.info(`Total email records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    logger.error("Error fetching email records:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

// fetch Notes Records

// Add pagenation Logic here
async function fetchClientById(clientId, properties = []) {
  if (!clientId) {
    throw new Error("clientId is required");
  }

  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/2-171843307/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot client by Id:",
      error.response?.data || error
    );
    throw error;
  }
}
// fetch InQuirer by Id
async function fetchInquirerById(inquirerId, properties = []) {
  if (!inquirerId) {
    throw new Error("inquirerId is required");
  }

  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/0-1/${inquirerId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot contact:",
      error.response?.data || error
    );
    throw error;
  }
}

// fetch Invoice by Id
async function fetchInvoiceById(invoiceId, properties = []) {
  if (!invoiceId) {
    throw new Error("invoiceId is required");
  }

  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/0-3/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot contact:",
      error.response?.data || error
    );
    throw error;
  }
}
// fetch Affiliate by Id
async function fetchAffiliateById(affiliateId, properties = []) {
  if (!affiliateId) {
    throw new Error("affiliateId is required");
  }

  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/2-171942530/${affiliateId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error(
      "Error fetching HubSpot contact:",
      error.response?.data || error
    );
    throw error;
  }
}

// async function associateObjects({
//   fromObjectType,
//   fromObjectId,
//   toObjectType,
//   toObjectId,
//   associationTypeId,
//   accessToken,
// }) {
//   if (!fromObjectType || !fromObjectId || !toObjectType || !toObjectId) {
//     throw new Error("Missing required association parameters");
//   }

//   try {
//     // 1️⃣ Resolve association type if not provided
//     let typeId = associationTypeId;

//     if (!typeId) {
//       const labelsRes = await axios.get(
//         `https://api.hubapi.com/crm/v4/associations/${fromObjectType}/${toObjectType}/labels`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (!labelsRes.data?.results?.length) {
//         throw new Error(
//           `No association types found between ${fromObjectType} and ${toObjectType}`
//         );
//       }

//       // Prefer HUBSPOT_DEFINED, fallback to first
//       const assoc =
//         labelsRes.data.results.find((r) => r.category === "HUBSPOT_DEFINED") ||
//         labelsRes.data.results[0];

//       typeId = assoc.typeId;
//     }

//     // 2️⃣ Create association
//     await axios.put(
//       `https://api.hubapi.com/crm/v4/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}/${typeId}`,
//       null,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
//         },
//       }
//     );

//     return {
//       success: true,
//       fromObjectType,
//       fromObjectId,
//       toObjectType,
//       toObjectId,
//       associationTypeId: typeId,
//     };
//   } catch (error) {
//     logger.error("HubSpot association failed", {
//       fromObjectType,
//       fromObjectId,
//       toObjectType,
//       toObjectId,
//       status: error.response?.status,
//       data: error.response?.data,
//     });

//     return null;
//   }
// }
async function associateObjects({
  fromObjectType,
  fromObjectId,
  toObjectType,
  toObjectId,
  associationTypeId, // optional
  associationLabel, // 👈 NEW (preferred)
  accessToken,
}) {
  if (!fromObjectType || !fromObjectId || !toObjectType || !toObjectId) {
    console.warn("Missing required association parameters");
    return null;
  }

  // if (!accessToken) {
  //   throw new Error("Missing HubSpot access token");
  // }

  try {
    let typeId = associationTypeId;

    // 🔍 Resolve typeId via label if provided
    if (!typeId) {
      const labelsRes = await axios.get(
        `https://api.hubapi.com/crm/v4/associations/${fromObjectType}/${toObjectType}/labels`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          },
        }
      );

      const results = labelsRes.data?.results;
      if (!results?.length) {
        throw new Error(
          `No association types found between ${fromObjectType} and ${toObjectType}`
        );
      }

      let assoc;

      // 🎯 Prefer label match if provided
      if (associationLabel) {
        assoc = results.find((r) => r.label === associationLabel);

        if (!assoc) {
          throw new Error(
            `Association label "${associationLabel}" not found between ${fromObjectType} and ${toObjectType}`
          );
        }
      } else {
        // fallback logic (safe default)
        assoc =
          results.find((r) => r.category === "HUBSPOT_DEFINED") || results[0];
      }

      typeId = assoc.typeId;
    }

    // 🔗 Create association
    await axios.put(
      `https://api.hubapi.com/crm/v4/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}/${typeId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      fromObjectType,
      fromObjectId,
      toObjectType,
      toObjectId,
      associationTypeId: typeId,
      associationLabel: associationLabel || null,
    };
  } catch (error) {
    logger.error("❌ HubSpot association failed", {
      fromObjectType,
      fromObjectId,
      toObjectType,
      toObjectId,
      associationLabel,
      status: error.response?.status,
      data: error.response?.data,
    });

    return null;
  }
}

async function searchCustomObjectInHubSpot(objectType, collectionId) {
  if (!collectionId) return null;

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "collection_id", // ✅ internal property name
            operator: "EQ",
            value: String(collectionId),
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${objectType}/search`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || null;
    return results;
  } catch (error) {
    logger.error(
      `❌ Error searching custom Object by collection_id: ${objectType}`,
      error.response?.data || error
    );
    return null;
  }
}
async function searchCustomObjectInHubSpotBasedonCustomeField(
  objectType,
  customField,
  customValue
) {
  if (!objectType || !customField || !customValue) {
    logger.warn("Missing required association parameters");
    return null;
  }

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: customField,
            operator: "EQ",
            value: String(customValue),
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${objectType}/search`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || null;
    return results;
  } catch (error) {
    logger.error(
      `❌ Error searching custom Object by collection_id: ${objectType}`,
      error.response?.data || error
    );
    return null;
  }
}

export {
  searchCustomObjectInHubSpotBasedonCustomeField,
  searchCustomObjectInHubSpot,
  associateObjects,
  fetchAffiliateById,
  fetchInvoiceById,
  fetchInquirerById,
  fetchClientById,
  fetchInquirerRecords,
  fetchAffiliateRecords,
  fetchActivityReords,
  fetchInvoicesRecords,
  fetchClientsRecords,
  fetchOrdersRecords,
  fetchTextMessagesRecords,
  fetchEmailsRecords,
};
