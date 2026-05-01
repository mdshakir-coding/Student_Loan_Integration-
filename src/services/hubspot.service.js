import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();
import { logger } from "../index.js";
import { hubspotExecutor, studentLoan } from "../utils/executors.js";

// Create Affiliate in Hubspot

async function createAffiliateInHubSpot(Payloads) {
  const url = "https://api.hubapi.com/crm/v3/objects/2-171942530";

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(url, Payloads, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      {
        name: `createAffiliateInHubSpot and payload ${JSON.stringify(
          Payloads
        )}`,
      }
    );

    // logger.info("✅ Affiliate created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating affiliate:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    throw error; // IMPORTANT
  }
}

// Update Function for Affiliate in hubspot

async function updateAffiliateInHubSpot(existingAffiliateId, Payloads) {
  const url = `https://api.hubapi.com/crm/v3/objects/2-171942530/${existingAffiliateId}`;

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.patch(url, Payloads, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      {
        name: `updateAffiliateInHubSpot and payload ${JSON.stringify(
          Payloads
        )}`,
      }
    );

    // logger.info("✅ Affiliate updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating affiliate:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    throw error; // IMPORTANT
  }
}

// code for search Affiliate
async function searchAffiliateByInHubspot(collectionId) {
  if (!collectionId) {
    return [];
  } else {
    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "collection_id",
              operator: "EQ",
              value: String(collectionId),
            },
          ],
        },
      ],
      limit: 1,
    };

    try {
      const response = await hubspotExecutor(
        () => {
          return axios.post(
            "https://api.hubapi.com/crm/v3/objects/2-171942530/search",
            payload,
            {
              headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
        },
        {
          name: `searchAffiliateByInHubspot and payload ${JSON.stringify(
            payload
          )}`,
        }
      );

      return response.data.results || [];
    } catch (error) {
      logger.error(
        "❌ HubSpot Affiliate Search Error:",
        JSON.stringify(error.response?.data, null, 2)
      );
      return [];
    }
  }
}

// Search Client function
async function searchClientInHubSpot(collectionId) {
  if (!collectionId) return [];

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "collection_id",
            operator: "EQ",
            value: collectionId,
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(
          "https://api.hubapi.com/crm/v3/objects/2-171843307/search",
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      },
      { name: `searchClientInHubSpot and payload ${JSON.stringify(payload)}` }
    );

    const result = response.data.results || [];
    // logger.info("✅ Client search result:", result.length);
    return result;
  } catch (error) {
    logger.error("❌ Error searching client:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return [];
  }
}

// Create function in clientx

async function createClientInHubSpot(Payloads) {
  const url = "https://api.hubapi.com/crm/v3/objects/2-171843307";

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(url, Payloads, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `createClientInHubSpot` }
    );

    // logger.info("✅ Client created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating client:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // IMPORTANT (same as affiliate)
    return {};
  }
}

// Update client function

async function updateClientInHubSpot(existingClientId, Payloads) {
  const url = `https://api.hubapi.com/crm/v3/objects/2-171843307/${existingClientId}`;

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.patch(url, Payloads, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `updateClientInHubSpot` }
    );

    // logger.info("✅ Client updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating client:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return {};
  }
}

// Search function for Invoice in hubspot
async function searchInvoiceInHubSpot(collectionId) {
  if (!collectionId) return [];

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "collection_id",
            operator: "EQ",
            value: String(collectionId),
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(
          "https://api.hubapi.com/crm/v3/objects/0-3/search",
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      },
      { name: `searchInvoiceInHubSpot` }
    );

    return response.data.results || [];
  } catch (error) {
    logger.error("❌ Error listing invoices:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });

    return [];
  }
}

// Create Invoice function in hubspot
async function createInvoiceInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/0-3";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Invoice created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating invoice:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Update Invoice function in hubspot
async function updateInvoiceInHubSpot(existingInvoiceId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/0-3/${existingInvoiceId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Invoice updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating invoice:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    throw error; // IMPORTANT
  }
}

// search Inquirer function in hubspot

// search by collection id
// async function searchInquirerInHubSpot(collectionId, email) {
//   if (!collectionId && !email) return [];

//   const payload = {
//     filterGroups: [
//       {
//         filters: [
//           {
//             propertyName: "collection_id", // ✅ internal property name
//             operator: "EQ",
//             value: String(collectionId),
//           },
//         ],
//       },
//       {
//         filters: [
//           {
//             propertyName: "email", // ✅ internal property name
//             operator: "EQ",
//             value: String(collectionId),
//           },
//         ],
//       },
//     ],
//     limit: 1,
//   };

//   try {
//     const response = await axios.post(
//       "https://api.hubapi.com/crm/v3/objects/0-1/search",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const results = response.data?.results || [];
//     // logger.info("✅ Inquirer search by collection_id:", results.length);
//     return results;
//   } catch (error) {
//     logger.error("❌ Error searching inquirer by collection_id:", {
//       status: error?.status,
//       response: error.response?.data,
//       method: error?.method,
//       url: error?.config?.url,
//       message: error.message,
//       stack: error?.stack || error,
//     });
//     return [];
//   }
// }
async function searchInquirerInHubSpot(collectionId, email) {
  if (!collectionId && !email) return [];

  const headers = {
    Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
  const searchUrl = "https://api.hubapi.com/crm/v3/objects/0-1/search";

  // 1️⃣ FIRST: Search by Email (Primary Identifier)
  if (email) {
    try {
      const emailPayload = {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: String(email),
              },
            ],
          },
        ],
        limit: 1,
      };

      const response = await axios.post(searchUrl, emailPayload, { headers });
      const results = response.data?.results || [];

      // If we found a match by email, stop here and return it
      if (results.length > 0) {
        // logger.info(`✅ Inquirer found by email: ${email}`);
        return results;
      }
    } catch (error) {
      logger.error("❌ Error searching inquirer by email:", {
        message: error.message,
        response: error.response?.data,
      });
    }
  }

  // 2️⃣ THEN: Search by Collection ID (Fallback Identifier)
  if (collectionId) {
    try {
      const collectionPayload = {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "collection_id",
                operator: "EQ",
                value: String(collectionId),
              },
            ],
          },
        ],
        limit: 1,
      };

      const response = await axios.post(searchUrl, collectionPayload, {
        headers,
      });
      const results = response.data?.results || [];

      // If we found a match by collection ID, return it
      if (results.length > 0) {
        // logger.info(`✅ Inquirer found by collection_id: ${collectionId}`);
        return results;
      }
    } catch (error) {
      logger.error("❌ Error searching inquirer by collection_id:", {
        message: error.message,
        response: error.response?.data,
      });
    }
  }

  // 3️⃣ Finally: If neither search yielded a result, return an empty array
  return [];
}
// Update Inquirer in Hubspot
async function updateInquirerInHubSpot(existingInquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/0-1/${existingInquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Inquirer updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating inquirer:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// async function updateInquirerInHubSpot(inquirerId, properties) {
//   const url = `https://api.hubapi.com/crm/v3/objects/0-1/${inquirerId}`;

//   // 🚨 Do NOT call API if nothing valid
//   if (!properties || !Object.keys(properties).length) {
//     logger.warn("⚠️ No valid properties to update in HubSpot");
//     return null;
//   }

//   try {
//     const response = await axios.patch(
//       url,
//       { properties }, // ✅ REQUIRED BY HUBSPOT
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     logger.info("✅ Inquirer updated:", response.data);
//     return response.data;

//   } catch (error) {
//     logger.error(
//       "❌ Error updating inquirer:",
//       {
//   status: error?.status,
//   response: error.response?.data,
//   method: error?.method,
//   url: error?.config?.url,
//   message: error.message,
//   stack: error?.stack || error,
// }
//     );
//     return null; // ✅ NEVER return {}
//   }
// }

// create Inquirer in Hubspot
async function createInquirerInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/0-1";

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `createInquirerInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Inquirer created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating inquirer:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return null;
  }
}

// Search oder in hubspot

async function searchOrderInHubSpot(collectionId) {
  if (!collectionId) return [];

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
    const response = await hubspotExecutor(
      () => {
        return axios.post(
          "https://api.hubapi.com/crm/v3/objects/0-5/search",
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      },
      { name: `searchOrderInHubSpot ${collectionId}` }
    );

    const results = response.data?.results || [];
    // logger.info("✅ Order search by collection_id:", results.length);
    return results;
  } catch (error) {
    logger.error("❌ Error searching order by collection_id:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return [];
  }
}

// Update order in Hubspot

async function updateOderInHubSpot(existingOrderId, Payloads) {
  const url = `https://api.hubapi.com/crm/v3/objects/0-5/${existingOrderId}`;

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.patch(url, Payloads, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `updateOderInHubSpot ${existingOrderId}` }
    );

    // logger.info("✅ Order updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating order:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return null;
  }
}

// Create Order In hubspot

async function createOrderInHubSpot(Payloads) {
  const url = "https://api.hubapi.com/crm/v3/objects/0-5";

  try {
    const response = await axios.post(url, Payloads, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Order created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating order:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Search Text Message in hubspot

// async function searchTextMessageInHubSpot(collectionId) {
//   if (!collectionId) return [];

//   const payload = {
//     filterGroups: [
//       {
//         filters: [
//           {
//             propertyName: "collection_id", // ✅ internal property name
//             operator: "EQ",
//             value: String(collectionId),
//           },
//         ],
//       },
//     ],
//     limit: 1,
//   };

//   try {
//     const response = await axios.post(
//       "https://api.hubapi.com/crm/v3/objects/notes/search",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const results = response.data?.results || [];
//     logger.info("✅ Text Message search by collection_id:", results.length);
//     return results;
//   } catch (error) {
//     logger.error(
//       "❌ Error searching text message by collection_id:",
//       {
//   status: error?.status,
//   response: error.response?.data,
//   method: error?.method,
//   url: error?.config?.url,
//   message: error.message,
//   stack: error?.stack || error,
// }
//     );
//     return [];
//   }
// }

async function searchTextMessageInHubSpot(collectionId) {
  if (!collectionId) return [];

  try {
    const response = await axios.get(
      "https://api.hubapi.com/crm/v3/objects/notes",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
        params: {
          limit: 100, // max items per request
          properties: "hs_note_body,hs_timestamp",
        },
      }
    );

    const notes = response.data.results || [];

    // Filter notes whose body contains the collectionId string
    const filteredNotes = notes.filter((note) =>
      note.properties.hs_note_body?.includes(collectionId)
    );

    logger.info(
      "✅ Text Message fallback filtered count:",
      filteredNotes.length
    );
    return filteredNotes;
  } catch (error) {
    logger.error("❌ Error fetching notes fallback:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return [];
  }
}

// Update Text Message In hubspot

async function updateTextMessageInHubSpot(existingMessageId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/notes/${existingMessageId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Text Message updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating text message:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Text Message In hubspot

async function createTextMessageInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/notes";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // logger.info("✅ Text Message created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating text message:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Email Search Function in hubspot

async function searchEmailInHubSpot(collectionId) {
  if (!collectionId) return [];

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
    const response = await hubspotExecutor(
      () => {
        return axios.post(
          "https://api.hubapi.com/crm/v3/objects/contacts/search",
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      },
      { name: `searchEmailInHubSpot ${JSON.stringify(payload)}` }
    );

    const results = response.data?.results || [];
    // logger.info("✅ Email search by collection_id:", results.length);
    return results;
  } catch (error) {
    logger.error("❌ Error searching email by collection_id:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    return [];
  }
}

// update Email In hubspot
async function updateEmailInHubSpot(existingEmailId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${existingEmailId}`;

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.patch(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `updateEmailInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Email updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating email:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Email In hubspot

async function createEmailInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/contacts";

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `createEmailInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Email created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating email:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Search Activity In hubspot

// async function searchActivityInHubSpot(collectionId) {
//   if (!collectionId) return null;

//   const payload = {
//     filterGroups: [
//       {
//         filters: [
//           {
//             propertyName: "collection_id", // ✅ internal property name
//             operator: "EQ",
//             value: String(collectionId),
//           },
//         ],
//       },
//     ],
//     limit: 1,
//   };

//   try {
//     const response = await axios.post(
//       "https://api.hubapi.com/crm/v3/objects/notes/search",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const results = response.data?.results?.[0] || null;
//     logger.info("✅ Activity search by collection_id:", results.length);

//     return results;
//   } catch (error) {
//     logger.error(
//       "❌ Error searching activity by collection_id:",
//       {
//   status: error?.status,
//   response: error.response?.data,
//   method: error?.method,
//   url: error?.config?.url,
//   message: error.message,
//   stack: error?.stack || error,
// }
//     );
//     return null;
//   }
// }

// new code search fuunction for Activity in hubspot

async function searchActivityInHubSpot(collectionId) {
  if (!collectionId) return null;

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_note_body", // only searchable-ish field
            operator: "CONTAINS_TOKEN",
            value: String(collectionId),
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await hubsptExecutor(
      () => {
        return axios.post(
          "https://api.hubapi.com/crm/v3/objects/notes/search",
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      },
      { name: `searchActivityInHubSpot ${JSON.stringify(payload)}` }
    );

    const result = response.data?.results?.[0] ?? null;

    // logger.info(
    //   "ℹ️ Activity search attempted, found:",
    //   result ? "1 note" : "no notes"
    // );

    return result;
  } catch (error) {
    logger.warn("⚠️ Activity search skipped (HubSpot limitation)");
    return null;
  }
}
async function searchTaskInHubSpot(collectionId) {
  if (!collectionId) return null;

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_task_body", // only searchable-ish field
            operator: "CONTAINS_TOKEN",
            value: String(collectionId),
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/notes/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data?.results?.[0] ?? null;

    // logger.info(
    //   "ℹ️ Activity search attempted, found:",
    //   result ? "1 note" : "no notes"
    // );

    return result;
  } catch (error) {
    logger.warn("⚠️ Activity search skipped (HubSpot limitation)");
    return null;
  }
}

// update Activity In hubspot

async function updateActivityInHubSpot(existingActivityId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/notes/${existingActivityId}`;

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.patch(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `updateActivityInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Activity updated:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error updating activity:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Activity In hubspot
async function createActivityInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/notes";

  try {
    const response = await hubspotExecutor(
      () => {
        axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { namw: `createActivityInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Activity created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating activity:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}
async function createTaskInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/tasks";

  try {
    const response = await hubspotExecutor(
      () => {
        return axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
      },
      { name: `createTaskInHubSpot ${JSON.stringify(payload)}` }
    );

    // logger.info("✅ Activity created:", response.data);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating Task:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
    // throw error; // keep commented to match your pattern
    return {};
  }
}

export {
  createTaskInHubSpot,
  createAffiliateInHubSpot,
  updateAffiliateInHubSpot,
  searchAffiliateByInHubspot,
  searchClientInHubSpot,
  createClientInHubSpot,
  updateClientInHubSpot,
  searchInvoiceInHubSpot,
  createInvoiceInHubSpot,
  updateInvoiceInHubSpot,
  updateInquirerInHubSpot,
  searchInquirerInHubSpot,
  createInquirerInHubSpot,
  searchOrderInHubSpot,
  updateOderInHubSpot,
  createOrderInHubSpot,
  searchTextMessageInHubSpot,
  createTextMessageInHubSpot,
  updateTextMessageInHubSpot,
  searchEmailInHubSpot,
  updateEmailInHubSpot,
  createEmailInHubSpot,
  searchActivityInHubSpot,
  updateActivityInHubSpot,
  createActivityInHubSpot,
};
