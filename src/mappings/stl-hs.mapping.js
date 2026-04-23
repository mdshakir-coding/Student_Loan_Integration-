function buildHubSpotActivityPayload(data = {}) {
  const lines = [];

  if (data?.collection_id) lines.push(`Collection ID: ${data?.collection_id}`);
  if (data?.site_id) lines.push(`Site ID: ${data?.site_id}`);
  if (data?.fields_changed)
    lines.push(`Fields Changed: ${data?.fields_changed}`);

  if (data?.location) lines.push(`Location: ${data?.location}`);
  if (data?.date_email_opened)
    lines.push(`Email Opened: ${data?.date_email_opened}`);

  if (data?.email_id) lines.push(`Email ID: ${data?.email_id}`);
  if (data?.subject) lines.push(`Subject: ${data?.subject}`);

  if (data?.field_from) lines.push(`From: ${data?.field_from}`);
  if (data?.email_to) lines.push(`To: ${data?.email_to}`);
  if (data?.cc) lines.push(`CC: ${data?.cc}`);
  if (data?.bcc) lines.push(`BCC: ${data?.bcc}`);

  if (data?.recurrence) lines.push(`Recurrence: ${data?.recurrence}`);
  if (data?.all_day_event !== undefined)
    lines.push(`All Day Event: ${data?.all_day_event}`);

  if (data?.start_time) lines.push(`Start Time: ${data?.start_time}`);
  if (data?.end_time) lines.push(`End Time: ${data?.end_time}`);

  if (data?.priority) lines.push(`Priority: ${data?.priority}`);
  if (data?.status) lines.push(`Status: ${data?.status}`);

  if (data?.activity) lines.push(`Activity: ${data?.activity}`);
  if (data?.description) lines.push(`Description: ${data?.description}`);

  if (data?.assigned) lines.push(`Assigned: ${data?.assigned}`);

  if (data?.created_date) lines.push(`Created Date: ${data?.created_date}`);
  if (data?.created_by) lines.push(`Created By: ${data?.created_by}`);

  if (data?.modified_date) lines.push(`Modified Date: ${data?.modified_date}`);
  if (data?.modified_by) lines.push(`Modified By: ${data?.modified_by}`);

  if (data?.date) lines.push(`Date: ${data?.date}`);

  return {
    properties: {
      hs_note_body: lines.join("\n"),
      hs_timestamp: new Date().toISOString(), // ✅ REQUIRED
    },
  };
}
