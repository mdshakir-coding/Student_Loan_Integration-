import axios from "axios";
import { cleanProps } from "../utils/helper.js";


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
      // return allRecords; //todo remove after testing

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

      console.log(`Fetched page ${page}, affiliated records: ${records.length}`);

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
        // return allRecords; //todo remove after testing

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

async function fetchTextMessagesRecrds(perPage = 100) {
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

      console.log(`Fetched page ${page}, text message records: ${records.length}`);

      allRecords.push(...records);
        // return allRecords; //todo remove after testing

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
        // return allRecords; //todo remove after testing

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





export {fetchInquirerRecords, fetchAffiliateRecords,
    fetchActivityReords,fetchInvoicesRecords,
    fetchClientsRecords,fetchOrdersRecords,fetchTextMessagesRecrds,fetchEmailsRecords, };
