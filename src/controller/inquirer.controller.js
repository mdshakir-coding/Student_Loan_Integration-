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

async function processnquirer(
  record = {
    collection_id: "39937",
    site_id: "1",
    fields_changed: "0,14652,12963,12964,11712,15468,11719,0",
    created_by: "41",
    modified_date: "2026-03-24 17:17:07",
    time_zone: "0",
    phone_1_type: "10246",
    phone_2: "",
    phone_2_type: "10249",
    email_2: "",
    lead_source_dont_use: "10266",
    time_zone0: "10275",
    address_1: "123 Main St",
    address_2: "Apt 100",
    city: "Somewhere",
    state: "NY",
    fed_loan_amount_old: "10285",
    inquirer_loan_status: "10296",
    marital_status: "10303",
    eval__spouse_has_loans: "10317",
    inquirer_current_repaymen: "10321",
    inquirer_employment_type: "12925",
    inquirer__last_year__ag: "120000.00",
    inquirer_current_monthly_: "1200.00",
    si_creation_date: null,
    inquirer_profession: "10331",
    zip: "14580",
    spouse: "0",
    client_referral: "7999",
    convert_to_client: "1",
    go_converting_to_client__: "",
    click_on_convert_1: "1",
    click_on_convert_2: "1",
    inquirer_no_sale_reason: "11484",
    fed_loan_amount_s: "1",
    actively_in_school_s: "1",
    loan_status_s: "1",
    fed_loan_payment_s: "1",
    type_of_repayment_s: "1",
    spouse_has_loans_s: "1",
    marital_status_s: "1",
    employment_type_s: "1",
    field_30_day_income_s: "1",
    inquirer_middle_name: "",
    spouse_fed_loan_amount0: "11882",
    spouse_fed_loans_payment: "180",
    eval__pay_frequency: "11972",
    orders: "1",
    inquirer_total_balance: "$121000",
    inquirer_avg_interest_ra: "6.5",
    inquirer_years_towards_fo: "6.2",
    already_enrolled_in_autop: "N",
    _of_subsidized_loans: "-",
    inquirer_outstanding_prin: "110500",
    inquirer_consolidation__0: "Direct Consolidated loans",
    inquirer_current_planidr: "SAVE - $196 per month",
    married: "Y",
    sps_total_balance: "",
    counting_spouse_in_hh_siz: "N",
    add_other_dependents: "1",
    add_child_dependents_in: "1",
    household_size_notes:
      "child, sister - Married Jointly - with access Access",
    annual_documented_income: "",
    spouse_annual_documented_: "",
    total_streams_of_taxable_: "",
    adj_gross_amount_stream_: "",
    pay_frequency_stream_1: "12879",
    adj_gross_amount_stream_0: "",
    pay_frequency_stream_2: "12880",
    adj_gross_amount_stream_1: "",
    pay_frequency_stream_3: "12889",
    combined_annual_documente: "",
    income_documentation_note:
      "$3216 biweekly - $236 pre-tax\n\n67% 401k contribution for $0 on IBR\n\nSpouse $100 monthly SCDI",
    tax_filing_status: "",
    household_size__income_t0: "12899",
    spouse_loan_description: "",
    savings_summary: "",
    balance_based_scenarios: "",
    tutor_approx_value_of_sav: "",
    loan_servicer_notes: "Nelnet",
    lead_type: "12922",
    sps_outstanding_principal: "",
    sps_avg_interest_rate: "",
    sps__of_sub_loans: "",
    sps_years_towards_forgiv: "",
    sps_already_enrolled_in_: "",
    sps_loan_types: "",
    sps_loan_servicers: "",
    inquirer_household_size_n: "2 children, sister",
    date_became_client: null,
    date_of_planning_call: "2026-03-24",
    date_marketing_reconciled: null,
    conferencesdani_pr_sourc: "15024",
    contractor_referred_by: "13101",
    kyle_affiliatefb_marketi0: "13105",
    online_generic_dont_use: "13108",
    inquiry_source_notes_esp0: "Test for Migration",
    inquirer_date_of_last_con: "2026-03-18",
    referral_from_financial_a: "false",
    linked_client: "0",
    copy_info: "1",
    inquirer_loan_servicer: "13301",
    calculator_results: "",
    notes_on_pricing_quoted_e: "Test for migration",
    inquirer_calculator_repor: "2026 MyAid Data Decoder",
    sps_calc_report_link: "",
    inquirer_profession_if_o: "Pediatric",
    eval_notes: "Test for migration",
    podcast: "14230",
    du_financial_planner: "14243",
    spouse__last_year__agi: "10000",
    eval__spouse_pay_frequen: "14245",
    eval__taxes_jointlysepa: "14250",
    notes: "",
    under_admin_review__t_k: "false",
    affiliate_referral: "13329",
    affiliate_lead_owner: "41",
    affiliate_presenting_tuto: "41",
    spacer: "1",
    date_of_tutor_fu: "2026-03-24",
    date_eval_occured: "2026-03-17",
    eval__federal_loan_amoun: "180000.00",
    graduation_year: "2010",
    eval__current_income: "130000",
    eval__spouse_current_inc: "15000",
    good_timing_for_strategy_0: "false",
    financial_experience: "",
    assets__insurances: "",
    renting_or_owning_if_hom: "",
    liabilities: "",
    interested_in_values_base: "false",
    current_year_pretax_annu: "",
    anything_else_we_should_k: "",
    inquirer_referral0: "17434",
    slt_rep_referred_by: "0",
    date_of_initial_strategy_: null,
    years_until_tax_imp_expe: "",
    tax_imp_goal: null,
    na_note_from_referring_r: "",
    student__date_of_graduat: null,
    marketing_source: "15086",
    dani_pr_source: "15154",
    standby_notes__availabli: "Weekdays",
    standby_list: "15203",
    pc_appointment_confirmati: "15207",
    pc_follow_up_to_book: "2026-03-03",
    coordinator_notes: "Test text for migration",
    no_call_no_show_1: "2026-03-17",
    no_call_no_show_2: "2026-03-18",
    no_call_no_show_3: "2026-03-24",
    rescheduled_date: "2026-03-27",
    standby_marked_date: "2026-03-24",
    entered_info_for_nfm: null,
    slt_referring_rep: "0",
    est_tax_burden: "61585",
    created_date: "2026-03-24 16:39:16",
    lead_owner: "41",
    tutor_name: "41",
    first_name: "Walter",
    modified_by: "41",
    last_name: "Bingus (Tony Test)",
    primary_phone: "5552375555",
    email_1: "walter@fakeemail.com",
    inquirer_status: "10262",
    du_slt_outreachaffiliate: "13104",
    tutor_needs_attention: "false",
    setter_needs_attention: "false",
    under_admin_review__s_k: "false",
  },
) {
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
    inquirer_record_id = searchResults[0].id;

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

    // let inquirer_record_id = null;
    // let searchResults = null;

    // searchResults = await searchInquirerInHubSpot(record.collection_id);

    // if (searchResults && searchResults.length > 0) {
    //   // ✅ SAFE now
    //   inquirer_record_id = searchResults[0].id;

    //   // Inquirer exists → update
    //   let existingInquirerId = searchResults[0].id;
    //   logger.info(`Inquirer exists with id ${existingInquirerId}, updating...`);

    //   let updated = await updateInquirerInHubSpot(existingInquirerId, payload);
    //   logger.info(`✅ Inquirer updated: ${updated?.id}`);
    // } else {
    //   // Inquirer does not exist → create
    //   let created = await createInquirerInHubSpot(payload);

    //   inquirer_record_id = created?.id;

    //   logger.info(`✅ Inquirer created: ${created?.id}`);
    // }
    return; // todo remove after testing
    // Find client based on linked_client field in Hubspot ->(Client,affiliate,inquirer)
    const hs_client = getHubspotClient();

    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.client_referral,
    );
    logger.info(`Client: ${JSON.stringify(client[0], null, 2)}`);
    const affiliate = await searchCustomObjectInHubSpot(
      affiliateObject,
      record?.affiliate_referral,
    );
    logger.info(`affiliate: ${JSON.stringify(affiliate[0], null, 2)}`);

    const inquirer = await searchCustomObjectInHubSpot(
      record.inquirer_referral0,
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
        "USER_DEFINED",
      );
      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with Client ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`,
      );
    }
    if (affiliate[0]?.id && inquirer_record_id) {
      const associate = await hs_client.associations.associate(
        inquirerObject,
        inquirer_record_id,
        affiliateObject,
        affiliate[0]?.id,
        72,
        "USER_DEFINED",
      );
      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with affiliate ${
          affiliate[0]?.id
        }: Association ${JSON.stringify(associate.results[0], null, 2)}`,
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
        449,
      );

      logger.info(
        `✅ Inquirer ${inquirer_record_id} associated with inquirer ${
          inquirer[0]?.id
        }: Association ${JSON.stringify(associate)}`,
      );
    }
  } catch (error) {
    logger.error("Error processing record index", error);
  }
}

export { syncInquirer, processnquirer };
