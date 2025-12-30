import axios from "axios";
import dotenv from "dotenv";
dotenv.config();




// Create Inquirer in Hubspot
async function createInquirerInHubSpot(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/contacts";

  // const properties = cleanProps({
  //   firstname: "Stephanie",
  //   lastname: "Hart",
  //   phone: "2398236353",
  //   email: "stefb98@hotmail.com",

  //   // Custom properties (must exist in HubSpot)
  //   inquirer_status: "10265",
  //   inquirer_current_monthly_payment: "596.08",
  //   inquirer_last_year_agi: "3966.00",

  //   lead_owner: "14",
  //   marketing_source: "0",
  //   convert_to_client: "true"
  // });

  // const payload = {
  //   properties
  // };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ HubSpot Inquirer (Contact) created:", response.data.id);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating HubSpot inquirer:",
      error.response?.data || error.message
    );
    return {};
  }
}


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
async function searchClientInHubSpot(email) {
  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: email
          }
        ]
      }
    ],
    limit: 1
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
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
async function createClientInHubSpot(data) {
  const payload = {
    properties: {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      phone: data.phone
    }
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Client created:", response.data.id);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating client:",
      error.response?.data || error.message
    );
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







export {createInquirerInHubSpot,createAffiliateInHubSpot,
  createActivityInHubSpot,updateAffiliateInHubSpot,
  searchAffiliateByInHubspot,searchClientInHubSpot,
  createClientInHubSpot,updateClientInHubSpot};