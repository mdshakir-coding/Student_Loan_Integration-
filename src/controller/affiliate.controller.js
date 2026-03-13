import { logger } from "../index.js";

import { fetchAffiliateRecords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotAffiliatePayload } from "../utils/helper.js";
import { createAffiliateInHubSpot } from "../service/student.service.js";
import { updateAffiliateInHubSpot } from "../service/student.service.js";
import { searchAffiliateByInHubspot } from "../service/student.service.js";
// import {buildAffiliateHubspotUser} from '../utils/helper.js'

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

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

// async function syncAffiliate() {
//   try {
//     const records = await fetchAffiliateRecords(); // call the function for All Affiliate Records  synced
//     console.log("Affiliate Records", records.length);

//     // if (records.length === 0) {
//     //   console.log("🎄 All Affiliated Processed");
//     //   return;
//     // }

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {
//       try {
//         const record = records[i];

//         let affiliateId = null;

//         const Payloads = buildHubSpotAffiliatePayload(record); // call the function for payload

//         console.log(" Records", record);
//         console.log("Payloads", Payloads);
//         // return; // todo remove after testing

//         // await createAffiliateInHubSpot(Payloads);

//         // create Affiliate in hubspot
//         const create = await createAffiliateInHubSpot(Payloads);
//         console.log("✅ Affiliate created", affiliateId);
//         affiliateId = create?.id || null;

//         // Save progress after successful processing
//         // saveProgress(i + 1);
//       } catch (error) {
//         console.error(error);
//         // saveProgress(i);
//         break; // todo remove after testing
//       }
//     }

//     console.log("🎄 All Affiliated Processed");
//   } catch (error) {
//     console.error("Error Fecting Inquirer Records", error);
//     return;
//   }
// }

async function syncAffiliate() {
  try {
    const records = await fetchAffiliateRecords(); // fetch all affiliate records
    console.log("Affiliate Records", records.length);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processAffiliate(record);

        return;
        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        console.error("Error processing record index", i, error);
        // Save progress here to resume later if needed
        // saveProgress(i);
      }
    }

    console.log("🎄 All Affiliates Processed");
  } catch (error) {
    console.error("Error fetching affiliate records", error);
    return;
  }
}

async function processAffiliate(
  record={

            "collection_id": "12975",
            "site_id": "1",
            "fields_changed": "0,15261,14844,0",
            "date_setter_spoke_w_affi": null,
            "created_by": "71",
            "employment_type_s": "1",
            "field_30_day_income_s": "1",
            "tome_zone_intake": "1",
            "lead_description__specia0": "Draw Complete\n\nWorks in an office with CPA's\nStarted with Northwestern Mutual - medical residences now with 1847 Financial \nJust presented to 40 CA's \nWould like to schedule a webinar with me\nMedical professionals \n\n1 of 3 - 12/18",
            "date_of_last_contact": null,
            "industry": "14739",
            "presenting_rep": "71",
            "bd_andor_ria_rep": "",
            "date_of_birth__year": "",
            "receives_texts": "false",
            "name_stated_on_vm": "",
            "date_of_fa_presentation": "2024-11-18",
            "title": "FA",
            "_of_registered_states": "",
            "marital_status_s": "1",
            "vip_affiliate": "false",
            "_of_years_an_agent_new": null,
            "email__personal_type": "",
            "linkedin": "",
            "has_referrals_in_mind_asa": "false",
            "date_of_first_client_refe": null,
            "affiliate_nurturing_call": "false",
            "revenue_share": "false",
            "comp_super_affiliate": "15128",
            "conference": "15132",
            "fa_draw": "",
            "field_1st": "true",
            "field_2nd": "true",
            "field_3rd": "true",
            "primary_address_1": "",
            "created_date": "2024-11-19 14:27:26",
            "modified_by": "41",
            "modified_date": "2026-01-28 14:58:27",
            "time_zone": "0",
            "primary_phone_line_type": "14264",
            "phone_2": "",
            "phone_2_type": "14268",
            "email__business2_type": "",
            "time_zone0": "14335",
            "spouse_has_loans_s": "1",
            "primary_address_2": "",
            "primary_city": "Baton Rouge",
            "no_sale_reason": "14525",
            "type_of_repayment_s": "1",
            "fed_loan_payment_s": "1",
            "loan_status_s": "1",
            "actively_in_school_s": "1",
            "fed_loan_amount_s": "1",
            "profession": "14393",
            "click_on_convert_2": "1",
            "click_on_convert_1": "1",
            "primary_zip_code": "",
            "lead_owner": "71",
            "first_name": "Donny",
            "last_name": "Schmitt ",
            "primary_phone": "",
            "email__business_type": "dschmitt@attracctfinancial.com ",
            "affiliate_status": "14757",
            "lead_source": "14842",
            "_of_years_an_agent_old": "",
            "firm_name": "Attracct Financial ",
            "primary_state": "Louisiana"
        
}
) {
  try {
    // Build payload
    const Payloads = buildHubSpotAffiliatePayload(record);

    logger.info(`Affiliate Record: ${JSON.stringify(record, null, 2)}`);
    logger.info(`Affiliate Payload: ${JSON.stringify(Payloads,  null, 2)}`);

    // First, search existing affiliate by collection_id
    const searchResults = await searchAffiliateByInHubspot(
      record.collection_id
    );

    if (searchResults && searchResults.length > 0) {
      // Affiliate exists, update it
      const existingAffiliateId = searchResults[0].id;
      logger.info(
        `Affiliate exists with id ${existingAffiliateId}, updating...`
      );

      const updated = await updateAffiliateInHubSpot(
        existingAffiliateId,
        Payloads
      );

      logger.info(` ✅ Affiliate updated: ${JSON.stringify(updated,null, 2)}`);
    } else {
      // Affiliate does not exist, create new
      const created = await createAffiliateInHubSpot(Payloads);
      logger.info(` ✅ Affiliate created: ${JSON.stringify(created, null, 2)}`);
    }
    // return; // todo remove after testing
    // Save progress after successful processing
    // saveProgress(i + 1);
  } catch (error) {
    logger.error("Error processing record index", error);
    // Save progress here to resume later if needed
    // saveProgress(i);
  }
}



export { syncAffiliate,processAffiliate };
