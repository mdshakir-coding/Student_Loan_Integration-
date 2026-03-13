import { logger } from "../index.js";

import { fetchClientsRecords } from "../service/student.loan.Hubspot.js";
import { buildHubSpotClientPayload } from "../utils/helper.js";
import { searchClientInHubSpot } from "../service/student.service.js";
import { createClientInHubSpot } from "../service/student.service.js";
import { updateClientInHubSpot } from "../service/student.service.js";

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

// code Client Function

async function syncClients() {
  try {
    const records = await fetchClientsRecords(); // fetch all client records
    logger.info(`Clients Records :${records.length}`);

    let startIndex = loadProgress();

    for (let i = startIndex; i < records.length; i++) {
      try {
        const record = records[i];

        await processClient(record);

        return; // todo remove after testing

        // Save progress after successful processing
        // saveProgress(i + 1);
      } catch (error) {
        logger.error("Error processing record index", error);

        // Save progress if needed
        // saveProgress(i);
        // break; // todo remove after testing
      }
    }

    logger.info("🎄 All Clients Processed");
  } catch (error) {
    logger.error("Error fetching client records", error);
    return;
  }
}

async function processClient(
  record ={
            "collection_id": "10322",
            "site_id": "1",
            "fields_changed": "0,13538,12289,12287,12296,15073,13965,12426,15274,13864,15357,15358,13873,13874,0",
            "created_by": "41",
            "created_date": "2026-02-23 14:32:01",
            "modified_by": "92",
            "modified_date": "2026-03-12 11:43:08",
            "lead_owner": "47",
            "phone_1_type": "11174",
            "phone_2": "",
            "phone_2_type": "11177",
            "email_2": "",
            "time_zone0": "11206",
            "address_1": "2213 NW 59th St.",
            "address_2": "#202",
            "city": "Seattle",
            "state": "WA",
            "zip": "98107",
            "spouse__partner": "0",
            "referral": "0",
            "msa_sent_": "2026-02-23",
            "msa_received0": "2026-03-03",
            "lpa_sent": "2026-02-23",
            "lpa_received": "2026-03-03",
            "client_action_taken": "2026-03-12 13:43:00",
            "idr_app_submitted_date": null,
            "days_since_app_sub": null,
            "recert_date": null,
            "error_with_payments": "1",
            "date_of_birth": "1994-04-21",
            "social_security_number": "574-15-5990",
            "primary_phone0": "7204255531",
            "primary_phone_type": "11174",
            "secondary_phone": "",
            "secondary_phone_type": "11177",
            "studentaidgov_user_not_0": "",
            "studentaidgov_pass_not_0": "",
            "employerbusiness_name": "University of Washington Medical Center",
            "employer_address": "1959 NE Pacific St.",
            "employers_city": "Seatlle",
            "employers_state": "WA",
            "reference_1_name": "",
            "reference_1_address": "",
            "reference_1_city": "",
            "reference_1_state": "",
            "reference_1_zip_": "",
            "reference_2_name": "",
            "reference_2_address": "",
            "reference_2_city": "",
            "reference_2_state": "",
            "reference_2_zip": "",
            "spouse__full_name_": "",
            "spouse__date_of_birth": "",
            "maidenformer_name": "",
            "spouse__ssn": "",
            "spouse__email": "",
            "spouse__phone": "",
            "spouse_has_loans": "",
            "spouse__loan_amount": null,
            "employer_info_": "1",
            "personal_reference": "1",
            "spouse_info": "1",
            "q26_spouse_income_changed0": "1",
            "desired_servicer_s": "1",
            "borrower_actual_agi_0": "1",
            "state_s": "1",
            "actual_combined_agi_s": "1",
            "spouse_actual_agi_s": "1",
            "desired_repay_plan_s": "1",
            "q1_balance_based_type_s": "1",
            "q1_income_driven_type_s": "1",
            "q1_and_q2_desired_repay_p0": "1",
            "q5_dependent_children_s": "1",
            "q6_other_dependents_s": "1",
            "q7_marital_status_s": "1",
            "q10_employment_type_s": "1",
            "q18_employment_type_0": "1",
            "q20_filed_taxes_last_2_yr0": "1",
            "q23_separated_from_spouse0": "1",
            "q24_sp_income_access_s": "1",
            "q8_filed_taxes_last_2_yrs": "1",
            "filed_taxes_last_2_yrs0": "1",
            "q25_spouse_filed_taxes_s": "1",
            "q15_you_and_spouse_filed_0": "1",
            "q21_income_change_since_l0": "1",
            "q22_taxable_income_s": "1",
            "q13_if_icr_repay_jointly_": "1",
            "q16_income_changed_s": "1",
            "q17_spouse_income_changed0": "1",
            "client_created_date": null,
            "aar_fee": "13370",
            "q12_provide_info": "1",
            "q4_in_forbearance": "1",
            "client_name_fulf": "1",
            "client_name_fulc": "1",
            "reference_1_phone": "",
            "reference_1_relationship": "",
            "reference_2_phone": "",
            "reference_2_relationship": "",
            "employers_zip": "98185",
            "roa_sent_to_servicer": "2026-03-06",
            "email_address": "alyssaann14@gmail.com",
            "recerts": "1",
            "middle_initialname": "A",
            "customer_info": "1",
            "current_servicer0": "15071",
            "status0": "1",
            "servicer__username": "aaboyle14",
            "servicer__password": "Transplant.12",
            "last_update": null,
            "profession0": "14848",
            "profession_details": "",
            "field_2nd_contact__first_name": "",
            "field_2nd_contact__last_name": "",
            "field_2nd_contact__phone": "",
            "field_2nd_contact__email": "",
            "client_is_pslf0": "13002",
            "ia_inquirer_status": "13380",
            "self_employed__ein0": "",
            "meeting_notes": "",
            "contact_notes": "",
            "field_2nd_contact_notes0": "",
            "aar__othertrade_specify": "",
            "multiple__which_servicer": "",
            "slt_rep_referred_by_no_l": "0",
            "date_calculation_ran": "2026-02-23",
            "client_consolidation__lo": "Direct Consolidated",
            "client_avg_interest_rate": "6.13",
            "_of_subsidized_loans_if": "-",
            "client_current_planidr_h": "SAVE - $373 - 8/25/2025 AAR",
            "calculation_performed_by": "41",
            "special_calculation_notes": "",
            "ia_insurance_status": "13282",
            "date_of_appexam_appointm": null,
            "current_managed_plan_deta": "",
            "state_license_needed": "WA",
            "term_only0": "false",
            "na_interested_in_securit": "false",
            "monthly_premium0": null,
            "fyc_est": null,
            "date_of_scheduled_followu": null,
            "estimations_current_as_of": "2026-02-23",
            "calc_raw_results": "",
            "client_years_towards_forg0": "49 PSLF (69 with buyback)",
            "enrolled_in_autopay_if_": "N",
            "client_orig_total_balanc": "197,634",
            "client_orig_principal_ba": "189409",
            "est_forgiveness_date0": "2030-06-01",
            "field_2nd_date_if_2_sets": null,
            "years_until_forgiveness": "-50",
            "client_household_size_not": "Single",
            "client_income_doc_notes": "$7792 - $582.22 pretax - bimonthly 10 and 25th pay dates\n\n80% or $6233 (not including parking)",
            "apc_status": "1",
            "issueanniversaryannual_": null,
            "calculator_report_link": "https://lookerstudio.google.com/s/m7bBS-uoulE",
            "nickname": "",
            "security_qas": "",
            "referrals": "1",
            "inactive_specifics": "13794",
            "payment_problem_to_resolv": "false",
            "aar_booked_date": null,
            "myaiddata_in_drive": "2026-02-23",
            "calc_doc_in_drive": "2026-02-23",
            "current_ffel_loans": "false",
            "do_not_complete_work_unti": null,
            "collection_notes": "",
            "pslf_verified_qualifying_": "",
            "pslf_date_updated": "2026-02-23",
            "pslf_forgiveness_date": null,
            "pslf_2nd_forgiveness_date": null,
            "pslf_employer_1": "",
            "pslf_notes": "Client submitted PSLF on her own 2/23/26.\n",
            "pslf_employer_2": "",
            "pslf_date_last_signed_1": null,
            "pslf_date_last_signed_2": null,
            "unpaid_invoice": "false",
            "intake_call_complete": "2026-03-03",
            "welcome_mailer_sent": null,
            "pslf_employment_date_rang": "",
            "pslf_employment_date_rang0": "",
            "pslf_employer_3": "",
            "pslf_employer_4": "",
            "pslf_employment_date_rang1": "",
            "pslf_employment_date_rang2": "",
            "pslf_date_last_signed_3": null,
            "pslf_date_last_signed_4": null,
            "work_order_notes": "IBR-using paystub/SCDI\nJune 2030 - eligible to submit PSLF Buyback from 7/2024 to 3/2026 while on SAVE for 20 months",
            "notestax_savings_details": "",
            "apc_status0": "1",
            "client_int_in_slt_nonpr0": "false",
            "date_marked_inactive": null,
            "current_year_total_balanc": "197,634",
            "current_year_principal_ba": "189,409",
            "date_current_myaid_data_s": "2026-02-23",
            "referring_affiliate": "0",
            "escrow_protocol": "false",
            "escrow_amount_released": null,
            "date_of_required_annual_r": null,
            "apc_presentation_date": null,
            "date_of_last_contact": null,
            "last_meeting_outcome": "",
            "invoice_sent_date": null,
            "spouse__family": "",
            "dl___state_of_issue": "",
            "special_app_notes_finra0": "",
            "trusted_contact_namee": "",
            "time_horizon": "",
            "productinvestment_purpos": "",
            "cria_rationale": "",
            "investment_knowledge": "",
            "standing_instructionsban": "",
            "periodic_investment_plan_": "",
            "ia_type_of_client": "14921",
            "beneficiary_details": "",
            "net_worth": "",
            "assets_houseinvestments": "",
            "assets_source": "",
            "overall_strategy_info": "",
            "best_interest_reasonable_": "",
            "investment_objective_ris": "",
            "updates_since_initial_fac": "",
            "date_email_annual_reminde": null,
            "incomeemployment_details": "",
            "annual_hh_income": null,
            "annual_hh_expenses": null,
            "servicer": "1",
            "policy_numbers": "",
            "backdoor_roth": "false",
            "nelnet_security_code_emai": "",
            "nelnet_security_code_emai0": "",
            "studentloanrecordid": "1",
            "date_intake_apt_schedule": "2026-03-03",
            "consol_app_submit_date": null,
            "days_since_consol_sub": null,
            "tsr_client_no_longer_use": "false",
            "what_assets__insurances_": "",
            "what_debts__liabilities_": "",
            "any_specific_questions_fo": "",
            "datetime_of_appointment_": "",
            "mn_client": "false",
            "ny_client": "false",
            "ca_client": "false",
            "avs_only__charge_after_a0": "0",
            "avs_only__no_lpa__charg": "0",
            "charge_percentage__msa_f": "0",
            "waiting_to_submit__begin": null,
            "idr_recert_app_sub_deadli": null,
            "days_to_dealine": null,
            "no_show_intake__voicemai": null,
            "date_tutor_notified": null,
            "fulfillment_company": "15025",
            "goals": "",
            "recommendations": "",
            "w9_sent": null,
            "possible_testimonial": "false",
            "solic_agent": "15035",
            "date_agreed_to_ia_service": null,
            "date_of_payroll_completio": null,
            "additional_notes": "",
            "account_": "",
            "routing_": "",
            "account_type": "15045",
            "payment_plan": "",
            "escrow_acct_set_up": null,
            "first_year_of_payment": "false",
            "maiden_name": "",
            "contacted_on": null,
            "apc_booking_status_no_lo": "15076",
            "reason_not_booking": "",
            "balance_at_save_enrollmen": "",
            "lead_type_client": "0",
            "import_id": "",
            "marketing_source": "0",
            "mass_update_": "false",
            "apc_scheduled_date": null,
            "next_payment_due0": "2028-11-24 14:39:00",
            "advisor_action_needed": "false",
            "testimonial_complete": "false",
            "ni_in_testimonial": "false",
            "servicer_account_": "2955287876",
            "referred_to_slp": "false",
            "double_consol_ppl_in_prog": "false",
            "email_created_for_nelnet_0": "",
            "ia_securities_status": "15139",
            "date_of_lost_opp": null,
            "new_client_or_aar0": "15177",
            "does_client_have_a_financ": "15181",
            "advisors_name": "",
            "email0": "",
            "phone_number": "",
            "advisors_company": "",
            "email_sent_to_tutor_with_": null,
            "available_advisors": "15185",
            "please_add_fyrn_to_all_in0": "fyrn@holisticfinance.com",
            "lpamsa__sent_from": "15194",
            "spousal_consol_loans": "false",
            "no_apc__fa_referral": "false",
            "current_idr_plan": "15244",
            "type_of_idr_app_submitted": "15255",
            "multiple_idr_plans": "",
            "idr_monthly_payment_amoun": "$373.47",
            "pslf": "",
            "spouse_name": "",
            "entered_info_for_nfm": null,
            "slt_referring_rep_nfm": "0",
            "final_pp_consolidation_ap": null,
            "double_consol_progress": "15294",
            "pp_tags_active": "false",
            "invoicing": "",
            "client_contact_info": "1",
            "address": "1",
            "schedule_and_book_through": "",
            "idr_plan_ends": null,
            "aar_automation_date": "1",
            "if_idr_plan_date_is_diffe": "1",
            "last_date_of_contact": null,
            "days_since_last_contact": null,
            "estimated_tax_implication": "NA",
            "months_toward_forgiveness": "49 PSLF",
            "ibr_update_sent_to_client": null,
            "weighted_interest_rate": "6.13",
            "qualifying_payment_period": "",
            "qualifying_payment_period1": "",
            "qualifying_payment_period2": "",
            "qualifying_payment_period0": "",
            "pending_forgiveness": "false",
            "tutor_name": "41",
            "processor_name": "92",
            "first_name": "Alyssa",
            "last_name": "Boyle",
            "primary_phone": "7204255531",
            "email_1": "alyssaann14@gmail.com",
            "days_to_recert": null,
            "status1": "11893",
            "days_since_client_cont": "0"
        },
) {
  try {
    // Build payload
    const Payloads = buildHubSpotClientPayload(record);

    logger.info(`Clients Record: ${JSON.stringify(record, null, 2)}`);
    logger.info(`Clients Payload: ${JSON.stringify(Payloads, null, 2)}`);

    // 🔍 Search existing client by collection_id
    const searchResults = await searchClientInHubSpot(record.collection_id);

    if (searchResults && searchResults.length > 0) {
      // Client exists → Update
      const existingClientId = searchResults[0].id;
      logger.info(`Client exists with id ${existingClientId}, updating...`);

      const updated = await updateClientInHubSpot(
        existingClientId,
         Payloads
        );

      logger.info(`✅ Client updated:${updated.id}`);
    } else {
      // Client does not exist → Create
      const created = await createClientInHubSpot(Payloads);
      logger.info(`✅ Client created: ${created.id}`);
    }
  } catch (error) {
    logger.error("Error processing client record", error);
  }
}

export { syncClients, processClient };
