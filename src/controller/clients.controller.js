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
  record = {
           
            "collection_id": "34",
            "site_id": "1",
            "fields_changed": "0,13538,15497,15274,13864,15357,15358,0",
            "created_by": "11",
            "created_date": "2016-08-10 17:53:32",
            "modified_by": "26",
            "modified_date": "2026-02-27 09:25:26",
            "lead_owner": "0",
            "phone_1_type": "11174",
            "phone_2": "",
            "phone_2_type": "11177",
            "email_2": "",
            "time_zone0": "11205",
            "address_1": "850 Golden Jubilee ",
            "address_2": "",
            "city": "Fruita",
            "state": "CO",
            "zip": "81521",
            "spouse__partner": "0",
            "referral": "0",
            "msa_sent_": "2023-09-14",
            "msa_received0": "2016-09-07",
            "lpa_sent": "2016-09-07",
            "lpa_received": "2016-09-07",
            "client_action_taken": "2026-02-27 09:20:00",
            "idr_app_submitted_date": "2025-11-28 13:50:00",
            "days_since_app_sub": "101",
            "recert_date": "2026-12-10 00:00:00",
            "error_with_payments": "1",
            "date_of_birth": "1984-05-12",
            "social_security_number": "522-63-9739",
            "primary_phone0": "7203087179",
            "primary_phone_type": "11174",
            "secondary_phone": "",
            "secondary_phone_type": "11177",
            "studentaidgov_user_not_0": "Jacarrithers",
            "studentaidgov_pass_not_0": "Miranda!122!!",
            "employerbusiness_name": "Carrithers Chiropractic",
            "employer_address": "506 W. Baseline Rd",
            "employers_city": "Lafayette",
            "employers_state": "CO",
            "reference_1_name": "Greg Lane",
            "reference_1_address": "910 Main St",
            "reference_1_city": "Delta",
            "reference_1_state": "CO",
            "reference_1_zip_": "81416",
            "reference_2_name": "Patty Lane",
            "reference_2_address": "880 Willow Wood Ln",
            "reference_2_city": "Delta",
            "reference_2_state": "CO",
            "reference_2_zip": "81416",
            "spouse__full_name_": "Miranda Rose Carrithers",
            "spouse__date_of_birth": "09/06/1984",
            "maidenformer_name": "Lane",
            "spouse__ssn": "n/a",
            "spouse__email": "n/a",
            "spouse__phone": "",
            "spouse_has_loans": "No",
            "spouse__loan_amount": "0.00",
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
            "client_created_date": "2016-07-07 09:58:00",
            "aar_fee": "11552",
            "q12_provide_info": "1",
            "q4_in_forbearance": "1",
            "client_name_fulf": "1",
            "client_name_fulc": "1",
            "reference_1_phone": "9702092336",
            "reference_1_relationship": "Father in Law",
            "reference_2_phone": "9706408973",
            "reference_2_relationship": "Mother in Law",
            "employers_zip": "80026",
            "roa_sent_to_servicer": "2018-10-11",
            "email_address": "joelcarrithers@gmail.com",
            "recerts": "1",
            "middle_initialname": "",
            "customer_info": "1",
            "current_servicer0": "11965",
            "status0": "1",
            "servicer__username": "jacarrithers",
            "servicer__password": "Clarabelle#2025",
            "last_update": null,
            "profession0": "12735",
            "profession_details": "",
            "field_2nd_contact__first_name": "",
            "field_2nd_contact__last_name": "",
            "field_2nd_contact__phone": "",
            "field_2nd_contact__email": "",
            "client_is_pslf0": "13001",
            "ia_inquirer_status": "14914",
            "self_employed__ein0": "",
            "meeting_notes": "500/month alir design",
            "contact_notes": "",
            "field_2nd_contact_notes0": "",
            "aar__othertrade_specify": "",
            "multiple__which_servicer": "",
            "slt_rep_referred_by_no_l": "26",
            "date_calculation_ran": null,
            "client_consolidation__lo": "DCL 2016",
            "client_avg_interest_rate": "6.625",
            "_of_subsidized_loans_if": "",
            "client_current_planidr_h": "REPAYE $0",
            "calculation_performed_by": "0",
            "special_calculation_notes": "",
            "ia_insurance_status": "13282",
            "date_of_appexam_appointm": null,
            "current_managed_plan_deta": "rchd out 7/6 for appt\n\nwanted to wait til after taxes and after refinancing. successfully got refinanced due to my guy from MM Samuel Thompson",
            "state_license_needed": "CO",
            "term_only0": "false",
            "na_interested_in_securit": "false",
            "monthly_premium0": "0.00",
            "fyc_est": "0.00",
            "date_of_scheduled_followu": "2022-05-02",
            "estimations_current_as_of": "2020-10-13",
            "calc_raw_results": "",
            "client_years_towards_forg0": "",
            "enrolled_in_autopay_if_": "",
            "client_orig_total_balanc": "220710",
            "client_orig_principal_ba": "205324",
            "est_forgiveness_date0": "2041-09-18",
            "field_2nd_date_if_2_sets": null,
            "years_until_forgiveness": "-186",
            "client_household_size_not": "",
            "client_income_doc_notes": "",
            "apc_status": "1",
            "issueanniversaryannual_": null,
            "calculator_report_link": "https://datastudio.google.com/s/iamJy7ma0iM",
            "nickname": "",
            "security_qas": "",
            "referrals": "1",
            "inactive_specifics": "13794",
            "payment_problem_to_resolv": "false",
            "aar_booked_date": "2025-07-24",
            "myaiddata_in_drive": null,
            "calc_doc_in_drive": null,
            "current_ffel_loans": "false",
            "do_not_complete_work_unti": "0.00",
            "collection_notes": "",
            "pslf_verified_qualifying_": "",
            "pslf_date_updated": null,
            "pslf_forgiveness_date": null,
            "pslf_2nd_forgiveness_date": null,
            "pslf_employer_1": "",
            "pslf_notes": "",
            "pslf_employer_2": "",
            "pslf_date_last_signed_1": null,
            "pslf_date_last_signed_2": null,
            "unpaid_invoice": "false",
            "intake_call_complete": null,
            "welcome_mailer_sent": null,
            "pslf_employment_date_rang": "",
            "pslf_employment_date_rang0": "",
            "pslf_employer_3": "",
            "pslf_employer_4": "",
            "pslf_employment_date_rang1": "",
            "pslf_employment_date_rang2": "",
            "pslf_date_last_signed_3": null,
            "pslf_date_last_signed_4": null,
            "work_order_notes": "Graduated in 2011 - Repayment in 2012 Forgiveness in 2037\nTax implication is $81,661\n\n",
            "notestax_savings_details": "Helped Joel get refinanced. He knows he needs to do some savings planning with me please send him at the next AAR ",
            "apc_status0": "1",
            "client_int_in_slt_nonpr0": "false",
            "date_marked_inactive": null,
            "current_year_total_balanc": "",
            "current_year_principal_ba": "",
            "date_current_myaid_data_s": null,
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
            "nelnet_security_code_emai": "J.CarrithersSLT2023@gmail.com",
            "nelnet_security_code_emai0": "StudentLoan0034!",
            "studentloanrecordid": "1",
            "date_intake_apt_schedule": null,
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
            "avs_only__charge_after_a0": null,
            "avs_only__no_lpa__charg": "0",
            "charge_percentage__msa_f": "0",
            "waiting_to_submit__begin": null,
            "idr_recert_app_sub_deadli": "2026-11-10",
            "days_to_dealine": "-244",
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
            "account_": "0",
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
            "lead_type_client": "",
            "import_id": "34",
            "marketing_source": "",
            "mass_update_": "true",
            "apc_scheduled_date": null,
            "next_payment_due0": null,
            "advisor_action_needed": "false",
            "testimonial_complete": "false",
            "ni_in_testimonial": "false",
            "servicer_account_": "",
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
            "please_add_fyrn_to_all_in0": "",
            "lpamsa__sent_from": "15196",
            "spousal_consol_loans": "false",
            "no_apc__fa_referral": "false",
            "current_idr_plan": "15245",
            "type_of_idr_app_submitted": "15259",
            "multiple_idr_plans": "",
            "idr_monthly_payment_amoun": "0.00",
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
            "idr_plan_ends": "2026-12-10",
            "aar_automation_date": "1",
            "if_idr_plan_date_is_diffe": "1",
            "last_date_of_contact": null,
            "days_since_last_contact": null,
            "estimated_tax_implication": "",
            "months_toward_forgiveness": "",
            "ibr_update_sent_to_client": null,
            "weighted_interest_rate": "",
            "qualifying_payment_period": "",
            "qualifying_payment_period1": "",
            "qualifying_payment_period2": "",
            "qualifying_payment_period0": "",
            "pending_forgiveness": "false",
            "tutor_name": "26",
            "processor_name": "26",
            "first_name": "Joel",
            "last_name": "Carrithers",
            "primary_phone": "7203087179",
            "email_1": "joelcarrithers@gmail.com",
            "days_to_recert": "-274",
            "status1": "11556",
            "days_since_client_cont": "10"
        }
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

      const updated = await updateClientInHubSpot(existingClientId, Payloads);

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
