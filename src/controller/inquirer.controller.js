import { logger } from "../index.js";
// import { fetchInquirerRecords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotInquirerPayload } from "../utils/helper.js";
import { searchInquirerInHubSpot } from "../service/student.service.js";
import { updateInquirerInHubSpot } from "../service/student.service.js";
import { createInquirerInHubSpot } from "../service/student.service.js";
import {
  fetchAffiliateById,
  fetchInvoiceById,
  fetchInquirerById,
  fetchClientById,
  associateObjects,
  fetchInquirerRecords,
  searchCustomObjectInHubSpot,
} from "../service/student.loan.Hubspot.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

import { getHubspotClient } from "../configs/hubspot.config.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

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

// function call logic here

// async function syncInquirer() {
//   try {
//     const records = await fetchInquirerRecords(); // call the function
//     logger.info("inquirerRecords", records.length);

//     let startIndex = loadProgress();

//     for (let i = startIndex; i < records.length; i++) {

//       try {

//         const record = records[i];

//         let inquirerId = null;

//        const Payloads = buildHubSpotInquirerPayload(record); // call the function

//         logger.info (" Records", record);
//         logger.info("Payloads", Payloads);
//         return; // todo remove after testing
//         // await createInquirerInHubSpot(Payloads);

//         // Save progress after successful processing
//         // saveProgress(i + 1);
//       } catch (error) {
//         logger.error(error);
//         // saveProgress(i);
//         // break; // todo remove after testing
//       }
//     }
//     logger.info ("👨‍🎓 All Inquirer Processed");
//   } catch (error) {
//     logger.error("Error Fecting Inquirer Records", error);
//     return;
//   }
// }

// new Code

async function syncInquirer() {
  try {
    const records = await fetchInquirerRecords(); // fetch all inquirer records
    logger.info("Inquirer Records:", records.length);

    // let startIndex = loadProgress();
    let startIndex = 0;

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];


        await processnquirer(record);


        // Save progress after success
        // saveProgress(i + 1);

        return; // ❗ remove after testing
      } catch (error) {
        logger.error("Error processing record index", error);

        // Save progress to resume later
        // saveProgress(i);

        // return; // ❗ remove after testing
      }
    }
  } catch (error) {
    logger.error("Error fetching inquirer records", error);
    return;
  }
}


async function processInquirer(record = {

            
            
            "collection_id": "16099",
            "site_id": "1",
            "fields_changed": "0,11697,0",
            "created_by": "44",
            "modified_date": "2021-10-29 17:48:25",
            "time_zone": "0",
            "phone_1_type": "10245",
            "phone_2": "",
            "phone_2_type": "10249",
            "email_2": "",
            "lead_source_dont_use": "10266",
            "time_zone0": "10278",
            "address_1": "2233 SUPHUR SPRING AVE ",
            "address_2": "",
            "city": "SAINT HELENA",
            "state": "CA ",
            "fed_loan_amount_old": "10290",
            "inquirer_loan_status": "10298",
            "marital_status": "10304",
            "eval__spouse_has_loans": "10316",
            "inquirer_current_repaymen": "10323",
            "inquirer_employment_type": "12913",
            "inquirer__last_year__ag": "115000.00",
            "inquirer_current_monthly_": "0.00",
            "si_creation_date": null,
            "inquirer_profession": "10336",
            "zip": "94574",
            "spouse": "0",
            "client_referral": "0",
            "convert_to_client": "1",
            "go_converting_to_client__": "",
            "click_on_convert_1": "1",
            "click_on_convert_2": "1",
            "inquirer_no_sale_reason": "11484",
            "fed_loan_amount_s": "1",
            "actively_in_school_s": "1",
            "loan_status_s": "1",
            "fed_loan_payment_s": "1",
            "type_of_repayment_s": "1",
            "spouse_has_loans_s": "1",
            "marital_status_s": "1",
            "employment_type_s": "1",
            "field_30_day_income_s": "1",
            "inquirer_middle_name": "Michael",
            "spouse_fed_loan_amount0": "11888",
            "spouse_fed_loans_payment": "",
            "eval__pay_frequency": "11975",
            "orders": "1",
            "inquirer_total_balance": "55012",
            "inquirer_avg_interest_ra": "6.8",
            "inquirer_years_towards_fo": "0",
            "already_enrolled_in_autop": "N",
            "_of_subsidized_loans": "39.6",
            "inquirer_outstanding_prin": "44490",
            "inquirer_consolidation__0": "Direct",
            "inquirer_current_planidr": "In default - ICR Account collection agency",
            "married": "N ",
            "sps_total_balance": "",
            "counting_spouse_in_hh_siz": "N",
            "add_other_dependents": "3",
            "add_child_dependents_in": "",
            "household_size_notes": "living alone, but owns home and was paying half the mortgage before covid... parents and brother living in home now. HH4",
            "annual_documented_income": "",
            "spouse_annual_documented_": "",
            "total_streams_of_taxable_": "",
            "adj_gross_amount_stream_": "",
            "pay_frequency_stream_1": "12879",
            "adj_gross_amount_stream_0": "",
            "pay_frequency_stream_2": "12880",
            "adj_gross_amount_stream_1": "",
            "pay_frequency_stream_3": "12889",
            "combined_annual_documente": "49133.28",
            "income_documentation_note": "not counting modeling business going forward. \n$83.33 est. monthly payment",
            "tax_filing_status": "",
            "household_size__income_t0": "12900",
            "spouse_loan_description": "",
            "savings_summary": "",
            "balance_based_scenarios": "10-Yr IBR @ 6.8%\nMonthly payment amount:$942.92\nTotal years remaining:7.1\nTotal of payments remaining:$80,148.20\nTotal interest remaining:$16,683.10\n\n25-Yr IBR @ 6.8%:\nMonthly payment amount:$463.27\nTotal years remaining:22.1\nTotal of payments remaining:$122,766.55\nTotal interest remaining:$59,301.45",
            "tutor_approx_value_of_sav": "",
            "loan_servicer_notes": "Works as a self-employed (LLC) model and a W-2 regenerative farmer. $50-55K modeling, $60K farming.\nLoan in default: ICR debt collector\n$64,870.13 in FSL",
            "lead_type": "12922",
            "sps_outstanding_principal": "",
            "sps_avg_interest_rate": "",
            "sps__of_sub_loans": "",
            "sps_years_towards_forgiv": "",
            "sps_already_enrolled_in_": "",
            "sps_loan_types": "",
            "sps_loan_servicers": "",
            "inquirer_household_size_n": "1",
            "date_became_client": null,
            "date_of_planning_call": "2020-08-31",
            "date_marketing_reconciled": null,
            "conferencesdani_pr_sourc": "13074",
            "contractor_referred_by": "13098",
            "kyle_affiliatefb_marketi0": "13105",
            "online_generic_dont_use": "13108",
            "inquiry_source_notes_esp0": "Charles Eisenstein w/Zach",
            "inquirer_date_of_last_con": "2021-10-29",
            "referral_from_financial_a": "false",
            "linked_client": "0",
            "copy_info": "1",
            "inquirer_loan_servicer": "13300",
            "calculator_results": "",
            "notes_on_pricing_quoted_e": "",
            "inquirer_calculator_repor": "",
            "sps_calc_report_link": "",
            "inquirer_profession_if_o": "",
            "eval_notes": "",
            "podcast": "0",
            "du_financial_planner": "0",
            "spouse__last_year__agi": "",
            "eval__spouse_pay_frequen": "0",
            "eval__taxes_jointlysepa": "0",
            "notes": "",
            "under_admin_review__t_k": "false",
            "affiliate_referral": "0",
            "affiliate_lead_owner": "0",
            "affiliate_presenting_tuto": "0",
            "spacer": "1",
            "date_of_tutor_fu": null,
            "date_eval_occured": null,
            "eval__federal_loan_amoun": null,
            "graduation_year": null,
            "eval__current_income": "",
            "eval__spouse_current_inc": "",
            "good_timing_for_strategy_0": "false",
            "financial_experience": "",
            "assets__insurances": "",
            "renting_or_owning_if_hom": "",
            "liabilities": "",
            "interested_in_values_base": "false",
            "current_year_pretax_annu": "",
            "anything_else_we_should_k": "",
            "inquirer_referral0": "0",
            "slt_rep_referred_by": "0",
            "date_of_initial_strategy_": null,
            "years_until_tax_imp_expe": "",
            "tax_imp_goal": null,
            "na_note_from_referring_r": "",
            "student__date_of_graduat": null,
            "marketing_source": "0",
            "dani_pr_source": "0",
            "standby_notes__availabli": "",
            "standby_list": "0",
            "pc_appointment_confirmati": "0",
            "pc_follow_up_to_book": null,
            "coordinator_notes": "",
            "no_call_no_show_1": null,
            "no_call_no_show_2": null,
            "no_call_no_show_3": null,
            "rescheduled_date": null,
            "standby_marked_date": null,
            "entered_info_for_nfm": null,
            "slt_referring_rep": "0",
            "est_tax_burden": "",
            "created_date": "2020-08-26 17:14:28",
            "lead_owner": "44",
            "tutor_name": "46",
            "first_name": "Joshua",
            "modified_by": "44",
            "last_name": "Upshaw",
            "primary_phone": "7608462313",
            "email_1": "josh.loosechange@gmail.com",
            "inquirer_status": "12865",
            "du_slt_outreachaffiliate": "13264",
            "tutor_needs_attention": "false",
            "setter_needs_attention": "false",
            "under_admin_review__s_k": "false"
        
        
}) {

  
  try {
    // Build HubSpot payload
    const payload = buildHubSpotInquirerPayload(record);

    logger.info(`Inquirer Record: ${JSON.stringify(record, null, 2)}`);
    logger.info(`Inquirer Payload: ${JSON.stringify(payload, null, 2)}`);
    // logger.info(`Inquirer Record: ${JSON.stringify(record)}`);
    // logger.info(`Inquirer Payload: ${JSON.stringify(payload)}`);

    // 🔍 Search existing inquirer (example: by collection_id or name)
    let inquirer_record_id = null;
    let searchResults = null;
    searchResults = await searchInquirerInHubSpot(record.collection_id);
    inquirer_record_id = searchResults ? searchResults[0]?.id : null;

    if (searchResults && searchResults.length > 0) {
      // Inquirer exists → update
      let existingInquirerId = null;
      existingInquirerId = searchResults[0].id;
      logger.info(`Inquirer exists with id ${existingInquirerId}, updating...`);
      let updated = null;
      updated = await updateInquirerInHubSpot(existingInquirerId, payload);
      logger.info(`✅ Inquirer updated: ${updated.id}`);
    } else {
      // Inquirer does not exist → create
      let created = null;
      created = await createInquirerInHubSpot(payload);
      inquirer_record_id = created.id;

      logger.info(`✅ Inquirer created: ${created.id}`);
    }
    // return;
    // Find client based on linked_client field in Hubspot ->(Client,affiliate,inquirer)
    const hs_client = getHubspotClient();

    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.client_referral
      
    );
    logger.info(`Client: ${JSON.stringify(client[0], null, 2)}`);
    const affiliate = await searchCustomObjectInHubSpot(
      affiliateObject,
      record?.affiliate_referral
    );
    logger.info(`affiliate: ${JSON.stringify(affiliate[0], null, 2)}`);

    const inquirer = await searchCustomObjectInHubSpot(
      //  inquirerObject, // add value 
      record.inquirer_referral0
    );
    logger.info(`inquirer: ${JSON.stringify(inquirer[0], null, 2)}`);

    if (client[0]?.id && inquirer_record_id) {
      logger.info(`Client: ${client[0]?.id} : Inquirer: ${inquirer_record_id}`);

      // ➡️ associate here
      // const associate = await associateObjects({
      //   fromObjectType: "2-171843307", // Inquirer
      //   fromObjectId: client[0].id,
      //   toObjectType: "0-1", // Contact
      //   toObjectId: inquirer_record_id,
      //   associationLabel: "inquirers_to_clients",
      //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
      // });
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        clientObject,
        client[0].id,
        115,
        "USER_DEFINED"
      );
      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with Client ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
    if (affiliate[0]?.id && inquirer_record_id) {

      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        affiliateObject,
        affiliate[0]?.id,
        72,
        "USER_DEFINED"
      );
      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with affiliate ${
          affiliate[0]?.id
        }: Association ${JSON.stringify(associate.results[0], null, 2)}`
      );
    }
    if (inquirer[0]?.id && inquirer_record_id) {
      // ➡️ associate here
      // const associate = await associateObjects({
      //   fromObjectType: "0-1",
      //   fromObjectId: inquirer[0]?.id,
      //   toObjectType: "0-1",
      //   toObjectId: inquirer_record_id,
      //   associationTypeId: 449,
      //   accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
      // });
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        inquirerObject,
        inquirer[0]?.id,
        449
      );

      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with inquirer ${
          inquirer[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
  } catch (error) {

    logger.error("Error processing record index", error);
  }
}

export { syncInquirer, processInquirer };