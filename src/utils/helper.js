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

// Create Payload in Inquirer
const loanStatusMapping = {
  1: "Unknown",
  2: "Current",
  3: "Deferment or Forbearance",
  4: "Default",
  5: "Past Due",
  6: "Garnishment",
  7: "App in Process",
};

const enteredInfoMapping = {
  1: "Yes",
  2: "No",
};
const affiliateReferralMapping = {
  1: "Yes",
  2: "No",
};

const evalFederalMapping = {
  1: "Less than $60k",
  2: "$60k - $75k",
  3: "$75k - $100k",
  4: "$100k - $150k",
  5: "$150k - $200k",
  6: "$200k - $300k",
  7: "$300k+",
};

const contractorReferredmapping = {
  1: "Tony F.",
};

const duFinancialPlannerMapping = {
  1: "Belle Ives (NM) - Tony",
};

const duSltOutereachMapping = {
  1: "Not Listed yet",
};
const emloymenttypes = {
  1: "Self Employed - Business Owner",
  2: "Self Employed - No Entity Set Up Yet",
  3: "W2 Employee",
  4: "Multiple (Self Employed/W2)",
  5: "Unemployed",
  6: "Retired",
  7: "Self Employed",
  8: "W2",
  9: "1099",
  10: "	Multiple,",
};
const spounceHasMapping = {
  1: "Yes",
  2: "No",
  3: "Unknown",
};

const evalTaxesmapping = {
  1: "Jointly",
  2: "Seperate",
};

const householdIncomeMapping = {
  1: "HH1 - $22,590",
  2: "HH2 - $30,660",
  3: "HH3 - $38,730",
  4: "HH4 - $46,800",
  5: "HH5 - $54,870",
  6: "HH6 - $62,940",
  7: "HH7 - $71,010",
  8: "HH8 - $79,080",
  9: "HH9 - $87,150",
  10: "HH10 - $95,220",
  11: "HH11 - $103,290",
  12: "HH12 - $111,360",
  13: "HH13 - $119,430",
  14: "HH14 - $127,500",
  15: "HH15 - $135,570",
  16: "HH16 - $add $8,070 each",
};

const inquirerCurrentMapping = {
  1: "Unknown",
  2: "Balance Based",
  3: "Income Driven",
  4: "Recent Grad(Not setup yet)",
};
const loanServicerMapping = {
  1: "Nelnet",
  2: "AidVantage",
  3: "EdFinancial",
  4: "Mohela",
  5: "CRI (Central Research Incorporated)",
  6: "Multiple Servicers",
  7: "A.E.S",
  8: "A.C.S",
  9: "Navient (Inactive)",
  10: "SLOAN",
  11: "Cornerstone",
  12: "Granite State (Inactive)",
  13: "Aspire (Inactive)",
  14: "UHEAA",
  15: "Collections Agency",
  16: "OSLA",
  17: "Trellis (Higher Ed)",
  18: "Fedloan",
  19: "Great Lakes (Inactive)",
};
const loanMapping = {
  1: "Unknown",
  2: "Current",
  3: "Deferment or Forbearance",
  4: "Default",
  5: "Past Due",
  6: "Garnishment",
  7: "App in Process",
};

const professionMapping = {
  1: "Chiropractor",
  2: "Unknown",
  3: "Naturopath",
  4: "Acupuncturist",
  5: "Medical Practitioner",
  6: "Dentist",
  7: "Doctorate / PHD",
  8: "Attorney",
  9: "Finance",
  10: "Veterinarian",
  11: "Nurse",
  12: "Psychologist",
  13: "Therapist",
  14: "Nutritionist",
  15: "Teacher",
  16: "Self Employed (Generic)",
  17: "W-2 (Generic)",
  18: "Sales",
  19: "Optometrist",
  20: "Pharmacist",
  21: "Other",
};
const inquirerStatusMapping = {
  1: "New",
  2: "(DU) Hot Lead - Nurturing",
  3: "$0 Payment Currently",
  4: "Action Needed",
  5: "Bad Lead",
  6: "Became Client",
  7: "Canceled by inquirer",
  8: "DNC/DQ",
  9: "Eval Call Set",
  10: "Eval Reschedule - Pending",
  11: "F&F Became Client",
  12: "GF Became Client",
  13: "HF PCS",
  14: "MIA/Ghost",
  15: "No Resp. 1st Att.",
  16: "No Resp. 2nd Att.",
  17: "No Resp. Final Att.",
  18: "No Sale (tutor)",
  19: "No Show (Planning Call)",
  20: "Not Interested (eval)",
  21: "Outstanding Invoice",
  22: "Pending PC - Link Sent to book",
  23: "Planning Call (not paid yet)",
  24: "Planning Call Set",
  25: "Promise to Schedule",
  26: "Rehab Default",
  27: "Req to stop Texting - Drip 2",
  28: "Rescheduled Eval Call",
  29: "Sent to Cohen - Eval",
  30: "Setter Following Up - 1st Attempt",
  31: "Setter Following Up - 2nd Attempt",
  32: "Setter Following Up - Final",
  33: "Setter Hot Lead - Nurturing",
  34: "Student",
  35: "To Be Deleted",
  36: "TRAINING",
  37: "Tutor AAR Follow up",
  38: "Tutor Following Up",
  39: "Unqualified Lead",
};

function buildHubSpotInquirerPayload(data = {}) {
  // Map the numeric loan status to string if present
  const Employment = data?.employment_type_s;
  const duSlt = data?.du_slt_outreachaffiliate;
  const Du = data?.du_financial_planner;
  const Contractor = data?.contractor_referred_by;
  const Eval = data?.eval__federal_loan_amoun;
  const affiliate = data?.affiliate_referral;
  const entered = data?.entered_info_for_nfm;
  const status = data?.inquirer_loan_status;

  const properties = cleanProps({
    // employment_type_s: emloymenttypes[Employment] || null, // todo not exist in hubspot
    // inquirer_loan_: loanMapping[data?.inquirer_loan_ ]|| null, // todo field does not exist in both
    spouse_has_loans_s: spounceHasMapping[data?.spouse_has_loans_s] || null,
    inquirer_status: inquirerStatusMapping[data?.inquirer_status] || null,
    inquirer_profession: professionMapping[data?.inquirer_profession] || null,
    inquirer_loan_servicer:
      loanServicerMapping[data?.inquirer_loan_servicer] || null,
    inquirer_current_repaymen:
      inquirerCurrentMapping[data?.inquirer_current_repaymen] || null,
    household_size__income_t0:
      householdIncomeMapping[data?.household_size__income_t0] || null,
    eval__taxes_jointlysepa:
      evalTaxesmapping[data?.eval__taxes_jointlysepa] || null,
    du_slt_outreachaffiliate: duSltOutereachMapping[duSlt] || null,
    du_financial_planner: duFinancialPlannerMapping[Du] || null,
    contractor_referred_by: contractorReferredmapping[Contractor] || null,
    eval__federal_loan_amoun: evalFederalMapping[Eval] || null,
    affiliate_referral: affiliateReferralMapping[affiliate] || null,
    entered_info_for_nfm: enteredInfoMapping[entered] || null,
    inquirer_loan_status: loanStatusMapping[status] || null,

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

    inquirer___last_year___agi: data.inquirer__last_year__ag,
    eval___spouse_pay_frequency: data.eval__pay_frequency,
    inquirer_profession_if_o: data.inquirer_profession_if_o,

    collection_id: data.collection_id,
    site_id: data.site_id,
    phone_2: data.phone_2,
    email_2: data.email_2,
    address_1: data.address_1,
    address_2: data.address_2,
    city: data.city,
    state: data.state,
    fed_loan_amount_old: data.fed_loan_amount_old,
    si_creation_date: data.si_creation_date,
    zip: data.zip,
    spouse: data.spouse,
    client_referral: data.client_referral,
    convert_to_client: data.convert_to_client,
    go_converting_to_client__: data.go_converting_to_client__,
    click_on_convert_1: data.click_on_convert_1,
    click_on_convert_2: data.click_on_convert_2,
    inquirer_no_sale_reason: data.inquirer_no_sale_reason,
    fed_loan_amount_s: data.fed_loan_amount_s,
    actively_in_school_s: data.actively_in_school_s,
    loan_status_s: data.loan_status_s,
    fed_loan_payment_s: data.fed_loan_payment_s,
    type_of_repayment_s: data.type_of_repayment_s,
    inquirer_middle_name: data.inquirer_middle_name,
    field_30_day_income_s: data.field_30_day_income_s,
    spouse_fed_loans_payment: data.spouse_fed_loans_payment,
    orders: data.orders,
    inquirer_total_balance: data.inquirer_total_balance,
    of_subsidized_loans: data.of_subsidized_loans,
    inquirer_consolidation__0: data.inquirer_consolidation__0,
    inquirer_current_planidr: data.inquirer_current_planidr,
    married: data.married,
    sps_total_balance: data.sps_total_balance,
    household_size_notes: data.household_size_notes,
    annual_documented_income: data.annual_documented_income,
    adj_gross_amount_stream_: data.adj_gross_amount_stream_,
    pay_frequency_stream_1: data.pay_frequency_stream_1,
    adj_gross_amount_stream_0: data.adj_gross_amount_stream_0,
    adj_gross_amount_stream_1: data.adj_gross_amount_stream_1,
    combined_annual_documente: data.combined_annual_documente,
    income_documentation_note: data.income_documentation_note,
    tax_filing_status: data.tax_filing_status,
    spouse_loan_description: data.spouse_loan_description,
    savings_summary: data.savings_summary,
    balance_based_scenarios: data.balance_based_scenarios,
    tutor_approx_value_of_sav: data.tutor_approx_value_of_sav,
    loan_servicer_notes: data.loan_servicer_notes,
    sps_outstanding_principal: data.sps_outstanding_principal,
    sps_avg_interest_rate: data.sps_avg_interest_rate,
    sps_years_towards_forgiv: data.sps_years_towards_forgiv,
    sps_loan_types: data.sps_loan_types,
    sps_loan_servicers: data.sps_loan_servicers,
    inquirer_household_size_n: data.inquirer_household_size_n,
    date_of_planning_call: data.date_of_planning_call,
    date_marketing_reconciled: data.date_marketing_reconciled,
    conferencesdani_pr_sourc: data.conferencesdani_pr_sourc,
    kyle_affiliatefb_marketi0: data.kyle_affiliatefb_marketi0,
    online_generic_dont_use: data.online_generic_dont_use,
    inquiry_source_notes_esp0: data.inquiry_source_notes_esp0,
    inquirer_date_of_last_con: data.inquirer_date_of_last_con,
    referral_from_financial_a: data.referral_from_financial_a,
    linked_client: data.linked_client,
    copy_info: data.copy_info,
    calculator_results: data.calculator_results,
    inquirer_calculator_repor: data.inquirer_calculator_repor,
    sps_calc_report_link: data.sps_calc_report_link,
    eval_notes: data.eval_notes,
    spouse__last_year__agi: data.spouse__last_year__agi,
    eval__spouse_pay_frequen: data.eval__spouse_pay_frequen,
    notes: data.notes,
    under_admin_review__t_k: data.under_admin_review__t_k,
    affiliate_presenting_tuto: data.affiliate_presenting_tuto,
    spacer: data.spacer,
    date_of_tutor_fu: data.date_of_tutor_fu,
    date_eval_occured: data.date_eval_occured,
    graduation_year: data.graduation_year,
    eval__current_income: data.eval__current_income,
    eval__spouse_current_inc: data.eval__spouse_current_inc,
    good_timing_for_strategy_0: data.good_timing_for_strategy_0,
    financial_experience: data.financial_experience,
    assets__insurances: data.assets__insurances,
    renting_or_owning_if_hom: data.renting_or_owning_if_hom,
    liabilities: data.liabilities,
    interested_in_values_base: data.interested_in_values_base,
    current_year_pretax_annu: data.current_year_pretax_annu,
    anything_else_we_should_k: data.anything_else_we_should_k,
    inquirer_referral0: data.inquirer_referral0,
    slt_rep_referred_by: data.slt_rep_referred_by,
    date_of_initial_strategy_: data.date_of_initial_strategy_,
    years_until_tax_imp_expe: data.years_until_tax_imp_expe,
    tax_imp_goal: data.tax_imp_goal,
    na_note_from_referring_r: data.na_note_from_referring_r,
    student__date_of_graduat: data.student__date_of_graduat,
    marketing_source: data.marketing_source,
    dani_pr_source: data.dani_pr_source,
    standby_notes__availabli: data.standby_notes__availabli,
    pc_appointment_confirmati: data.pc_appointment_confirmati,
    pc_follow_up_to_book: data.pc_follow_up_to_book,
    coordinator_notes: data.coordinator_notes,
    no_call_no_show_1: data.no_call_no_show_1,
    no_call_no_show_2: data.no_call_no_show_2,
    no_call_no_show_3: data.no_call_no_show_3,
    rescheduled_date: data.rescheduled_date,
    standby_marked_date: data.standby_marked_date,
    est_tax_burden: data.est_tax_burden,
    created_date: data.created_date,
    lead_owner: data.lead_owner,
    first_name: data.first_name,
    modified_by: data.modified_by,
    last_name: data.last_name,
    primary_phone: data.primary_phone,
    email_1: data.email_1,
    tutor_needs_attention: data.tutor_needs_attention,
    setter_needs_attention: data.setter_needs_attention,
    under_admin_review__s_k: data.under_admin_review__s_k,
  });

  if (!Object.keys(properties).length) {
    throw new Error("HubSpot payload is empty");
  }

  return { properties };
}

//  code for Affiliate Payload

function buildHubSpotAffiliatePayload(data = {}) {
  if (!data || !data.first_name) {
    console.warn("No data provided for Affiliate payload");
    return {};
  }
  const payload = {
    properties: {
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

      // New Maaping Payload

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
      receives_texts: data.receives_texts,
      name_stated_on_vm: data.name_stated_on_vm,
      date_of_fa_presentation: data.date_of_fa_presentation,
      title: data.title,
      marital_status_s: data.marital_status_s,
      vip_affiliate: data.vip_affiliate,
      _of_years_an_agent_new: data._of_years_an_agent_new,
      email__personal_type: data.email__personal_type,
      linkedin: data.linkedin,
      has_referrals_in_mind_asa: data.has_referrals_in_mind_asa,
      date_of_first_client_refe: data.date_of_first_client_refe,
      affiliate_nurturing_call: data.affiliate_nurturing_call,
      revenue_share: data.revenue_share,
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
      // phone_2_type: data.phone_2_type,
      // time_zone0: data.time_zone0,
      // profession: data.profession,
      // lead_owner: data.lead_owner,
      // affiliate_status: data.affiliate_status,
      // lead_source: data.lead_source,
      // _of_years_an_agent_old: data._of_years_an_agent_old,
      // _of_registered_states: data._of_registered_states,
      // industry: data.industry,
      // presenting_rep: data.presenting_rep,
      // comp_super_affiliate: data.comp_super_affiliate,
      // conference: data.conference,
      // created_date: data.created_date,
      // time_zone: data.time_zone,
      // primary_phone_line_type: data.primary_phone_line_type,
    },
  };

  // if (!Object.keys(properties).length) {
  //   throw new Error("Affiliate payload is empty");
  // }

  return payload;
}

// Create Activity Payload

function buildHubSpotActivityPayload(data = {}) {
  const properties = cleanProps({
    activity_name: data.subject || "Capsule Activity",

    activity_type: data.activity, // 1004
    activity_status: data.status, // 10004
    activity_priority: data.priority, // 10006

    activity_description: data.description || "",
    activity_location: data.location || "",

    activity_timestamp: data.start_time
      ? new Date(data.start_time).getTime()
      : Date.now(),

    activity_end_time: data.end_time ? new Date(data.end_time).getTime() : null,

    is_all_day:
      data.all_day_event === "true" || data.all_day_event === true
        ? "true"
        : "false",

    hubspot_owner_id: data.assigned || null,

    activity_created_date: data.created_date
      ? new Date(data.created_date).getTime()
      : null,

    created_via: "api",
  });

  if (!Object.keys(properties).length) {
    throw new Error("❌ Activity payload is empty");
  }

  return { properties };
}

// Create Invoices Payload

function buildHubSpotInvoicePayload(data = {}) {
  const properties = cleanProps({
    special_notes: "",
    hourly_rate: "0.00",
    project_description: "",
    expense_description: "",
    related_client: "0",
    hours_spent: "10.50",
    special_details: "",
    amount_charged_today: "0.00",
    related_affiliate: "0",
    special_arrangements_deta: "",
    related_inquirer: "0",
    date_reconciled: null,
    date_of_activity: "2020-07-02",
    contractor_name: "47",
    total_invoice_amount: "25.00",
    total_sale_amount: "0.00",
    first_name: "",
    last_name: "",

    // Error fields for Invoices ----------------------------------------------------------------
    // "collection_id": "4",
    // "site_id": "1",
    // "fields_changed": "0,13792,0",/
    // "no_sale_bonus_to_setter_": "0",
    // "created_by": "14",
    // "amount_of_expense_receip": "0.00",
    // "review_bonuses__processi": "13199",
    // "marketing_bonuses": "13204",
    // "advanced_planning_activit": "13210",
    // "affiliate_bonus": "13213",
    // "dont_use_setter_if_25_": "0",
    // "setter_name": "0",
    // "sale_financing___recurri": "0",
    // "commission_": "1",
    // "sales_commission": "1",
    // "clients_tutor__only_sel": "0",
    // "additional_work_completed": "0",
    // "created_date": "2020-07-10 15:36:43",
    // "modified_by": "41",
    // "modified_date": "2020-07-14 15:27:42",
    // "related_client_processin": "0",
    // "related_client_recertifc": "0",
    // "aar_sale_amount": "13170",
    // "payment_type": "13175",
    // "payment_arrangementtrade": "",
    // "dont_use__setter_if_50_": "0",
    // "tutor_sale_amount": "13186",
    // "payment_arrangement": "13192",
    // "sales_category_report_cc": "0",
    // "invoice_category": "13217",
    // "aar_activity_commission": "13169",
    // "processing_activity": "13194",
    // "clients_tutor__only_sel0": "14"

    //------------------------------------------------------------------------------------------
  });

  if (!Object.keys(properties).length) {
    throw new Error("❌ Invoice payload is empty");
  }

  return { properties };
}

// Create Clients Payload

function buildHubSpotClientPayload(data = {}) {
  function toTimestamp(dateStr) {
    return dateStr ? new Date(dateStr).getTime() : null;
  }

  console.log("Raw input data:", data);

  const properties = cleanProps({
    // Old Mapping Fields...

    // servicer___username: data.servicer__username,
    // servicer___password: data.servicer__password,
    // client_avg__interest_rate: data.client_avg_interest_rate,
    // payment_problem_to_resolve: data.payment_problem_to_resolve,
    // collection_notes: data.collection_notes,
    // date_calculation_ran: data.date_calculation_ran,

    // collection_id: data.collection_id,
    // site_id: data.site_id,
    // fields_changed: data.fields_changed,
    // created_by: data.created_by,
    // modified_by: data.modified_by,
    // modified_date: data.modified_date,
    // lead_owner: data.lead_owner,
    // phone_2: data.phone_2,
    // email_2: data.email_2,
    // address_1: data.address_1,
    // address_2: data.address_2,
    // city: data.city,
    // state: data.state,
    // zip: data.zip,
    // spouse__partner: data.spouse__partner,
    // referral: data.referral,
    // msa_sent_: data.msa_sent_,
    // msa_received0: data.msa_received0,
    // lpa_sent: data.lpa_sent,
    // lpa_received: data.lpa_received,

    // idr_app_submitted_date: data.idr_app_submitted_date,
    // days_since_app_sub: data.days_since_app_sub,
    // error_with_payments: data.error_with_payments,
    // date_of_birth: data.date_of_birth,
    // primary_phone0: data.primary_phone0,
    // primary_phone_type: data.primary_phone_type,
    // secondary_phone: data.secondary_phone,
    // secondary_phone_type: data.secondary_phone_type,
    // studentaidgov_user_not_0: data.studentaidgov_user_not_0,
    // studentaidgov_pass_not_0: data.studentaidgov_pass_not_0,
    // employerbusiness_name: data.employerbusiness_name,
    // employer_address: data.employer_address,
    // employers_city: data.employers_city,
    // employers_state: data.employers_state,

    // reference_1_name: data.reference_1_name,
    // reference_1_address: data.reference_1_address,
    // reference_1_city: data.reference_1_city,
    // reference_1_state: data.reference_1_state,
    // reference_1_zip_: data.reference_1_zip_,
    // reference_2_name: data.reference_2_name,
    // reference_2_address: data.reference_2_address,
    // reference_2_city: data.reference_2_city,
    // reference_2_state: data.reference_2_state,
    // reference_2_zip: data.reference_2_zip,

    // spouse__full_name_: data.spouse__full_name_,
    // spouse__date_of_birth: data.spouse__date_of_birth,
    // maidenformer_name: data.maidenformer_name,
    // spouse__ssn: data.spouse__ssn,
    // spouse__email: data.spouse__email,
    // spouse__phone: data.spouse__phone,
    // spouse__loan_amount: data.spouse__loan_amount,

    // employer_info_: data.employer_info_,
    // personal_reference: data.personal_reference,
    // spouse_info: data.spouse_info,

    // q26_spouse_income_changed0: data.q26_spouse_income_changed0,
    // desired_servicer_s: data.desired_servicer_s,
    // borrower_actual_agi_0: data.borrower_actual_agi_0,
    // state_s: data.state_s,
    // actual_combined_agi_s: data.actual_combined_agi_s,
    // spouse_actual_agi_s: data.spouse_actual_agi_s,
    // desired_repay_plan_s: data.desired_repay_plan_s,
    // q1_balance_based_type_s: data.q1_balance_based_type_s,
    // q1_and_q2_desired_repay_p0: data.q1_and_q2_desired_repay_p0,
    // q5_dependent_children_s: data.q5_dependent_children_s,
    // q6_other_dependents_s: data.q6_other_dependents_s,
    // q7_marital_status_s: data.q7_marital_status_s,
    // q10_employment_type_s: data.q10_employment_type_s,
    // q20_filed_taxes_last_2_yr0: data.q20_filed_taxes_last_2_yr0,
    // q23_separated_from_spouse0: data.q23_separated_from_spouse0,
    // q24_sp_income_access_s: data.q24_sp_income_access_s,
    // q8_filed_taxes_last_2_yrs: data.q8_filed_taxes_last_2_yrs,
    // filed_taxes_last_2_yrs0: data.filed_taxes_last_2_yrs0,
    // q25_spouse_filed_taxes_s: data.q25_spouse_filed_taxes_s,
    // q15_you_and_spouse_filed_0: data.q15_you_and_spouse_filed_0,
    // q21_income_change_since_l0: data.q21_income_change_since_l0,
    // q22_taxable_income_s: data.q22_taxable_income_s,

    // reference_1_phone: data.reference_1_phone,
    // reference_1_relationship: data.reference_1_relationship,
    // reference_2_phone: data.reference_2_phone,
    // reference_2_relationship: data.reference_2_relationship,
    // employers_zip: data.employers_zip,
    // roa_sent_to_servicer: data.roa_sent_to_servicer,

    // first_name: data.first_name,
    // last_name: data.last_name,
    // email_1: data.email_1,

    // Error fields for Clients ---------------------------------------------------------------------------
    // slt_referring_rep_nfm: data.slt_referring_rep_nfm,//todo data mismatch
    // time_zone0: data.time_zone0,
    //client_current_planidr_h: data.client_current_planidr_h,
    // "tutor_name": "33",
    // "processor_name": "55",
    // "primary_phone": "8013689828",
    // "days_to_recert": "374",
    // "status1": "13385",
    // "days_since_client_cont": "488"
    // "created_date": "2016-08-10 08:26:33",
    // "phone_1_type": "11174",
    // "phone_2_type": "11177",
    // "client_action_taken": "2024-08-29 14:22:00",
    // "recert_date": "2024-12-21 22:00:00",
    // "social_security_number": "600-12-7333",
    // "spouse_has_loans": "No",
    // "available_advisors": "0",
    // "lpamsa__sent_from": "0",
    // "no_apc__fa_referral": "false",
    // "current_idr_plan": "0",
    // "type_of_idr_app_submitted": "0",
    // "slt_referring_rep_nfm": "0",
    // "double_consol_progress": "0",
    // "pp_tags_active": "false",
    // "client_contact_info": "1",
    // "address": "1",
    // "aar_automation_date": "1",
    // "if_idr_plan_date_is_diffe": "1",
    // "import_id": "28",
    // "mass_update_": "true",
    // "advisor_action_needed": "false",
    // "testimonial_complete": "false",
    // "ni_in_testimonial": "false",
    // "servicer_account_": "",
    // "referred_to_slp": "false",
    // "double_consol_ppl_in_prog": "false",
    // "ia_securities_status": "0",
    // "new_client_or_aar0": "0",
    // "does_client_have_a_financ": "0",
    // "account_": "0",
    // "account_type": "15045",
    // "first_year_of_payment": "false",
    // "apc_booking_status_no_lo": "15076",
    // "avs_only__no_lpa__charg": "0",
    // "charge_percentage__msa_f": "0",
    // "idr_recert_app_sub_deadli": "2024-11-21",
    // "days_to_dealine": "405",
    // "fulfillment_company": "15025",
    // "possible_testimonial": "false",
    // "solic_agent": "15035",
    // "mn_client": "false",
    // "ny_client": "false",
    // "ca_client": "false",
    // "ia_type_of_client": "14921",
    // "servicer": "1",
    // "backdoor_roth": "false",
    // "nelnet_security_code_emai": "T.FrazierSLT2024@gmail.com",
    // "nelnet_security_code_emai0": "StudentLoans28!",
    // "studentloanrecordid": "1",
    // "tsr_client_no_longer_use": "false",
    // "apc_status0": "1",
    // "client_int_in_slt_nonpr0": "false",
    // "date_marked_inactive": "2024-08-29",
    // "current_year_total_balanc": "158,776.12",
    // "current_year_principal_ba": "144324",
    // "referring_affiliate": "0",
    // "escrow_protocol": "false",
    // "est_forgiveness_date0": "2042-01-25",
    // "years_until_forgiveness": "-192",
    // "apc_status": "1",
    // "calculator_report_link": "https://datastudio.google.com/s/s9qrY0Ew8m0",
    // "referrals": "1",
    // "inactive_specifics": "14184",
    // "payment_problem_to_resolv": "false",
    // "current_ffel_loans": "false",
    // "do_not_complete_work_unti": "0.00",
    // "slt_rep_referred_by_no_l": "55",
    // "client_consolidation__lo": "DCL 2017 \n5",
    // "client_avg_interest_rate": "8.2",
    // "calculation_performed_by": "14",
    // "special_calculation_notes": "This is one that might get a significant credit. They've had these loans since 1999",
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
    // "aar_fee": "11493",
    // "q12_provide_info": "1",
    // "q4_in_forbearance": "1",
    // "client_name_fulf": "1",
    // "client_name_fulc": "1",
    // "email_address": "kmfraz@comcast.net",
    // "recerts": "1",
    // "middle_initialname": "Delane",
    // "customer_info": "1",
    // "current_servicer0": "11965",
    // "status0": "1",
    // "servicer__username": "tkfraz7",
    // "servicer__password": "George62543*",
    // "profession0": "12735",
    // "client_is_pslf0": "13001",
    // "ia_inquirer_status": "13289",
    // "meeting_notes": "@sara Troy Frazier. Didn't have loan data or myaid data on file (please try to have that for future APC's). They are in too much debt and recovering from surgery and no cashflow so not in a good spot to start saving. In a year please ask them if they have excess in their business again and if it would be a good time for michael to help them get setup with a whole life policy. ",
    //------------------------------------------------------------------------------------------------------

    // New Mapping Client value

     // Error Fields-------------------------------------------------------------------------------
    // created_date: data?.created_date,
    // phone_1_type: data?.phone_1_type,
    // phone_2_type: data?.phone_2_type,
    // spouse_has_loans: data?.spouse_has_loans,
    // q1_income_driven_type_s: data?.q1_income_driven_type_s,
    // q18_employment_type_0: data?.q18_employment_type_0,
    // client_action_taken: data?.client_action_taken,
    // recert_date: data?.recert_date,
    // social_security_number: data?.social_security_number,
    //----------------------------------------------------------------------------------------------------

    collection_id: data?.collection_id,
    site_id: data?.site_id,
    fields_changed: data?.fields_changed,
    created_by: data?.created_by,
    modified_by: data?.modified_by,
    modified_date: data?.modified_date,
    lead_owner: data?.lead_owner,

    phone_2: data?.phone_2,
    email_2: data?.email_2,

    time_zone0: data?.time_zone0,
    address_1: data?.address_1,
    address_2: data?.address_2,
    city: data?.city,
    state: data?.state,
    zip: data?.zip,

    spouse__partner: data?.spouse__partner,
    referral: data?.referral,

    msa_sent_: data?.msa_sent_,
    msa_received0: data?.msa_received0,
    lpa_sent: data?.lpa_sent,
    lpa_received: data?.lpa_received,

    idr_app_submitted_date: data?.idr_app_submitted_date,
    days_since_app_sub: data?.days_since_app_sub,
    error_with_payments: data?.error_with_payments,

    date_of_birth: data?.date_of_birth,

    primary_phone0: data?.primary_phone0,
    primary_phone_type: data?.primary_phone_type,
    secondary_phone: data?.secondary_phone,
    secondary_phone_type: data?.secondary_phone_type,

    studentaidgov_user_not_0: data?.studentaidgov_user_not_0,
    studentaidgov_pass_not_0: data?.studentaidgov_pass_not_0,

    employerbusiness_name: data?.employerbusiness_name,
    employer_address: data?.employer_address,
    employers_city: data?.employers_city,
    employers_state: data?.employers_state,

    reference_1_name: data?.reference_1_name,
    reference_1_address: data?.reference_1_address,
    reference_1_city: data?.reference_1_city,
    reference_1_state: data?.reference_1_state,
    reference_1_zip_: data?.reference_1_zip_,

    reference_2_name: data?.reference_2_name,
    reference_2_address: data?.reference_2_address,
    reference_2_city: data?.reference_2_city,
    reference_2_state: data?.reference_2_state,
    reference_2_zip: data?.reference_2_zip,

    spouse__full_name_: data?.spouse__full_name_,
    spouse__date_of_birth: data?.spouse__date_of_birth,
    maidenformer_name: data?.maidenformer_name,
    spouse__ssn: data?.spouse__ssn,
    spouse__email: data?.spouse__email,
    spouse__phone: data?.spouse__phone,

    spouse__loan_amount: data?.spouse__loan_amount,

    employer_info_: data?.employer_info_,
    personal_reference: data?.personal_reference,
    spouse_info: data?.spouse_info,

    q26_spouse_income_changed0: data?.q26_spouse_income_changed0,
    desired_servicer_s: data?.desired_servicer_s,

    borrower_actual_agi_0: data?.borrower_actual_agi_0,
    state_s: data?.state_s,
    actual_combined_agi_s: data?.actual_combined_agi_s,
    spouse_actual_agi_s: data?.spouse_actual_agi_s,

    desired_repay_plan_s: data?.desired_repay_plan_s,
    q1_balance_based_type_s: data?.q1_balance_based_type_s,

    q1_and_q2_desired_repay_p0: data?.q1_and_q2_desired_repay_p0,

    q5_dependent_children_s: data?.q5_dependent_children_s,
    q6_other_dependents_s: data?.q6_other_dependents_s,
    q7_marital_status_s: data?.q7_marital_status_s,

    q10_employment_type_s: data?.q10_employment_type_s,

    q20_filed_taxes_last_2_yr0: data?.q20_filed_taxes_last_2_yr0,
    q23_separated_from_spouse0: data?.q23_separated_from_spouse0,
    q24_sp_income_access_s: data?.q24_sp_income_access_s,

    q8_filed_taxes_last_2_yrs: data?.q8_filed_taxes_last_2_yrs,
    filed_taxes_last_2_yrs0: data?.filed_taxes_last_2_yrs0,

    q25_spouse_filed_taxes_s: data?.q25_spouse_filed_taxes_s,
    q15_you_and_spouse_filed_0: data?.q15_you_and_spouse_filed_0,
    q21_income_change_since_l0: data?.q21_income_change_since_l0,
    q22_taxable_income_s: data?.q22_taxable_income_s,
  });

  // console.log("Cleaned properties:", properties);

  if (Object.keys(properties).length === 0) {
    throw new Error("❌ Client payload is empty");
  }

  return { properties };
}

export {
  cleanProps,
  buildHubSpotInquirerPayload,
  buildHubSpotAffiliatePayload,
  buildHubSpotActivityPayload,
  buildHubSpotInvoicePayload,
  buildHubSpotClientPayload,
};
