import { time } from "console";

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
  10250: "Cell",
  10251: "Home",
  10252: "Work",
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
  15101: "Tutor ARR Follow up",
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

const timeZone0Mapping = {
  10275: "america_slash_new_york", // EST
  10276: "america_slash_chicago", // CST
  10277: "america_slash_denver", // MST
  13056: "america_slash_pheonix", // MST (Arizona, no DST)
  10278: "america_slash_los_angeles", // PST
  10279: "pacific_slash_honolulu", // HAST
  10280: "america_slash_anchorage", // AKST
  11522: "america_slash_anchorage", // AK
  11520: "america_slash_anchorage", // AKS
  11523: "america_slash_halifax", // HAT
  13398: "pacific_slash_honolulu", // HST
  11524: "america_slash_san_juan", // PR
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

const leadTypeMapping = {
  12919: "Client Referral",
  12923: "SLT Contractor Referral",
  13333: "Outbound Affiliates (Financial Planner) - NO APC",
  12922: "SLT/Tutor Affiliates",
  15311: "Webinar - Dani",
  14234: "Email Campaign (Marketing)",
  14210: "Low Balance Lead",
  12932: "Conferences",
  13395: "FB Groups/Word of Mouth",
  15032: "Non-Client Referral/Direct Mention",
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
  12921: "DU Website (dont use)",
  15082: "DU Dani/Csaba Split",
  14937: "DU Csaba FA",
  14938: "DU Csaba - PSLF",
  13140: "DU Digital Ad (Marketing)",
  12992: "DU Chiro Assoc. Affiliate (don't use)",
  13059: "DU SLT In-house Marketing (dont use)",
  13076: "DU Direct Outreach (dont use)",
  12987: "DU Kyle FB Ad/Affiliate Marketing (Don't use)",
  12920: "DU Online Generic (dont use)",
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

const conferencesDaniPrSourcesMapping = {
  15305: "Texas Chiro Assoc. Conference 2025 - Derek and Kevin",
  15096: "Better Wealth FA Conference - CO - Dani/Michael",
  14991: "Chiro Congress 2023",
  15001: "Kentucky Assoc. of Chiropractics - Dani",
  15003: "California Chiro Assoc 2023/2024 - Dani",
  15004: "Colorado Chiro Newsletter - Dani",
  15005: "Virginia Chiro Newsletter - Dani",
  15006: "Texas Chiro Newsletter - Dani",
  15007: "Georgia Chiro Newsletter - Dani",
  15008: "Missouri Chiro Newsletter - Dani",
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
  14992: "MAC - Michigan Chiro 2023",
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

// podcast mapping picklist mapping
const podcastMapping = {
  14230: "Zeitgeist Podcast (Except the Charles Episode)",
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
  14238: "Dani Converse (NM) - Tony",
  14240: "Hannah Morando (NM) - Tony",
  14239: "Van Everett (NM) - Tony",
  14256: "Lauren Peter (NM) - Tony",
  14751: "Trina Sessions (NM) - Tony",
  14754: "Alex Morgan (NM) - Tony",
  14755: "Nicki Morgan (NM) - Tony",
  14759: "Kimmy Schimek (NM) - Tony",
  14760: "Matt Schimek (NM) - Tony",
  14242: "John Coeuille (Ed Jones)",
  14753: "Hannah Moeller (NM) - Tony",
  14237: "Renata (Ed.Jones) - Tony",
  14746: "Myron (Chris) Henley - Derek",
};

// du_slt_outreach_affiliate_source picklist mapping
const duSltOutreachAffiliateSourceMapping = {
  13264: "Not Listed Yet",
  13117: "KSL Ad Michael Did",
  13127: "Mass Mutual (Michael)",
  14756: "KC Credit",
  13156: "Renata EdJones (Tony)",
  14215: "Dani Converse (NW M) - Tony",
  14225: "Van Everett (NW M) - Tony",
  14235: "Hannah Morando (NW M) - Tony",
  14236: "Belle Ives (NW M) - Tony",
  13120: "Ian Hoffman Student Loan Eraser",
  13128: "Amber Landry (pslf service/michael)",
  13121: "UCPA (Utah Physicians Chiropractic Association)",
  13126: "WSCA (Washington State Chiropractic Association)",
  13132: "UVCA (Virginia Chiropractic Association)",
  13133: "TCA (Texas Chiropractic Association)",
  13137: "IACP (Idaho Association of Chiropractic Physicians)",
  13138: "Calchiro (California Chiropractic Association)",
  13139: "FCA (Florida Chiropractic Association)",
  13227: "Florida Acupuncture Assoc",
  13228: "AT/DC Articles",
  13240: "ABCA",
  13256: "Life West Zoom",
  13267: "Women's FB Chiro Group",
  13355: "John Coeuille (Ed Jones)",
  14221: "Wealth Factory",
  14222: "Tom Pratt (Financial Planner)",
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
  14190: "Self Employed (generic)",
  14191: "W-2 (generic)",
  14192: "Sales",
  14967: "Optometrist",
  15167: "Pharmacist",
  10336: "Other",
};
// inquirer_employment_type picklist mapping
const inquirerEmploymentTypeMapping = {
  12925: "Self Employed",
  10325: "W2",
  10326: "1099",
  10327: "Unemployed",
  12913: "Multiple",
  15166: "Retired",
};

// marital_status picklist mapping
const maritalStatusMapping = {
  10303: "Married",
  10304: "Single",
  10305: "Divorced",
  10306: "Engaged",
  10307: "Separated",
};

// eval___taxes_jointly_separate_picklist mapping
const evalTaxesJointlySeparateMapping = {
  14250: "Jointly",
  14251: "Separate",
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
  10297: "Deferment Or Forbearance",
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
  13364: "Recent Grad (Not setup yet)",
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
  13306: "A.E.S.",
  13307: "A.C.S.",
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
const householdSizeIncomeThreshold150Mapping = {
  12897: "HH1 - $23,475",
  12898: "HH2 - $31,725",
  12899: "HH3 - $39,975",
  12900: "HH4 - $48,225",
  12901: "HH5 - $56,475",
  12902: "HH6 - $64,725",
  12903: "HH7 - $72,975",
  12904: "HH8 - $81,225",
  12905: "HH9 - $89,475",
  12906: "HH10 - $97,725",
  12907: "HH11 - $105,975",
  12908: "HH12 - $114,225",
  12909: "HH13 - $122,475",
  12910: "HH14 - $130,725",
  12911: "HH15 - $138,975",
  12912: "16+ - add $8,250 each",
};

// income_amount_and_pay_frequency picklist mapping
const incomeAmountAndPayFrequencyMapping = {
  12873: "Bi-weekly",
  12874: "Semi-Monthly",
  12875: "Weekly",
  12888: "Monthly",
  12877: "Annually",
  12876: "Quarterly",
  12878: "Daily",
};

// pay_frequency_stream_2 picklist mapping
const payFrequencyStream2Mapping = {
  12881: "Bi-weekly",
  12882: "Semi-Monthly",
  12887: "Weekly",
  12883: "Monthly",
  12885: "Annually",
  12884: "Quarterly",
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

function buildHubSpotInquirerPayload(data = {}) {
  const properties = cleanProps({
    // inquirer_loan_: loanMapping[data?.inquirer_loan_ ]|| null, // todo field does not exist in both
    // employment_type: emloymenttypes[data?.employment_type_s] || null, // todo not exist in hubspot
    // inquirer_status: inquirerStatusMapping[data?.inquirer_status] || null,
    // inquirer_profession: professionMapping[data?.inquirer_profession] || null,
    // inquirer_loan_servicer:
    // loanServicerMapping[data?.inquirer_loan_servicer] || null,
    // inquirer_current_repaymen:
    // inquirerCurrentMapping[data?.inquirer_current_repaymen] || null,
    // household_size__income_t0:
    // householdIncomeMapping[data?.household_size__income_t0] || null,
    // eval__federal_loan_amoun: evalFederalMapping[data?.eval__federal_loan_amoun] || null,
    // spouse_has_loans_s_ivinex: spounceHasMapping[data?.spouse_has_loans_s] || null, //
    // eval_taxes_jointlysepa_ivinex:
    // evalTaxesmapping[data?.eval__taxes_jointlysepa] || null, //
    // du_slt_outreachaffiliate_ivinex: duSltOutereachMapping[data?.du_slt_outreachaffiliate] || null, //
    // du_financial_planner_ivinex: duFinancialPlannerMapping[data?.du_financial_planner] || null, //
    // contractor_referred_by_ivinex: contractorReferredmapping[data?.contractor_referred_by] || null, //
    // affiliate_referral_ivinex: affiliateReferralMapping[data?.affiliate_referral] || null, //
    // entered_info_for_nfm_ivinex: enteredInfoMapping[data?.entered_info_for_nfm] || null, //
    // inquirer_loan_status_ivinex: loanStatusMapping[data?.inquirer_loan_status] || null, //

    // Error fields----------------------------------------------------------------------
    // "fields_changed": "0,0",
    // "created_by": "14",
    // "modified_date": "2019-05-21 11:38:19",
    // "time_zone": "0",
    // "phone_1_type": "10246",
    // "phone_2_type": "10249",
    // "lead_source_dont_use": "10270",
    // "time_zone0": "10275",
    // "inquirer_loan_status": "10296",
    // "marital_status": "10303",
    // "eval__spouse_has_loans": "10318",
    // "inquirer_current_repaymen": "10321",
    // "inquirer_employment_type": "10325",
    // "inquirer__last_year__ag": "3966.00",
    // "inquirer_current_monthly_": "596.08",
    // "inquirer_profession": "10331",
    // "marital_status_s": "1",
    // "employment_type_s": "1",
    // "spouse_fed_loan_amount0": "11888",
    // "eval__pay_frequency": "11970",
    // "slt_referring_rep": "0",
    // "standby_list": "0",
    // "tutor_name": "14",
    // "inquirer_status": "10265",
    // "pay_frequency_stream_2": "0",
    // "pay_frequency_stream_3": "0",
    // "household_size__income_t0": "0",
    // "lead_type": "0",
    // "date_became_client": "0000-00-00",
    // "contractor_referred_by": "0",
    // "inquirer_loan_servicer": "0",
    // "podcast": "0",
    // "du_financial_planner": "0",
    // "affiliate_lead_owner": "0",
    // "inquirer_profession_if_o": "",
    // "podcast": "0",

    // "affiliate_lead_owner": "0",
    // inquirer_avg_interest_ra: data.inquirer_avg_interest_ra,
    // inquirer_years_towards_fo: data.inquirer_years_towards_fo,
    // already_enrolled_in_autop: data.already_enrolled_in_autop,
    // inquirer_outstanding_prin: data.inquirer_outstanding_prin,
    // counting_spouse_in_hh_siz: data.counting_spouse_in_hh_siz,
    // add_other_dependents: data.add_other_dependents,
    // add_child_dependents_in: data.add_child_dependents_in,
    // spouse_annual_documented_: data.spouse_annual_documented_,
    // total_streams_of_taxable_: data.total_streams_of_taxable_,
    // sps__of_sub_loans: data.sps__of_sub_loans,
    // sps_already_enrolled_in_: data.sps_already_enrolled_in_,
    // notes_on_pricing_quoted_e: data.notes_on_pricing_quoted_e,
    //------------------------------------------------------------------------------

    // Old Mapping Fields--------------------------------------------------------------
    // inquirer___last_year___agi: data.inquirer__last_year__ag,
    // eval___spouse_pay_frequency: data.eval__pay_frequency,
    // inquirer_profession_if_o: data.inquirer_profession_if_o,

    // collection_id: data.collection_id,
    // site_id: data.site_id,
    // phone_2: data.phone_2,
    // email_2: data.email_2,
    // address_1: data.address_1,
    // address_2: data.address_2,
    // city: data.city,
    // state: data.state,
    // fed_loan_amount_old: data.fed_loan_amount_old,
    // si_creation_date: data.si_creation_date,
    // zip: data.zip,
    // spouse: data.spouse,
    // client_referral: data.client_referral,
    // convert_to_client: data.convert_to_client,
    // go_converting_to_client__: data.go_converting_to_client__,
    // click_on_convert_1: data.click_on_convert_1,
    // click_on_convert_2: data.click_on_convert_2,
    // inquirer_no_sale_reason: data.inquirer_no_sale_reason,
    // fed_loan_amount_s: data.fed_loan_amount_s,
    // actively_in_school_s: data.actively_in_school_s,
    // loan_status_s: data.loan_status_s,
    // fed_loan_payment_s: data.fed_loan_payment_s,
    // type_of_repayment_s: data.type_of_repayment_s,
    // inquirer_middle_name: data.inquirer_middle_name,
    // field_30_day_income_s: data.field_30_day_income_s,
    // spouse_fed_loans_payment: data.spouse_fed_loans_payment,
    // orders: data.orders,
    // inquirer_total_balance: data.inquirer_total_balance,
    // of_subsidized_loans: data.of_subsidized_loans,
    // inquirer_consolidation__0: data.inquirer_consolidation__0,
    // inquirer_current_planidr: data.inquirer_current_planidr,
    // married: data.married,
    // sps_total_balance: data.sps_total_balance,
    // household_size_notes: data.household_size_notes,
    // annual_documented_income: data.annual_documented_income,
    // adj_gross_amount_stream_: data.adj_gross_amount_stream_,
    // pay_frequency_stream_1: data.pay_frequency_stream_1,
    // adj_gross_amount_stream_0: data.adj_gross_amount_stream_0,
    // adj_gross_amount_stream_1: data.adj_gross_amount_stream_1,
    // combined_annual_documente: data.combined_annual_documente,
    // income_documentation_note: data.income_documentation_note,
    // tax_filing_status: data.tax_filing_status,
    // spouse_loan_description: data.spouse_loan_description,
    // savings_summary: data.savings_summary,
    // balance_based_scenarios: data.balance_based_scenarios,
    // tutor_approx_value_of_sav: data.tutor_approx_value_of_sav,
    // loan_servicer_notes: data.loan_servicer_notes,
    // sps_outstanding_principal: data.sps_outstanding_principal,
    // sps_avg_interest_rate: data.sps_avg_interest_rate,
    // sps_years_towards_forgiv: data.sps_years_towards_forgiv,
    // sps_loan_types: data.sps_loan_types,
    // sps_loan_servicers: data.sps_loan_servicers,
    // inquirer_household_size_n: data.inquirer_household_size_n,
    // date_of_planning_call: data.date_of_planning_call,
    // date_marketing_reconciled: data.date_marketing_reconciled,
    // conferencesdani_pr_sourc: data.conferencesdani_pr_sourc,
    // kyle_affiliatefb_marketi0: data.kyle_affiliatefb_marketi0,
    // online_generic_dont_use: data.online_generic_dont_use,
    // inquiry_source_notes_esp0: data.inquiry_source_notes_esp0,
    // inquirer_date_of_last_con: data.inquirer_date_of_last_con,
    // referral_from_financial_a: data.referral_from_financial_a,
    // linked_client: data.linked_client,
    // copy_info: data.copy_info,
    // calculator_results: data.calculator_results,
    // inquirer_calculator_repor: data.inquirer_calculator_repor,
    // sps_calc_report_link: data.sps_calc_report_link,
    // eval_notes: data.eval_notes,
    // spouse__last_year__agi: data.spouse__last_year__agi,
    // eval__spouse_pay_frequen: data.eval__spouse_pay_frequen,
    // notes: data.notes,
    // under_admin_review__t_k: data.under_admin_review__t_k,
    // affiliate_presenting_tuto: data.affiliate_presenting_tuto,
    // spacer: data.spacer,
    // date_of_tutor_fu: data.date_of_tutor_fu,
    // date_eval_occured: data.date_eval_occured,
    // graduation_year: data.graduation_year,
    // eval__current_income: data.eval__current_income,
    // eval__spouse_current_inc: data.eval__spouse_current_inc,
    // good_timing_for_strategy_0: data.good_timing_for_strategy_0,
    // financial_experience: data.financial_experience,
    // assets__insurances: data.assets__insurances,
    // renting_or_owning_if_hom: data.renting_or_owning_if_hom,
    // liabilities: data.liabilities,
    // interested_in_values_base: data.interested_in_values_base,
    // current_year_pretax_annu: data.current_year_pretax_annu,
    // anything_else_we_should_k: data.anything_else_we_should_k,
    // inquirer_referral0: data.inquirer_referral0,
    // slt_rep_referred_by: data.slt_rep_referred_by,
    // date_of_initial_strategy_: data.date_of_initial_strategy_,
    // years_until_tax_imp_expe: data.years_until_tax_imp_expe,
    // tax_imp_goal: data.tax_imp_goal,
    // na_note_from_referring_r: data.na_note_from_referring_r,
    // student__date_of_graduat: data.student__date_of_graduat,
    // marketing_source: data.marketing_source,
    // dani_pr_source: data.dani_pr_source,
    // standby_notes__availabli: data.standby_notes__availabli,
    // pc_appointment_confirmati: data.pc_appointment_confirmati,
    // pc_follow_up_to_book: data.pc_follow_up_to_book,
    // coordinator_notes: data.coordinator_notes,
    // no_call_no_show_1: data.no_call_no_show_1,
    // no_call_no_show_2: data.no_call_no_show_2,
    // no_call_no_show_3: data.no_call_no_show_3,
    // rescheduled_date: data.rescheduled_date,
    // standby_marked_date: data.standby_marked_date,
    // est_tax_burden: data.est_tax_burden,
    // created_date: data.created_date,
    // lead_owner: data.lead_owner,
    // first_name: data.first_name,
    // modified_by: data.modified_by,
    // last_name: data.last_name,
    // primary_phone: data.primary_phone,
    // email_1: data.email_1,
    // tutor_needs_attention: data.tutor_needs_attention,
    // setter_needs_attention: data.setter_needs_attention,
    // under_admin_review__s_k: data.under_admin_review__s_k,
    //----------------------------------------------------------------------------

    // New Inquirer Mapping fields:-

    // New Picklist value Mapped here

    affiliate_lead_owner:
      affiliateleadOwnerMapping[data?.affiliate_lead_owner] || null,
    phone_1_type: phone1TypeMapping[data?.phone_1_type] || null,
    phone_2_type: phone2TypeMapping[data?.phone_2_type] || null,
    inquirer_status: inquirerStatusMapping[data?.inquirer_status] || null,
    hs_timezone: timeZone0Mapping[data?.time_zone0] || null,
    standby_list: standyListMapping[data?.standby_list] || null,
    pc_appointment_confirmation:
      pcAppointmentConfirmationMapping[data?.pc_appointment_confirmation] ||
      null,
    slt_referring_rep: sltReferringRepMapping[data?.slt_referring_rep] || null,
    lead_type: leadTypeMapping[data?.lead_type] || null,
    affiliate_presenting_tutor:
      affiliatePresentingTutorMapping[data?.affiliate_presenting_tuto] || null,
    conferences_dani_pr_sources:
      conferencesDaniPrSourcesMapping[data?.conferencesdani_pr_sourc] || null,
    podcast: podcastMapping[data?.podcast] || null,
    du_financial_planner:
      duFinancialPlannerMapping[data?.du_financial_planner] || null,
    du_slt_outreach_affiliate_source:
      duSltOutreachAffiliateSourceMapping[data?.du_slt_outreachaffiliate] ||
      null,
    contractor_referred_by:
      contractorReferredByMapping[data?.contractor_referred_by] || null,
    inquirer_profession:
      inquirerProfessionMapping[data?.inquirer_profession] || null,
    inquirer_employment_type:
      inquirerEmploymentTypeMapping[data?.inquirer_employment_type] || null,
    marital_status: maritalStatusMapping[data?.marital_status] || null,
    eval___taxes_jointly_separate_:
      evalTaxesJointlySeparateMapping[data?.eval__taxes_jointlysepa] || null,
    eval___spouse_has_loans:
      evalSpouseHasLoansMapping[data?.eval__spouse_has_loans] || null,
    eval___spouse_pay_frequency:
      evalSpousePayFrequencyMapping[data?.eval__pay_frequency] || null, // hubspot data single-line text
    inquirer_loan_status:
      inquirerLoanStatusMapping[data?.inquirer_loan_status] || null,
    inquirer_current_repayment_plan:
      inquirerCurrentRepaymentPlanMapping[data?.inquirer_current_repaymen] ||
      null,
    tutor_name_: tutorNameMapping[data?.tutor_name] || null,
    slt_rep_referred_by:
      sltRepReferredByMapping[data?.slt_rep_referred_by] || null, //hubspot data single-line text
    fed_loan_amount_old:
      fedLoanAmountOldMapping[data?.fed_loan_amount_old] || null, // hubspot data single-line text
    inquirer_loan_servicer:
      inquirerLoanServicerMapping[data?.inquirer_loan_servicer] || null,
    household_size___income_threshold__150__:
      householdSizeIncomeThreshold150Mapping[data?.household_size__income_t0] ||
      null,
    income_amount_and_pay_frequency:
      incomeAmountAndPayFrequencyMapping[data?.pay_frequency_stream_1] || null,
    pay_frequency_stream_2:
      payFrequencyStream2Mapping[data?.pay_frequency_stream_2] || null,
    pay_frequency_stream_3:
      payFrequencyStream3Mapping[data?.pay_frequency_stream_3] || null,

    inquirer_status_ivinex: data?.inquirer_status || null,
    spouse_has_loans_s_ivinex: data?.spouse_has_loans_s || null, //
    eval_taxes_jointlysepa_ivinex: data?.eval__taxes_jointlysepa || null, //
    du_slt_outreachaffiliate_ivinex: data?.du_slt_outreachaffiliate || null, //
    contractor_referred_by_ivinex: data?.contractor_referred_by || null, //
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

    si_creation_date: data?.si_creation_date || null,
    zip: data?.zip,
    collection_id: data?.collection_id,
    site_id: data?.site_id,
    phone_2: data?.phone_2,
    email_2: data?.email_2,
    address_1: data?.address_1,
    address_2: data?.address_2,
    city: data?.city,
    state: data?.state,
    spouse: data?.spouse,
    client_referral: data?.client_referral,
    convert_to_client: data?.convert_to_client,
    go_converting_to_client__: data?.go_converting_to_client__,
    click_on_convert_1: data?.click_on_convert_1,
    click_on_convert_2: data?.click_on_convert_2,
    inquirer_no_sale_reason: data?.inquirer_no_sale_reason,
    fed_loan_amount_s: data?.fed_loan_amount_s,
    actively_in_school_s: data?.actively_in_school_s,
    loan_status_s: data?.loan_status_s,
    fed_loan_payment_s: data?.fed_loan_payment_s,
    type_of_repayment_s: data?.type_of_repayment_s,

    field_30_day_income_s: data?.field_30_day_income_s,
    inquirer_middle_name: data?.inquirer_middle_name,
    spouse_fed_loans_payment: data?.spouse_fed_loans_payment,
    orders: data?.orders,
    inquirer_total_balance: data?.inquirer_total_balance,

    inquirer_consolidation__0: data?.inquirer_consolidation__0,
    inquirer_current_planidr: data?.inquirer_current_planidr,
    married: data?.married,
    sps_total_balance: data?.sps_total_balance,

    household_size_notes: data?.household_size_notes,
    annual_documented_income: data?.annual_documented_income,
    adj_gross_amount_stream_: data?.adj_gross_amount_stream_,
    pay_frequency_stream_1: data?.pay_frequency_stream_1,
    adj_gross_amount_stream_0: data?.adj_gross_amount_stream_0,
    adj_gross_amount_stream_1: data?.adj_gross_amount_stream_1,
    combined_annual_documente: data?.combined_annual_documente,
    income_documentation_note: data?.income_documentation_note,
    tax_filing_status: data?.tax_filing_status,
    spouse_loan_description: data?.spouse_loan_description,
    savings_summary: data?.savings_summary,
    balance_based_scenarios: data?.balance_based_scenarios,
    tutor_approx_value_of_sav: data?.tutor_approx_value_of_sav,
    loan_servicer_notes: data?.loan_servicer_notes,
    sps_outstanding_principal: data?.sps_outstanding_principal,
    sps_avg_interest_rate: data?.sps_avg_interest_rate,
    sps_years_towards_forgiv: data?.sps_years_towards_forgiv,
    sps_loan_types: data?.sps_loan_types,
    sps_loan_servicers: data?.sps_loan_servicers,
    inquirer_household_size_notes: data?.inquirer_household_size_n,
    date_of_planning_call: data?.date_of_planning_call,
    date_marketing_reconciled: data?.date_marketing_reconciled,
    conferencesdani_pr_sourc: data?.conferencesdani_pr_sourc,
    kyle_affiliatefb_marketi0: data?.kyle_affiliatefb_marketi0,
    online_generic_dont_use: data?.online_generic_dont_use,
    inquiry_source_notes_esp0: data?.inquiry_source_notes_esp0,
    inquirer_date_of_last_con: data?.inquirer_date_of_last_con,
    referral_from_financial_a: data?.referral_from_financial_a,
    linked_client: data?.linked_client,
    copy_info: data?.copy_info,
    calculator_results: data?.calculator_results,
    inquirer_calculator_repor: data?.inquirer_calculator_repor,
    sps_calc_report_link: data?.sps_calc_report_link,
    inquirer_profession_if_o: data?.inquirer_profession_if_o,
    eval_notes: data?.eval_notes,

    eval__spouse_pay_frequen: data?.eval__spouse_pay_frequen,
    notes: data?.notes,
    under_admin_review__t_k: data?.under_admin_review__t_k,
    affiliate_presenting_tuto: data?.affiliate_presenting_tuto,
    spacer: data?.spacer,
    date_of_tutor_fu: data?.date_of_tutor_fu,
    date_eval_occured: data?.date_eval_occured,
    graduation_year: data?.graduation_year,
    eval__current_income: data?.eval__current_income,
    eval__spouse_current_inc: data?.eval__spouse_current_inc,
    good_timing_for_strategy_0: data?.good_timing_for_strategy_0,
    financial_experience: data?.financial_experience,
    assets__insurances: data?.assets__insurances,
    renting_or_owning_if_hom: data?.renting_or_owning_if_hom,
    liabilities: data?.liabilities,
    interested_in_values_base: data?.interested_in_values_base,
    current_year_pretax_annu: data?.current_year_pretax_annu,
    anything_else_we_should_k: data?.anything_else_we_should_k,
    inquirer_referral0: data?.inquirer_referral0,
    date_of_initial_strategy_: data?.date_of_initial_strategy_,
    years_until_tax_imp_expe: data?.years_until_tax_imp_expe,
    tax_imp_goal: data?.tax_imp_goal,
    na_note_from_referring_r: data?.na_note_from_referring_r,
    student__date_of_graduat: data?.student__date_of_graduat,
    marketing_source: data?.marketing_source,
    dani_pr_source: data?.dani_pr_source,
    standby_notes__availabli: data?.standby_notes__availabli,
    pc_appointment_confirmati: data?.pc_appointment_confirmati,
    pc_follow_up_to_book: data?.pc_follow_up_to_book,
    coordinator_notes: data?.coordinator_notes,
    no_call_no_show_1: data?.no_call_no_show_1,
    no_call_no_show_2: data?.no_call_no_show_2,
    no_call_no_show_3: data?.no_call_no_show_3,
    rescheduled_date: data?.rescheduled_date,
    standby_marked_date: data?.standby_marked_date,

    est_tax_burden: data?.est_tax_burden,
    created_date: data?.created_date,
    first_name: data?.first_name,
    modified_by: data?.modified_by,
    last_name: data?.last_name,
    primary_phone: data?.primary_phone,
    email_1: data?.email_1,
    tutor_needs_attention: data?.tutor_needs_attention,
    setter_needs_attention: data?.setter_needs_attention,
    under_admin_review__s_k: data?.under_admin_review__s_k,
    spouse_fed_loan_amount: data?.spouse_fed_loan_amount0,

    counting_spouse_in_hh_size_: data?.counting_spouse_in_hh_siz,
    add___other__dependents: data?.add_other_dependents,
    add__child_dependents__incl__adult_children_: data?.add_child_dependents_in,
    spouse_annual_documented: data?.spouse_annual_documented_,
    total_streams_of_taxable: data?.total_streams_of_taxable_,
    sps__already_enrolled_in_autopay_: data?.sps_already_enrolled_in_,
    inquirer___last_year___agi: data?.inquirer__last_year__ag,
    inquirer_current_monthly_payment: data?.inquirer_current_monthly_,
    // tutor_name_: data?.tutor_name,
    notes_on_pricing_quoted_etc_: data?.notes_on_pricing_quoted_e,
    spouse__last_year__agi: data?.spouse__last_year__agi,
    sps___of_sub_loans: data?.sps__of_sub_loans,
    inquirer_avg__interest_rate: data?.inquirer_avg_interest_ra,
    inquirer_years_towards_forgiveness: data?.inquirer_years_towards_fo,
    already_enrolled_in_autopay_: data?.already_enrolled_in_autop,
    of_subsidized_loans: data?._of_subsidized_loans,
    inquirer_outstanding_principal: data?.inquirer_outstanding_prin,
    time_zone__custom: data?.time_zone,
    adj_gross_amount_stream_0: data?.adj_gross_amount_stream_0,
    adj_gross_amount_stream_1: data?.adj_gross_amount_stream_1,
    annual_documented_income: data?.annual_documented_income,
    anything_else_we_should_know: data?.anything_else_we_should_know,
    company: data?.company,
    country: data?.country,
    date_of_tutor_fu: data?.date_of_tutor_fu,
    inquirer_loan_ivinex: data?.inquirer_loan || null,

    // New Error fields------------------------------------------------------------
    // du_financial_planner_ivinex: data?.du_financial_planner || null, // //todo doest not exist in hubspot
    // employment_type: data?.employment_type_s || null,
    // inquirer_status: data?.inquirer_status || null,
    // inquirer_profession: data?.inquirer_profession || null,
    // inquirer_loan_servicer:data?.inquirer_loan_servicer || null,
    // household_size__income_t0:data?.household_size__income_t0 || null,
    // marital_status:data?.marital_status || null, // dropdown
    // eval___spouse_has_loans: data?.eval__spouse_has_loans || null, // dropdown

    // hs_created_by_user_id: data?.created_by,
    // modified_date: data?.modified_date,
    // phone_2_type: data?.phone_2_type,
    // lead_source_dont_use: data?.lead_source_dont_use,
    // date_became_client: data?.date_became_client,
    // inquirer_employment_type: data?.inquirer_employment_type,
    // pay_frequency_stream_2: data?.pay_frequency_stream_2,
    // pay_frequency_stream_3: data?.pay_frequency_stream_3,
    // marital_status: data?.marital_status_s,
    // employment_type: data?.employment_type_s,
    // podcast: data?.podcast,
    // affiliate_lead_owner: data?.affiliate_lead_owner,
    //----------------------------------------------------------------------------
  });

  if (!Object.keys(properties).length) {
    throw new Error("HubSpot payload is empty");
  }

  return { properties };
}

// picklist Mapping Affiliate
// lead_owner picklist mapping
const leadOwnerMappingAffiliate = {
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
const timeZoneMappingAffilate = {
  14334: "Eastern Standard Time (EST)",
  14335: "Central Standard Time (CST)",
  14336: "Mountain Standard Time (MST)",
  14337: "Mountain Standard Time - Arizona (MST - Arizona)",
  14338: "Pacific Standard Time (PST)",
  14339: "Hawaii-Aleutian Standard Time (HAST)",
  14340: "Alaska Standard Time (AKST)",
  14341: "Alaska Time (AK)",
  14342: "Alaska Standard Time (AKS)",
  14343: "Hawaii-Aleutian Time (HAT)",
  14344: "Hawaii Standard Time (HST)",
  14345: "Puerto Rico Time (PR)",
  14346: "Coordinated Universal Time (UTC)",
};

//  code for Affiliate Payload

function buildHubSpotAffiliatePayload(data = {}) {
  const properties = {
    // presenting_rep: data.presenting_rep,
    // old Mapping Fileds..

    // collection_id: data.collection_id,
    // site_id: data.site_id,
    // fields_changed: data.fields_changed,
    // date_setter_spoke_w_affi: data.date_setter_spoke_w_affi,
    // created_by: data.created_by,
    // employment_type_s: data.employment_type_s,
    // field_30_day_income_s: data.field_30_day_income_s,
    // tome_zone_intake: data.tome_zone_intake,
    // lead_description__specia0: data.lead_description__specia0,
    // date_of_last_contact: data.date_of_last_contact,
    // bd_andor_ria_rep: data.bd_andor_ria_rep,
    // date_of_birth__year: data.date_of_birth__year,
    // receives_texts: data.receives_texts,
    // name_stated_on_vm: data.name_stated_on_vm,
    // date_of_fa_presentation: data.date_of_fa_presentation,
    // title: data.title,
    // marital_status_s: data.marital_status_s,
    // vip_affiliate: data.vip_affiliate,
    // of_registered_states: data._of_registered_states,
    // of_years_an_agent_new: data._of_years_an_agent_new,
    // of_years_an_agent_old: data.of_years_an_agent_old,
    // email__personal_type: data.email__personal_type,
    // linkedin: data.linkedin,
    // has_referrals_in_mind_asa: data.has_referrals_in_mind_asa,
    // date_of_first_client_refe: data.date_of_first_client_refe,
    // affiliate_nurturing_call: data.affiliate_nurturing_call,
    // revenue_share: data.revenue_share,
    // fa_draw: data.fa_draw,
    // field_1st: data.field_1st,
    // field_2nd: data.field_2nd,
    // field_3rd: data.field_3rd,
    // primary_address_1: data.primary_address_1,
    // modified_by: data.modified_by,
    // modified_date: data.modified_date,
    // phone_2: data.phone_2,
    // email__business2_type: data.email__business2_type,
    // time_zone0: data.time_zone0,
    // spouse_has_loans_s: data.spouse_has_loans_s,
    // primary_address_2: data.primary_address_2,
    // primary_city: data.primary_city,
    // no_sale_reason: data.no_sale_reason,
    // type_of_repayment_s: data.type_of_repayment_s,
    // fed_loan_payment_s: data.fed_loan_payment_s,
    // loan_status_s: data.loan_status_s,
    // actively_in_school_s: data.actively_in_school_s,
    // fed_loan_amount_s: data.fed_loan_amount_s,
    // click_on_convert_2: data.click_on_convert_2,
    // click_on_convert_1: data.click_on_convert_1,
    // primary_zip_code: data.primary_zip_code,
    // first_name: data.first_name,
    // last_name: data.last_name,
    // primary_phone: data.primary_phone,
    // email__business_type: data.email__business_type,
    // firm_name: data.firm_name,
    // primary_state: data.primary_state,

    // Error fields----------------------------------------------------------------------
    // "industry": "14738",
    // "presenting_rep": "0",
    // "comp_super_affiliate": "0",
    // "conference": "0",
    // "created_date": "2022-06-06 16:02:50",
    // "time_zone": "0",
    // "primary_phone_line_type": "14264",
    // "phone_2_type": "14268",
    // "profession": "14384",
    // "lead_owner": "14",
    // "affiliate_status": "14283",
    // "lead_source": "14750",
    //------------------------------------------------------------------------------------

    // New Affilate Maaping Payload

    //Picklist Mapping here

    // lead_owner: leadOwnerMappingAffiliate[data?.lead_owner] || null, // hubspot user
    // presenting_rep: presentingRepMapping[data?.presenting_rep] || null, // hubspot user
    primary_phone_line_type:
      primaryPhoneLineTypeMapping[data?.primary_phone_line_type] || null,
    phone_2_type: phone2TypeMappingAffiliate[data?.phone_2_type] || null,
    affiliate_status: affiliateStatusMapping[data?.affiliate_status] || null,
    industry: industryMapping[data?.industry] || null,
    profession: professionMapping[data?.profession] || null,
    lead_source: leadSourceMapping[data?.lead_source] || null,
    comp_super_affiliate:
      compSuperAffiliateMapping[data?.comp_super_affiliate] || null,
    conference: conferenceMapping[data?.conference] || null,
    time_zone: timeZoneMappingAffilate[data?.time_zone0] || null,

    collection_id: data.collection_id,
    site_id: data.site_id,
    fields_changed: data.fields_changed,
    date_setter_spoke_w_affi: data.date_setter_spoke_w_affi,
    created_by: data.created_by,
    employment_type_s: data.employment_type_s,
    field_30_day_income_s: data.field_30_day_income_s,
    tome_zone_intake: data.tome_zone_intake,
    lead_description__specia0: data.lead_description__specia0,
    date_of_last_contact: data.date_of_last_contact,
    bd_andor_ria_rep: data.bd_andor_ria_rep,
    date_of_birth__year: data.date_of_birth__year,
    name_stated_on_vm: data.name_stated_on_vm,
    date_of_fa_presentation: data.date_of_fa_presentation,
    title: data.title,
    marital_status_s: data.marital_status_s,
    receives_texts_ivinex: data.receives_texts, //
    vip_affiliate_ivinex: data.vip_affiliate, //
    has_referrals_in_mind_asa_ivinex: data.has_referrals_in_mind_asa, //
    affiliate_nurturing_call_ivinex: data.affiliate_nurturing_call, //
    revenue_share_ivinex: data.revenue_share, //
    comp_super_affiliate_ivinex: data.comp_super_affiliate, //
    _of_years_an_agent_new: data._of_years_an_agent_new,
    email__personal_type: data.email__personal_type,
    linkedin: data.linkedin,
    date_of_first_client_refe: data.date_of_first_client_refe,
    fa_draw: data.fa_draw,
    field_1st: data.field_1st,
    field_2nd: data.field_2nd,
    field_3rd: data.field_3rd,
    primary_address_1: data.primary_address_1,
    modified_by: data.modified_by,
    modified_date: data.modified_date,
    phone_2: data.phone_2,
    email__business2_type: data.email__business2_type,
    spouse_has_loans_s: data.spouse_has_loans_s,
    primary_address_2: data.primary_address_2,
    primary_city: data.primary_city,
    no_sale_reason: data.no_sale_reason,
    type_of_repayment_s: data.type_of_repayment_s,
    fed_loan_payment_s: data.fed_loan_payment_s,
    loan_status_s: data.loan_status_s,
    actively_in_school_s: data.actively_in_school_s,
    fed_loan_amount_s: data.fed_loan_amount_s,
    click_on_convert_2: data.click_on_convert_2,
    click_on_convert_1: data.click_on_convert_1,
    primary_zip_code: data.primary_zip_code,
    first_name: data.first_name,
    last_name: data.last_name,
    primary_phone: data.primary_phone,
    email__business_type: data.email__business_type,
    firm_name: data.firm_name,
    primary_state: data.primary_state,
    time_zone0: data.time_zone0,
    affiliate_status_ivinex: data.affiliate_status,
    lead_source_ivinex: data.lead_source,
    of_registered_states: data?._of_registered_states,
    industry_ivinex: data.industry,
    conference_ivinex: data.conference,

    // New error Fields ------------------------------------------------------------------

    // phone_2_type: data.phone_2_type,
    // profession: data.profession,
    // lead_owner: data.lead_owner,
    // presenting_rep: data.presenting_rep,
    // _of_years_an_agent_old: data._of_years_an_agent_old,
    // created_date: data.created_date,
    // time_zone: data.time_zone,
    // primary_phone_line_type: data.primary_phone_line_type,
    //----------------------------------------------------------------------------------
  };
  const cleanedProperties = cleanProps(properties);

  // 🔥 Critical safety check
  if (!Object.keys(cleanedProperties).length) {
    throw new Error("Affiliate payload has no valid properties");
  }

  return {
    properties: cleanedProperties,
  };
}

// Create Invoices Payload

function buildHubSpotInvoicePayload(data = {}) {
  const properties = cleanProps({
    clients_tutor__only_sel: data?.clients_tutor__only_sel1,
    collection_id: data?.collection_id,
    site_id: data?.site_id,
    fields_changed: data?.fields_changed,
    dont_use_setter_if_25_: data?.dont_use_setter_if_25_,
    hours_spent: data?.hours_spent,
    created_by: data?.created_by,
    project_description: data?.project_description,
    amount_of_expense_receip: data?.amount_of_expense_receip,
    expense_description: data?.expense_description,
    review_bonuses__processi: data?.review_bonuses__processi,
    marketing_bonuses: data?.marketing_bonuses,
    advanced_planning_activit: data?.advanced_planning_activit,
    affiliate_bonus: data?.affiliate_bonus,
    related_client: data?.related_client,
    no_sale_bonus_to_setter_: data?.no_sale_bonus_to_setter_,
    hourly_rate: data?.hourly_rate,
    setter_name: data?.setter_name,
    sale_financing___recurri: data?.sale_financing___recurri,
    special_details: data?.special_details,
    amount_charged_today: data?.amount_charged_today,
    commission_: data?.commission_,
    sales_commission: data?.sales_commission,
    clients_tutor__only_sel: data?.clients_tutor__only_sel,
    related_affiliate: data?.related_affiliate,
    additional_work_completed: data?.additional_work_completed,
    payment_type: data?.payment_type,
    date_reconciled: data?.date_reconciled,
    related_inquirer: data?.related_inquirer,
    related_client_processin: data?.related_client_processin,
    special_notes: data?.special_notes,
    related_client_recertifc: data?.related_client_recertifc,
    aar_sale_amount: data?.aar_sale_amount,
    payment_arrangementtrade: data?.payment_arrangementtrade,
    modified_date: data?.modified_date,
    modified_by: data?.modified_by,
    tutor_sale_amount: data?.tutor_sale_amount,
    payment_arrangement: data?.payment_arrangement,
    dont_use__setter_if_50_: data?.dont_use__setter_if_50_,
    special_arrangements_deta: data?.special_arrangements_deta,
    created_date: data?.created_date,
    date_of_activity: data?.date_of_activity,
    contractor_name: data?.contractor_name,
    sales_category_report_cc: data?.sales_category_report_cc,
    invoice_category: data?.invoice_category,
    total_sale_amount: data?.total_sale_amount,
    total_invoice_amount: data?.total_invoice_amount,
    first_name: data?.first_name,
    last_name: data?.last_name,
    aar_activity_commission: data?.aar_activity_commission,
    processing_activity: data?.processing_activity,
    clients_tutor__only_sel0: data?.clients_tutor__only_sel0,
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
  13383: "(please select)",
  15073: "Pending - No Sale - Tutor Following Up",
  15021: "Pending - No Sale - Outstanding Invoice",
  14995: "Tutor Strategy Call Needed / Work Order Review",
  14208: "New Client Pending - Intake Scheduled",
  14195: "No Show Intake - Tutor Following Up",
  11893: "Gathering",
  13379: "Waiting to Submit",
  11894: "App Submitted",
  14185: "Ready for Sign-Off",
  11556: "Complete",
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
  15251: "(please select)",
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
  15253: "(please select)",
  15254: "Enter into IDR - SAVE",
  15255: "Enter into IDR - IBR",
  15256: "Enter into IDR - PAYE",
  15257: "Enter into IDR - ICR",
  15258: "Plan Change - to SAVE",
  15260: "Plan Change - to PAYE",
  15259: "Plan Change - to IBR",
  15261: "Plan Change - to ICR",
  15262: "Recertification",
  15263: "Recalculation",
  15308: "Multiple IDR Plans",
};

// client_is_pslf_ Mapping fields
const clientIsPslfMapping = {
  13004: "(please select)",
  13001: "No",
  13002: "Yes",
  13003: "Yes - New Enrollment",
  15283: "No Plan to Fulfill 120 mo. req.",
  13033: "Plans to Open Non-Profit",
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
const aarFeeMapping = {
  11552: "$250",
  11493: "$450",
  13370: "$600",
  15325: "$800",
  14253: "$400 (Low Bal./Spouse)",
  14200: "$300 (F&F)",
  13130: "Other (Trade etc.)",
};
//current_servicer Mapping fields
const currentServicerMapping = {
  11964: "(Please Select)",
  11969: "Multiple Servicers",
  11965: "Nelnet.studentaid.gov",
  13043: "Mohela.com (FFEL)",
  15239: "Servicing.Mohela.com",
  15071: "Mohela.studentaid.gov",
  14202: "AidVantage.studentaid.gov",
  13044: "EdFinancial.studentaid.gov",
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
const iaInquirerStatusMapping = {
  13380: "DON'T BOOK APC! (Send Dani Request to Connect with FA)",
  13238: "Missed Apt.",
  13394: "Priority Case (likely)",
  13032: "Following Up",
  13235: "Client in Progress",
  13135: "Active Client (Schedule with Current Advisor)",
  15186: "Inactive Client",
  13069: "Advisor Long Term Scheduled F/U",
  13026: "No Sale - Own Plan in Place",
  13241: "No Sale - MIA",
  13289: "No Sale - Offer APC Next Year",
  13290: "No Sale - Advisor F/U OK",
  13291: "No Sale - Don't Offer APC",
  13318: "No Sale - No $",
  15097: "Lost Opp (MIA)",
  15098: "Lost Opp (Health)",
  15099: "Lost Opp (Competitor))",
  15100: "Lost Opp (Misc.)",
  13246: "Advisor Final F/U Needed",
  14914: "Please book at AAR",
  13237: "Advisor F/U With Securities Option",
  15034: "Julia G. Transferred",
  14999: "Katie J. Transferred",
  14850: "No Sale - Matt",
  14890: "Pending Scheduling",
  14183: "Active HF Client (Securities Only)",
  14849: "Active HF Client (Matt)",
  13027: "Advisor Short Term Scheduled F/U",
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

// Create Clients Payload

function buildHubSpotClientPayload(data = {}) {
  function toTimestamp(dateStr) {
    return dateStr ? new Date(dateStr).getTime() : null;
  }
  const properties = cleanProps({
    // Old Mapping Fields...

    // picklist Mapping fields:-

    // tutor_name: clientsNameMapping[data?.tutor_name] ||null, // hubspot user
    // processor_name: processorNameMapping[data?.processor_name] ||null, // hubspot user
    // slt_referring_rep_nfm: sltReferringRepNfm[data?.slt_referring_rep_nfm] ||null, // hubspot user
    phone_1_type: phone1TypeMappingClient[data?.phone_1_type] || null,
    phone_2_type: phone2TypeMappingClient[data?.phone_2_type] || null,
    time_zone: timeZoneMapping[data?.time_zone0] || null, // hubspot single test-line
    status: statusMapping[data?.fields_changed] || null,
    // inactive_specifics: inactiveSpecificsMapping[data?.inactive_specifics] || null, // hubspot missing value
    current_idr_plan: currentIdrPlanMapping[data?.current_idr_plan] || null,
    type_of_idr_app_submitted:
      typeOfIdrAppSubmittedMapping[data?.type_of_idr_app_submitted] || null,
    client_is_pslf_: clientIsPslfMapping[data?.client_is_pslf0] || null,
    // calculation_performed_by: calculationPerformedByMapping[data?.calculation_performed_by] ||null, //hubspot user
    aar_fee: aarFeeMapping[data?.aar_fee] || null,
    current_servicer: currentServicerMapping[data?.current_servicer0] || null,
    // new_client_or_aar0: newClientOrAar0Mapping[data?.new_client_or_aar0] ||null, // hubspot missing fileds
    // does_client_have_a_financ: doesClientHaveAFinancMapping[data?.does_client_have_a_financ] ||null, // hubspot missing fileds
    // slt_referring_rep_nfm: sltReferringRepNfmMapping[data?.slt_referring_rep_nfm] ||null, // hubspot user
    // ia_inquirer_status: iaInquirerStatusMapping[data?.ia_inquirer_status] ||null,
    // solic_agent: solicAgentMapping[data?.solic_agent] ||null, // hubspot missing fields
    // ia_insurance_status: iaInsuranceStatusMapping[data?.ia_insurance_status] ||null, // hubspot missing fields
    // ia_securities_status: iaSecuritiesStatusMapping[data?.ia_securities_status] ||null, // hubspot missing fields
    // ia_type_of_client: iaTypeOfClientMapping[data?.ia_type_of_client] ||null, // hubspot missing fields
    // fulfillment_company: fulfillmentCompanyMapping[data?.fulfillment_company] || null, // hubspot missing fields

    // client_consolidation___loan_type_description:
    //   data?.client_consolidation__lo,
    // client_avg__interest_rate: data?.client_avg_interest_rate,
    hs_object_id: data?.hs_object_id,
    servicer___username: data.servicer__username,
    servicer___password: data.servicer__password,
    payment_problem_to_resolve: data.payment_problem_to_resolve,
    collection_notes: data.collection_notes,
    date_calculation_ran: data.date_calculation_ran,

    collection_id: data.collection_id,
    site_id: data.site_id,
    fields_changed: data.fields_changed,
    created_by: data.created_by,
    modified_by: data.modified_by,
    modified_date: data.modified_date,
    // lead_owner: data.lead_owner,
    phone_2: data.phone_2,
    email_2: data.email_2,
    address_1: data.address_1,
    address_2: data.address_2,
    city: data.city,
    state: data.state,
    zip: data.zip,
    spouse__partner: data.spouse__partner,
    // referral: data.referral,
    msa_sent_: data.msa_sent_,
    msa_received0: data.msa_received0,
    lpa_sent: data.lpa_sent,
    lpa_received: data.lpa_received,

    idr_app_submitted_date: data.idr_app_submitted_date,
    days_since_app_sub: data.days_since_app_sub,
    error_with_payments: data.error_with_payments,
    date_of_birth: data.date_of_birth,
    primary_phone0: data.primary_phone0,
    primary_phone_type: data.primary_phone_type,
    secondary_phone: data.secondary_phone,
    secondary_phone_type: data.secondary_phone_type,
    studentaidgov_user_not_0: data.studentaidgov_user_not_0,
    studentaidgov_pass_not_0: data.studentaidgov_pass_not_0,
    employerbusiness_name: data.employerbusiness_name,
    employer_address: data.employer_address,
    employers_city: data.employers_city,
    employers_state: data.employers_state,

    reference_1_name: data.reference_1_name,
    reference_1_address: data.reference_1_address,
    reference_1_city: data.reference_1_city,
    reference_1_state: data.reference_1_state,
    reference_1_zip_: data.reference_1_zip_,
    reference_2_name: data.reference_2_name,
    reference_2_address: data.reference_2_address,
    reference_2_city: data.reference_2_city,
    reference_2_state: data.reference_2_state,
    reference_2_zip: data.reference_2_zip,

    spouse__full_name_: data.spouse__full_name_,
    spouse__date_of_birth: data.spouse__date_of_birth,
    maidenformer_name: data.maidenformer_name,
    spouse__ssn: data.spouse__ssn,
    spouse__email: data.spouse__email,
    spouse__phone: data.spouse__phone,
    spouse__loan_amount: data.spouse__loan_amount,

    employer_info_: data.employer_info_,
    personal_reference: data.personal_reference,
    spouse_info: data.spouse_info,

    q26_spouse_income_changed0: data.q26_spouse_income_changed0,
    desired_servicer_s: data.desired_servicer_s,
    borrower_actual_agi_0: data.borrower_actual_agi_0,
    state_s: data.state_s,
    actual_combined_agi_s: data.actual_combined_agi_s,
    spouse_actual_agi_s: data.spouse_actual_agi_s,
    desired_repay_plan_s: data.desired_repay_plan_s,
    q1_balance_based_type_s: data.q1_balance_based_type_s,
    q1_and_q2_desired_repay_p0: data.q1_and_q2_desired_repay_p0,
    q5_dependent_children_s: data.q5_dependent_children_s,
    q6_other_dependents_s: data.q6_other_dependents_s,
    q7_marital_status_s: data.q7_marital_status_s,
    q10_employment_type_s: data.q10_employment_type_s,
    q20_filed_taxes_last_2_yr0: data.q20_filed_taxes_last_2_yr0,
    q23_separated_from_spouse0: data.q23_separated_from_spouse0,
    q24_sp_income_access_s: data.q24_sp_income_access_s,
    q8_filed_taxes_last_2_yrs: data.q8_filed_taxes_last_2_yrs,
    filed_taxes_last_2_yrs0: data.filed_taxes_last_2_yrs0,
    q25_spouse_filed_taxes_s: data.q25_spouse_filed_taxes_s,
    q15_you_and_spouse_filed_0: data.q15_you_and_spouse_filed_0,
    q21_income_change_since_l0: data.q21_income_change_since_l0,
    q22_taxable_income_s: data.q22_taxable_income_s,

    reference_1_phone: data.reference_1_phone,
    reference_1_relationship: data.reference_1_relationship,
    reference_2_phone: data.reference_2_phone,
    reference_2_relationship: data.reference_2_relationship,
    employers_zip: data.employers_zip,
    roa_sent_to_servicer: data.roa_sent_to_servicer,
    time_zone0: data.time_zone0,
    // client_current_plan_idr_history: data.client_current_planidr_h,
    primary_phone0: data?.primary_phone,
    address_1: data.address,
    desired_servicer_s: data?.servicer_account_,
    // days_to_recert: data?.days_to_recert,
    // possible_testimonial: data?.possible_testimonial,
    // mn_client: data?.mn_client,
    // ny_client: data?.ny_client,
    // ca_client: data?.ca_client,
    import_id: data?.import_id,
    mass_update: data?.mass_update_,
    // referred_to_slp: data?.referred_to_slp,
    // double_consol_ppl_in_progress: data?.double_consol_ppl_in_prog,
    servicer_account: data?.servicer_account_,
    first_year_of_payment: data?.first_year_of_payment,
    pp_tags_active: data?.pp_tags_active,
    current_year_total_balance: data?.current_year_total_balanc,
    calculator_report_link: data?.calculator_report_link,
    payment_problem_to_resolve: data?.payment_problem_to_resolv,
    current_ffel_loans: data?.current_ffel_loans,
    // special_calculation_notes: data?.special_calculation_notes,
    email_address: data?.email_address,

    first_name: data.first_name,
    last_name: data.last_name,
    n2nd_contact___first_name: data?.first_name,
    n2nd_contact___last_name: data?.last_name,
    n2nd_contact___email: data?.email_1,
    n2nd_contact___phone: data?.primary_phone,
    client_name: data?.client_name,

    email_1: data.email_1,
    phone_1_type_ivinex: data?.phone_1_type, //
    phone_2_type_ivinex: data?.phone_2_type, //
    spouse_has_loans_ivinex: data?.spouse_has_loans, //
    // forbearance_needed0_ivinex: data?.forbearance_needed0, //todo doesnot exist in hubspot
    // pslf_ivinex:data?.pslf, //todo doesnot exist in hubspot

    // Error fields for Clients ---------------------------------------------------------------------------
    // slt_referring_rep_nfm: data.slt_referring_rep_nfm,//todo data mismatch
    // tutor_name:data?.tutor_name,
    // processor_name: data?.processor_name,
    // "status1": "13385",
    // "days_since_client_cont": "488"
    // client_date:data?.created_date,
    // client_action_taken:data?.client_action_taken,
    // recert_date:data?.recert_date,
    // social_security_number:data?.social_security_number,
    // "available_advisors": "0",
    // "lpamsa__sent_from": "0",
    // "no_apc__fa_referral": "false",
    // "current_idr_plan": "0",
    // "type_of_idr_app_submitted": "0",
    // "client_contact_info": "1",
    // aar_automation_date: data?.aar_automation_date,
    // "if_idr_plan_date_is_diffe": "1",
    // "advisor_action_needed": "false",
    // "testimonial_complete": "false",
    // "ni_in_testimonial": "false",
    // "ia_securities_status": "0",
    // "new_client_or_aar0": "0",
    // "does_client_have_a_financ": "0",
    // "apc_booking_status_no_lo": "15076",
    // "avs_only__no_lpa__charg": "0",
    // "charge_percentage__msa_f": "0",
    // idr_recert_app_sub_deadline:data?.
    // days_to_deadline:data?.idr_recert_app_sub_deadli,
    // "fulfillment_company": "15025",
    // "solic_agent": "15035",
    // "ia_type_of_client": "14921",
    // "backdoor_roth": "false",
    // "nelnet_security_code_emai": "T.FrazierSLT2024@gmail.com",
    // "nelnet_security_code_emai0": "StudentLoans28!",
    // "client_ssn_last_4": "4321",
    // "client_ssn_full": "123-45-4321",
    // "studentloanrecordid": "1",
    // "tsr_client_no_longer_use": "false",
    // "apc_status0": "1",
    // "client_int_in_slt_nonpr0": "false",
    // "date_marked_inactive": "2024-08-29",
    // "referring_affiliate": "0",
    // "escrow_protocol": "false",
    // "est_forgiveness_date0": "2042-01-25",
    // "years_until_forgiveness": "-192",
    // "apc_status": "1",
    // "referrals": "1",
    // "inactive_specifics": "14184",
    // "do_not_complete_work_unti": "0.00",
    // "slt_rep_referred_by_no_l": "55",
    // "calculation_performed_by": "14",
    // "ia_insurance_status": "13282",
    // "state_license_needed": "UT",
    // "term_only0": "false",
    // "na_interested_in_securit": "false",
    // "monthly_premium0": "0.00",
    // "fyc_est": "0.00",
    // "q1_income_driven_type_s": "1",
    // "q18_employment_type_0": "1",
    // "q13_if_icr_repay_jointly_": "1",
    // "q16_income_changed_s": "1",
    // "q17_spouse_income_changed0": "1",
    // "client_created_date": "2016-08-10 13:03:00",
    //  aar_fee:data?.aar_fee,
    // "q12_provide_info": "1",
    // "q4_in_forbearance": "1",
    // "client_name_fulf": "1",
    // "client_name_fulc": "1",
    // "recerts": "1",
    // "middle_initialname": "Delane",
    // "customer_info": "1",
    // "current_servicer0": "11965",
    // "status0": "1",
    // "profession0": "12735",
    // "client_is_pslf0": "13001",
    // "ia_inquirer_status": "13289",
    // "meeting_notes": "@sara Troy Frazier. Didn't have loan data or myaid data on file (please try to have that for future APC's). They are in too much debt and recovering from surgery and no cashflow so not in a good spot to start saving. In a year please ask them if they have excess in their business again and if it would be a good time for michael to help them get setup with a whole life policy. ",
    //------------------------------------------------------------------------------------------------------

    // New Mapping Client value:-

    // collection_id: data?.collection_id,
    // site_id: data?.site_id,
    // fields_changed: data?.fields_changed,
    // created_by: data?.created_by,
    // modified_by: data?.modified_by,
    // modified_date: data?.modified_date,
    // lead_owner: data?.lead_owner,

    // phone_2: data?.phone_2,
    // email_2: data?.email_2,

    // time_zone0: data?.time_zone0,
    // address_1: data?.address_1,
    // address_2: data?.address_2,
    // city: data?.city,
    // state: data?.state,
    // zip: data?.zip,

    // spouse__partner: data?.spouse__partner,
    // referral: data?.referral,

    // msa_sent_: data?.msa_sent_,
    // msa_received0: data?.msa_received0,
    // lpa_sent: data?.lpa_sent,
    // lpa_received: data?.lpa_received,

    // idr_app_submitted_date: data?.idr_app_submitted_date,
    // days_since_app_sub: data?.days_since_app_sub,
    // error_with_payments: data?.error_with_payments,

    // date_of_birth: data?.date_of_birth,

    // primary_phone0: data?.primary_phone0,
    // primary_phone_type: data?.primary_phone_type,
    // secondary_phone: data?.secondary_phone,
    // secondary_phone_type: data?.secondary_phone_type,

    // studentaidgov_user_not_0: data?.studentaidgov_user_not_0,
    // studentaidgov_pass_not_0: data?.studentaidgov_pass_not_0,

    // employerbusiness_name: data?.employerbusiness_name,
    // employer_address: data?.employer_address,
    // employers_city: data?.employers_city,
    // employers_state: data?.employers_state,

    // reference_1_name: data?.reference_1_name,
    // reference_1_address: data?.reference_1_address,
    // reference_1_city: data?.reference_1_city,
    // reference_1_state: data?.reference_1_state,
    // reference_1_zip_: data?.reference_1_zip_,

    // reference_2_name: data?.reference_2_name,
    // reference_2_address: data?.reference_2_address,
    // reference_2_city: data?.reference_2_city,
    // reference_2_state: data?.reference_2_state,
    // reference_2_zip: data?.reference_2_zip,

    // spouse__full_name_: data?.spouse__full_name_,
    // spouse__date_of_birth: data?.spouse__date_of_birth,
    // maidenformer_name: data?.maidenformer_name,
    // spouse__ssn: data?.spouse__ssn,
    // spouse__email: data?.spouse__email,
    // spouse__phone: data?.spouse__phone,

    // spouse__loan_amount: data?.spouse__loan_amount,

    // employer_info_: data?.employer_info_,
    // personal_reference: data?.personal_reference,
    // spouse_info: data?.spouse_info,

    // q26_spouse_income_changed0: data?.q26_spouse_income_changed0,
    // desired_servicer_s: data?.desired_servicer_s,

    // borrower_actual_agi_0: data?.borrower_actual_agi_0,
    // state_s: data?.state_s,
    // actual_combined_agi_s: data?.actual_combined_agi_s,
    // spouse_actual_agi_s: data?.spouse_actual_agi_s,

    // desired_repay_plan_s: data?.desired_repay_plan_s,
    // q1_balance_based_type_s: data?.q1_balance_based_type_s,

    // q1_and_q2_desired_repay_p0: data?.q1_and_q2_desired_repay_p0,

    // q5_dependent_children_s: data?.q5_dependent_children_s,
    // q6_other_dependents_s: data?.q6_other_dependents_s,
    // q7_marital_status_s: data?.q7_marital_status_s,

    // q10_employment_type_s: data?.q10_employment_type_s,

    // q20_filed_taxes_last_2_yr0: data?.q20_filed_taxes_last_2_yr0,
    // q23_separated_from_spouse0: data?.q23_separated_from_spouse0,
    // q24_sp_income_access_s: data?.q24_sp_income_access_s,

    // q8_filed_taxes_last_2_yrs: data?.q8_filed_taxes_last_2_yrs,
    // filed_taxes_last_2_yrs0: data?.filed_taxes_last_2_yrs0,

    // q25_spouse_filed_taxes_s: data?.q25_spouse_filed_taxes_s,
    // q15_you_and_spouse_filed_0: data?.q15_you_and_spouse_filed_0,
    // q21_income_change_since_l0: data?.q21_income_change_since_l0,
    // q22_taxable_income_s: data?.q22_taxable_income_s,

    // Error Fields-------------------------------------------------------------------------------
    // created_date: data?.created_date,
    // q1_income_driven_type_s: data?.q1_income_driven_type_s,
    // q18_employment_type_0: data?.q18_employment_type_0,
    // client_action_taken: data?.client_action_taken,
    // recert_date: data?.recert_date,
    // social_security_number: data?.social_security_number,
    //----------------------------------------------------------------------------------------------------
  });

  // console.log("Cleaned properties:", properties);

  if (Object.keys(properties).length === 0) {
    throw new Error("Client payload is empty");
  }

  return { properties };
}

// Picklist Mapping Work Order

// employment_type Mapping fields
const employmentTypeMapping = {
  15056: "(please select)",
  15053: "Self Employed - Business Owner",
  15054: "Self Employed - No Entity Set Up Yet",
  15067: "Self Employed - 1099",
  15055: "W2 - Employee",
  15059: "Multiple - Self Employed/W2",
  15057: "Unemployed",
  15172: "Retired",
};

// income_doc_type Mapping fields
const incomeDocTypeMapping = {
  11929: "(please select)",
  12037: "Multiple Sources",
  11932: "Payroll / Pay Stub",
  11933: "SCDI / Income Letter",
  11930: "1040",
  11931: "1099 (most recent year only)",
  13259: "W2 (most recent year only)",
  15213: "Social Security",
  11957: "Unemployment",
  12708: "No Income / Between Jobs",
};
// marital_status Mapping fields

const maritalStatusMappingOrder = {
  11911: "(please select)",
  11913: "Single",
  11915: "Engaged",
  11912: "Married",
  11916: "Separated",
  11914: "Divorced",
};
// most_recent_tax_filing_st Mapping fields
const mostRecentTaxFilingStatusMapping = {
  11917: "(please select)",
  11918: "Single",
  11919: "Married Filing Jointly - With Access",
  11955: "Married Filing Jointly - No Access",
  12991: "Married Filing Separately - No Access",
  12728: "Married but Separated - No Access",
  11920: "Married Filing Separately - With Access (Only for IBR, PAYE)",
};
// tax_saving_status_apc Mapping fields
const taxSavingStatusApcMapping = {
  14762: "(please select)",
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
  15018: "(please select)",
  15017: "Current Client",
  15016: "New Client",
};

// work_needed Mapping fields
const workNeededMapping = {
  11951: "(please select)",
  11890: "Recert AAR",
  15019: "Consol",
  15287: "PSLF - Enter into IDR from Balanced Based",
  15020: "No Consol - Enter into IDR from Balance Based",
  12871: "No Consol - Plan Change",
  11889: "No Consol - Recalc",
  11907: "New Client Recert - No Consol",
  14989: "Double Consolidation - Parent Plus",
  11954: "Fresh Start",
  12758: "Default/Consol",
};
// pslf mapping fields
const pslfMapping = {
  12725: "Yes - Not Yet Enrolled",
  11945: "Yes - Already Enrolled",
  11946: "No",
  11947: "In Process",
};
//forbearance_needed mapping fields
const forbearanceNeededMapping = {
  12705: "No",
  12706: "Yes",
  15022: "Yes - Past Due",
  12707: "In Forbearance",
};

//hh_size__income_threshol mapping fields
const hhSizeIncomeThresholdMapping = {
  15225: "(please select)",
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
  15226: "(please select)",
  15218: "HH1 - $23475",
  15219: "HH2 - $31725",
  15220: "HH3 - $39975",
  15221: "HH4 - $48225",
  15222: "HH5 - $56475",
  15223: "HH6 - $64725",
  15224: "HH7 - $72975",
  15235: "HH8 - $81225",
  15277: "HH9 - $89475",
  15278: "HH10 - $97725"
};
//field_2025_icr__20 mapping fields
const field2025Icr20Mapping = {
  15227: "(please select)",
  15228: "HH1 - $15650",
  15229: "HH2 - $21150",
  15230: "HH3 - $26650",
  15231: "HH4 - $32150",
  15232: "HH5 - $37650",
  15233: "HH6 - $43150",
  15234: "HH7 - $48650",
  15276: "HH8 - $54150",
  15279: "HH9 - $59650",
  15280: "HH10 - $65150"
};
// Order Payload

function buildHubspotOrderPayload(data = {}) {
  const payload = cleanProps({
    // picklist Mapping here
    employment_type: employmentTypeMapping[data?.employment_type] || null,
    // income_doc_type: incomeDocTypeMapping[data?.income_doc_type] || null,
    marital_status: maritalStatusMappingOrder[data?.marital_status] || null,
    most_recent_tax_filing_st:
      mostRecentTaxFilingStatusMapping[data?.most_recent_tax_filing_st] || null, // hubspot single-text-line
    tax_saving_status_apc:
      taxSavingStatusApcMapping[data?.tax_saving_status_apc] || null, // hubspot single-text-line
    type0: type0Mapping[data?.type0] || null, // hubspot single-text line
    // work_needed: workNeededMapping[data?.work_needed] || null,
    pslf: pslfMapping[data?.pslf] || null,
    // forbearance_needed:
      // forbearanceNeededMapping[data?.forbearance_needed] || null,
    hh_size__income_threshol:
      hhSizeIncomeThresholdMapping[data?.hh_size__income_threshol] || null, // hubspot single-text-line
    field_2025_ibrpaye__15: field2025Ibrpaye15Mapping[data?.field_2025_ibrpaye__15] || null, //hubspot single text line
    field_2025_icr__20: field2025Icr20Mapping[data?.field_2025_icr__20] || null, //hubspot single text line

    income_doc_type_ivinex: data?.income_doc_type,
    marital_status_ivinex: data?.marital_status,
    pslf_ivinex: data?.pslf,
    consolidation_2_desired_0: data?.consolidation,
    desired_servicer_ivinex: data?.desired_servicer,
    desired_repayment_plan_ivinex: data?.desired_repayment_plan,
    employment_type_ivinex: data?.employment_type,
    income_frequency_1: data?._income_frequency_1,
    current_repayment_plan_ivinex: data?.current_repayment_plan,
    forbearance_needed0_ivinex: data?.forbearance_needed,

    // Order Mapping Fields:-

    collection_id: data?.collection_id,
    site_id: data?.site_id,
    fields_changed: data?.fields_changed,
    created_by: data?.created_by,
    modified_by: data?.modified_by,
    modified_date: data?.modified_date,
    // most_recent_tax_filing_st: data?.most_recent_tax_filing_st,
    filed_taxes_in_the_last_t: data?.filed_taxes_in_the_last_t,
    household_size: data?.household_size,
    children: data?.children,
    other: data?.other,
    amount: data?.amount,
    income_frequency: data?.income_frequency,
    linked_record: data?.linked_record,
    notes: data?.notes,
    spouse_income: data?.spouse_income,
    spouse_income_type: data?.spouse_income_type,
    spouse_income_frequency: data?.spouse_income_frequency,

    spouse_fed_loan_amount0: data?.spouse_fed_loan_amount0,
    nslds_screenshots: data?.nslds_screenshots,
    outstanding_principle: data?.outstanding_principle,
    avg_interest_rate_: data?.avg_interest_rate_,
    percent_subsidized_: data?.percent_subsidized_,
    years_towards_forgiveness: data?.years_towards_forgiveness,
    consolidationloan_notes: data?.consolidationloan_notes,
    est_tax_implication_: data?.est_tax_implication_,
    life_of_loan_payments: data?.life_of_loan_payments,
    est_total_cost_of_slt_st: data?.est_total_cost_of_slt_st,
    balance_based_mo_payment: data?.balance_based_mo_payment,
    balance_based_total_cost: data?.balance_based_total_cost,
    overall_savings_vs_balan: data?.overall_savings_vs_balan,
    new_payment_amount: data?.new_payment_amount,
    additional_notes_: data?.additional_notes_,
    if_invest_monthly_saving: data?.if_invest_monthly_saving,
    total_earnings_by_time_of: data?.total_earnings_by_time_of,
    date_info_captured: data?.date_info_captured,
    total_balance: data?.total_balance,
    current_servicer: data?.current_servicer,
    interest_per_year: data?.interest_per_year,
    after_neg_am_interest_pe: data?.after_neg_am_interest_pe,
    interest_life_of_loan_be0: data?.interest_life_of_loan_be0,

    subsidized_forgiveness_su: data?.subsidized_forgiveness_su,
    projected_balance_at_time: data?.projected_balance_at_time,
    projected_additional_inte: data?.projected_additional_inte,
    apc_notes: data?.apc_notes,
    year_of_taxes_being_used: data?.year_of_taxes_being_used,
    tutor_approx_value_of_str: data?.tutor_approx_value_of_str,
    servicer: data?.servicer,
    balance_based_years: data?.balance_based_years,
    balance_based_scenarios: data?.balance_based_scenarios,
    value_of_cashflow: data?.value_of_cashflow,
    slt_calc_results: data?.slt_calc_results,
    household_notes: data?.household_notes,
    income_notes: data?.income_notes,
    // hh_size__income_threshol: data?.hh_size__income_threshol,
    related_email_address: data?.related_email_address,
    income_notes0: data?.income_notes0,
    household_notes0: data?.household_notes0,
    refusal_details0: data?.refusal_details0,
    stop_dont_use: data?.stop_dont_use,
    copy_order: data?.copy_order,
    type0: data?.type0,
    months_of_pslf: data?.months_of_pslf,
    due_remove_auto_pay: data?.due_remove_auto_pay,
    servicerwebsite: data?.servicerwebsite,
    plans: data?.plans,
    consol_1_loan_codes__am: data?.consol_1_loan_codes__am,
    consol_2_loan_codes__am: data?.consol_2_loan_codes__am,
    consolidation_1_desired_0: data?.consolidation_1_desired_0,
    consolidation_2_desired_0: data?.consolidation_2_desired_0,
    consolidation_3_desired_: data?.consolidation_3_desired_,
    final_step_enroll_into_i: data?.final_step_enroll_into_i,
    current_servicer__repaym: data?.current_servicer__repaym,
    consol_3_loan_codes__am: data?.consol_3_loan_codes__am,
    dates: data?.dates,
    amount_1: data?.amount_1,
    amount_2: data?.amount_2,
    dates0: data?.dates0,
    agi: data?.agi,

    income_frequency_2: data?.income_frequency_2,
    spouses_name: data?.spouses_name,
    special_grouping__notes: data?.special_grouping__notes,
    spouse_income_notes: data?.spouse_income_notes,
    // field_2025_ibrpaye__15: data?.field_2025_ibrpaye__15,
    // field_2025_icr__20: data?.field_2025_icr__20,
    consolidating_heal_loans0: data?.consolidating_heal_loans0,
    in_school_deferment: data?.in_school_deferment,
    forbearance_needed0: data?.forbearance_needed0,
    total: data?.total,
    total0: data?.total0,
    consolidate: data?.consolidate,
    leave_out: data?.leave_out,
    plans0: data?.plans0,
    eligible_for_ibr_new_all: data?.eligible_for_ibr_new_all,
    year0: data?.year0,

    estimated_payment: data?.estimated_payment,
    client: data?.client,
    actual_payment: data?.actual_payment,
    // tax_saving_status_apc: data?.tax_saving_status_apc,
    created_date: data?.created_date,

    // IMPORTANT: must be a STAGE ID, not pipeline ID or label
    // hs_pipeline_stage: data?.hs_pipeline_stage,
    hs_pipeline_stage: "2091193059",
    subject: "SLT calculation record",
    content: "Created via API",
  });
  return { properties: payload };
}
// Text Message Payload

// function buildTextMessagePayload(data = {}) {
//   const payload = {
//     collection_id: data?.collection_id,
//     site_id: data?.site_id,
//     fields_changed: data?.fields_changed,

//     created_by: data?.created_by,
//     modified_by: data?.modified_by,
//     modified_date: data?.modified_date,
//     created_date: data?.created_date,

//     read_status: data?.read_status,
//     status: data?.status,

//     message: data?.message,

//     text_number: data?.text_number,
//     external_number: data?.external_number,

//     external_id: data?.external_id,

//     client: data?.client,

//     group_text: data?.group_text,
//     group_text_parent: data?.group_text_parent,
//   };

//   return cleanProps(payload);
// }

// new Text Message Payload
function buildTextMessagePayload(data = {}) {
  const lines = [];

  if (data.collection_id) lines.push(`Collection ID: ${data.collection_id}`);
  if (data.site_id) lines.push(`Site ID: ${data.site_id}`);
  if (data.fields_changed) lines.push(`Fields Changed: ${data.fields_changed}`);

  if (data.created_by) lines.push(`Created By: ${data.created_by}`);
  if (data.modified_by) lines.push(`Modified By: ${data.modified_by}`);
  if (data.modified_date) lines.push(`Modified Date: ${data.modified_date}`);
  if (data.created_date) lines.push(`Created Date: ${data.created_date}`);

  if (data.read_status) lines.push(`Read Status: ${data.read_status}`);
  if (data.status) lines.push(`Status: ${data.status}`);

  if (data.message) lines.push(`Message: ${data.message}`);

  if (data.text_number) lines.push(`Text Number: ${data.text_number}`);
  if (data.external_number)
    lines.push(`External Number: ${data.external_number}`);

  if (data.external_id) lines.push(`External ID: ${data.external_id}`);

  if (data.client) lines.push(`Client: ${data.client}`);

  if (data.group_text) lines.push(`Group Text: ${data.group_text}`);
  if (data.group_text_parent)
    lines.push(`Group Text Parent: ${data.group_text_parent}`);

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
    collection_id: data?.collection_id,
    site_id: data?.site_id,
    fields_changed: data?.fields_changed,

    linked_record: data?.linked_record,
    linked_module: data?.linked_module,

    folder_id: data?.folder_id,
    retry_count: data?.retry_count,

    notify_options: data?.notify_options,
    external_options: data?.external_options,

    message_uid: data?.message_uid,
    message_id: data?.message_id,
    result: data?.result,

    open_date: data?.open_date,
    events: data?.events,

    email_attachments: data?.email_attachments,
    ivinex_attachments: data?.ivinex_attachments,
    file_upload_status: data?.file_upload_status,

    template_processed: data?.template_processed,
    email_template: data?.email_template,

    replied_from: data?.replied_from,
    forwarded_from: data?.forwarded_from,

    reply: data?.reply,
    reply_all: data?.reply_all,
    forward: data?.forward,

    delay_send_date: data?.delay_send_date,

    created_date: data?.created_date,
    modified_by: data?.modified_by,
    modified_date: data?.modified_date,
    created_by: data?.created_by,

    email_from: data?.email_from,
    email_from_name: data?.email_from_name,

    email_to: data?.email_to,
    cc: data?.cc,
    bcc: data?.bcc,

    subject: data?.subject,
    body: data?.body,
    body_plain: data?.body_plain,

    email_date: data?.email_date,
    email_status: data?.email_status,

    email_account: data?.email_account,
    user: data?.user,
  };

  return cleanProps(payload);
}

// Create Activity Payload

// function buildHubSpotActivityPayload(data = {}) {
//   const payload = cleanProps({

//     collection_id: data?.collection_id,
//     site_id: data?.site_id,
//     fields_changed: data?.fields_changed,

//     location: data?.location,
//     date_email_opened: data?.date_email_opened,

//     email_id: data?.email_id,
//     subject: data?.subject,

//     field_from: data?.field_from,
//     email_to: data?.email_to,
//     cc: data?.cc,
//     bcc: data?.bcc,

//     recurrence: data?.recurrence,
//     all_day_event: data?.all_day_event,

//     start_time: data?.start_time,
//     end_time: data?.end_time,

//     priority: data?.priority,
//     status: data?.status,

//     activity: data?.activity,
//     description: data?.description,

//     assigned: data?.assigned,

//     created_date: data?.created_date,
//     created_by: data?.created_by,

//     modified_date: data?.modified_date,
//     modified_by: data?.modified_by,

//     date: data?.date,
//   });

//   if (!Object.keys(payload).length) {
//     throw new Error("❌ Activity payload is empty");
//   }

//   return {
//     payload: {
//       hs_note_body: lines.join("\n"),
//       hs_timestamp: new Date().toISOString(), // ✅ REQUIRED
//     },
//   };
// }

// new payload Activity

function buildHubSpotActivityPayload(data = {}) {
  const lines = [];

  if (data.collection_id) lines.push(`Collection ID: ${data.collection_id}`);
  if (data.site_id) lines.push(`Site ID: ${data.site_id}`);
  if (data.fields_changed) lines.push(`Fields Changed: ${data.fields_changed}`);

  if (data.location) lines.push(`Location: ${data.location}`);
  if (data.date_email_opened)
    lines.push(`Email Opened: ${data.date_email_opened}`);

  if (data.email_id) lines.push(`Email ID: ${data.email_id}`);
  if (data.subject) lines.push(`Subject: ${data.subject}`);

  if (data.field_from) lines.push(`From: ${data.field_from}`);
  if (data.email_to) lines.push(`To: ${data.email_to}`);
  if (data.cc) lines.push(`CC: ${data.cc}`);
  if (data.bcc) lines.push(`BCC: ${data.bcc}`);

  if (data.recurrence) lines.push(`Recurrence: ${data.recurrence}`);
  if (data.all_day_event !== undefined)
    lines.push(`All Day Event: ${data.all_day_event}`);

  if (data.start_time) lines.push(`Start Time: ${data.start_time}`);
  if (data.end_time) lines.push(`End Time: ${data.end_time}`);

  if (data.priority) lines.push(`Priority: ${data.priority}`);
  if (data.status) lines.push(`Status: ${data.status}`);

  if (data.activity) lines.push(`Activity: ${data.activity}`);
  if (data.description) lines.push(`Description: ${data.description}`);

  if (data.assigned) lines.push(`Assigned: ${data.assigned}`);

  if (data.created_date) lines.push(`Created Date: ${data.created_date}`);
  if (data.created_by) lines.push(`Created By: ${data.created_by}`);

  if (data.modified_date) lines.push(`Modified Date: ${data.modified_date}`);
  if (data.modified_by) lines.push(`Modified By: ${data.modified_by}`);

  if (data.date) lines.push(`Date: ${data.date}`);

  return {
    properties: {
      hs_note_body: lines.join("\n"),
      hs_timestamp: new Date().toISOString(), // ✅ REQUIRED
    },
  };
}

export {
  cleanProps,
  buildHubSpotInquirerPayload,
  buildHubSpotAffiliatePayload,
  buildHubSpotActivityPayload,
  buildHubSpotInvoicePayload,
  buildHubSpotClientPayload,
  buildHubspotOrderPayload,
  buildTextMessagePayload,
  buildEmailPayload,
};
