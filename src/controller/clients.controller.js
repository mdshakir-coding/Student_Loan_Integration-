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
    // fetch all client records
    const records = await fetchClientsRecords(); 
    logger.info(`Clients Records :${JSON.stringify(records.length)}`);

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
    logger.error("Error fetching client records", error.message);
    return;
  }
}

async function processClient(
  record = 
  {
            "collection_id": "10191",
            "site_id": "1",
            "fields_changed": "0,13538,12418,15274,0",
            "created_by": "70",
            "created_date": "2026-02-06 11:31:21",
            "modified_by": "41",
            "modified_date": "2026-03-24 16:43:57",
            "lead_owner": "70",
            "phone_1_type": "11176",
            "phone_2": "1383092021",
            "phone_2_type": "11180",
            "email_2": "Sheesh@bigdogs.com",
            "time_zone0": "13399",
            "address_1": "sux 5th ave",
            "address_2": "",
            "city": "New York City",
            "state": "NY",
            "zip": "10033",
            "spouse__partner": "3568",
            "referral": "0",
            "msa_sent_": "2026-03-24",
            "msa_received0": "2026-03-24",
            "lpa_sent": "2026-03-24",
            "lpa_received": "2026-03-24",
            "client_action_taken": "2026-03-24 10:11:00",
            "idr_app_submitted_date": "2026-03-24 10:11:00",
            "days_since_app_sub": "0",
            "recert_date": "2027-05-06 10:15:44",
            "error_with_payments": "1",
            "date_of_birth": "1939-01-16",
            "social_security_number": "133-21-1995",
            "primary_phone0": "18018330856",
            "primary_phone_type": "11176",
            "secondary_phone": "1383092021",
            "secondary_phone_type": "11180",
            "studentaidgov_user_not_0": "studentaid user",
            "studentaidgov_pass_not_0": "studentaid pass",
            "employerbusiness_name": "Department of Defense",
            "employer_address": "Area 51",
            "employers_city": "Reno",
            "employers_state": "NV",
            "reference_1_name": "Big Floppa",
            "reference_1_address": "575 s 1200 w",
            "reference_1_city": "orem",
            "reference_1_state": "UT",
            "reference_1_zip_": "84058",
            "reference_2_name": "Lil Flippa",
            "reference_2_address": "716 E 2550 N",
            "reference_2_city": "Provo",
            "reference_2_state": "UT",
            "reference_2_zip": "84604",
            "spouse__full_name_": "Kevin Harvey",
            "spouse__date_of_birth": "09/22/1989",
            "maidenformer_name": "Jones",
            "spouse__ssn": "xxx-xx-xxxx",
            "spouse__email": "kevinslegitimateemail@aol.net",
            "spouse__phone": "13332221111",
            "spouse_has_loans": "nope",
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
            "client_created_date": null,
            "aar_fee": "13370",
            "q12_provide_info": "1",
            "q4_in_forbearance": "1",
            "client_name_fulf": "1",
            "client_name_fulc": "1",
            "reference_1_phone": "18017773213",
            "reference_1_relationship": "Big Brudda",
            "reference_2_phone": "18013582779",
            "reference_2_relationship": "lil brudda",
            "employers_zip": "84321",
            "roa_sent_to_servicer": "2026-03-24",
            "email_address": "TestEmail321@bingus.walter",
            "recerts": "1",
            "middle_initialname": "S",
            "customer_info": "1",
            "current_servicer0": "15071",
            "status0": "1",
            "servicer__username": "HorseInTheBar",
            "servicer__password": "18781sasdfdasdAEWR",
            "last_update": null,
            "profession0": "14968",
            "profession_details": "Gang Member",
            "field_2nd_contact__first_name": "Billy",
            "field_2nd_contact__last_name": "Joel",
            "field_2nd_contact__phone": "18001112222",
            "field_2nd_contact__email": "Neanderthals@mammoth.gov",
            "client_is_pslf0": "13034",
            "hf_apc_booking_status": "13380",
            "self_employed__ein0": "87-1357889",
            "meeting_notes": "Meeting notes right here",
            "contact_notes": "Just holla",
            "field_2nd_contact_notes0": "It's him. ",
            "aar__othertrade_specify": "",
            "multiple__which_servicer": "",
            "slt_rep_referred_by_no_l": "70",
            "date_calculation_ran": "2026-03-24",
            "client_consolidation__lo": "9 parent plus loans",
            "client_avg_interest_rate": "6.7",
            "_of_subsidized_loans_if": "30",
            "client_current_planidr_h": "He had a plan but forgot",
            "calculation_performed_by": "70",
            "special_calculation_notes": "",
            "ia_insurance_status": "15187",
            "date_of_appexam_appointm": "2026-03-18 10:34:00",
            "current_managed_plan_deta": "Money goes into savings, money builds. ",
            "state_license_needed": "NY",
            "term_only0": "true",
            "na_interested_in_securit": "true",
            "monthly_premium0": "1.50",
            "fyc_est": "1.00",
            "date_of_scheduled_followu": "2026-03-22",
            "estimations_current_as_of": "2026-03-24",
            "calc_raw_results": "",
            "client_years_towards_forg0": "32 days towards forgivness",
            "enrolled_in_autopay_if_": "no",
            "client_orig_total_balanc": "128773",
            "client_orig_principal_ba": "108773",
            "est_forgiveness_date0": "2030-03-07",
            "field_2nd_date_if_2_sets": null,
            "years_until_forgiveness": "-47",
            "client_household_size_not": "3 squirrels and a cow. ",
            "client_income_doc_notes": "dolla bills weekly every other week. about three fiddy on a good day. ",
            "apc_status": "1",
            "issueanniversaryannual_": "2026-03-24",
            "calculator_report_link": "crikeythatsabigspider",
            "nickname": "Walter",
            "security_qas": "Who is your brother: Big Fluffa",
            "referrals": "1",
            "inactive_specifics": "13787",
            "payment_problem_to_resolv": "true",
            "aar_booked_date": "2026-03-24",
            "myaiddata_in_drive": "2026-03-24",
            "calc_doc_in_drive": "2026-03-24",
            "current_ffel_loans": "true",
            "do_not_complete_work_unti": null,
            "collection_notes": "Send the collector if he doesn't pay up. ",
            "pslf_verified_qualifying_": "1",
            "pslf_date_updated": "2026-03-24",
            "pslf_forgiveness_date": "2036-03-25",
            "pslf_2nd_forgiveness_date": null,
            "pslf_employer_1": "Department of Defense",
            "pslf_notes": "He works for the gov that's all we know, submitted his PSLF for one month. ",
            "pslf_employer_2": "Church of Scientology Allegedly",
            "pslf_date_last_signed_1": "2026-03-24",
            "pslf_date_last_signed_2": "2026-03-22",
            "unpaid_invoice": "true",
            "intake_call_complete": "2026-03-24",
            "welcome_mailer_sent": "2026-03-24",
            "pslf_employment_date_rang": "March 2026- March 2026",
            "pslf_employment_date_rang0": "1995 til 2005",
            "pslf_employer_3": "Activision",
            "pslf_employer_4": "Paypal",
            "pslf_employment_date_rang1": "2005-2006",
            "pslf_employment_date_rang2": "2007-2009",
            "pslf_date_last_signed_3": "2020-03-24",
            "pslf_date_last_signed_4": "2019-03-24",
            "work_order_notes": "He works a job, maybe two. ",
            "notestax_savings_details": "God gotta lot of money",
            "apc_status0": "1",
            "client_int_in_slt_nonpr0": "false",
            "date_marked_inactive": "2026-02-18",
            "current_year_total_balanc": "158618",
            "current_year_principal_ba": "168619",
            "date_current_myaid_data_s": "2026-03-24",
            "referring_affiliate": "0",
            "escrow_protocol": "false",
            "escrow_amount_released": null,
            "date_of_required_annual_r": "2026-03-24",
            "apc_presentation_date": "2026-03-24",
            "date_of_last_contact": "2026-03-23",
            "last_meeting_outcome": "He lost all his money and house on online gamblings. ",
            "invoice_sent_date": null,
            "spouse__family": "big family",
            "dl___state_of_issue": "UTAH",
            "special_app_notes_finra0": "",
            "trusted_contact_namee": "Tony",
            "time_horizon": "2 light years. ",
            "productinvestment_purpos": "Make more money. ",
            "cria_rationale": "7%",
            "investment_knowledge": "nilch",
            "standing_instructionsban": "He's got a bank under walter bingus. ",
            "periodic_investment_plan_": "yes",
            "ia_type_of_client": "15151",
            "beneficiary_details": "His little brotha lil flippa. ",
            "net_worth": "2390000",
            "assets_houseinvestments": "1 house, 12 car garage. ",
            "assets_source": "unknown",
            "overall_strategy_info": "make money. ",
            "best_interest_reasonable_": "32%",
            "investment_objective_ris": "Lots of Risk",
            "updates_since_initial_fac": "He is now broke",
            "date_email_annual_reminde": "2026-03-24",
            "incomeemployment_details": "lots of money weekly every other week. ",
            "annual_hh_income": "900000.00",
            "annual_hh_expenses": "350.00",
            "servicer": "1",
            "policy_numbers": "12345",
            "backdoor_roth": "true",
            "nelnet_security_code_emai": "microsoft@gmail.yahoo",
            "nelnet_security_code_emai0": "1228897",
            "studentloanrecordid": "1",
            "date_intake_apt_schedule": "2026-02-17",
            "consol_app_submit_date": "2026-03-24",
            "days_since_consol_sub": "1",
            "tsr_client_no_longer_use": "false",
            "what_assets__insurances_": "",
            "what_debts__liabilities_": "I owe 3 million to the IRS. ",
            "any_specific_questions_fo": "",
            "datetime_of_appointment_": "",
            "mn_client": "false",
            "ny_client": "false",
            "ca_client": "false",
            "avs_only__charge_after_a0": "0",
            "avs_only__no_lpa__charg": "0",
            "charge_percentage__msa_f": "0",
            "waiting_to_submit__begin": null,
            "idr_recert_app_sub_deadli": "2027-04-07",
            "days_to_dealine": "-377",
            "no_show_intake__voicemai": "2026-02-17",
            "date_tutor_notified": "2026-02-17",
            "fulfillment_company": "15028",
            "goals": "make money",
            "recommendations": "Big bubba",
            "w9_sent": null,
            "possible_testimonial": "true",
            "solic_agent": "15039",
            "date_agreed_to_ia_service": "2026-03-21",
            "date_of_payroll_completio": "2026-03-20",
            "additional_notes": "additional notes. ",
            "account_": "",
            "routing_": "",
            "account_type": "15045",
            "payment_plan": "",
            "escrow_acct_set_up": null,
            "first_year_of_payment": "true",
            "maiden_name": "Spoingus",
            "contacted_on": "2026-03-24",
            "apc_booking_status_no_lo": "15191",
            "reason_not_booking": "",
            "balance_at_save_enrollmen": "158618",
            "lead_type_client": "0",
            "import_id": "",
            "marketing_source": "0",
            "mass_update_": "false",
            "apc_scheduled_date": "2026-02-17",
            "next_payment_due0": "2026-03-24 10:10:00",
            "advisor_action_needed": "false",
            "testimonial_complete": "true",
            "ni_in_testimonial": "true",
            "servicer_account_": "12345accountnumber",
            "referred_to_slp": "true",
            "double_consol_ppl_in_prog": "true",
            "email_created_for_nelnet_0": "",
            "ia_securities_status": "15188",
            "date_of_lost_opp": "2026-03-19",
            "new_client_or_aar0": "15179",
            "does_client_have_a_financ": "15182",
            "advisors_name": "bingus",
            "email0": "bingus",
            "phone_number": "8888421231",
            "advisors_company": "Mass",
            "email_sent_to_tutor_with_": "2026-03-24",
            "available_advisors": "15185",
            "please_add_fyrn_to_all_in0": "fyrn@holisticfinance.com",
            "lpamsa__sent_from": "15195",
            "spousal_consol_loans": "true",
            "current_idr_plan": "15245",
            "type_of_idr_app_submitted": "15259",
            "multiple_idr_plans": "",
            "idr_monthly_payment_amoun": "199",
            "pslf": "",
            "spouse_name": "Ya boi",
            "entered_info_for_nfm": null,
            "slt_referring_rep_nfm": "70",
            "final_pp_consolidation_ap": "2026-01-24",
            "double_consol_progress": "15294",
            "pp_tags_active": "true",
            "invoicing": "",
            "client_contact_info": "1",
            "address": "1",
            "schedule_and_book_through": "",
            "optional_charge_client": "2026-03-31",
            "aar_automation_date": "1",
            "if_idr_plan_date_is_diffe": "1",
            "last_date_of_contact": null,
            "days_since_last_contact": null,
            "estimated_tax_implication": "1337",
            "months_toward_forgiveness": "30",
            "ibr_update_sent_to_client": "2026-03-24",
            "weighted_interest_rate": "5.5",
            "qualifying_payment_period": "1",
            "qualifying_payment_period1": "10 years right there",
            "qualifying_payment_period2": "12 months",
            "qualifying_payment_period0": "24 months. ",
            "pending_forgiveness": "true",
            "field_500_cash_flow_available_": "15336",
            "dont_book_with_holistic_": "",
            "dont_book": "1",
            "hf_status": "1",
            "holistic_finance_tracking": "1",
            "tutor_name": "70",
            "processor_name": "70",
            "first_name": "Walter",
            "last_name": "Bingus",
            "primary_phone": "18018330856",
            "email_1": "TestEmail321@bingus.walter",
            "days_to_recert": "-407",
            "status1": "13385",
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

    logger.info(`Search results: ${JSON.stringify(searchResults, null, 2)}`);

    if (searchResults && searchResults.length > 0) {
      // Client exists → Update
      const existingClientId = searchResults[0].id;
      logger.info(`Client exists with id ${JSON.stringify(existingClientId,null,2)}, updating...`);

      const updated = await updateClientInHubSpot(
        existingClientId,
         Payloads
        );

      logger.info(`✅ Client updated:${JSON.stringify(updated.id)}`);
    } else {
      // Client does not exist → Create
      const created = await createClientInHubSpot(Payloads);
      logger.info(`✅ Client created: ${JSON.stringify(created.id,null,2)}`);
    }
  } catch (error) {
    logger.error("Error processing client record", error.message);
  }
}

export { syncClients, processClient };
