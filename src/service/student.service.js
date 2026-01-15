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
    } catch (error) {
      console.error(
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
          }
        ]
      }
    ],
    limit: 1
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/2-171945144/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error(
      "❌ Error listing invoices:",
      error.response?.data || error
    );
   
    return [];
  }
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

// search by collection id
async function searchInquirerInHubSpot(collectionId) {
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
      "https://api.hubapi.com/crm/v3/objects/0-1/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || [];
    console.log("✅ Inquirer search by collection_id:", results.length);
    return results;
  } catch (error) {
    console.error(
      "❌ Error searching inquirer by collection_id:",
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


// async function updateInquirerInHubSpot(inquirerId, properties) {
//   const url = `https://api.hubapi.com/crm/v3/objects/0-1/${inquirerId}`;

//   // 🚨 Do NOT call API if nothing valid
//   if (!properties || !Object.keys(properties).length) {
//     console.warn("⚠️ No valid properties to update in HubSpot");
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

//     console.log("✅ Inquirer updated:", response.data);
//     return response.data;

//   } catch (error) {
//     console.error(
//       "❌ Error updating inquirer:",
//       error.response?.data || error.message
//     );
//     return null; // ✅ NEVER return {}
//   }
// }


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
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/0-123/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || [];
    console.log("✅ Order search by collection_id:", results.length);
    return results;
  } catch (error) {
    console.error(
      "❌ Error searching order by collection_id:",
      error.response?.data || error.message
    );
    return [];
  }
}

// Update order in Hubspot

async function updateOderInHubSpot(inquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/0-123/${inquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Order updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating order:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Order In hubspot

async function createOrderInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/0-123";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Order created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating order:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}


// Search Text Message in hubspot

async function searchTextMessageInHubSpot(collectionId) {
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
      "https://api.hubapi.com/crm/v3/objects/{Number}/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || [];
    console.log("✅ Text Message search by collection_id:", results.length);
    return results;
  } catch (error) {
    console.error(
      "❌ Error searching text message by collection_id:",
      error.response?.data || error.message
    );
    return [];
  }
}

// Update Text Message In hubspot

async function updateTextMessageInHubSpot(inquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/{Number}/${inquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Text Message updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating text message:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Text Message In hubspot

async function createTextMessageInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/{Number}";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Text Message created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating text message:",
      error.response?.data || error
    );
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
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/{Number}/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || [];
    console.log("✅ Email search by collection_id:", results.length);
    return results;
  } catch (error) {
    console.error(
      "❌ Error searching email by collection_id:",
      error.response?.data || error.message
    );
    return [];
  }
}

// update Email In hubspot
async function updateEmailInHubSpot(inquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/{Number}/${inquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating email:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}


// Create Email In hubspot

async function createEmailInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/{Number}";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating email:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Search Activity In hubspot

async function searchActivityInHubSpot(collectionId) {
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
      "https://api.hubapi.com/crm/v3/objects/{Number}/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.results || [];
    console.log("✅ Activity search by collection_id:", results.length);
    return results;
  } catch (error) {
    console.error(
      "❌ Error searching activity by collection_id:",
      error.response?.data || error.message
    );
    return [];
  }
}

// update Activity In hubspot

async function updateActivityInHubSpot(inquirerId, payload) {
  const url = `https://api.hubapi.com/crm/v3/objects/{Number}/${inquirerId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Activity updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating activity:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

// Create Activity In hubspot
async function createActivityInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/{Number}";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Activity created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating activity:",
      error.response?.data || error
    );
    // throw error; // keep commented to match your pattern
    return {};
  }
}

export {createAffiliateInHubSpot,
  updateAffiliateInHubSpot,
  searchAffiliateByInHubspot,searchClientInHubSpot,
  createClientInHubSpot,updateClientInHubSpot,searchInvoiceInHubSpot,createInvoiceInHubSpot,
  updateInvoiceInHubSpot,
  updateInquirerInHubSpot,searchInquirerInHubSpot,createInquirerInHubSpot,
searchOrderInHubSpot,updateOderInHubSpot,createOrderInHubSpot,
searchTextMessageInHubSpot,createTextMessageInHubSpot,updateTextMessageInHubSpot,
searchEmailInHubSpot,updateEmailInHubSpot,createEmailInHubSpot,
searchActivityInHubSpot,updateActivityInHubSpot,createActivityInHubSpot};