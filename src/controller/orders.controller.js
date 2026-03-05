import { logger } from "../index.js";

import {
  fetchOrdersRecords,
  searchCustomObjectInHubSpot,
} from "../service/student.loan.Hubspot.js";
import { buildHubspotOrderPayload } from "../utils/helper.js";
import { searchOrderInHubSpot } from "../service/student.service.js";
import { updateOderInHubSpot } from "../service/student.service.js";
import { createOrderInHubSpot } from "../service/student.service.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "progress.json");

import { getHubspotClient } from "../configs/hubspot.config.js";
const inquirerObject = "0-1";
const clientObject = "2-171843307";
const affiliateObject = "2-171942530";
const invoiceObject = "0-3";
const orderObject = "0-5";
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
/*
async function syncOrders() {
  try {
    const response = await fetchOrdersRecords();
    logger.info("Orders response", response.length);
  } catch (error) {
    logger.error("Error feching records", error);
    return;
  }
}
export { syncOrders };

*/

// New Oorder controller

async function syncOrders() {
  try {
    const records = await fetchOrdersRecords(); // fetch all order records
    logger.info(`Orders Records : ${records.length}`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processOrder(record);

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing record index", i, error);
        // Save progress here to resume later if needed
        // saveProgress(i);
      }
    }
  } catch (error) {
    logger.error("Error fetching order records", error);
  }
}

async function processOrder(
  record = {
    collection_id: "106",
    site_id: "1",
    fields_changed: "0,13754,0",
    created_by: "14",
    modified_by: "900000183",
    modified_date: "2020-03-25 13:13:15",
    marital_status: "11912",
    most_recent_tax_filing_st: "11920",
    filed_taxes_in_the_last_t: "11922",
    household_size: "5",
    children: "3",
    other: "0",
    amount: "65093.00",
    income_frequency: "11928",
    income_doc_type: "11932",
    linked_record: "0",
    notes:
      "<p>$250 approved this time for a referral.</p>\n<p>wants to use the new cc on file for his student loan payments.&nbsp;</p>\n<p>told him confirmation by monday night from processing&nbsp;</p>",
    spouse_income: "0.00",
    spouse_income_type: "11934",
    spouse_income_frequency: "11939",
    pslf: "11946",
    consolidation: "11950",
    spouse_fed_loan_amount0: "0.00",
    nslds_screenshots: "1",
    outstanding_principle: "",
    avg_interest_rate_: "",
    percent_subsidized_: "",
    years_towards_forgiveness: "",
    consolidationloan_notes: "",
    est_tax_implication_: "",
    life_of_loan_payments: "",
    est_total_cost_of_slt_st: "",
    balance_based_mo_payment: "",
    balance_based_total_cost: "",
    overall_savings_vs_balan: "",
    new_payment_amount: "",
    additional_notes_: "",
    if_invest_monthly_saving: "",
    total_earnings_by_time_of: "",
    date_info_captured: null,
    total_balance: "",
    current_servicer: "12058",
    desired_servicer: "12048",
    interest_per_year: "",
    after_neg_am_interest_pe: "",
    interest_life_of_loan_be0: "",
    calculate_for_autopay: "",
    subsidized_forgiveness_su: "",
    projected_balance_at_time: "",
    projected_additional_inte: "",
    forbearance_needed: "12705",
    apc_notes: "",
    desired_repayment_plan: "0",
    year_of_taxes_being_used: "",
    tutor_approx_value_of_str: "",
    servicer: "",
    balance_based_years: "",
    balance_based_scenarios: "",
    value_of_cashflow: "",
    slt_calc_results: "",
    household_notes: "",
    income_notes: "",
    hh_size__income_threshol: "0",
    related_email_address: "travisalton@hotmail.com",
    income_notes0: "",
    household_notes0: "",
    refusal_details0: "",
    stop_dont_use: "",
    copy_order: "1",
    type0: "0",
    current_months_of_pslf: "",
    due_remove_auto_pay: "",
    servicerwebsite: "",
    plans: "",
    consol_1_loan_codes__am: "",
    consol_2_loan_codes__am: "",
    consolidation_1_desired_0: "",
    consolidation_2_desired_0: "",
    consolidation_3_desired_: "",
    final_step_enroll_into_i: "",
    current_servicer__repaym: "",
    consol_3_loan_codes__am: "",
    employment_type: "0",
    dates: "",
    amount_1: "",
    amount_2: "",
    dates0: "",
    agi: "",
    _income_frequency_1: "0",
    income_frequency_2: "0",
    spouses_name: "",
    special_grouping__notes: "",
    spouse_income_notes: "",
    field_2025_ibrpaye__15: "0",
    field_2025_icr__20: "0",
    consolidating_heal_loans0: "false",
    in_school_deferment: "0",
    forbearance_needed0: "0",
    total: "",
    total0: "",
    consolidate: "",
    leave_out: "",
    plans0: "",
    eligible_for_ibr_new_all: "false",
    total_repayment_period_ra: "",
    qualifying_pslf_employers0: "",
    year0: "2017",
    work_needed: "11890",
    current_repayment_plan: "11908",
    estimated_payment: "183.00",
    client: "84",
    actual_payment: "",
    tax_saving_status_apc: "0",
    created_date: "2017-06-28 13:47:32",
  }
) {
  try {
    let order_record_id = null;

    // Build payload
    const Payloads = buildHubspotOrderPayload(record);

    logger.info(`Orders Record: ${JSON.stringify(record, null, 2)}`);

    logger.info(`Orders Payload: ${JSON.stringify(Payloads, null, 2)}`);

    // First, search existing order by collection_id
    const searchResults = await searchOrderInHubSpot(record.collection_id);

    if (searchResults && searchResults.length > 0) {
      // Order exists, update it
      const existingOrderId = searchResults[0].id;
      order_record_id = searchResults[0].id;
      logger.info(`Order exists with id ${existingOrderId}, updating...`);

      const updated = await updateOderInHubSpot(existingOrderId, Payloads);
      logger.info(`✅ Order updated: ${updated.id}`);
    } else {
      // Order does not exist, create new
      const created = await createOrderInHubSpot(Payloads);
      order_record_id = created?.id;
      logger.info(`✅ Order created: ${created.id}`);
    }
    // return; // todo remove after testing
    // Associate client and order
    const hs_client = getHubspotClient();
    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.client
    );

    logger.info(`Client: ${JSON.stringify(client, null, 2)}`);

    if (client[0]?.id && order_record_id) {
      logger.info(
        `Client: ${client[0]?.id} : order_record_id: ${order_record_id}`
      );

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
        orderObject,
        order_record_id,
        clientObject,
        client[0].id,
        109,
        "USER_DEFINED"
      );
      logger.info(
        `✅ order_record_id ${order_record_id} associated with Client ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`
      );
    }
  } catch (error) {
    logger.error("Error processing order", error);
  }
}

export { syncOrders, processOrder };
