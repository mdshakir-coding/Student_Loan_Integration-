import axios from "axios";
import { cleanProps } from "../utils/helper.js";
import { logger } from "../index.js";

// fetch Inquirer Records
// async function fetchInquirerRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10103";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response (Records)
//   } catch (error) {
//     console.error(
//       "Error fetching student loan records:",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic

async function fetchInquirerRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10103&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // Stop if less than perPage records are returned => last page
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total inquirer records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching student loan records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// fetch Affiliated Rescords

// async function fetchAffiliateRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10156";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (10156):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic

async function fetchAffiliateRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10156&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(
        `Fetched page ${page}, affiliated records: ${records.length}`
      );

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // stop when last page reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total affiliated records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching records (10156):",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// fetch Activity Records

// async function fetchActivityReords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=50";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=50):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic here

async function fetchActivityReords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=50&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, activity records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // ⛔ stop when last page is reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total activity records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching activity records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// Fetch Invoices Records

// async function fetchInvoicesRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10151";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=10151):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic

async function fetchInvoicesRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10151&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, invoice records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // ⛔ Stop when last page is reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total invoice records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching invoice records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// fetch Clients Records

// async function fetchClientsRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10116";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=10116):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic here

async function fetchClientsRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10116&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, client records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // ⛔ stop when last page is reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total client records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching client records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// fetch Orders Records

// async function fetchOrdersRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10130";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=10130):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation logic

async function fetchOrdersRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10130&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, order records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // stop when last page reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total order records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching records (CollectionTypeID=10130):",
      error.response?.data || error.message
    );
    return allRecords;
  }
}

// fetch Text Messages Records

// async function fetchTextMessagesRecrds() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10129";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=10129):",
//       error.response?.data || error.message
//     );
//     return{};
//   }
// }

// Add pagenation logic

async function fetchTextMessagesRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10129&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(
        `Fetched page ${page}, text message records: ${records.length}`
      );

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // ⛔ stop when last page is reached (same logic)
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total text message records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching text message records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

// fetch Emails Records

// async function fetchEmailsRecords() {
//   const url =
//     "https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10141";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
//         Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
//       },
//     });

//     return response.data.Records; // JSON response
//   } catch (error) {
//     console.error(
//       "Error fetching records (CollectionTypeID=10141):",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// Add pagenation Logic here

async function fetchEmailsRecords(perPage = 100) {
  let page = 1;
  let allRecords = [];

  try {
    while (true) {
      const url = `https://studentloantutor.ivinex.com/API/Records.php?CollectionTypeID=10141&Page=${page}&Limit=${perPage}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${process.env.IVINEX_API_KEY}`,
          Cookie: "PHPSESSID=ma52q48rkj4splq1qq4anatq4e",
        },
      });

      const records = response.data?.Records || [];

      console.log(`Fetched page ${page}, email records: ${records.length}`);

      allRecords.push(...records);
      return allRecords; //todo remove after testing

      // ⛔ stop when last page is reached
      if (records.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`Total email records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error(
      "Error fetching email records:",
      error.response?.data || error.message
    );
    return allRecords; // return what was fetched before error
  }
}

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
    console.error(
      "Error fetching HubSpot client by Id:",
      error.response?.data || error
    );
    throw error;
  }
}
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
    console.error(
      "Error fetching HubSpot contact:",
      error.response?.data || error
    );
    throw error;
  }
}
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
    console.error(
      "Error fetching HubSpot contact:",
      error.response?.data || error
    );
    throw error;
  }
}
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
    console.error(
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
//     console.error("HubSpot association failed", {
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
    console.error("❌ HubSpot association failed", {
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
    console.error(
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
    console.error(
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
