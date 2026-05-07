import { logger } from "./winston.logger.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

// helper function to normalize picklist values with flexible matching

function normalizePicklistValue(mapping, value, options = {}) {
  const { defaultValue = null, log = false } = options;

  if (!value) return defaultValue;

  // 🔹 normalize input
  const normalize = (val) =>
    val
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\s*\/\s*/g, "/"); // normalize slash spacing

  const normalizedInput = normalize(value);

  // 🔹 loop mapping (works for number keys + string values)
  for (const key in mapping) {
    const mapValue = mapping[key];

    if (!mapValue) continue;

    const normalizedMapValue = normalize(mapValue);

    // ✅ match by value
    if (normalizedInput === normalizedMapValue) {
      return mapValue; // EXACT HubSpot value
    }

    // ✅ match by key (ID case)
    if (normalizedInput === key.toString().toLowerCase()) {
      return mapValue;
    }
  }

  if (log) {
    logger.warn(`❌ Unmapped value: "${value}"`);
  }

  return defaultValue;
}

function cleanPrincipalAmount(rawValue) {
  if (!rawValue) return null;

  // Convert to string if needed
  let value = String(rawValue);

  // If there are multiple values (separated by tabs, spaces, etc.), take the first one
  // Or handle as needed based on your business logic
  if (value.includes("\t") || value.includes("  ")) {
    // Split by whitespace and take the first valid number
    const parts = value.split(/\s+/);
    value = parts[0]; // Take first amount
    console.warn(`Multiple principal values found, using first: ${value}`);
  }

  // Remove dollar signs, commas, and any non-numeric characters except decimal point
  let cleaned = value.replace(/[^0-9.-]/g, "");

  // Handle multiple decimal points (keep only first)
  const decimalParts = cleaned.split(".");
  if (decimalParts.length > 2) {
    cleaned = decimalParts[0] + "." + decimalParts.slice(1).join("");
  }

  // Convert to number
  const number = parseFloat(cleaned);

  // Return null if invalid number
  return isNaN(number) ? null : number;
}

function cleanNumericField(value, fieldName) {
  if (value === null || value === undefined) return null;

  let strValue = String(value).trim();

  // Common non-numeric values
  const nullIndicators = [
    "-",
    "—",
    "N/A",
    "n/a",
    "NA",
    "na",
    "",
    "null",
    "undefined",
    "none",
    "None",
    "--",
  ];
  if (nullIndicators.includes(strValue)) {
    console.log(`[INFO] ${fieldName}: Converting "${strValue}" to null`);
    return null;
  }

  // Remove commas, dollar signs, percent signs, and now - extract only the number
  strValue = strValue.replace(/[,%$€£()]/g, "");

  // Extract the first numeric value (handles "5 years", "5 years 6 months", etc.)
  const numberMatch = strValue.match(/\d+(?:\.\d+)?/);

  if (!numberMatch) {
    console.warn(
      `[WARN] ${fieldName}: Could not parse "${strValue}" as number`
    );
    return null;
  }

  const number = parseFloat(numberMatch[0]);

  if (isNaN(number)) {
    console.warn(`[WARN] ${fieldName}: "${strValue}" resulted in NaN`);
    return null;
  }

  // For forgiveness years, likely want integer (floor)
  const result = Math.floor(number);

  // Log the cleaning for debugging
  if (String(value) !== result.toString()) {
    console.log(`[INFO] ${fieldName}: Cleaned "${value}" → ${result}`);
  }

  return result;
}

function cleanIntegerValue(value) {
  if (!value || value === null || value === undefined) return null;

  // Convert to string and trim
  let strValue = String(value).trim();

  // Check for common "empty" or "null" representations
  const invalidPatterns = [
    "-",
    "—",
    "N/A",
    "n/a",
    "NA",
    "na",
    "",
    "null",
    "undefined",
    "none",
    "None",
  ];
  if (invalidPatterns.includes(strValue)) {
    return null;
  }

  // Remove commas and extract numbers
  const cleaned = strValue.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);

  if (!cleaned) return null;

  const number = parseFloat(cleaned[0]);

  // Return integer (floor) or null if NaN
  return isNaN(number) ? null : Math.floor(number);
}

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

// lead_owner Picklist value mapped for Inquirer

const affiliateleadOwnerMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// Phone_1_type picklist mapping
const phone1TypeMapping = {
  10246: "Cell",
  10247: "Home",
  10248: "Work",
};

// phone_2_type picklist mapping
const phone2TypeMapping = {
  10249: "Cell",
  10250: "Home",
  10251: "Work",
};

// inquirer_status picklist mapping
const inquirerStatusMapping = {
  10261: "New",
  15030: "Canceled by inquirer",
  10263: "Bad Lead",
  13070: "Unqualified Lead",
  12989: "No Resp. 1st Att.",
  13061: "No Resp. 2nd Att.",
  13062: "No Resp. Final Att.",
  13063: "MIA/Ghost",
  13161: "Pending PC - Link Sent to book",
  10262: "Eval Call Set",
  15164: "Rescheduled Eval Call",
  15165: "Eval Reschedule - Pending",
  14857: "Setter Following Up - 1st Attempt",
  15270: "Setter Following Up - 2nd Attempt",
  15271: "Setter Following Up - Final",
  15309: "Setter Hot Lead - Nurturing",
  10264: "Not Interested (eval)",
  15302: "Req to stop Texting - Drip 2",
  15085: "Sent to Cohen - Eval",
  15237: "HF PCS",
  13058: "Planning Call (not paid yet)",
  10265: "Planning Call Set",
  15041: "No Show (Planning Call)",
  13016: "Tutor Following Up",
  15286: "$0 Payment Currently",
  15101: "Tutor AAR Follow up",
  13049: "No Sale (tutor)",
  15285: "Outstanding Invoice",
  12865: "Became Client",
  13055: "GF Became Client",
  14201: "F&F Became Client",
  11518: "DNC/DQ",
  12866: "Rehab Default",
  11517: "Student",
  13064: "Action Needed",
  14196: "TRAINING",
  15306: "(DU) Hot Lead - Nurturing",
  14882: "To Be Deleted",
};

// time_zone0 picklist mapping

// const timeZone0Mapping = {
//   10275: "america_slash_new_york", // EST
//   10276: "america_slash_chicago", // CST
//   10277: "america_slash_denver", // MST
//   13056: "america_slash_phoenix", // MST (Arizona, no DST)
//   10278: "america_slash_los_angeles", // PST
//   10279: "pacific_slash_honolulu", // HAST
//   10280: "america_slash_anchorage", // AKST
//   11522: "america_slash_anchorage", // AK
//   11520: "america_slash_anchorage", // AKS
//   11523: "america_slash_halifax", // HAT
//   13398: "pacific_slash_honolulu", // HST
//   11524: "america_slash_san_juan", // PR
//   11521: "utc", // UTC
// };
const timeZone0Mapping = {
  10275: "america_slash_new_york", // EST
  10276: "america_slash_chicago", // CST
  10277: "america_slash_denver", // MST
  13056: "america_slash_phoenix", // MST (Arizona, no DST)
  10278: "america_slash_los_angeles", // PST
  10279: "pacific_slash_honolulu", // HAST
  10280: "america_slash_anchorage", // AKST
  11522: "america_slash_anchorage", // AK
  11520: "america_slash_anchorage", // AKS
  11523: "america_slash_halifax", // HAT
  13398: "pacific_slash_honolulu", // HST
  11524: "america_slash_puerto_rico", // PR - FIXED
  11521: "utc", // UTC
};

// standy_list picklist mapping
const standyListMapping = {
  15203: "Low Importance",
  15204: "High Importance",
};

// pc_appointment_confirmation picklist mapping
const pcAppointmentConfirmationMapping = {
  15207: "Confirmed",
  15208: "Rescheduled",
};

// slt_referring_rep picklist mapping
const sltReferringRepMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// lead_type picklist mapping

// const leadTypeMapping = {
//   12919: "Client Referral",
//   12923: "SLT Contractor Referral",
//   13333: "Outbound Affiliates (Financial Planner) - NO APC",
//   12922: "SLT/Tutor Affiliates",
//   15311: "Webinar - Dani",
//   14234: "Email Campaign (Marketing)",
//   14210: "Low Balance Lead",
//   12932: "Conferences",
//   13395: "FB Groups/Word of Mouth",
//   15032: "Non-Client Referral/Direct Mention",
//   13293: "Undetermined",
//   13036: "Spouse/Partner",
//   14232: "Podcast",
//   14774: "Webinar",
//   14928: "Csaba",
//   15031: "Non-Commission Referrals (Csaba)",
//   15236: "Non-qual HF Lead",
//   14993: "Dani PR",
//   15068: "Dani - Partner Link",
//   15153: "Dani - Conferences",
//   14940: "PR Articles - Dani",
//   14984: "Parker University - Tony",
//   12921: "DU Website (dont use)",
//   15082: "DU Dani/Csaba Split",
//   14937: "DU Csaba FA",
//   14938: "DU Csaba - PSLF",
//   13140: "DU Digital Ad (Marketing)",
//   12992: "DU Chiro Assoc. Affiliate (don't use)",
//   13059: "DU SLT In-house Marketing (dont use)",
//   13076: "DU Direct Outreach (dont use)",
//   12987: "DU Kyle FB Ad/Affiliate Marketing (Don't use)",
//   12920: "DU Online Generic (dont use)",
//   14901: "DU M Physicians",
// };
const leadTypeMapping = {
  12919: "Client Referral",
  12923: "SLT Contractor Referral",
  // Fixed: Removed the dash before NO APC
  13333: "Outbound Affiliates (Financial Planner) NO APC",
  12922: "SLT/Tutor Affiliates",
  // 15311: "Webinar - Dani",
  14234: "Email Campaign (Marketing)",
  14210: "Low Balance Lead",
  12932: "Conferences",
  13395: "FB Groups/Word of Mouth",
  // Fixed: Added space after the slash
  15032: "Non-Client Referral/ Direct Mention",
  13293: "Undetermined",
  13036: "Spouse/Partner",
  14232: "Podcast",
  14774: "Webinar",
  14928: "Csaba",
  15031: "Non-Commission Referrals (Csaba)",
  15236: "Non-qual HF Lead",
  14993: "Dani PR",
  15068: "Dani - Partner Link",
  15153: "Dani - Conferences",
  14940: "PR Articles - Dani",
  14984: "Parker University - Tony",
  // Fixed: Added apostrophe
  12921: "DU Website (don't use)",
  // Fixed: Added space after the slash
  15082: "DU Dani/ Csaba Split",
  14937: "DU Csaba FA",
  14938: "DU Csaba - PSLF",
  13140: "DU Digital Ad (Marketing)",
  12992: "DU Chiro Assoc. Affiliate (don't use)",
  // Fixed: Added apostrophe
  13059: "DU SLT In-house Marketing (don't use)",
  // Fixed: Added apostrophe
  13076: "DU Direct Outreach (don't use)",
  12987: "DU Kyle FB Ad/Affiliate Marketing (Don't use)",
  // Fixed: Added apostrophe (The one that caused your current error)
  12920: "DU Online Generic (don't use)",
  14901: "DU M Physicians",
};

// affiliate_presenting_tutor picklist mapping
const affiliatePresentingTutorMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// conferences_dani_pr_sources picklist mapping

// const conferencesDaniPrSourcesMapping = {
//   15305: "Texas Chiro Assoc. Conference 2025 - Derek and Kevin",
//   15096: "Better Wealth FA Conference - CO - Dani/Michael",
//   14991: "Chiro Congress 2023",
//   15001: "Kentucky Assoc. of Chiropractics - Dani",
//   15003: "California Chiro Assoc 2023/2024 - Dani",
//   15004: "Colorado Chiro Newsletter - Dani",
//   15005: "Virginia Chiro Newsletter - Dani",
//   15006: "Texas Chiro Newsletter - Dani",
//   15007: "Georgia Chiro Newsletter - Dani",
//   15008: "Missouri Chiro Newsletter - Dani",
//   15009: "Florida Chiro Newsletter - Dani",
//   15010: "Ohio Chiro Newsletter - Dani",
//   15011: "Arizona Chiro Newsletter - Dani",
//   15012: "Illinois Chiro Newsletter - Dani",
//   15013: "Utah Chiro Newsletter - Dani",
//   15023: "OSCA Newsletter - Dani",
//   15046: "Washington Chiro Newsletter - Dani PR",
//   15060: "NC Chiro Association - Dani",
//   15062: "MyBalto - Dani",
//   15063: "Open Door Consults - Dani",
//   15064: "Florida Chiro Association",
//   15065: "Illinois State Veterinary Assoc. - Dani",
//   15066: "Texas Veterinary Med Assoc. - Dani",
//   15070: "CE - Chiro Economics",
//   15093: "Texas Chiro Assoc. Conference 2024 - Tony and Kevin",
//   14992: "MAC - Michigan Chiro 2023",
//   14987: "OSCA 2023 - Ohio",
//   13073: "Whiplash Group 2020",
//   15024: "TCA Webinar 2024 - Tony",
//   14939: "Texas Chiro Expo 2023 - Tony and Derek",
//   14979: "Unison 2023",
//   14220: "2022 Whiplash - Derek and Max",
//   13077: "Idaho Chiro Association (old)",
//   13078: "California Chiro Association (old)",
//   13079: "Utah Chiro Association (old)",
//   13096: "Washington Chiro Association (old)",
//   13157: "Texas Chiro Conference (2018/2019)",
//   13266: "Colorado Chiro Conference",
//   13393: "2021 Washington State (WSCA) - Derek",
//   14752: "ABCA 2022 KCMO",
//   14893: "ACS - Alaska Chiro Society Oct 2022",
//   13158: "Virginia Chiro Conference 2020",
//   14931: "Texas Chiro Expo - 2023 - Tony and Derek",
// };

// podcast mapping picklist mapping

const conferencesDaniPrSourcesMapping = {
  15305: "Texas Chiro Assoc. Conference 2025 - Derek and Kevin",
  15096: "Better Wealth FA Conference - CO - Dani/Michael",
  14991: "Chiro Congress 2023",
  15001: "Kentucky Assoc. of Chiropractics - Dani",
  15003: "California Chiro Assoc. 2023/2024 - Dani", // Added period after "Assoc"
  15004: "Colorado Chiro Newsletter - Dani",
  15005: "Virginia Chiro Newsletter - Dani",
  15006: "Texas Chiro Newsletter - Dani",
  15007: "Georgia Chiro Newsletter - Dani",
  15008: "Missouri Chiro Newsletter - -Dani", // Double dash before Dani
  15009: "Florida Chiro Newsletter - Dani",
  15010: "Ohio Chiro Newsletter - Dani",
  15011: "Arizona Chiro Newsletter - Dani",
  15012: "Illinois Chiro Newsletter - Dani",
  15013: "Utah Chiro Newsletter - Dani",
  15023: "OSCA Newsletter - Dani",
  15046: "Washington Chiro Newsletter - Dani PR",
  15060: "NC Chiro Association - Dani",
  15062: "MyBalto - Dani",
  15063: "Open Door Consults - Dani",
  15064: "Florida Chiro Association",
  15065: "Illinois State Veterinary Assoc. - Dani",
  15066: "Texas Veterinary Med Assoc. - Dani",
  15070: "CE - Chiro Economics",
  15093: "Texas Chiro Assoc. Conference 2024 - Tony and Kevin",
  14992: "MAC - Michigan Chrio 2023", // "Chrio" not "Chiro" (HubSpot typo)
  14987: "OSCA 2023 - Ohio",
  13073: "Whiplash Group 2020",
  15024: "TCA Webinar 2024 - Tony",
  14939: "Texas Chiro Expo 2023 - Tony and Derek",
  14979: "Unison 2023",
  14220: "2022 Whiplash - Derek and Max",
  13077: "Idaho Chiro Association (old)",
  13078: "California Chiro Association (old)",
  13079: "Utah Chiro Association (old)",
  13096: "Washington Chiro Association (old)",
  13157: "Texas Chiro Conference (2018/2019)",
  13266: "Colorado Chiro Conference",
  13393: "2021 Washington State (WSCA) - Derek",
  14752: "ABCA 2022 KCMO",
  14893: "ACS - Alaska Chiro Society Oct 2022",
  13158: "Virginia Chiro Conference 2020",
  14931: "Texas Chiro Expo - 2023 - Tony and Derek",
};
const podcastMapping = {
  14230: "Zeitgeist Podcast (Expect the Charles Episode)", // ✅ fixed
  14226: "Charles Eisenstein Podcast",
  14227: "Lions of Liberty (Michael Podcast)",
  14229: "Life Benefits/Wealth Talks/Tom Mcfie",
  14231: "Lifestyle Practice Builders Podcast - Haley Day",
  14894: "Kim Besuden Podcast - Tony",
  14933: "PPP - Dr Jay LaGuardia - Tony",
  14936: "Money Mastery Coaching - Michael",
  14942: "The Culture Podcast",
  14944: "Animal Chiro - Katie Lackey",
  15047: "Chiropractic Connection - Dani",
  15061: "Practice on Purpose - Dani",
  15189: "Better Wealth Podcast - Dani",
  15190: "Expect Miracles Podcast - Kevin",
  15319: "Wealthy Practitioner - Dani",
};
// du_financial_planner picklist mapping
const duFinancialPlannerMapping = {
  14241: "Belle Ives (NM) - Tony",
  // 14238: "Dani Converse (NM) - Tony",
  // 14240: "Hannah Morando (NM) - Tony",
  // 14239: "Van Everett (NM) - Tony",
  // 14256: "Lauren Peter (NM) - Tony",
  // 14751: "Trina Sessions (NM) - Tony",
  // 14754: "Alex Morgan (NM) - Tony",
  // 14755: "Nicki Morgan (NM) - Tony",
  // 14759: "Kimmy Schimek (NM) - Tony",
  // 14760: "Matt Schimek (NM) - Tony",
  // 14242: "John Coeuille (Ed Jones)",
  // 14753: "Hannah Moeller (NM) - Tony",
  // 14237: "Renata (Ed.Jones) - Tony",
  // 14746: "Myron (Chris) Henley - Derek",
};

// du_slt_outreach_affiliate_source picklist mapping
const duSltOutreachAffiliateSourceMapping = {
  13264: "Not Listed yet",
  // 13117: "KSL Ad Michael Did",
  // 13127: "Mass Mutual (Michael)",
  // 14756: "KC Credit",
  // 13156: "Renata EdJones (Tony)",
  // 14215: "Dani Converse (NW M) - Tony",
  // 14225: "Van Everett (NW M) - Tony",
  // 14235: "Hannah Morando (NW M) - Tony",
  // 14236: "Belle Ives (NW M) - Tony",
  // 13120: "Ian Hoffman Student Loan Eraser",
  // 13128: "Amber Landry (pslf service/michael)",
  // 13121: "UCPA (Utah Physicians Chiropractic Association)",
  // 13126: "WSCA (Washington State Chiropractic Association)",
  // 13132: "UVCA (Virginia Chiropractic Association)",
  // 13133: "TCA (Texas Chiropractic Association)",
  // 13137: "IACP (Idaho Association of Chiropractic Physicians)",
  // 13138: "Calchiro (California Chiropractic Association)",
  // 13139: "FCA (Florida Chiropractic Association)",
  // 13227: "Florida Acupuncture Assoc",
  // 13228: "AT/DC Articles",
  // 13240: "ABCA",
  // 13256: "Life West Zoom",
  // 13267: "Women's FB Chiro Group",
  // 13355: "John Coeuille (Ed Jones)",
  // 14221: "Wealth Factory",
  // 14222: "Tom Pratt (Financial Planner)",
};

// contractor_referred_by picklist mapping

const contractorReferredByMapping = {
  13097: "Michael/Maomi",
  13099: "Derek S.",
  13101: "Tony F.",
  13102: "Zack/Madeline",
  13112: "Genevieve B.",
  13125: "Amie E.",
  14974: "Kevin H.",
  14975: "Adam D.",
  14976: "Terni B.",
  14977: "Joe F.",
  14978: "Sara R.",
  13113: "Adam S.",
  13114: "Casey D.",
  14198: "Katie R.",
  14199: "Max B.",
  13100: "Amrit D.",
};

// inquirer_profession picklist mapping
const inquirerProfessionMapping = {
  10331: "Chiropractor",
  10335: "Unknown",
  12730: "Naturopath",
  12729: "Acupuncturist",
  10332: "Medical Practitioner",
  10330: "Dentist",
  10333: "Doctorate / PHD",
  10334: "Attorney",
  12731: "Finance",
  12732: "Veterinarian",
  13330: "Nurse",
  13331: "Psychologist",
  13332: "Therapist",
  13363: "Nutritionist",
  14187: "Teacher",
  14190: "Self Employed (Generic)",
  14191: "W-2 (Generic)",
  14192: "Sales",
  14967: "Optometrist",
  15167: "Pharmacist",
  10336: "Other",
};
// inquirer_employment_type picklist mapping
// const inquirerEmploymentTypeMapping = {
//   12925: "Self Employed",
//   10325: "W2",
//   10326: "1 99",
//   10327: "Unemployed",
//   12913: "Multiple",
//   15166: "Retired",
// };

// const inquirerEmploymentTypeMapping = {
//   12925: "Self Employed - Business Owner",
//   10325: "W2 Employee",
//   10326: "Self Employed - No Entity Set Up Yet",
//   10327: "Unemployed",
//   12913: "Multiple (Self Employed/W2)", // ✅ FIXED
//   15166: "Retired",
// };

const inquirerEmploymentTypeMapping = {
  12925: "Self Employed", // Changed from "Self Employed - Business Owner"
  10325: "W2", // Changed from "W2 Employee"
  10326: "1 99", // Assuming this maps to "Self Employed - No Entity Set Up Yet" (likely a typo in the CRM for "1099")
  10327: "Unemployed", // Already valid
  12913: "Multiple", // Changed from "Multiple (Self Employed/W2)"
  15166: "Retired", // Already valid
};

// marital_status picklist mapping
const maritalStatusMapping = {
  10303: "Married",
  10304: "Single",
  10305: "Divorced",
  10306: "Engaged",
  10307: "Seperated", // ✅ Changed from "Separated" to "Seperated" (HubSpot's typo)
};

// eval___taxes_jointly_separate_picklist mapping
const evalTaxesJointlySeparateMapping = {
  14250: "Jointly",
  14251: "Seperate", // Match HubSpot's typo
};

//eval___spouse_has_loans picklist mapping
const evalSpouseHasLoansMapping = {
  10317: "Yes",
  10318: "No",
  10319: "Unknown",
};

// inquirer_loan_status picklist mapping
const inquirerLoanStatusMapping = {
  12930: "Unknown",
  10296: "Current",
  10297: "Deferment or Forbearance", // ✅ Changed 'O' to 'o'
  10298: "Default",
  10299: "Past Due",
  10300: "Garnishment",
  10301: "App in Process",
};

// inquirer_current_repayment_plan picklist mapping
const inquirerCurrentRepaymentPlanMapping = {
  10323: "Unknown",
  10321: "Balance Based",
  10322: "Income Driven",
  13364: "Recent Grad(Not setup yet)", // Removed the space before "("
};
// tutor_name picklist mapping
const tutorNameMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// slt_rep_referred_by picklist mapping
const sltRepReferredByMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};
// eval___spouse_pay_frequency picklist mapping
const evalSpousePayFrequencyMapping = {
  11971: "Weekly",
  11972: "Bi-Weekly",
  11973: "Semi-Monthly",
  11974: "Monthly",
  11975: "Annually",
  12914: "Daily",
  12915: "Quarterly",
};
// lead_owner picklist mapping
const leadOwnerMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// fed_loan_amount_old picklist mapping

const fedLoanAmountOldMapping = {
  10286: "0",
  10287: "Less than 10K",
  10288: "10K-30K",
  10289: "30K-50K",
  10290: "50K-100K",
  10291: "100K-150K",
  10292: "150K-200K",
  10293: "200K-300K",
  10294: "More than 300K",
};

// inquirer_loan_servicer picklist mapping
const inquirerLoanServicerMapping = {
  13301: "Nelnet",
  14203: "AidVantage",
  13309: "EdFinancial",
  13308: "Mohela",
  15275: "CRI (Central Research Incorporated)",
  13305: "Multiple Servicers",
  13306: "A.E.S", // ✅ Removed trailing period
  13307: "A.C.S.", // Keep as is - check if HubSpot expects "A.C.S" or "A.C.S."
  13302: "Navient (Inactive)",
  15050: "SLOAN",
  13310: "Cornerstone",
  13311: "Granite State (Inactive)",
  13312: "Aspire (Inactive)",
  13314: "UHEAA",
  13313: "Collections Agency",
  13315: "OSLA",
  14211: "Trellis (Higher Ed)",
  13303: "Fedloan",
  13304: "Great Lakes (Inactive)",
};

//household_size___income_threshold__150__ picklist mapping
// const householdSizeIncomeThreshold150Mapping = {
//   12897: "HH1 - $23,475",
//   12898: "HH2 - $31,725",
//   12899: "HH3 - $39,975",
//   12900: "HH4 - $48,225",
//   12901: "HH5 - $56,475",
//   12902: "HH6 - $64,725",
//   12903: "HH7 - $72,975",
//   12904: "HH8 - $81,225",
//   12905: "HH9 - $89,475",
//   12906: "HH10 - $97,725",
//   12907: "HH11 - $105,975",
//   12908: "HH12 - $114,225",
//   12909: "HH13 - $122,475",
//   12910: "HH14 - $130,725",
//   12911: "HH15 - $138,975",
//   12912: "16+ - add $8,250 each",
// };

const householdSizeIncomeThreshold150Mapping = {
  12897: "HH1",
  12898: "HH2",
  12899: "HH3",
  12900: "HH4",
  12901: "HH5",
  12902: "HH6",
  12903: "HH7",
  12904: "HH8",
  12905: "HH9",
  12906: "HH10",
  12907: "HH11",
  12908: "HH12",
  12909: "HH13",
  12910: "HH14",
  12911: "HH15",
  12912: "HH16_PLUS", // ⚠️ confirm this in HubSpot (may vary)
};

// income_amount_and_pay_frequency picklist mapping
// const incomeAmountAndPayFrequencyMapping = {
//   12873: "Bi-weekly",
//   12874: "Semi-Monthly",
//   12875: "Weekly",
//   12888: "Monthly",
//   12877: "Annually",
//   12876: "Quarterly",
//   12878: "Daily",
// };
const incomeAmountAndPayFrequencyMapping = {
  12873: "Bi-Weekly", // ✅ Changed 'w' to 'W'
  12874: "Bi-Monthly", // ✅ Changed "Semi-Monthly" to match HubSpot's "Bi-Monthly"
  12875: "Weekly",
  12888: "Monthly",
  12877: "Annual Gross (AGI)", // ✅ Changed "Annually" to match HubSpot's option
  12876: "Quarterly",
  12878: null, // ⚠️ "Daily" is NOT in HubSpot's list! This will crash if you send it. Pass null or add "Daily" to HubSpot.
};

// pay_frequency_stream_2 picklist mapping
const payFrequencyStream2Mapping = {
  12881: "Bi-weekly",
  12882: "Semi-Monthly",
  12887: "Weekly",
  12883: "Monthly",
  12885: "Annually",
  12884: "Quaterly",
  12886: "Daily",
};

// pay_frequency_stream_3 picklist mapping
const payFrequencyStream3Mapping = {
  12890: "Bi-weekly",
  12891: "Semi-Monthly",
  12893: "Weekly",
  12892: "Monthly",
  12895: "Annually",
  12894: "Quarterly",
  12896: "Daily",
};

// lead_owner picklist mapping
const leadOwnerMappingInquirer = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

function buildHubSpotInquirerPayload(data = {}) {
  const properties = cleanProps({
    // Inquirer Mapping fields:-

    affiliate_presenting_tutor:
      buildOwnerMapping(
        affiliatePresentingTutorMapping[data?.affiliate_presenting_tuto]
      ) || null, //Hubspot User
    affiliate_lead_owner:
      buildOwnerMapping(
        affiliateleadOwnerMapping[data?.affiliate_lead_owner]
      ) || null, // hubspot user
    slt_referring_rep:
      buildOwnerMapping(sltReferringRepMapping[data?.slt_referring_rep]) ||
      null, // hubspot user
    lead_owner:
      buildOwnerMapping(leadOwnerMappingInquirer[data?.lead_owner]) || null, //hubspot User

    phone_1_type: normalizePicklistValue(phone1TypeMapping, data?.phone_1_type),
    phone_2_type: normalizePicklistValue(phone2TypeMapping, data?.phone_2_type),
    inquirer_status: normalizePicklistValue(
      inquirerStatusMapping,
      data?.inquirer_status
    ),
    hs_timezone: normalizePicklistValue(timeZone0Mapping, data?.time_zone0),
    standby_list: normalizePicklistValue(standyListMapping, data?.standby_list),
    pc_appointment_confirmation: normalizePicklistValue(
      pcAppointmentConfirmationMapping,
      data?.pc_appointment_confirmati
    ),
    lead_type: normalizePicklistValue(leadTypeMapping, data?.lead_type),
    conferences_dani_pr_sources: normalizePicklistValue(
      conferencesDaniPrSourcesMapping,
      data?.conferencesdani_pr_sourc
    ),
    podcast: normalizePicklistValue(podcastMapping, data?.podcast),
    du_financial_planner: normalizePicklistValue(
      duFinancialPlannerMapping,
      data?.du_financial_planner
    ),
    du_slt_outreach_affiliate_source: normalizePicklistValue(
      duSltOutreachAffiliateSourceMapping,
      data?.du_slt_outreachaffiliate
    ),
    // contractor_referred_by: normalizePicklistValue(
    //   contractorReferredByMapping,
    //   data?.contractor_referred_by
    // ),
    inquirer_profession: normalizePicklistValue(
      inquirerProfessionMapping,
      data?.inquirer_profession
    ),
    inquirer_employment_type: normalizePicklistValue(
      inquirerEmploymentTypeMapping,
      data?.inquirer_employment_type
    ),
    marital_status: normalizePicklistValue(
      maritalStatusMapping,
      data?.marital_status
    ),
    eval___taxes_jointly_separate_: normalizePicklistValue(
      evalTaxesJointlySeparateMapping,
      data?.eval__taxes_jointlysepa
    ),
    eval___spouse_has_loans: normalizePicklistValue(
      evalSpouseHasLoansMapping,
      data?.eval__spouse_has_loans
    ),
    eval___spouse_pay_frequency: normalizePicklistValue(
      evalSpousePayFrequencyMapping,
      data?.eval__pay_frequency
    ), // hubspot data single-line text
    inquirer_loan_status: normalizePicklistValue(
      inquirerLoanStatusMapping,
      data?.inquirer_loan_status
    ),
    inquirer_current_repayment_plan: normalizePicklistValue(
      inquirerCurrentRepaymentPlanMapping,
      data?.inquirer_current_repaymen
    ),
    tutor: buildOwnerMapping(tutorNameMapping[data?.tutor_name]) || null,
    slt_rep_referred_by: normalizePicklistValue(
      sltRepReferredByMapping,
      data?.slt_rep_referred_by
    ), //hubspot data single-line text
    fed_loan_amount_old: normalizePicklistValue(
      fedLoanAmountOldMapping,
      data?.fed_loan_amount_old
    ), // hubspot data single-line text
    inquirer_loan_servicer: normalizePicklistValue(
      inquirerLoanServicerMapping,
      data?.inquirer_loan_servicer
    ),
    household_size___income_threshold__150__: normalizePicklistValue(
      householdSizeIncomeThreshold150Mapping,
      data?.household_size__income_t0
    ),
    income_amount_and_pay_frequency: normalizePicklistValue(
      incomeAmountAndPayFrequencyMapping,
      data?.pay_frequency_stream_1
    ),
    pay_frequency_stream_2: normalizePicklistValue(
      payFrequencyStream2Mapping,
      data?.pay_frequency_stream_2
    ),
    pay_frequency_stream_3: normalizePicklistValue(
      payFrequencyStream3Mapping,
      data?.pay_frequency_stream_3
    ),

    inquirer_status_ivinex: data?.inquirer_status || null,
    spouse_has_loans_s_ivinex: data?.spouse_has_loans_s || null, //
    eval_taxes_jointlysepa_ivinex: data?.eval__taxes_jointlysepa || null, //
    du_slt_outreachaffiliate_ivinex: data?.du_slt_outreachaffiliate || null, //
    contractor_referred_by_ivinex: normalizePicklistValue(
      contractorReferredByMapping,
      data?.contractor_referred_by
    ), //
    affiliate_referral_ivinex: data?.affiliate_referral || null, //
    entered_info_for_nfm_ivinex: data?.entered_info_for_nfm || null, //
    inquirer_loan_status_ivinex: data?.inquirer_loan_status || null, //
    inquirer_loan_servicer_ivinex: data?.inquirer_loan_servicer || null,
    eval_federal_loan_amount_ivinex: data?.eval__federal_loan_amount || null,

    inquirer_current_repaymen_ivinex: data?.inquirer_current_repaymen || null,
    eval__federal_loan_amoun: data?.eval__federal_loan_amoun || null,
    inquirer___last_year___agi: data?.inquirer__last_year__ag || null,
    inquirer_current_monthly_payment: data?.inquirer_current_monthly_ || null,
    inquirer_profession_ivinex: data?.inquirer_profession || null,
    field_of_study: data?.fields_changed || null,
    // apc_follow_up_date:data?.pc_follow_up_to_book || null,

    gross_income_amount_2: cleanNumericField(data?.adj_gross_amount_stream_0),
    gross_income_amount_3: data?.adj_gross_amount_stream_1 || null,
    income_amount: cleanNumericField(
      data?.adj_gross_amount_stream_,
      "income_amount"
    ),
    inquirer_household_size_n: data?.inquirer_household_size_n || null,
    loan_services_notes: data?.loan_servicer_notes || null,
    inquirer_profession__if_other_: data?.inquirer_profession_if_o || null,
    eval___federal_loan_amount: data?.eval__federal_loan_amoun || null,
    inquirer_date_of_last_contact: data?.inquirer_date_of_last_con || null,
    inquiry_source_notes__especially_if_uncertain_:
      data?.inquiry_source_notes_esp0 || null,
    standby_notes___availablity: data?.standby_notes__availabli || null,

    no_call_no_show__1_: data?.no_call_no_show_1 || null,
    no_call_no_show__2_: data?.no_call_no_show_2 || null,
    no_call_no_show__3_: data?.no_call_no_show_3 || null,
    firstname: data?.first_name || null,
    inquirer_middle_name: data?.inquirer_middle_name || null,
    lastname: data?.last_name || null,
    email: data?.email_1?.trim() || null,
    //  email_2:data?.email_2 || null,
    //  phone_2:data?.phone_2 || null,
    income_notes: data?.income_documentation_note || null,
    tutor_followup_date: data?.date_of_tutor_fu || null,
    date_of_tutor_f_u: data?.date_of_tutor_fu || null,
    date_became_client:
      data?.date_became_client === "0000-00-00" || !data?.date_became_client
        ? null
        : data.date_became_client,

    si_creation_date: data?.si_creation_date || null,
    zip: data?.zip || null,
    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    phone_2: data?.phone_2 || null,
    email_2: data?.email_2 || null,
    address_1: data?.address_1 || null,
    address_2: data?.address_2 || null,
    city: data?.city || null,
    state: data?.state || null,
    spouse: data?.spouse || null,
    client_referral: data?.client_referral || null,
    convert_to_client: data?.convert_to_client || null,
    go_converting_to_client__: data?.go_converting_to_client__ || null,
    click_on_convert_1: data?.click_on_convert_1 || null,
    click_on_convert_2: data?.click_on_convert_2 || null,
    inquirer_no_sale_reason: data?.inquirer_no_sale_reason || null,
    fed_loan_amount_s: data?.fed_loan_amount_s || null,
    actively_in_school_s: data?.actively_in_school_s || null,
    loan_status_s: data?.loan_status_s || null,
    fed_loan_payment_s: data?.fed_loan_payment_s || null,
    type_of_repayment_s: data?.type_of_repayment_s || null,
    field_30_day_income_s: data?.field_30_day_income_s || null,
    inquirer_middle_name: data?.inquirer_middle_name || null,
    spouse_fed_loans_payment: data?.spouse_fed_loans_payment || null,
    orders: data?.orders || null,
    // inquirer_total_balance: data?.inquirer_total_balance,
    inquirer_total_balance: data?.inquirer_total_balance
      ? Number(data.inquirer_total_balance.replace(/[^0-9.-]+/g, ""))
      : null,

    inquirer_consolidation__0: data?.inquirer_consolidation__0 || null,
    inquirer_current_plan_idr_history: data?.inquirer_current_planidr || null,
    inquirer_current_planidr: data?.inquirer_current_planidr || null,
    married: data?.married || null,
    married_: data?.married || null,
    sps_total_balance: cleanNumericField(
      data?.sps_total_balance,
      "sps_total_balance"
    ),
    inquirer_consolidation___loan_types:
      data?.inquirer_consolidation__0 || null,
    est__tax_burden: data?.est_tax_burden || null,

    sps___of_sub_loans:
      data?.sps___of_sub_loans === "-"
        ? null
        : cleanIntegerValue(data?.sps___of_sub_loans),
    sps__already_enrolled_in_autopay_:
      data?.sps__already_enrolled_in_autopay_ || null,
    sps__loan_servicer_s_: data?.sps_loan_servicers || null,

    household_size_notes: data?.household_size_notes || null,
    annual_documented_income: data?.annual_documented_income || null,
    adj_gross_amount_stream_: data?.adj_gross_amount_stream_ || null,
    pay_frequency_stream_1: data?.pay_frequency_stream_1 || null,
    adj_gross_amount_stream_0: data?.adj_gross_amount_stream_0 || null,
    adj_gross_amount_stream_1: data?.adj_gross_amount_stream_1 || null,
    combined_annual_documente: data?.combined_annual_documente || null,
    income_documentation_note: data?.income_documentation_note || null,
    tax_filing_status: data?.tax_filing_status || null,
    spouse_loan_description: data?.spouse_loan_description || null,
    savings_summary: data?.savings_summary || null,
    balance_based_scenarios: data?.balance_based_scenarios || null,
    tutor_approx_value_of_sav: data?.tutor_approx_value_of_sav || null,
    loan_servicer_notes: data?.loan_servicer_notes || null,
    sps_outstanding_principal: cleanNumericField(
      data?.sps_outstanding_principal,
      "sps_outstanding_principal"
    ),
    sps_avg_interest_rate: data?.sps_avg_interest_rate || null,
    sps__years_towards_forgiveness: cleanNumericField(
      data?.sps_years_towards_forgiv,
      "sps_years_towards_forgiv"
    ),
    sps_loan_types: data?.sps_loan_types || null,
    // sps_loan_servicers: data?.sps_loan_servicers || null,
    inquirer_household_size_notes: data?.inquirer_household_size_n || null,
    date_of_planning_call: data?.date_of_planning_call || null,
    date_marketing_reconciled: data?.date_marketing_reconciled || null,
    conferencesdani_pr_sourc: data?.conferencesdani_pr_sourc || null,
    kyle_affiliatefb_marketi0: data?.kyle_affiliatefb_marketi0 || null,
    online_generic_dont_use: data?.online_generic_dont_use || null,
    inquiry_source_notes_esp0: data?.inquiry_source_notes_esp0 || null,
    inquirer_date_of_last_con: data?.inquirer_date_of_last_con || null,
    referral_from_financial_a: data?.referral_from_financial_a || null,
    linked_client: data?.linked_client || null,
    copy_info: data?.copy_info || null,
    calculator_results: data?.calculator_results || null,
    inquirer_calculator_report_link: data?.inquirer_calculator_repor || null,
    sps__calc_report_link: data?.sps_calc_report_link || null,
    inquirer_profession_if_o: data?.inquirer_profession_if_o || null,
    eval_notes: data?.eval_notes || null,

    eval__spouse_pay_frequen: data?.eval__spouse_pay_frequen || null,
    notes: data?.notes || null,
    under_admin_review__t_k: data?.under_admin_review__t_k || null,
    affiliate_presenting_tuto: data?.affiliate_presenting_tuto || null,
    spacer: data?.spacer || null,
    date_of_tutor_fu: data?.date_of_tutor_fu || null,
    date_eval_occured: data?.date_eval_occured || null,
    graduation_year: data?.graduation_year || null,
    eval__current_income: data?.eval__current_income || null,
    eval___current_income: data?.eval__current_income
      ? parseFloat(String(data.eval__current_income).replace(/[^0-9.]/g, ""))
      : null,
    eval__spouse_current_inc: data?.eval__spouse_current_inc || null,
    good_timing_for_strategy_0: data?.good_timing_for_strategy_0 || null,
    financial_experience: data?.financial_experience || null,
    assets__insurances: data?.assets__insurances || null,
    renting_or_owning_if_hom: data?.renting_or_owning_if_hom || null,
    liabilities: data?.liabilities || null,
    interested_in_values_base: data?.interested_in_values_base || null,
    current_year_pretax_annu: data?.current_year_pretax_annu || null,
    anything_else_we_should_k: data?.anything_else_we_should_k || null,
    inquirer_referral0: data?.inquirer_referral0 || null,
    inquirer_referral: data?.inquirer_referral0 || null,
    date_of_initial_strategy_: data?.date_of_initial_strategy_ || null,
    years_until_tax_imp_expe: data?.years_until_tax_imp_expe || null,
    tax_imp_goal: data?.tax_imp_goal || null,
    na_note_from_referring_r: data?.na_note_from_referring_r || null,
    student__date_of_graduat: data?.student__date_of_graduat || null,
    marketing_source: data?.marketing_source || null,
    dani_pr_source: data?.dani_pr_source || null,
    standby_notes__availabli: data?.standby_notes__availabli || null,
    pc_appointment_confirmati: data?.pc_appointment_confirmati || null,
    pc_follow_up_to_book: data?.pc_follow_up_to_book || null,
    coordinator_notes: data?.coordinator_notes || null,
    no_call_no_show_1: data?.no_call_no_show_1 || null,
    no_call_no_show_2: data?.no_call_no_show_2 || null,
    no_call_no_show_3: data?.no_call_no_show_3 || null,
    rescheduled_date: data?.rescheduled_date || null,
    standby_marked_date: data?.standby_marked_date || null,
    est_tax_burden: data?.est_tax_burden || null,
    created_date: data?.created_date || null,
    first_name: data?.first_name || null,
    modified_by: data?.modified_by || null,
    last_name: data?.last_name || null,
    primary_phone: data?.primary_phone || null,
    email_1: data?.email_1 || null,
    tutor_needs_attention: data?.tutor_needs_attention || null,
    setter_needs_attention: data?.setter_needs_attention || null,
    under_admin_review__s_k: data?.under_admin_review__s_k || null,
    spouse_fed_loan_amount: data?.spouse_fed_loan_amount0 || null,

    counting_spouse_in_hh_size_: data?.counting_spouse_in_hh_siz || null,
    add___other__dependents: data?.add_other_dependents || null,
    add__child_dependents__incl__adult_children_:
      data?.add_child_dependents_in || null,
    spouse_annual_documented: data?.spouse_annual_documented_ || null,
    total_streams_of_taxable: data?.total_streams_of_taxable_ || null,
    sps__already_enrolled_in_autopay_: data?.sps_already_enrolled_in_ || null,
    inquirer___last_year___agi: data?.inquirer__last_year__ag || null,
    inquirer_current_monthly_payment: data?.inquirer_current_monthly_ || null,
    // tutor_name_: data?.tutor_name,
    notes_on_pricing_quoted_etc_: data?.notes_on_pricing_quoted_e || null,
    spouse__last_year__agi: data?.spouse__last_year__agi || null,
    // sps___of_sub_loans: data?.sps__of_sub_loans || null,
    // Quick fix for just the percentage issue
    inquirer_avg__interest_rate: (() => {
      const value = data?.inquirer_avg_interest_ra;
      if (!value || value === "-" || value === "N/A") return null;

      let cleaned = String(value).replace("%", "").trim();
      const number = parseFloat(cleaned);

      return isNaN(number) ? null : number;
    })(),
    inquirer_years_towards_forgiveness: cleanNumericField(
      data?.inquirer_years_towards_fo,
      "inquirer_years_towards_forgiveness"
    ),
    already_enrolled_in_autopay_: data?.already_enrolled_in_autop || null,
    // of_subsidized_loans: data?._of_subsidized_loans,
    of_subsidized_loans:
      data?._of_subsidized_loans === "-"
        ? null
        : Number(data?._of_subsidized_loans),
    inquirer_outstanding_principal: cleanPrincipalAmount(
      data?.inquirer_outstanding_prin
    ),
    time_zone__custom: data?.time_zone || null,
    adj_gross_amount_stream_0: data?.adj_gross_amount_stream_0 || null,
    adj_gross_amount_stream_1: data?.adj_gross_amount_stream_1 || null,
    annual_documented_income: data?.annual_documented_income || null,
    anything_else_we_should_know: data?.anything_else_we_should_know || null,
    company: data?.company || null,
    country: data?.country || null,
    date_of_tutor_fu: data?.date_of_tutor_fu || null,
    inquirer_loan_ivinex: data?.inquirer_loan || null,
  });

  if (!Object.keys(properties).length) {
    throw new Error("HubSpot payload is empty");
  }

  return { properties };
}

// picklist Mapping Affiliate
// lead_owner picklist mapping
const STL_Owner_Mapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Christine Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// presenting_rep Mapping fields

const presentingRepMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// primary_phone_line_type Mapping fields

const primaryPhoneLineTypeMapping = {
  14265: "Wireless",
  14266: "Home",
  14267: "Work",
  14783: "Unknown",
  14784: "Landline",
  14785: "VoIP",
};

// phone_2_type Mapping fields
const phone2TypeMappingAffiliate = {
  14269: "Cell",
  14270: "Home",
  14271: "Work",
};
//affiliate_status Mapping fields

const affiliateStatusMapping = {
  14280: "New",
  14281: "Bad Lead",
  14282: "Unqualified Lead",
  14283: "No Resp. 1st Att.",
  14284: "No Resp. 2nd Att.",
  14840: "Missed Presentation",
  14838: "Setter Following Up",
  14858: "Email/Info Sent",
  14736: "Interested - Presentation Set",
  14757: "Active Referring Partner",
  14904: "Received Presentation",
  14289: "Not Interested",
  14286: "MIA/Ghost",
  14297: "DNC/DO NOT CALL",
  14845: "Duplicate Phone Number",
  15058: "Inactive/wrong email",
  14881: "To Be Deleted",
};

// industry Mapping fields
const industryMapping = {
  14738: "Life Insurance",
  14739: "Financial Advisor",
  14740: "Realtor",
  14741: "Loan Officer",
  14742: "CPA",
  14935: "Book Keeper",
  14994: "Program Director",
  15002: "Association",
  14743: "Influencer (Chiro)",
  14744: "Influencer (Accupuncture)",
};

// profession Mapping fields

const professionMapping = {
  14385: "Chiropractor",
  14386: "Unknown",
  14387: "Naturopath",
  14388: "Acupuncturist",
  14389: "Medical Practitioner",
  14390: "Dentist",
  14391: "Doctorate / PHD",
  14392: "Attorney",
  14393: "Finance",
  14394: "Veterinarian",
  14395: "Nurse",
  14396: "Psychologist",
  14397: "Therapist",
  14398: "Nutritionist",
  14399: "Teacher",
  14400: "Self Employed (generic)",
  14401: "W-2 (generic)",
  14402: "Sales",
  14403: "Other",
};

// lead_source Mapping fields

const leadSourceMapping = {
  14748: "LinkedIn Ad",
  14749: "Outbound List (Discovery Data)",
  14750: "MM Outbound",
  14758: "SLT Contact Form",
  14771: "Affiliate Referral",
  14841: "SLT Client Advisor",
  14842: "Direct Outreach",
  15131: "Conference",
  14885: "Prosperity Summit with Kim Butler",
  14887: "DD - LPL 11-15-22",
  14888: "DD - Raymond James 1 11-15-22",
  14891: "DD - Raymond James 2 11-15-22",
  14892: "DD - NWN - LI only. all states except ny, wa, ut, tx, fl, mt, wy, co",
  14788: "DD (Tx NWM NoBD)",
  14839: "DD Top LI NO BD (Tx,Ca,Wa,Fl,,Co)",
  14862: "Book1-EJ-allstates-yesphone-nodncs",
};

// comp_super_affiliate Mapping fields
const compSuperAffiliateMapping = {
  15129: "Caleb/Better Wealth",
  15130: "Dave Brandt",
};
//conference Mapping fields
const conferenceMapping = {
  15133: "Better Wealth/And Asset",
  15134: "Currence",
  15135: "Future Proof",
  15136: "Test Conference",
};

// time_zone Mapping fields
// const timeZoneMappingAffilate = {
//   14334: "Eastern Standard Time (EST)",
//   14335: "Central Standard Time (CST)",
//   14336: "Mountain Standard Time (MST)",
//   14337: "Mountain Standard Time (Arizona)",
//   14338: "Pacific Standard Time (PST)",
//   14339: "Hawaii-Aleutian Standard Time (HAST)",
//   14340: "Alaska Standard Time (AKST)",
//   14341: "Alaska (AK)",
//   14342: "Alaska Standard (AKS)",
//   14343: "Hawaii-Aleutian Time (HAT)",
//   14344: "Hawaii Standard Time (HST)",
//   14345: "Puerto Rico (PR)",
//   14346: "Coordinated Universal Time (UTC)",
// };

const timeZoneMappingAffilate = {
  14334: "EST",
  14335: "CST",
  14336: "MST",
  14337: "MST (Arizona)",
  14338: "PST",
  14339: "HAST",
  14340: "AKST",
  14341: "AK",
  14342: "AKS",
  14343: "HAT",
  14344: "HST",
  14345: "PR",
  14346: "UTC",
};

//  code for Affiliate Payload

function buildHubSpotAffiliatePayload(data = {}) {
  const properties = {
    //Picklist Mapping here

    // lead_owner: buildOwnerMapping(STL_Owner_Mapping[data?.lead_owner]) || null, // hubspot user
    // presenting_rep:
    //   buildOwnerMapping(STL_Owner_Mapping[data?.presenting_rep]) || null, // hubspot user
    // primary_phone_line_type:
    //   primaryPhoneLineTypeMapping[data?.primary_phone_line_type] || null,
    // phone_2_type: phone2TypeMappingAffiliate[data?.phone_2_type] || null,
    // // affiliate_status: affiliateStatusMapping[data?.affiliate_status] || null,
    // industry: industryMapping[data?.industry] || null,
    // profession: professionMapping[data?.profession] || null,
    // lead_source: leadSourceMapping[data?.lead_source] || null,
    // comp_super_affiliate:
    //   compSuperAffiliateMapping[data?.comp_super_affiliate] || null,
    // conference: conferenceMapping[data?.conference] || null,
    // time_zone: timeZoneMappingAffilate[data?.time_zone0] || null,

    lead_owner: data?.lead_owner
      ? buildOwnerMapping(STL_Owner_Mapping?.[data.lead_owner])
      : null, // hubspot user

    presenting_rep: data?.presenting_rep
      ? buildOwnerMapping(STL_Owner_Mapping?.[data.presenting_rep])
      : null, // hubspot user

    primary_phone_line_type: normalizePicklistValue(
      primaryPhoneLineTypeMapping,
      data?.primary_phone_line_type
    ),

    phone_2_type: normalizePicklistValue(
      phone2TypeMappingAffiliate,
      data?.phone_2_type
    ),

    affiliate_status: normalizePicklistValue(
      affiliateStatusMapping,
      data?.affiliate_status
    ),
    industry: normalizePicklistValue(industryMapping, data?.industry),

    profession: normalizePicklistValue(professionMapping, data?.profession),

    lead_source: normalizePicklistValue(leadSourceMapping, data?.lead_source),

    comp_super_affiliate: normalizePicklistValue(
      compSuperAffiliateMapping,
      data?.comp_super_affiliate
    ),

    conference: normalizePicklistValue(conferenceMapping, data?.conference),

    time_zone: normalizePicklistValue(
      timeZoneMappingAffilate,
      data?.time_zone0
    ),

    receives_texts_: data?.receives_texts || null,
    affiliate_nurturing_call: data?.affiliate_nurturing_call || null,

    n1st: data?.field_1st || null,
    n2nd: data?.field_2nd || null,
    n3rd: data?.field_3rd || null,
    affiliate_status_ivinex: data?.affiliate_status || null,
    conference_ivinex: data?.conference || null,

    draw_complete: data?.fa_draw || null,
    has_referrals_in_mind_asa: data?.has_referrals_in_mind_asap || null,
    has_referrals_in_mind_asa: data?.has_referrals_in_mind_asa || null,
    industry_ivinex: data?.industry || null,
    lead_description___special_notes: data?.lead_description__specia0 || null,
    lead_source_ivinex: data?.lead_source || null,
    of_year_an_agent_old: data?._of_years_an_agent_old || null,

    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    fields_changed: data?.fields_changed || null,
    date_setter_spoke_w__affiliate: data?.date_setter_spoke_w_affi || null,

    employment_type_s: data?.employment_type_s || null,
    field_30_day_income_s: data?.field_30_day_income_s || null,
    tome_zone_intake: data?.tome_zone_intake || null,
    lead_description__specia0: data?.lead_description__specia0 || null,
    date_of_last_contact: data?.date_of_last_contact || null,
    bd_andor_ria_rep: data?.bd_andor_ria_rep || null,
    date_of_birth__year: data?.date_of_birth__year || null,
    name_stated_on_vm: data?.name_stated_on_vm || null,
    date_of_fa_presentation: data?.date_of_fa_presentation || null,
    title: data?.title || null,
    marital_status_s: data?.marital_status_s || null,
    receives_texts: data?.receives_texts || null, //
    receives_texts_ivinex: data?.receives_texts || null, //
    vip_affiliate_ivinex: data?.vip_affiliate || null, //
    vip_affiliate: data?.vip_affiliate || null,
    revenue_share: data?.revenue_share || null,

    has_referrals_in_mind_asa_ivinex: data?.has_referrals_in_mind_asa || null, //
    affiliate_nurturing_call_ivinex: data?.affiliate_nurturing_call || null, //
    revenue_share_ivinex: data?.revenue_share || null, //
    comp_super_affiliate_ivinex: data?.comp_super_affiliate || null, //
    // _of_years_an_agent_new: data?._of_years_an_agent_new || null,
    email__personal_type: data?.email__personal_type || null,
    linkedin: data?.linkedin || null,
    date_of_first_client_referral: data?.date_of_first_client_refe || null,
    fa_draw: data?.fa_draw || null,
    field_1st: data?.field_1st || null,
    field_2nd: data?.field_2nd || null,
    field_3rd: data?.field_3rd || null,
    primary_address_1: data?.primary_address_1 || null,
    modified_by: data?.modified_by || null,
    modified_date: data?.modified_date || null,
    phone_2: data?.phone_2 || null,
    email___business2_type: data?.email__business2_type || null,
    spouse_has_loans_s: data?.spouse_has_loans_s || null,
    primary_address_2: data?.primary_address_2 || null,
    primary_city: data?.primary_city || null,
    no_sale_reason: data?.no_sale_reason || null,
    type_of_repayment_s: data?.type_of_repayment_s || null,
    fed_loan_payment_s: data?.fed_loan_payment_s || null,
    loan_status_s: data?.loan_status_s || null,
    actively_in_school_s: data?.actively_in_school_s || null,
    fed_loan_amount_s: data?.fed_loan_amount_s || null,
    click_on_convert_2: data?.click_on_convert_2 || null,
    click_on_convert_1: data?.click_on_convert_1 || null,
    primary_zip_code: data?.primary_zip_code || null,
    first_name: data?.first_name || null,
    last_name: data?.last_name || null,
    primary_phone: data?.primary_phone || null,
    email___business_type: data?.email__business_type || null,
    firm_name: data?.firm_name || null,
    primary_state: data?.primary_state || null,
    // time_zone0: data?.time_zone0,
    // affiliate_status_ivinex: data?.affiliate_status,
    // lead_source_ivinex: data?.lead_source,
    of_registered_states: data?._of_registered_states || null,
    // industry_ivinex: data?.industry,
    // conference_ivinex: data?.conference,
  };
  const cleanedProperties = cleanProps(properties);

  // 🔥 Critical safety check
  // if (!Object.keys(cleanedProperties).length) {

  // }

  return {
    properties: cleanedProperties,
  };
}

// Create Invoices Payload

function buildHubSpotInvoicePayload(data = {}) {
  const properties = cleanProps({
    clients_tutor__only_sel: data?.clients_tutor__only_sel1 || null,
    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    fields_changed: data?.fields_changed || null,
    dont_use_setter_if_25_: data?.dont_use_setter_if_25_ || null,
    hours_spent: data?.hours_spent || null,
    created_by: data?.created_by || null,
    project_description: data?.project_description || null,
    amount_of_expense_receip: data?.amount_of_expense_receip || null,
    expense_description: data?.expense_description || null,
    review_bonuses__processi: data?.review_bonuses__processi || null,
    marketing_bonuses: data?.marketing_bonuses || null,
    advanced_planning_activit: data?.advanced_planning_activit || null,
    affiliate_bonus: data?.affiliate_bonus || null,
    related_client: data?.related_client || null,
    no_sale_bonus_to_setter_: data?.no_sale_bonus_to_setter_ || null,
    hourly_rate: data?.hourly_rate || null,
    setter_name: data?.setter_name || null,
    sale_financing___recurri: data?.sale_financing___recurri || null,
    special_details: data?.special_details || null,
    amount_charged_today: data?.amount_charged_today || null,
    commission_: data?.commission_ || null,
    sales_commission: data?.sales_commission || null,
    clients_tutor__only_sel: data?.clients_tutor__only_sel || null,
    related_affiliate: data?.related_affiliate || null,
    additional_work_completed: data?.additional_work_completed || null,
    payment_type: data?.payment_type || null,
    date_reconciled: data?.date_reconciled || null,
    related_inquirer: data?.related_inquirer || null,
    related_client_processin: data?.related_client_processin || null,
    special_notes: data?.special_notes || null,
    related_client_recertifc: data?.related_client_recertifc || null,
    aar_sale_amount: data?.aar_sale_amount || null,
    payment_arrangementtrade: data?.payment_arrangementtrade || null,
    modified_date: data?.modified_date || null,
    modified_by: data?.modified_by || null,
    tutor_sale_amount: data?.tutor_sale_amount || null,
    payment_arrangement: data?.payment_arrangement || null,
    dont_use__setter_if_50_: data?.dont_use__setter_if_50_ || null,
    special_arrangements_deta: data?.special_arrangements_deta || null,
    created_date: data?.created_date || null,
    date_of_activity: data?.date_of_activity || null,
    contractor_name: data?.contractor_name || null,
    sales_category_report_cc: data?.sales_category_report_cc || null,
    invoice_category: data?.invoice_category || null,
    total_sale_amount: data?.total_sale_amount || null,
    total_invoice_amount: data?.total_invoice_amount || null,
    first_name: data?.first_name,
    last_name: data?.last_name || null,
    aar_activity_commission: data?.aar_activity_commission || null,
    processing_activity: data?.processing_activity || null,
    clients_tutor__only_sel0: data?.clients_tutor__only_sel0 || null,
  });

  if (!Object.keys(properties).length) {
    throw new Error("❌ Invoice payload is empty");
  }

  return { properties };
}

// clients picklist value mapped here

//tutor_name picklist mapping

const clientsNameMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

// processor_name picklist mapping

const processorNameMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

//slt_referring_rep_nfm picklist mapping
const sltReferringRepNfm = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};
//phone_1_type Mapping fields
const phone1TypeMappingClient = {
  11174: "Cell",
  11175: "Home",
  11176: "Work",
};

//phone_2_type Mapping fields
const phone2TypeMappingClient = {
  11178: "Cell",
  11179: "Home",
  11180: "Work",
};

//time_zone Mapping fields
const timeZoneMapping = {
  11203: "Eastern Standard Time (EST)",
  11204: "Central Standard Time (CST)",
  11205: "Mountain Standard Time (MST)",
  13057: "Mountain Standard Time (Arizona) (MST)",
  11206: "Pacific Standard Time (PST)",
  11207: "Hawaii–Aleutian Standard Time (HAST)",
  11208: "Alaska Standard Time (AKST)",
  13399: "Hawaii Standard Time (HST)",
};
// status Mapping fields
const statusMapping = {
  // 13383: "(please select)",
  15073: "Pending - No Sale - Tutor Following Up",
  15021: "Pending - No Sale - Outstanding Invoice",
  14995: "Tutor Strategy Call Needed / Work Order Review",
  14208: "New Client Pending - Intake Scheduled",
  14195: "No Show Intake - Tutor Following Up",
  11893: "Gathering",
  13379: "Waiting to Submit",
  11894: "App Submitted",
  14185: "Ready for Sign-Off",
  11556: "- Complete -",
  15320: "Processor Consultation in Process",
  11558: "Manual AAR Booking in Process",
  13786: "AAR - Booked",
  15252: "AAR - No Show - Rescheduling",
  11895: "AAR - Gathering",
  11896: "AAR - App Submitted",
  13385: "INACTIVE (Select Reason)",
  14929: "IA Client ONLY",
  12712: "Test",
  14197: "Training",
};

// inactive_specifics Mapping fields
const inactiveSpecificsMapping = {
  13788: "Tutor Escalation/Rehash Needed",
  13790: "Self-Managed Recert",
  15199: "Self-Managed - Can't Afford Services",
  13791: "In School",
  13792: "Do Not Call",
  14184: "Loans Forgiven",
  13789: "Paying Loans In Full",
  14209: "Client Refinanced",
  14883: "Deceased",
  14886: "Bankruptcy",
  13787: "MIA",
  13793: "MIA - Processor Final Escalation Needed",
  15094: "Tutor No Sale or Refunded",
};

//current_idr_plan Mapping fields
const currentIdrPlanMapping = {
  // 15251: "(please select)",
  15244: "SAVE",
  15245: "IBR",
  15327: "IBR New - After 07/01/2014",
  15246: "ICR",
  15247: "PAYE",
  15273: "MULTIPLE",
  15250: "IDR-Alternative",
  15243: "None - Balance Based",
  15248: "None - In School",
  15249: "None - Default",
};

//type_of_idr_app_submitted Mapping fields
const typeOfIdrAppSubmittedMapping = {
  // 15253: "(please select)",
  15254: "Enter into IDR - SAVE",
  15255: "Enter into IDR - IBR",
  15256: "Enter into IDR - PAYE",
  15257: "Enter into IDR - ICR",
  15258: "Plan Change - to SAVE",
  15260: "Plan Change - to PAYE",
  15259: "Plan Change - to IBR",
  15261: "Plan Change - to ICR",
  15262: "Recertification",
  // 15263: "Recalculation",
  15308: "Multiple IDR Plans",
};

// client_is_pslf_ Mapping fields
const clientIsPslfMapping = {
  // 13004: "(please select)",
  13001: "No",
  13002: "Yes",
  13003: "Yes - New Enrollment",
  15283: "No plan to Fulfil 120 mo. req.",
  13033: "Plans to open Non-Profit",
  13034: "Maybe Someday",
};
//calculation_performed_by Mapping fields
const calculationPerformedByMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

//aar_fee Mapping fields
// const aarFeeMapping = {
//   11552: "$250",
//   11493: "$450",
//   13370: "$600",
//   15325: "$800",
//   14253: "$400 (Low Bal./Spouse)",
//   14200: "$300 (F&F)",
//   13130: "Other (Trade etc.)",
// };
const aarFeeMapping = {
  11552: "$250",
  11493: "$450",
  13370: "$600",
  15325: "$800",
  14253: "$400 (Low Bal/Spouse)", // Removed period after Bal
  14200: "$300 (F&F)",
  13130: "Other (Trade etc)", // Removed period after etc
};
//current_servicer Mapping fields
const currentServicerMapping = {
  // 11964: "(Please Select)",
  11969: "Multiple Servicers",
  11965: "Nelnet.studentaid.gov",
  13043: "Mohela.com (FFEL)",
  15239: "Servicing.Mohela.com",
  15071: "Mohela.studentaid.gov",
  14202: "AidVantage.studentaid.gov",
  13044: "Edfinancial.studentaid.gov", // ✅ fixed
  15168: "CRI.studentaid.gov",
  15051: "Sloanservicing.com (FFEL)",
  13041: "A.E.S. (FFEL)",
  13155: "UHEAA (FFEL)",
  13047: "Aspire (FFEL)",
  13048: "-Collections Agency",
  15040: "N/A - HF Client only",
  11968: "Great Lakes (Inactive)",
  11966: "Navient (Inactive)",
  11967: "FedLoan (Inactive)",
  13042: "A.C.S. (Inactive)",
  13254: "OSLA (Inactive)",
  13045: "Cornerstone (Inactive)",
  15176: "FFEL - servicing.mohela.com",
  14212: "Trellis (Higher Ed)",
  13046: "Granite State (Inactive)",
};
// new_client_or_aar0 Mapping fields
const newClientOrAar0Mapping = {
  15178: "New Client",
  15179: "Annual Review",
};

//does_client_have_a_financ Mapping fields
const doesClientHaveAFinancMapping = {
  15182: "Yes",
  15183: "No",
};
//slt_referring_rep_nfm Mapping fields
const sltReferringRepNfmMapping = {
  53: "Adam Deutsch",
  26: "Amie Engberg",
  68: "Anica Vasquez",
  56: "Api User",
  100: "Carlee Finlinson",
  94: "Chris Mcginnis",
  67: "Christopher Michael",
  66: "Csaba Soos",
  71: "Dani Lynch",
  33: "Derek Snel",
  42: "Genevieve Bronson",
  93: "Heather Ballard",
  96: "Jamison Ryan",
  101: "Jarom Bischoff",
  92: "Jennifer Sbaiti",
  62: "Joe Fiacco",
  95: "Joseph Bronson",
  84: "Julia Guerin",
  99: "Juvane Real",
  58: "Kelli Case",
  75: "Kerry Derry",
  69: "Kevin Harvey",
  98: "Maitri Chheda",
  70: "Matt Bronson",
  14: "Michael Wheelwright",
  81: "Misha Theofilatos",
  102: "Nadia McCrary",
  97: "Nadine Lochtefeld",
  90: "Nadya Fejeran",
  87: "Rachael Davis",
  79: "Rocky Christensen",
  77: "Sabrina Adamson",
  55: "Sara Redman",
  86: "Sasha Miller",
  47: "Savannah Ferra",
  88: "Shade Conover",
  89: "Stefano Quarta",
  80: "Stephanie Hassoldt",
  52: "Terni Blood",
  73: "Thatcher Norton",
  41: "Tony Ferra",
  83: "Victor Martell",
  49: "Zack Geist",
};

//ia_inquirer_status Mapping fields

// TODO : check this, Commented because of error only allowed field value is "DON'T BOOK APC!
const iaInquirerStatusMapping = {
  13380: "DON'T BOOK APC!",
  // 13238: "Missed Apt.",
  // 13394: "Priority Case (likely)",
  // 13032: "Following Up",
  // 13235: "Client in Progress",
  // 13135: "Active Client (Schedule with Current Advisor)",
  // 15186: "Inactive Client",
  // 13069: "Advisor Long Term Scheduled F/U",
  // 13026: "No Sale - Own Plan in Place",
  // 13241: "No Sale - MIA",
  // 13289: "No Sale - Offer APC Next Year",
  // 13290: "No Sale - Advisor F/U OK",
  // 13291: "No Sale - Don't Offer APC",
  // 13318: "No Sale - No $",
  // 15097: "Lost Opp (MIA)",
  // 15098: "Lost Opp (Health)",
  // 15099: "Lost Opp (Competitor)",
  // 15100: "Lost Opp (Misc.)",
  // 13246: "Advisor Final F/U Needed",
  // 14914: "Please book at AAR",
  // 13237: "Advisor F/U With Securities Option",
  // 15034: "Julia G. Transferred",
  // 14999: "Katie J. Transferred",
  // 14850: "No Sale - Matt",
  // 14890: "Pending Scheduling",
  // 14183: "Active HF Client (Securities Only)",
  // 14849: "Active HF Client (Matt)",
  // 13027: "Advisor Short Term Scheduled F/U",
};

// solic_agent Mapping fields
const solicAgentMapping = {
  15036: "Michael Wheelwright",
  15037: "Tony Ferra",
  15038: "Julia G.",
  15039: "Multiple",
};
// ia_insurance_status Mapping fields

const iaInsuranceStatusMapping = {
  13283: "App Appointment Set",
  15104: "App Rescheduling",
  15102: "Waiting for Licensing",
  15103: "Client Signature Needed",
  13285: "Underwriting Pending",
  13287: "Client Acceptance Pending",
  13288: "Completed/Active",
  15149: "Client Contact Needed",
  13292: "Advisor Action Needed",
  15187: "Surrendered Policy",
};
//ia_securities_status Mapping fields
const iaSecuritiesStatusMapping = {
  15140: "App Apt Set",
  15141: "App Rescheduling",
  15142: "Waiting on Licensing",
  15143: "Processing",
  15144: "Client Signature Needed",
  15145: "ACH Form Pending",
  15146: "Account Pending Funding",
  15147: "Complete/Active",
  15148: "Client Contact Needed",
  15150: "Advisor Action Needed",
  15188: "Closed/Cancelled Accounts",
};

//ia_type_of_client Mapping fields
const iaTypeOfClientMapping = {
  14922: "LI - Term Only",
  14923: "LI - Whole Only",
  14924: "JAV/Brokerage Only",
  14925: "CRIA Only",
  14926: "LI + CRIA Annual Required",
  14927: "LI + JAV Non-annual required",
  15151: "CRIA+JAV Securities Only",
};
//fulfillment_company Mapping fields
const fulfillmentCompanyMapping = {
  15026: "Mass Mutual",
  15027: "Guardian",
  15028: "Other",
};

// client status Mapping fields

// const clinetStatusMapping = {

//   15073: "Pending - Tutor Following Up",
//   15021: "Pending - Outstanding Invoice",
//   14208: "Pending - Intake Scheduled"

// };

const clinetStatusMapping = {
  // ✅ Direct mappings
  15073: "Pending - Tutor Following Up",
  15021: "Pending - Outstanding Invoice",
  14208: "Pending - Intake Scheduled",

  // 🔁 Follow-up related → Tutor Following Up
  14995: "Pending - Tutor Following Up",
  14195: "Pending - Tutor Following Up",

  // 🔁 Process / pipeline → Intake Scheduled
  11893: "Pending - Intake Scheduled",
  13379: "Pending - Intake Scheduled",
  11894: "Pending - Intake Scheduled",
  14185: "Pending - Intake Scheduled",
  11556: "Pending - Intake Scheduled",
  15320: "Pending - Intake Scheduled",
  11558: "Pending - Intake Scheduled",
  13786: "Pending - Intake Scheduled",
  15252: "Pending - Intake Scheduled",
  11895: "Pending - Intake Scheduled",
  11896: "Pending - Intake Scheduled",

  // 🔴 INACTIVE (special handling)
  13385: "Pending - Tutor Following Up",
};

const lpaMsaSentFromMapping = {
  // 15196: "", // (please select) → usually send empty / null
  15193: "SLT - docs@studentloantutor.com",
  15194: "SLP - docs@studentloanprocessor.com",
  15195: "SLP.NET - docs@studentloanprocessing.net",
};

const professionMappingClient = {
  // 12734: "", // Blank → send null/empty
  13381: "Unknown",
  12735: "Chiropractor",
  12736: "Naturopath",
  12737: "Acupuncturist",
  12738: "Dentist",
  12739: " Medical Practitioner",
  12740: "Teacher",
  12741: "Multiple",
  13066: "Veterinarian",
  12743: "Sales",
  12744: "Finance",
  12745: "Self Employed (Generic)",
  12742: "W-2 (Generic)",
  14905: "Financial Advisor",
  13326: "Therapist",
  14188: "Attorney",
  14189: "Nutritionist",
  14193: "Doctorate (PHD)",
  14194: "Nurse",
  14848: "Pharmacist",
  14902: "Psychologist",
  14913: "Physician",
  14947: "Orthodontist",
  12748: "Optometrist",
  14968: "Other",
};

function mapSpouseLoans(value) {
  if (!value) return "Unknown";

  const normalized = value.toLowerCase().trim();

  if (["yes", "y", "true"].includes(normalized)) return "Yes";
  if (["no", "n", "false", "nope"].includes(normalized)) return "No";

  return "Unknown";
}

function convertToHubspotDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

// Create Clients Payload

function buildHubSpotClientPayload(data = {}) {
  function toTimestamp(dateStr) {
    return dateStr ? new Date(dateStr).getTime() : null;
  }
  const properties = cleanProps({
    // picklist Mapping fields:-

    tutor_name: buildOwnerMapping(clientsNameMapping[data?.tutor_name]) || null, // hubspot user
    processor_name:
      buildOwnerMapping(processorNameMapping[data?.processor_name]) || null, // hubspot user

    slt_referring_rep_nfm:
      buildOwnerMapping(sltReferringRepNfm[data?.slt_referring_rep_nfm]) ||
      null, // hubspot user
    calculation_performed_by:
      buildOwnerMapping(
        calculationPerformedByMapping[data?.calculation_performed_by]
      ) || null, //hubspot user

    phone_1_type: normalizePicklistValue(
      phone1TypeMappingClient,
      data?.phone_1_type
    ),
    phone_2_type: normalizePicklistValue(
      phone2TypeMappingClient,
      data?.phone_2_type
    ),
    time_zone: normalizePicklistValue(timeZoneMapping, data?.time_zone0),
    status: normalizePicklistValue(statusMapping, data?.status1),
    current_idr_plan: normalizePicklistValue(
      currentIdrPlanMapping,
      data?.current_idr_plan
    ),
    type_of_idr_app_submitted: normalizePicklistValue(
      typeOfIdrAppSubmittedMapping,
      data?.type_of_idr_app_submitted
    ),
    aar_fee: normalizePicklistValue(aarFeeMapping, data?.aar_fee),
    current_servicer: normalizePicklistValue(
      currentServicerMapping,
      data?.current_servicer0
    ),
    ia_inquirer_status: normalizePicklistValue(
      iaInquirerStatusMapping,
      data?.hf_apc_booking_status
    ),
    lpamsa__sent_from: normalizePicklistValue(
      lpaMsaSentFromMapping,
      data?.lpamsa__sent_from
    ),
    profession: normalizePicklistValue(
      professionMappingClient,
      data?.profession0
    ),
    // spouse_has_loans_
    // : normalizePicklistValue(spouseHasLoansMapping,data?.spouse_has_loans,),
    client_status: normalizePicklistValue(clinetStatusMapping, data?.status1),
    // inactive_specifics: normalizePicklistValue(inactiveSpecificsMapping,data?.inactive_specifics,),
    // apc_status: normalizePicklistValue(apcStatusMapping,data?.apc_booking_status_no_lo,),

    spouse_has_loans_: mapSpouseLoans(data?.spouse_has_loans),

    client_is_pslf_: normalizePicklistValue(
      clientIsPslfMapping,
      data?.client_is_pslf0
    ),
    // new_client_or_aar0: newClientOrAar0Mapping[data?.new_client_or_aar0] ||null, // hubspot missing fileds
    // does_client_have_a_financ: doesClientHaveAFinancMapping[data?.does_client_have_a_financ] ||null, // hubspot missing fileds
    // solic_agent: solicAgentMapping[data?.solic_agent] ||null, // hubspot missing fields
    // ia_insurance_status: iaInsuranceStatusMapping[data?.ia_insurance_status] ||null, // hubspot missing fields
    // ia_securities_status: iaSecuritiesStatusMapping[data?.ia_securities_status] ||null, // hubspot missing fields
    // ia_type_of_client: iaTypeOfClientMapping[data?.ia_type_of_client] ||null, // hubspot missing fields
    // fulfillment_company: fulfillmentCompanyMapping[data?.fulfillment_company] || null, // hubspot missing fields
    // client_consolidation___loan_type_description:
    //   data?.client_consolidation__lo ||null,
    // client_avg__interest_rate: data?.client_avg_interest_rate || null,
    // idr_app_submitted_date:data?.idr_app_submitted_date ||null,

    // work_orders: data?.work_order_notes || null,

    spouse_has_loans_ivinex: data?.spouse_has_loans_ivinex || null,

    idr_app_submitted_date: data?.idr_app_submitted_date
      ? (() => {
          const d = new Date(data.idr_app_submitted_date);
          d.setUTCHours(0, 0, 0, 0);
          return d.getTime();
        })()
      : null,

    n2nd_date__if_2_sets_: data?.field_2nd_date_if_2_sets
      ? (() => {
          const d = new Date(data.field_2nd_date_if_2_sets);
          d.setUTCHours(0, 0, 0, 0);
          return d.getTime();
        })()
      : null,

    pslf_2nd_forgiveness_date: data?.pslf_2nd_forgiveness_date
      ? (() => {
          const d = new Date(data.pslf_2nd_forgiveness_date);
          d.setUTCHours(0, 0, 0, 0);
          return d.getTime();
        })()
      : null,

    recert_date: data?.recert_date
      ? (() => {
          const d = new Date(data.recert_date);
          d.setUTCHours(0, 0, 0, 0);
          return d.getTime();
        })()
      : null,

    middle_name: data?.middle_initialname || null,
    nickname: data?.nickname || null,
    maiden_name: data?.maiden_name || null,
    profession_detail: data?.profession_details || null,
    profession_details: data?.profession_details || null,
    contact_notes: data?.contact_notes || null,
    spouse_name: data?.spouse_name || null,
    n2nd_contact_notes: data?.field_2nd_contact_notes0 || null,
    unpaid_invoice: data?.unpaid_invoice || null,

    // spouse_has_loans_:data?.spouse_has_loans ||null,

    hs_object_id: data?.hs_object_id || null,
    servicer___username: data?.servicer__username || null,
    servicer___password: data?.servicer__password || null,
    payment_problem_to_resolve: data?.payment_problem_to_resolve || null,
    collection_notes: data?.collection_notes || null,
    date_calculation_ran: data?.date_calculation_ran || null,
    spouse___ssn: data?.spouse__ssn || null,
    work_order_notes: data?.work_order_notes || null,

    spouse___date_of_birth:
      convertToHubspotDate(data?.spouse__date_of_birth) || null,
    multiple__which_servicers_: data?.multiple__which_servicer || null,
    self_employed____ein: data?.self_employed__ein0 || null,

    pslf_employment_date_range_1: data?.pslf_employment_date_rang1 || null,
    pslf_employment_date_range_2: data?.pslf_employment_date_rang2 || null,
    pslf_employment_date_range_3: data?.pslf_employment_date_rang || null,
    pslf_employment_date_range_4: data?.pslf_employment_date_rang0 || null,
    //  affiliate_referral:data?.referring_affiliate ||null,

    // est__forgiveness_date:data?.pending_forgiveness || null,
    pslf_forgiveness_date: data?.pslf_forgiveness_date
      ? new Date(data?.pslf_forgiveness_date).getTime()
      : null,
    idr_recert_app_sub_deadline: data?.idr_recert_app_sub_deadli
      ? new Date(data?.idr_recert_app_sub_deadli).getTime()
      : null,
    idr_plan_ends: data?.idr_plan_ends
      ? new Date(data?.idr_plan_ends).getTime()
      : null,
    pslf_notes: data?.pslf_notes || null,

    social_security_number: data?.social_security_number
      ? Number(data.social_security_number.replace(/-/g, ""))
      : null,
    employer_business_name: data?.employerbusiness_name || null,
    // next_payment_due:data?.next_payment_due0 ||null,
    next_payment_due: data?.next_payment_due0
      ? new Date(data.next_payment_due0.split(" ")[0]).getTime()
      : null,

    // client_action_taken:data?.client_action_taken || null,
    client_action_taken: data?.client_action_taken
      ? new Date(data.client_action_taken.split(" ")[0]).getTime()
      : null,
    idr_monthly_payment_amount: data?.idr_monthly_payment_amoun || null,
    // days_since_action_taken:data?.days_since_action_taken || null,
    msa_received: data?.msa_received0 || null,
    intake_call_complete: data?.intake_call_complete || null,
    balance_at_save_enrollment: data?.balance_at_save_enrollmen || null,
    ibr_update_sent_to_client: data?.ibr_update_sent_to_client || null,
    consol_app_submit_date: data?.consol_app_submit_date
      ? new Date(data.consol_app_submit_date.split(" ")[0]).getTime()
      : null,
    // apc_booked:data?.apc_booked ||null,
    // apc_notes:data?.apc_notes || null,

    weighted_interest_rate: data?.weighted_interest_rate || null,
    calc_doc_in_drive: data?.calc_doc_in_drive || null,
    myaiddata_in_drive: data?.myaiddata_in_drive || null,
    // lpamsa__sent_from:data?.lpamsa__sent_from || null, // picklist mapping
    msa_sent: data?.msa_sent_ || null,
    spousal_consol_loans: data?.spousal_consol_loans || null,
    estimations_current_as_of: data?.estimations_current_as_of || null,
    estimated_tax_implication: data?.estimated_tax_implication || null,
    months_toward_forgiveness: data?.months_toward_forgiveness || null,
    est__forgiveness_date: data?.est_forgiveness_date0 || null,
    current_year_principal_bal: data?.current_year_principal_ba || null,
    n2nd_date__if_2_sets_: data?.field_2nd_date_if_2_sets || null,
    pslf_date_updated: data?.pslf_date_updated || null,
    pslf_employer_1: data?.pslf_employer_1 || null,
    pslf_employer_2: data?.pslf_employer_2 || null,
    pslf_employer_3: data?.pslf_employer_3 || null,
    pslf_employer_4: data?.pslf_employer_4 || null,
    qualifying_payment_period_1: data?.qualifying_payment_period1 || null,
    qualifying_payment_period_2: data?.qualifying_payment_period2 || null,
    qualifying_payment_period_3: data?.qualifying_payment_period0 || null,
    qualifying_payment_period_4: data?.qualifying_payment_period || null,
    client_int_in_slt_nonprofit_program: data?.client_int_in_slt_nonpr0 || null,
    pslf_date_last_signed_1: data?.pslf_date_last_signed_1 || null,
    pslf_date_last_signed_2: data?.pslf_date_last_signed_2 || null,
    pslf_date_last_signed_3: data?.pslf_date_last_signed_3 || null,
    pslf_date_last_signed_4: data?.pslf_date_last_signed_4 || null,
    pslf_verified_qualifying_payments_total:
      data?.pslf_verified_qualifying_ || null,
    employer_city: data?.employers_city || null,
    studentaidgov_user_not_needed: data?.studentaidgov_user_not_0 || null,
    studentaidgov_pass_not_needed: data?.studentaidgov_pass_not_0 || null,
    loan_2_months_toward_forgiveness: data?.months_toward_forgiveness || null,
    security_qas: data?.security_qas || null,
    email_created_for_nelnet_6digit_security_code:
      data?.nelnet_security_code_emai || null,
    nelnet_security_code_email_password:
      data?.nelnet_security_code_emai0 || null,

    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    fields_changed: data?.fields_changed || null,
    created_by: data?.created_by || null,
    modified_by: data?.modified_by || null,
    modified_date: data?.modified_date || null,
    phone_2: data?.phone_2 || null,
    email_2: data?.email_2 || null,
    address_1: data?.address_1 || null,
    address_2: data?.address_2 || null,
    city: data?.city || null,
    state: data?.state || null,
    zip: data?.zip || null,
    spouse__partner: data?.spouse__partner || null,
    msa_received0: data?.msa_received0 || null,
    lpa_sent: data?.lpa_sent || null,
    lpa_received: data?.lpa_received || null,
    client_household_size_notes: data?.client_household_size_not || null,
    client_income_doc_notes: data?.client_income_doc_notes || null,
    // primary_phone:data?.primary_phone ||null,
    // secondary_phone:data?.secondary_phone ||null,
    // referral: data?.referrals || null,
    // idr_app_submitted_date: data?.idr_app_submitted_date,
    // days_since_app_sub: data?.days_since_app_sub,
    // days_since_app_sub: data?.days_since_app_sub || null,
    error_with_payments: data?.error_with_payments || null,
    date_of_birth: data?.date_of_birth || null,
    phone_1: data?.primary_phone0 || null,
    primary_phone_type: data?.primary_phone_type || null,
    secondary_phone: data?.secondary_phone || null,
    secondary_phone_type: data?.secondary_phone_type || null,
    employerbusiness_name: data?.employerbusiness_name || null,
    employer_address: data?.employer_address || null,
    employers_city: data?.employers_city || null,
    employers_state: data?.employers_state || null,
    reference_1_name: data?.reference_1_name || null,
    reference_1_address: data?.reference_1_address || null,
    reference_1_city: data?.reference_1_city || null,
    reference_1_state: data?.reference_1_state || null,
    reference_1_zip: data?.reference_1_zip_ || null,
    reference_2_name: data?.reference_2_name || null,
    reference_2_address: data?.reference_2_address || null,
    reference_2_city: data?.reference_2_city || null,
    reference_2_state: data?.reference_2_state || null,
    reference_2_zip: data?.reference_2_zip || null,

    spouse__full_name: data?.spouse__full_name_ || null,
    spouse__date_of_birth: data?.spouse__date_of_birth || null,
    maidenformer_name: data?.maidenformer_name || null,
    spouse__ssn: data?.spouse__ssn || null,
    spouse___email: data?.spouse__email || null,
    spouse___phone: data?.spouse__phone || null,
    spouse__loan_amount: data?.spouse__loan_amount || null,
    spouse_loan_amount: data?.spouse__loan_amount || null,

    employer_info_: data?.employer_info_ || null,
    personal_reference: data?.personal_reference || null,
    spouse_info: data?.spouse_info || null,

    q26_spouse_income_changed0: data?.q26_spouse_income_changed0 || null,
    desired_servicer_s: data?.desired_servicer_s || null,
    borrower_actual_agi_0: data?.borrower_actual_agi_0 || null,
    state_s: data?.state_s || null,
    actual_combined_agi_s: data?.actual_combined_agi_s || null,
    spouse_actual_agi_s: data?.spouse_actual_agi_s || null,
    desired_repay_plan_s: data?.desired_repay_plan_s || null,
    q1_balance_based_type_s: data?.q1_balance_based_type_s || null,
    q1_and_q2_desired_repay_p0: data?.q1_and_q2_desired_repay_p0 || null,
    q5_dependent_children_s: data?.q5_dependent_children_s || null,
    q6_other_dependents_s: data?.q6_other_dependents_s || null,
    q7_marital_status_s: data?.q7_marital_status_s || null,
    q10_employment_type_s: data?.q10_employment_type_s || null,
    q20_filed_taxes_last_2_yr0: data?.q20_filed_taxes_last_2_yr0 || null,
    q23_separated_from_spouse0: data?.q23_separated_from_spouse0 || null,
    q24_sp_income_access_s: data?.q24_sp_income_access_s || null,
    q8_filed_taxes_last_2_yrs: data?.q8_filed_taxes_last_2_yrs || null,
    filed_taxes_last_2_yrs0: data?.filed_taxes_last_2_yrs0 || null,
    q25_spouse_filed_taxes_s: data?.q25_spouse_filed_taxes_s || null,
    q15_you_and_spouse_filed_0: data?.q15_you_and_spouse_filed_0 || null,
    q21_income_change_since_l0: data?.q21_income_change_since_l0 || null,
    q22_taxable_income_s: data?.q22_taxable_income_s || null,

    reference_1_phone: data?.reference_1_phone || null,
    reference_1_relationship: data?.reference_1_relationship || null,
    reference_2_phone: data?.reference_2_phone || null,
    reference_2_relationship: data?.reference_2_relationship || null,
    employers_zip: data?.employers_zip
      ? parseInt(data.employers_zip.toString().replace(/,/g, "").trim(), 10)
      : null,

    roa_sent_to_servicer: data?.roa_sent_to_servicer || null,
    desired_servicer_s: data?.servicer_account_ || null,
    // time_zone0: data?.time_zone0,
    // client_current_plan_idr_history: data?.client_current_planidr_h,
    // primary_phone0: data?.primary_phone,
    // days_to_recert: data?.days_to_recert || null,
    // recert_date: data?.recert_date || null,
    // possible_testimonial: data?.possible_testimonial,
    // mn_client: data?.mn_client,
    // ny_client: data?.ny_client,
    // ca_client: data?.ca_client,
    // referred_to_slp: data?.referred_to_slp,
    // double_consol_ppl_in_progress: data?.double_consol_ppl_in_prog,
    // special_calculation_notes: data?.special_calculation_notes,
    import_id: data?.import_id || null,
    mass_update: data?.mass_update_ || null,
    servicer_account: data?.servicer_account_ || null,
    first_year_of_payment: data?.first_year_of_payment,
    pp_tags_active: data?.pp_tags_active,
    current_year_total_balance: data?.current_year_total_balanc || null,
    calculator_report_link: data?.calculator_report_link || null,
    payment_problem_to_resolve: data?.payment_problem_to_resolv || null,
    current_ffel_loans: data?.current_ffel_loans,
    email_address: data?.email_address || null,

    first_name: data?.first_name || null,
    last_name: data?.last_name || null,
    n2nd_contact___first_name: data?.first_name || null,
    n2nd_contact___last_name: data?.last_name || null,
    n2nd_contact___email: data?.email_1 || null,
    n2nd_contact___phone: data?.primary_phone || null,
    client_name: data?.client_name || null,
    email_1: data?.email_1 || null,
    spouse_has_loans_ivinex: data?.spouse_has_loans || null,
  });

  // logger.info("Cleaned properties:", properties);

  if (Object.keys(properties).length === 0) {
    throw new Error("Client payload is empty");
  }

  return { properties };
}

// Picklist Mapping Work Order

// employment_type Mapping fields
const employmentTypeMapping = {
  // 15056: "(please select)",
  15053: "Self Employed - Business Owner",
  15054: "Self Employed - No Entity Set Up Yet",
  // 15067: "Self Employed - 1099",
  15055: "W2 Employee",
  15059: "Multiple (Self Employed/W2)",
  15057: "Unemployed",
  15172: "Retired",
};

// income_doc_type Mapping fields
const incomeDocTypeMapping = {
  // 11929: "(please select)",
  12037: "Multiple Sources",
  11932: "Payroll / Pay Stub",
  11933: "SCDI / Income Letter",
  11930: "1040",
  11931: "1099 (Most Recent Year Only)",
  13259: "W2 (Most Recent Year Only)",
  15213: "Social Security",
  11957: "Unemployment Income",
  12708: "No Income/Between Jobs",
};
// marital_status Mapping fields

const maritalStatusMappingOrder = {
  // 11911: "(please select)",
  11913: "Single",
  11915: "Engaged",
  11912: "Married",
  11916: "Separated",
  11914: "Divorced",
};
// most_recent_tax_filing_st Mapping fields
const mostRecentTaxFilingStatusMapping = {
  // 11917: "(please select)",
  11918: "Single",
  11919: "Married Filing Jointly - With Access",
  11955: "Married Filing Jointly - No Access",
  12991: "Married Filing Separately - No Access",
  12728: "Married but Separated - No Access",
  11920: "Married Filing Separately - With Access (Only for IBR, PAYE)",
};
// tax_saving_status_apc Mapping fields
const taxSavingStatusApcMapping = {
  // 14762: "(please select)",
  14764: "Financial Advisor Intro Set",
  14763: "APC Set",
  15075: "Booking Link Sent",
  15074: "Reminder after IDR Approval",
  14765: "Insufficient Cashflow",
  14770: "PSLF Objections",
  14846: "Personal Plan in Place",
  14769: "Wants to Wait",
  14766: "Refused",
  14767: "APC Already Happened",
  14775: "Financial Partner Referral",
};
// type0 Mapping fields
const type0Mapping = {
  // 15018: "(please select)",
  15017: "Current Client",
  15016: "New Client",
};

// work_needed Mapping fields
const workNeededMapping = {
  11890: "Annual Recertification of IDR",
  11907: "Annual Recertification of IDR",

  11889: "Recalculation of Current IDR",
  12871: "Change to Different IDR",

  15287: "Enter into IDR Plan from Balanced Based",
  15020: "Enter into IDR Plan from Balanced Based",

  12758: "Consolidation Out of Default",

  // Confirm with business:
  15019: "Full Consolidation",
  14989: "Full Consolidation",
  11954: "Consolidation Out of Default",
};

// pslf mapping fields
const pslfMapping = {
  12725: "Yes - Not Yet Enrolled",
  11945: "Yes - Already Enrolled",
  11946: "No",
  // 11947: "In Process",
};
//forbearance_needed mapping fields

const forbearanceNeededMapping = {
  12705: "no",
  12706: "yes",
  15022: "yes_past__due",
};

//hh_size__income_threshol mapping fields
const hhSizeIncomeThresholdMapping = {
  // 15225: "(please select)",
  12966: "HH1 - $32805",
  12967: "HH2 - $44370",
  12968: "HH3 - $55935",
  12969: "HH4 - $67500",
  12970: "HH5 - $79065",
  12971: "HH6 - $90630",
  12972: "HH7 - $102195",
  12973: "HH8 - $113760",
  12974: "HH9 - $125325",
  12975: "HH10 - $136890",
  12976: "HH11 - $148455",
  12977: "HH12 - $160020",
  12978: "HH13 - $171585",
  12979: "HH14 - $183150",
  12980: "HH15 - $194715",
  12981: "HH16+ - add $11565 each",
};
//field_2025_ibrpaye__15 mapping fields
const field2025Ibrpaye15Mapping = {
  // 15226: "(please select)",
  15218: "HH1 - $23475",
  15219: "HH2 - $31725",
  15220: "HH3 - $39975",
  15221: "HH4 - $48225",
  15222: "HH5 - $56475",
  15223: "HH6 - $64725",
  15224: "HH7 - $72975",
  15235: "HH8 - $81225",
  15277: "HH9 - $89475",
  15278: "HH10 - $97725",
};
//field_2025_icr__20 mapping fields
const field2025Icr20Mapping = {
  // 15227: "(please select)",
  15228: "HH1 - $15650",
  15229: "HH2 - $21150",
  15230: "HH3 - $26650",
  15231: "HH4 - $32150",
  15232: "HH5 - $37650",
  15233: "HH6 - $43150",
  15234: "HH7 - $48650",
  15276: "HH8 - $54150",
  15279: "HH9 - $59650",
  15280: "HH10 - $65150",
};
// Order Payload

function buildHubspotOrderPayload(data = {}) {
  const rawChildren = data?.children;
  const parsedChildren = Number(rawChildren);

  const finalChildren =
    rawChildren !== "-" && rawChildren !== "" && Number.isFinite(parsedChildren)
      ? parsedChildren
      : null;

  const payload = cleanProps({
    // picklist Mapping here

    employment_type: normalizePicklistValue(
      employmentTypeMapping,
      data?.employment_type
    ),
    income_doc_type: normalizePicklistValue(
      incomeDocTypeMapping,
      data?.income_doc_type
    ),
    marital_status: normalizePicklistValue(
      maritalStatusMappingOrder,
      data?.marital_status
    ),
    most_recent_tax_filing_st: normalizePicklistValue(
      mostRecentTaxFilingStatusMapping,
      data?.most_recent_tax_filing_st
    ), // hubspot single-text-line
    tax_saving_status_apc: normalizePicklistValue(
      taxSavingStatusApcMapping,
      data?.tax_saving_status_apc
    ), // hubspot single-text-line
    type0: normalizePicklistValue(type0Mapping, data?.type0), // hubspot single-text line
    work_needed: normalizePicklistValue(workNeededMapping, data?.work_needed),
    pslf: normalizePicklistValue(pslfMapping, data?.pslf),
    forbearance_needed: normalizePicklistValue(
      forbearanceNeededMapping,
      data?.forbearance_needed
    ),
    hh_size__income_threshol: normalizePicklistValue(
      hhSizeIncomeThresholdMapping,
      data?.hh_size__income_threshol
    ), // hubspot single-text-line
    field_2025_ibrpaye__15: normalizePicklistValue(
      field2025Ibrpaye15Mapping,
      data?.field_2025_ibrpaye__15
    ), //hubspot single text line
    field_2025_icr__20: normalizePicklistValue(
      field2025Icr20Mapping,
      data?.field_2025_icr__20
    ), //hubspot single text line

    income_doc_type_ivinex: data?.income_doc_type || null,
    marital_status_ivinex: data?.marital_status || null,
    pslf_ivinex: data?.pslf || null,
    consolidation_2_desired_0: data?.consolidation || null,
    desired_servicer_ivinex: data?.desired_servicer || null,
    desired_repayment_plan_ivinex: data?.desired_repayment_plan || null,
    employment_type_ivinex: data?.employment_type || null,
    income_frequency_1: data?._income_frequency_1 || null,
    current_repayment_plan_ivinex: data?.current_repayment_plan || null,
    forbearance_needed0_ivinex: data?.forbearance_needed || null,

    // Order Mapping Fields:-

    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    fields_changed: data?.fields_changed || null,
    created_by: data?.created_by || null,
    modified_by: data?.modified_by || null,
    modified_date: data?.modified_date || null,
    // most_recent_tax_filing_st: data?.most_recent_tax_filing_st,
    filed_taxes_in_the_last_t: data?.filed_taxes_in_the_last_t || null,
    household_size: data?.household_size || null,
    children: finalChildren || null,
    other: data?.other || null,
    amount: data?.amount || null,
    income_frequency: data?.income_frequency || null,
    linked_record: data?.linked_record || null,
    notes: data?.notes || null,
    spouse_income: data?.spouse_income || null,
    spouse_income_type: data?.spouse_income_type || null,
    spouse_income_frequency: data?.spouse_income_frequency || null,

    spouse_fed_loan_amount0: data?.spouse_fed_loan_amount0 || null,
    nslds_screenshots: data?.nslds_screenshots || null,
    outstanding_principle: data?.outstanding_principle || null,
    avg_interest_rate_: data?.avg_interest_rate_ || null,
    percent_subsidized_: data?.percent_subsidized_ || null,
    years_towards_forgiveness: data?.years_towards_forgiveness || null,
    consolidationloan_notes: data?.consolidationloan_notes || null,
    est_tax_implication_: data?.est_tax_implication_ || null,
    life_of_loan_payments: data?.life_of_loan_payments || null,
    est_total_cost_of_slt_st: data?.est_total_cost_of_slt_st || null,
    balance_based_mo_payment: data?.balance_based_mo_payment || null,
    balance_based_total_cost: data?.balance_based_total_cost || null,
    overall_savings_vs_balan: data?.overall_savings_vs_balan || null,
    new_payment_amount: data?.new_payment_amount || null,
    additional_notes_: data?.additional_notes_ || null,
    if_invest_monthly_saving: data?.if_invest_monthly_saving || null,
    total_earnings_by_time_of: data?.total_earnings_by_time_of || null,
    date_info_captured: data?.date_info_captured || null,
    total_balance: data?.total_balance || null,
    current_servicer: data?.current_servicer || null,
    interest_per_year: data?.interest_per_year || null,
    after_neg_am_interest_pe: data?.after_neg_am_interest_pe || null,
    interest_life_of_loan_be0: data?.interest_life_of_loan_be0 || null,

    subsidized_forgiveness_su: data?.subsidized_forgiveness_su || null,
    projected_balance_at_time: data?.projected_balance_at_time || null,
    projected_additional_inte: data?.projected_additional_inte || null,
    apc_notes: data?.apc_notes || null,
    year_of_taxes_being_used: data?.year_of_taxes_being_used || null,
    tutor_approx_value_of_str: data?.tutor_approx_value_of_str || null,
    servicer: data?.servicer || null,
    balance_based_years: data?.balance_based_years || null,
    balance_based_scenarios: data?.balance_based_scenarios || null,
    value_of_cashflow: data?.value_of_cashflow || null,
    slt_calc_results: data?.slt_calc_results || null,
    household_notes: data?.household_notes || null,
    income_notes: data?.income_notes || null,
    // hh_size__income_threshol: data?.hh_size__income_threshol,
    related_email_address: data?.related_email_address || null,
    income_notes0: data?.income_notes0 || null,
    household_notes0: data?.household_notes0 || null,
    refusal_details0: data?.refusal_details0 || null,
    stop_dont_use: data?.stop_dont_use || null,
    copy_order: data?.copy_order || null,
    // type0: data?.type0,
    months_of_pslf: data?.months_of_pslf || null,
    due_remove_auto_pay: data?.due_remove_auto_pay || null,
    servicerwebsite: data?.servicerwebsite || null,
    plans: data?.plans || null,
    consol_1_loan_codes__am: data?.consol_1_loan_codes__am || null,
    consol_2_loan_codes__am: data?.consol_2_loan_codes__am || null,
    consolidation_1_desired_0: data?.consolidation_1_desired_0 || null,
    consolidation_2_desired_0: data?.consolidation_2_desired_0 || null,
    consolidation_3_desired_: data?.consolidation_3_desired_ || null,
    final_step_enroll_into_i: data?.final_step_enroll_into_i || null,
    current_servicer__repaym: data?.current_servicer__repaym || null,
    consol_3_loan_codes__am: data?.consol_3_loan_codes__am || null,
    dates: data?.dates || null,
    amount_1: data?.amount_1 || null,
    amount_2: data?.amount_2 || null,
    dates0: data?.dates0 || null,
    agi: data?.agi || null,

    income_frequency_2: data?.income_frequency_2 || null,
    spouses_name: data?.spouses_name || null,
    special_grouping__notes: data?.special_grouping__notes || null,
    spouse_income_notes: data?.spouse_income_notes || null,
    // field_2025_ibrpaye__15: data?.field_2025_ibrpaye__15,
    // field_2025_icr__20: data?.field_2025_icr__20,
    consolidating_heal_loans0: data?.consolidating_heal_loans0 || null,
    in_school_deferment: data?.in_school_deferment || null,
    forbearance_needed0: data?.forbearance_needed0 || null,
    total: data?.total || null,
    total0: data?.total0 || null,
    consolidate: data?.consolidate || null,
    leave_out: data?.leave_out || null,
    plans0: data?.plans0 || null,
    eligible_for_ibr_new_all: data?.eligible_for_ibr_new_all || null,
    year0: data?.year0 || null,

    // estimated_payment: data?.estimated_payment,
    estimated_payment:
      Number(String(data?.estimated_payment || "").replace(/[^0-9.]/g, "")) ||
      null,
    client: data?.client || null,
    actual_payment: data?.actual_payment || null,
    // tax_saving_status_apc: data?.tax_saving_status_apc,
    created_date: data?.created_date || null,
    // IMPORTANT: must be a STAGE ID, not pipeline ID or label
    // hs_pipeline_stage: data?.hs_pipeline_stage,
    hs_pipeline_stage: "2091193059", // 1300018877,2091193059
    subject: data?.subject || null,
    content: data?.content || null,
  });
  return { properties: payload };
}

// new Text Message Payload
function buildTextMessagePayload(data = {}) {
  const lines = [];

  if (data?.collection_id) lines.push(`Collection ID: ${data?.collection_id}`);
  if (data?.site_id) lines.push(`Site ID: ${data?.site_id}`);
  if (data?.fields_changed)
    lines.push(`Fields Changed: ${data?.fields_changed}`);

  if (data?.created_by) lines.push(`Created By: ${data?.created_by}`);
  if (data?.modified_by) lines.push(`Modified By: ${data?.modified_by}`);
  if (data?.modified_date) lines.push(`Modified Date: ${data?.modified_date}`);
  if (data?.created_date) lines.push(`Created Date: ${data?.created_date}`);

  if (data?.read_status) lines.push(`Read Status: ${data?.read_status}`);
  if (data?.status) lines.push(`Status: ${data?.status}`);

  if (data?.message) lines.push(`Message: ${data?.message}`);

  if (data?.text_number) lines.push(`Text Number: ${data?.text_number}`);
  if (data?.external_number)
    lines.push(`External Number: ${data?.external_number}`);

  if (data?.external_id) lines.push(`External ID: ${data?.external_id}`);

  if (data?.client) lines.push(`Client: ${data?.client}`);

  if (data?.group_text) lines.push(`Group Text: ${data?.group_text}`);
  if (data?.group_text_parent)
    lines.push(`Group Text Parent: ${data?.group_text_parent}`);

  if (lines.length === 0) {
    throw new Error("❌ Text message payload is empty");
  }

  return {
    properties: {
      hs_note_body: lines.join("\n"),
      hs_timestamp: new Date().toISOString(),
    },
  };
}

// Email Payload

function buildEmailPayload(data = {}) {
  const payload = {
    collection_id: data?.collection_id || null,
    site_id: data?.site_id || null,
    fields_changed: data?.fields_changed || null,

    linked_record: data?.linked_record || null,
    linked_module: data?.linked_module || null,

    folder_id: data?.folder_id || null,
    retry_count: data?.retry_count || null,

    notify_options: data?.notify_options || null,
    external_options: data?.external_options || null,

    message_uid: data?.message_uid || null,
    message_id: data?.message_id || null,
    result: data?.result || null,

    open_date: data?.open_date || null,
    events: data?.events || null,

    email_attachments: data?.email_attachments || null,
    ivinex_attachments: data?.ivinex_attachments || null,
    file_upload_status: data?.file_upload_status || null,

    template_processed: data?.template_processed || null,
    email_template: data?.email_template || null,

    replied_from: data?.replied_from || null,
    forwarded_from: data?.forwarded_from || null,

    reply: data?.reply || null,
    reply_all: data?.reply_all || null,
    forward: data?.forward || null,

    delay_send_date: data?.delay_send_date || null,

    created_date: data?.created_date || null,
    modified_by: data?.modified_by || null,
    modified_date: data?.modified_date || null,
    created_by: data?.created_by || null,

    email_from: data?.email_from || null,
    email_from_name: data?.email_from_name || null,

    email_to: data?.email_to || null,
    cc: data?.cc || null,
    bcc: data?.bcc || null,

    subject: data?.subject || null,
    body: data?.body || null,
    body_plain: data?.body_plain || null,

    email_date: data?.email_date || null,
    email_status: data?.email_status || null,
    email_account: data?.email_account || null,
    user: data?.user || null,
  };

  return cleanProps(payload);
}

//  payload Activity

function buildHubSpotActivityPayload(data = {}) {
  if (!data) {
    logger.warn(`Record :${JSON.stringify} missing`);
    return null;
  }
  const lines = [];

  if (data?.collection_id) lines.push(`Collection ID: ${data?.collection_id}`);
  if (data?.site_id) lines.push(`Site ID: ${data?.site_id}`);
  if (data?.fields_changed)
    lines.push(`Fields Changed: ${data?.fields_changed}`);

  if (data?.location) lines.push(`Location: ${data?.location}`);
  if (data?.date_email_opened)
    lines.push(`Email Opened: ${data?.date_email_opened}`);

  if (data?.email_id) lines.push(`Email ID: ${data?.email_id}`);
  if (data?.subject) lines.push(`Subject: ${data?.subject}`);

  if (data?.field_from) lines.push(`From: ${data?.field_from}`);
  if (data?.email_to) lines.push(`To: ${data?.email_to}`);
  if (data?.cc) lines.push(`CC: ${data?.cc}`);
  if (data?.bcc) lines.push(`BCC: ${data?.bcc}`);

  if (data?.recurrence) lines.push(`Recurrence: ${data?.recurrence}`);
  if (data?.all_day_event !== undefined)
    lines.push(`All Day Event: ${data?.all_day_event}`);

  if (data?.start_time) lines.push(`Start Time: ${data?.start_time}`);
  if (data?.end_time) lines.push(`End Time: ${data?.end_time}`);

  if (data?.priority) lines.push(`Priority: ${data?.priority}`);
  if (data?.status) lines.push(`Status: ${data?.status}`);

  if (data?.activity) lines.push(`Activity: ${data?.activity}`);
  if (data?.description) lines.push(`Description: ${data?.description}`);

  if (data?.assigned) lines.push(`Assigned: ${data?.assigned}`);

  if (data?.created_date) lines.push(`Created Date: ${data?.created_date}`);
  if (data?.created_by) lines.push(`Created By: ${data?.created_by}`);

  if (data?.modified_date) lines.push(`Modified Date: ${data?.modified_date}`);
  if (data?.modified_by) lines.push(`Modified By: ${data?.modified_by}`);

  if (data?.date) lines.push(`Date: ${data?.date}`);

  return {
    properties: {
      hs_note_body: lines.join("\n"),
      hs_timestamp: new Date().toISOString(), // ✅ REQUIRED
    },
  };
}
function buildHubSpotActivityPayloadBatch(data = {}, clientId) {
  const lines = [];

  if (data?.collection_id) lines.push(`Collection ID: ${data?.collection_id}`);
  if (data?.site_id) lines.push(`Site ID: ${data?.site_id}`);
  if (data?.fields_changed)
    lines.push(`Fields Changed: ${data?.fields_changed}`);

  if (data?.location) lines.push(`Location: ${data?.location}`);
  if (data?.date_email_opened)
    lines.push(`Email Opened: ${data?.date_email_opened}`);

  if (data?.email_id) lines.push(`Email ID: ${data?.email_id}`);
  if (data?.subject) lines.push(`Subject: ${data?.subject}`);

  if (data?.field_from) lines.push(`From: ${data?.field_from}`);
  if (data?.email_to) lines.push(`To: ${data?.email_to}`);
  if (data?.cc) lines.push(`CC: ${data?.cc}`);
  if (data?.bcc) lines.push(`BCC: ${data?.bcc}`);

  if (data?.recurrence) lines.push(`Recurrence: ${data?.recurrence}`);
  if (data?.all_day_event !== undefined)
    lines.push(`All Day Event: ${data?.all_day_event}`);

  if (data?.start_time) lines.push(`Start Time: ${data?.start_time}`);
  if (data?.end_time) lines.push(`End Time: ${data?.end_time}`);

  if (data?.priority) lines.push(`Priority: ${data?.priority}`);
  if (data?.status) lines.push(`Status: ${data?.status}`);

  if (data?.activity) lines.push(`Activity: ${data?.activity}`);
  if (data?.description) lines.push(`Description: ${data?.description}`);

  if (data?.assigned) lines.push(`Assigned: ${data?.assigned}`);

  if (data?.created_date) lines.push(`Created Date: ${data?.created_date}`);
  if (data?.created_by) lines.push(`Created By: ${data?.created_by}`);

  if (data?.modified_date) lines.push(`Modified Date: ${data?.modified_date}`);
  if (data?.modified_by) lines.push(`Modified By: ${data?.modified_by}`);

  if (data?.date) lines.push(`Date: ${data?.date}`);

  return {
    properties: {
      hs_note_body: lines.join("\n"),
      hs_timestamp: new Date().toISOString(), // ✅ REQUIRED
    },

    associations: clientId
      ? [
          {
            to: {
              id: clientId,
            },
            types: [
              {
                associationCategory: "USER_DEFINED",
                associationTypeId: 26,
              },
            ],
          },
        ]
      : [],
  };
}

function normalizeName(firstName = "", lastName = "") {
  return `${firstName} ${lastName}`.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildOwnerMap(owners) {
  const map = new Map();

  for (const owner of owners) {
    if (owner.archived) continue; // skip archived

    const key = normalizeName(owner.firstName, owner.lastName);

    if (!key) continue; // skip empty names

    map.set(key, owner.userId); // userId = hubspot_owner_id
  }

  return map;
}

const ownerMapping = {
  "Priya Dhall": "48368390",
  "Juvane Real": "63051842",
  "Cerin Xavier": "63110840",
  "Mohak Sethi": "63139842",
  "INSIDEA Onboarding": "63667720",
  "Rahib Azam": "67876480",
  "Damini Lakshmana": "69195266",
  "Mahi Tasnimul": "70465145",
  "Manik Soi": "75522716",
  "Avishek Koley": "78599046",
  "Tony Ferra": "159009872",
  "Csaba Soos": "159202068",
  "Genevieve Bronson": "159202069",
  "Matt Bronson": "159308437",
  "Savannah Ferra": "161053638",
  "Kelli Christine Case": "161053639",
  "Anica Vasquez": "161053640",
  "Rachael Davis": "161053641",
  "Sasha Miller": "161053642",
  "Heather Ballard": "161053643",
  "Michael Wheelwright": "161053664",
  "Joe Fiacco": "161053665",
  "Kevin Harvey": "161053666",
  "Thatcher Norton": "161053667",
  "Julia Guerin": "161053668",
  "Jamison Ryan": "161053669",
  "Derek Snel": "161053670",
  "Amie Engberg": "161053672",
  "Kerry Derry": "161053673",
  "Victor Martell": "161053675",
  "Chris McGinnis": "161053676",
  "Terni Blood": "161053681",
  "Adam Deutsch": "161053682",
  "Sara Redman": "161053683",
  "Chris Rudert": "161053684",
  "Stephanie Hassoldt": "161053685",
  "Rocky Christensen": "161053686",
  "Sabrina Adamson": "161053687",
  "Shade Conover": "161053688",
  "Stefano Quarta": "161053689",
  "Jennifer Sbaiti": "161053690",
  "Joseph Bronson": "161053691",
  "Jarom Bischoff": "161053692",
  "Carlee Finlinson": "161053693",
};
function buildOwnerMapping(owner) {
  const ownerId = ownerMapping[owner];

  return ownerId;
}

function buildHubSpotTaskPayload(data = {}) {
  // 1. Map Status & Priority to HubSpot's accepted Enums
  // HubSpot task priorities: "LOW", "MEDIUM", "HIGH"
  const priorityMap = {
    10006: "LOW",
    10007: "MEDIUM",
    10009: "HIGH",
    // TODO: Add other source priority ID mappings if needed
  };

  // HubSpot task statuses: "NOT_STARTED", "IN_PROGRESS", "WAITING", "COMPLETED", "DEFERRED"
  const statusMap = {
    10002: "NOT_STARTED",
    10003: "IN_PROGRESS",
    10004: "COMPLETED",
    // TODO: Add other source status ID mappings if needed
  };

  // 2. Build the Task Body (Description + Metadata block)
  const bodyLines = [];

  if (data?.description) {
    bodyLines.push(data.description);
    bodyLines.push("\n--- Source Details ---"); // Visual separator for the HubSpot UI
  }

  // Push relevant metadata that lacks a 1:1 HubSpot property
  if (data?.collection_id)
    bodyLines.push(`Collection ID: ${data.collection_id}`);
  if (data?.site_id) bodyLines.push(`Site ID: ${data.site_id}`);
  if (data?.fields_changed)
    bodyLines.push(`Fields Changed: ${data.fields_changed}`);
  if (data?.assigned) bodyLines.push(`Source Assignee ID: ${data.assigned}`);
  if (data?.created_date)
    bodyLines.push(`Source Created: ${data.created_date}`);
  if (data?.modified_date)
    bodyLines.push(`Source Modified: ${data.modified_date}`);

  // 3. Construct the HubSpot Task Object
  return {
    properties: {
      // If subject is blank, provide a fallback title so the task isn't nameless in HubSpot
      hs_task_subject:
        data?.subject ||
        `Task Follow-up (ID: ${data?.collection_id || "Unknown"})`,

      // Join the description and metadata into the rich text body
      hs_task_body: bodyLines.join("\n"),

      // Map the follow-up 'date' if it exists, otherwise fallback to current time
      hs_timestamp: data?.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),

      hs_task_status: statusMap[data?.status] || "NOT_STARTED",
      hs_task_priority: priorityMap[data?.priority] || "MEDIUM",
      hs_task_type: "TODO",
    },
  };
}
// 1. Map Status & Priority to HubSpot's accepted Enums
// HubSpot task priorities: "LOW", "MEDIUM", "HIGH"
const priorityMap = {
  10006: "LOW",
  10007: "MEDIUM",
  10009: "HIGH",
  // TODO: Add other source priority ID mappings if needed
};

// HubSpot task statuses: "NOT_STARTED", "IN_PROGRESS", "WAITING", "COMPLETED", "DEFERRED"
const statusMap = {
  10002: "NOT_STARTED",
  10003: "IN_PROGRESS",
  10004: "COMPLETED",
  // TODO: Add other source status ID mappings if needed
};
function buildHubSpotTaskPayloadBatch(data = {}, clientId) {
  if (!data || clientId) {
    return null;
  }
  // 2. Build the Task Body (Description + Metadata block)
  const bodyLines = [];

  if (data?.description) {
    bodyLines.push(data.description);
    bodyLines.push("\n--- Source Details ---"); // Visual separator for the HubSpot UI
  }
  // Push relevant metadata that lacks a 1:1 HubSpot property

  if (data?.collection_id)
    bodyLines.push(`Collection ID: ${data.collection_id}`);
  if (data?.site_id) bodyLines.push(`Site ID: ${data.site_id}`);
  if (data?.fields_changed)
    bodyLines.push(`Fields Changed: ${data.fields_changed}`);
  if (data?.assigned) bodyLines.push(`Source Assignee ID: ${data.assigned}`);
  if (data?.created_date)
    bodyLines.push(`Source Created: ${data.created_date}`);
  if (data?.modified_date)
    bodyLines.push(`Source Modified: ${data.modified_date}`);

  // 3. Construct the HubSpot Task Object
  return {
    properties: {
      // If subject is blank, provide a fallback title so the task isn't nameless in HubSpot
      hs_task_subject:
        data?.subject ||
        `Task Follow-up (ID: ${data?.collection_id || "Unknown"})`,

      // Join the description and metadata into the rich text body
      hs_task_body: bodyLines.join("\n"),

      // Map the follow-up 'date' if it exists, otherwise fallback to current time
      hs_timestamp: data?.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),

      hs_task_status: statusMap[data?.status] || "NOT_STARTED",
      hs_task_priority: priorityMap[data?.priority] || "MEDIUM",
      hs_task_type: "TODO",
    },

    associations: clientId
      ? [
          {
            to: {
              id: clientId,
            },
            types: [
              {
                associationCategory: "USER_DEFINED",
                associationTypeId: 32,
              },
            ],
          },
        ]
      : [],
  };
}

function saveProgress(index) {
  fs.writeFileSync(progressFile, JSON.stringify({ index }), "utf-8");
}

function loadProgress() {
  if (fs.existsSync(progressFile)) {
    try {
      const data = fs.readFileSync(progressFile, "utf-8");
      const obj = JSON.parse(data);
      return typeof obj.index === "number" ? obj.index : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

export {
  buildHubSpotActivityPayloadBatch,
  buildHubSpotTaskPayloadBatch,
  saveProgress,
  loadProgress,
  buildOwnerMap,
  normalizeName,
  cleanProps,
  buildHubSpotInquirerPayload,
  buildHubSpotAffiliatePayload,
  buildHubSpotTaskPayload,
  buildHubSpotActivityPayload,
  buildHubSpotInvoicePayload,
  buildHubSpotClientPayload,
  buildHubspotOrderPayload,
  buildTextMessagePayload,
  buildEmailPayload,
};
