import axios from "axios";
import dotenv from "dotenv";
dotenv.config();



// Create Affiliate in Hubspot

async function createAffiliateInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/2-171942530";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Affiliate created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating affiliate:",
      error.response?.data || error.message
    );
    throw error; // IMPORTANT
  }
}

// Update Function for Affiliate in hubspot


async function updateAffiliateInHubSpot(affiliateId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/2-171942530/${affiliateId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }); 

    console.log("✅ Affiliate updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating affiliate:",
      error.response?.data || error.message
    );
    throw error; // IMPORTANT
  }
}

// Create a search function for Affiliate in hubspot


// async function searchAffiliateByInHubspot(firstName) {
//   const url = "https://api.hubapi.com/crm/v3/objects/2-171942530/search";

//   const payload = {
//     filterGroups: [
//       {
//         filters: [
//           {
//             propertyName: "firstname",
//             operator: "EQ",
//             value: firstName,
//           },
//         ],
//       },
//     ],
//     properties: ["firstname", "lastname", "phone"], // fields to return
//     limit: 10,
//     after: 0,
//   };

//   try {
//     const response = await axios.post(url, payload, {
//       headers: {
//         Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("✅ Search results:", response.data.results);
//     return response.data.results;
//   } catch (error) {
//     console.error(
//       "❌ Error searching affiliates by first name:",
//       error.response?.data || error.message
//     );
//     return {};
//   }
// }

// new code for search Affiliate
async function searchAffiliateByInHubspot(firstName) {
  if (!firstName) return [];

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "first_name", // EXACT internal name
            operator: "EQ",
            value: String(firstName),
          },
        ],
      },
    ],
    limit: 1,
  };

  const response = await axios.post(
    "https://api.hubapi.com/crm/v3/objects/2-171942530/search",
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.results || [];
}








// Create Activity in Hubsopt 


async function createActivityInHubSpot(data) {
  const payload = buildHubSpotActivityPayload(data);

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/activities",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Activity created:", response.data.id);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating activity:",
      error.response?.data || error.message
    );
    return {};
  }
}

// Search Client function
async function searchClientInHubSpot(Email) {
  if (!Email) return [];
  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email_1",
            operator: "EQ",
            value: Email,
          }
        ]
      }
    ],
    limit: 1
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/2-171843307/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.results || [];
    console.log("✅ Client search result:", result.length);
    return result;
  } catch (error) {
    console.error(
      "❌ Error searching client:",
      error.response?.data || error.message
    );
    return [];
  }
}
// new code 

// async function searchClientInHubSpot(email) {
//   if (!email) return [];

//   const searchableFields = ["email_1", "email", "hs_email"];

//   for (const field of searchableFields) {
//     try {
//       const payload = {
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: field,
//                 operator: "EQ",
//                 value: String(email).trim(),
//               },
//             ],
//           },
//         ],
//         limit: 1,
//       };

//       const response = await axios.post(
//         "https://api.hubapi.com/crm/v3/objects/2-171945144/search",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.results?.length) {
//         console.log(`✅ Client found using ${field}`);
//         return response.data.results;
//       }
//     } catch {
//       // silently try next property
//     }
//   }

//   console.warn("⚠️ Client not found using any email field");
//   return [];
// }



// Create function in client

async function createClientInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/2-171843307";
  

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Client created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating client:",
      error.response?.data || error
    );
    // throw error; // IMPORTANT (same as affiliate)
    return {};
  }
}


// Update client function 

async function updateClientInHubSpot(clientId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/2-171843307/${clientId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Client updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating client:",
      error.response?.data || error.message
    );
    throw error; // IMPORTANT
  }
}

// Search function for Invoice in hubspot
async function searchInvoiceInHubSpot(contractorInvoice) {
  if (!contractorInvoice) return [];

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "contractor_invoice", // EXACT internal name
            operator: "EQ",
            value: String(contractorInvoice),
          },
        ],
      },
    ],
    limit: 1,
  };

  const response = await axios.post(
    "https://api.hubapi.com/crm/v3/objects/2-171945144/search",
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.results || [];
}

// Create Invoice function in hubspot
async function createInvoiceInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/2-171945144";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Invoice created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating invoice:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}


// Update Invoice function in hubspot
async function updateInvoiceInHubSpot(invoiceId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/2-171945144/${invoiceId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Invoice updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating invoice:",
      error.response?.data || error.message
    );
    throw error; // IMPORTANT
  }
}

// search Inquirer function in hubspot
async function searchInquirerInHubSpot(email) {
  if (!email) return [];

  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email", // EXACT internal name
            operator: "EQ",
            value: email,
          },
        ],
      },
    ],
    limit: 1,
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/0-1/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.results || [];
    console.log("✅ Inquirer search result:", result.length);
    return result;
  } catch (error) {
    console.error(
      "❌ Error searching inquirer:",
      error.response?.data || error.message
    );
    return [];
  }
}
// Update Inquirer in Hubspot
async function updateInquirerInHubSpot(inquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/0-1/${inquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Inquirer updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating inquirer:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// create Inquirer in Hubspot
async function createInquirerInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/0-1";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Inquirer created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating inquirer:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}




export {createAffiliateInHubSpot,
  createActivityInHubSpot,updateAffiliateInHubSpot,
  searchAffiliateByInHubspot,searchClientInHubSpot,
  createClientInHubSpot,updateClientInHubSpot,searchInvoiceInHubSpot,createInvoiceInHubSpot,
  updateInvoiceInHubSpot,
  updateInquirerInHubSpot,searchInquirerInHubSpot,createInquirerInHubSpot};