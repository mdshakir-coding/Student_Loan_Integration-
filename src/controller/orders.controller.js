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
    // fetch all order records
    const records = await fetchOrdersRecords();
    logger.info(` Work Orders Records : ${JSON.stringify(records.length)}`);

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
    collection_id: "22796",
    site_id: "1",
    fields_changed: "0,0",
    created_by: "70",
    modified_by: "70",
    modified_date: "2026-03-24 10:47:31",
    marital_status: "11914",
    most_recent_tax_filing_st: "11920",
    filed_taxes_in_the_last_t: "0",
    household_size: "0",
    children: "0",
    other: "2",
    amount: "350.00",
    income_frequency: "11925",
    income_doc_type: "13259",
    linked_record: "3568",
    notes:
      "<p>These are the work order processing notes, very important, we need these notes.&nbsp;</p>",
    spouse_income: "9000.00",
    spouse_income_type: "15210",
    spouse_income_frequency: "11941",
    pslf: "11945",
    consolidation: "0",
    spouse_fed_loan_amount0: "0.00",
    nslds_screenshots: "1",
    outstanding_principle: "128000",
    avg_interest_rate_: "6.5",
    percent_subsidized_: "0",
    years_towards_forgiveness: "0",
    consolidationloan_notes: "consoolidate all those PP loans. ",
    est_tax_implication_: "32000",
    life_of_loan_payments: "0",
    est_total_cost_of_slt_st: "free",
    balance_based_mo_payment: "70",
    balance_based_total_cost: "8984111352",
    overall_savings_vs_balan: "32000",
    new_payment_amount: "0",
    additional_notes_: "additional notes here to clear everything up. ",
    if_invest_monthly_saving: "3.50 a month. ",
    total_earnings_by_time_of: "300",
    date_info_captured: "2026-03-01",
    total_balance: "129000",
    current_servicer: "12058",
    desired_servicer: "12054",
    interest_per_year: "3",
    after_neg_am_interest_pe: "32",
    interest_life_of_loan_be0: "30",
    calculate_for_autopay: "no",
    subsidized_forgiveness_su: "0",
    projected_balance_at_time: "158717",
    projected_additional_inte: "8962",
    forbearance_needed: "12707",
    apc_notes:
      "<p>APC notes, he met, he put down money on life insurance.&nbsp;</p>",
    desired_repayment_plan: "12779",
    year_of_taxes_being_used: "",
    tutor_approx_value_of_str: "a whole lot, at least $2.",
    servicer: "Mohela",
    balance_based_years: "10",
    balance_based_scenarios: "10 years of repaying to waste money. ",
    value_of_cashflow: "priceless value",
    slt_calc_results: "<p>link here for the plan.&nbsp;</p>",
    household_notes: "2 bruddas",
    income_notes: "making money weekly every other week. ",
    hh_size__income_threshol: "12981",
    related_email_address: "TestEmail321@bingus.walter",
    income_notes0: "Works quite a bit, can't say enough about him. ",
    household_notes0: "lives with big floppa and lil flippa",
    refusal_details0: "",
    stop_dont_use: "",
    copy_order: "1",
    type0: "15016",
    current_months_of_pslf: "1",
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
    employment_type: "15053",
    dates: "",
    amount_1: "",
    amount_2: "",
    dates0: "",
    agi: "39280",
    _income_frequency_1: "15114",
    income_frequency_2: "15119",
    spouses_name: "Kevin",
    special_grouping__notes: "",
    spouse_income_notes: "works for SLT. ",
    field_2025_ibrpaye__15: "15278",
    field_2025_icr__20: "15280",
    consolidating_heal_loans0: "false",
    in_school_deferment: "0",
    forbearance_needed0: "0",
    total: "",
    total0: "",
    consolidate: "",
    leave_out: "",
    plans0: "",
    eligible_for_ibr_new_all: "true",
    total_repayment_period_ra: "119",
    qualifying_pslf_employers0: "1 from the DoD",
    year0: "2026",
    work_needed: "12758",
    current_repayment_plan: "14958",
    estimated_payment: "0",
    client: "10191",
    actual_payment: "100",
    tax_saving_status_apc: "14775",
    created_date: "2026-02-18 09:07:48",
  },
) {
  try {
    let order_record_id = null;

    // Build payload
    const Payloads = buildHubspotOrderPayload(record);

    logger.info(` Work Orders Record: ${JSON.stringify(record, null, 2)}`);

    logger.info(` Work Orders Payload: ${JSON.stringify(Payloads, null, 2)}`);

    // First, search existing order by collection_id
    const searchResults = await searchOrderInHubSpot(record.collection_id);

    logger.info(
      `Search Work Order results: ${JSON.stringify(searchResults, null, 2)}`,
    );

    if (searchResults && searchResults.length > 0) {
      // Order exists, update it
      const existingOrderId = searchResults[0].id;
      order_record_id = searchResults[0].id;
      // logger.info(`Order exists with id ${JSON.stringify(existingOrderId)}, updating...`);

      const updated = await updateOderInHubSpot(existingOrderId, Payloads);
      logger.info(
        `✅ Order Work updated: ${JSON.stringify(updated.id, null, 2)}`,
      );
    } else {
      // Order does not exist, create new
      const created = await createOrderInHubSpot(Payloads);
      order_record_id = created?.id;
      logger.info(
        `✅ Order Work created: ${JSON.stringify(created.id, null, 2)}`,
      );
    }
    // return; // todo remove after testing
    // Associate client and order
    const hs_client = getHubspotClient();
    const client = await searchCustomObjectInHubSpot(
      "2-171843307",
      record.client,
    );

    logger.info(`Client: ${JSON.stringify(client, null, 2)}`);

    if (client[0]?.id && order_record_id) {
      logger.info(
        `Client: ${client[0]?.id} : order_record_id: ${order_record_id}`,
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
        "USER_DEFINED",
      );
      logger.info(
        `✅ order_record_id ${order_record_id} associated with Client ${
          client[0]?.id
        }: Association ${JSON.stringify(associate)}`,
      );
    }
  } catch (error) {
    logger.error("Error processing order", error);
  }
}

export { syncOrders, processOrder };
