function cleanProps(obj) {
  const cleaned = {};

  for (const key in obj) {
    const value = obj[key];

    // Skip undefined
    if (value === undefined) continue;

    // Allow null (HubSpot accepts null for some fields)
    if (value === null) {
      cleaned[key] = null;
      continue;
    }

    // Allow strings and numbers directly
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      cleaned[key] = value;
      continue;
    }

    // If it's an object and has `.toString()`
    if (typeof value === "object") {
      // Capsule rich text: { content: "xxx" }
      if (value.content && typeof value.content === "string") {
        cleaned[key] = value.content;
        continue;
      }

      // Date object → convert to timestamp
      if (value instanceof Date) {
        cleaned[key] = value.getTime();
        continue;
      }

      // Otherwise fallback → JSON string
      cleaned[key] = JSON.stringify(value);
      continue;
    }

    // Everything else → convert to string
    cleaned[key] = String(value);
  }

  return cleaned;
}

// Create Payload in Inquirer

function buildHubSpotInquirerPayload(data = {}) {
  const properties = cleanProps({
    /* ===============================
      STANDARD HUBSPOT PROPERTIES
    =============================== */
    firstname: data.first_name,
    lastname: data.last_name,
    email: data.email_1,
    phone: data.primary_phone,
    city: data.city,
    state: data.state,
    zip: data.zip,

    /* ===============================
      OWNERSHIP
    =============================== */
    hubspot_owner_id: data.lead_owner,

    /* ===============================
      IMPORTANT INQUIRER FIELDS
      (must exist in HubSpot)
    =============================== */
    inquirer_status: data.inquirer_status,
    inquirer_loan_status: data.inquirer_loan_status,
    inquirer_employment_type: data.inquirer_employment_type,
    inquirer_profession: data.inquirer_profession,
    marital_status: data.marital_status,

    inquirer_current_monthly_payment: data.inquirer_current_monthly_,
    inquirer_last_year_agi: data.inquirer__last_year__ag,

    spouse_has_loans: data.eval__spouse_has_loans,
    pay_frequency: data.eval__pay_frequency,

    /* ===============================
      MARKETING / SOURCE
    =============================== */
    marketing_source: data.marketing_source,
    lead_type: data.lead_type,
    referral_from_financial_advisor:
      data.referral_from_financial_a === "true" ? "true" : "false",

    /* ===============================
      FLAGS / BOOLEANS
    =============================== */
    convert_to_client: data.convert_to_client === "1" ? "true" : "false",
    tutor_needs_attention:
      data.tutor_needs_attention === "true" ? "true" : "false",
    setter_needs_attention:
      data.setter_needs_attention === "true" ? "true" : "false",

    /* ===============================
      RAW IVINEX PAYLOAD (FULL BACKUP)
    =============================== */
    // ivinex_raw_payload: JSON.stringify(data),
  });

  if (!Object.keys(properties).length) {
    throw new Error("HubSpot payload is empty");
  }

  return { properties };
}

// Create Affiliate Payload

// function buildHubSpotAffiliatePayload(data = {}) {
//   if (!data ||!data.first_name ) {
//     console.warn("No data provided for Affiliate payload");
//     return{};
//   }
  
//   const properties = cleanProps({
//     //Dummy Payload
//     first_name: data.first_name,
//     last_name: data.last_name,

//     /* =========================
//        STANDARD HUBSPOT FIELDS
//     ========================= */

//     // phone: data.primary_phone,
//     // email: data.email__business_type || data.email__personal_type,

//     // company: data.firm_name,
//     // state: data.primary_state,
//     // zip: data.primary_zip_code,

//     // /* =========================
//     //    AFFILIATE IDENTIFICATION
//     // ========================= */
//     // affiliate_referral: "true",
//     // affiliate_status: data.affiliate_status,
//     // vip_affiliate:
//     //   data.vip_affiliate === "true" || data.vip_affiliate === true
//     //     ? "true"
//     //     : "false",

//     // /* =========================
//     //    BUSINESS / SOURCE INFO
//     // ========================= */
//     // industry: data.industry,
//     // lead_source: data.lead_source,
//     // profession: data.profession,
//     // website: data.lead_description__specia0,

//     // /* =========================
//     //    COMMUNICATION FLAGS
//     // ========================= */
//     // receives_texts:
//     //   data.receives_texts === "true" || data.receives_texts === true
//     //     ? "true"
//     //     : "false",

//     // has_referrals_in_mind:
//     //   data.has_referrals_in_mind_asa === "true" ? "true" : "false",

//     // /* =========================
//     //    OWNERSHIP
//     // ========================= */
//     // hubspot_owner_id: data.lead_owner,

//     /* =========================
//        OPTIONAL BACKUP (DEBUG)
//     ========================= */
//     // affiliate_raw_payload: JSON.stringify({
//     //     collection_id: data.collection_id,
//     //     created_date: data.created_date
//     //   })
//   });

//   if (!Object.keys(properties).length) {
//     throw new Error("Affiliate payload is empty");
//   }

//   return { properties };
// }

// New code for Affiliate Payload

function buildHubSpotAffiliatePayload(data = {}) {
  if (!data || !data.first_name) {
    console.warn("No data provided for Affiliate payload");
    return {};
  }

  // Map numeric or code values to allowed HubSpot dropdown string options
  // **You must fill these mappings with your real allowed option strings**

  // const professionMap = {
  //   "14384": "Chiropractor",
    // Add all other mappings here
  // };

  

  // const leadSourceMap = {
  //   "14750": "Affiliate Referral",
  //   // Add all other mappings here
  // };

  // const affiliateStatusMap = {
  //   "14283": "New",
  //   // Add all other mappings here
  // };

  const properties = cleanProps({
    first_name: data.first_name,
    last_name: data.last_name,
   
    
    receives_texts:
    data.receives_texts === true || data.receives_texts === "true" ? "true" : "false",
    vip_affiliate:
    data.vip_affiliate === true || data.vip_affiliate === "true" ? "true" : "false",    
    primary_phone: data.primary_phone,
    firm_name: data.firm_name,
    primary_state: data.primary_state,
    primary_zip_code: data.primary_zip_code,
    email__business_type: data.email__business_type || data.email__personal_type,
    has_referrals_in_mind_asa: data.has_referrals_in_mind_asa === "true" ? "true" : "false",
    
    
    
    // Error fields 
    // affiliate_status: data.affiliate_status,
    // industry: data.industry,
    // lead_source:  data.lead_source,
    // profession: data.profession,
    

  
  });

  if (!Object.keys(properties).length) {
    throw new Error("Affiliate payload is empty");
  }

  return { properties };
}



// Create Activity Payload

function buildHubSpotActivityPayload(data = {}) {
  const properties = cleanProps({
    activity_name: data.subject || "Capsule Activity",

    activity_type: data.activity, // 1004
    activity_status: data.status, // 10004
    activity_priority: data.priority, // 10006

    activity_description: data.description || "",
    activity_location: data.location || "",

    activity_timestamp: data.start_time
      ? new Date(data.start_time).getTime()
      : Date.now(),

    activity_end_time: data.end_time ? new Date(data.end_time).getTime() : null,

    is_all_day:
      data.all_day_event === "true" || data.all_day_event === true
        ? "true"
        : "false",

    hubspot_owner_id: data.assigned || null,

    activity_created_date: data.created_date
      ? new Date(data.created_date).getTime()
      : null,

    created_via: "api",
  });

  if (!Object.keys(properties).length) {
    throw new Error("❌ Activity payload is empty");
  }

  return { properties };
}

// Create Invoices Payload

function buildHubSpotInvoicePayload(data = {}) {
  const properties = cleanProps({
    // Unique invoice number (Capsule record ID)
    hs_invoice_number: data.collection_id || "",

    // Invoice status from invoice_category or default to "DRAFT"
    hs_invoice_status: data.invoice_category || "DRAFT",

    // Invoice amount as number
    hs_invoice_amount:
      data.total_invoice_amount != null
        ? Number(data.total_invoice_amount)
        : null,

    // Balance due - if available (your data does not have it, so usually null)
    hs_invoice_balance_due:
      data.balance_due != null ? Number(data.balance_due) : null,

    // Currency, default USD since none provided
    hs_invoice_currency: data.currency || "USD",

    // Due date mapped from date_of_activity, converted to timestamp
    hs_invoice_due_date: data.date_of_activity
      ? new Date(data.date_of_activity).getTime()
      : null,

    // Issue date from created_date, converted to timestamp
    hs_invoice_issue_date: data.created_date
      ? new Date(data.created_date).getTime()
      : null,

    // Combined notes fields into one string separated by " | "
    hs_invoice_notes:
      [data.special_notes, data.special_details, data.expense_description]
        .filter(Boolean)
        .join(" | ") || "",

    // Owner/assigned ID
    hubspot_owner_id: data.created_by || null,

    created_via: "api",
  });

  if (!Object.keys(properties).length) {
    throw new Error("❌ Invoice payload is empty");
  }

  return { properties };
}

// Create Clients Payload

function buildHubSpotClientPayload(data = {}) {
  function toTimestamp(dateStr) {
    return dateStr ? new Date(dateStr).getTime() : null;
  }

  console.log("Raw input data:", data);

  const properties = {
    firstname: data.first_name || "",
    lastname: data.last_name || "",
    email: data.email_1 || data.email_address || "",
    phone: data.primary_phone || data.primary_phone0 || "",

    company: data.employerbusiness_name || "",

    address: data.address_1 || "",
    city: data.city || "",
    state: data.state || "",
    zip: data.zip || "",

    createdate: toTimestamp(data.created_date || data.client_created_date),
    lastmodifieddate: toTimestamp(data.modified_date),

    hubspot_owner_id: data.created_by || data.lead_owner || null,

    referral: data.referral || null,
    msa_sent_date: toTimestamp(data.msa_sent_),
    msa_received_date: toTimestamp(data.msa_received0),
    recert_date: toTimestamp(data.recert_date),
    client_action_taken: toTimestamp(data.client_action_taken),

    date_marked_inactive: toTimestamp(data.date_marked_inactive),

    spouse_full_name: data.spouse__full_name_ || "",
    spouse_email: data.spouse__email || "",

    status: data.status0 || data.status1 || "",

    days_to_recert: data.days_to_recert || null,
    aar_fee: data.aar_fee ? Number(data.aar_fee) : null,

    // add more fields you want here...

    created_via: "api",
  };

  // Remove properties only if strictly empty string, null, or undefined
  Object.keys(properties).forEach((key) => {
    if (
      properties[key] === "" ||
      properties[key] === null ||
      properties[key] === undefined
    ) {
      delete properties[key];
    }
  });

  console.log("Final payload properties:", properties);

  if (Object.keys(properties).length === 0) {
    throw new Error("❌ Client payload is empty");
  }

  return { properties };
}

export {
  cleanProps,
  buildHubSpotInquirerPayload,
  buildHubSpotAffiliatePayload,
  buildHubSpotActivityPayload,
  buildHubSpotInvoicePayload,
  buildHubSpotClientPayload,
};
