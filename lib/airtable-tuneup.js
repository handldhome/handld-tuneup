const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TUNEUP_REPORTS_TABLE = 'TuneUp Reports';
const TUNEUP_TASKS_TABLE = 'TuneUp Tasks';

async function makeAirtableRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getReport(reportId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TUNEUP_REPORTS_TABLE)}/${reportId}`;
  
  const data = await makeAirtableRequest(url);
  
  return {
    id: data.id,
    customerName: data.fields['Customer Name'],
    address: data.fields['Address'],
    city: data.fields['City'],
    dateCompleted: data.fields['Date Completed'],
    technicianName: data.fields['Technician Name'],
    totalGood: data.fields['Total Good (Rollup)'] || 0,
    totalMonitor: data.fields['Total Monitor (Rollup)'] || 0,
    totalRepairSoon: data.fields['Total Repair Soon (Rollup)'] || 0,
    totalUrgent: data.fields['Total Urgent (Rollup)'] || 0,
    sectionNotes: data.fields['Section Notes'] ? JSON.parse(data.fields['Section Notes']) : {},
  };
}

export async function getTaskResults(reportId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TUNEUP_TASKS_TABLE)}`;
  
  const data = await makeAirtableRequest(url);
  
  // Filter tasks in JavaScript instead of using Airtable formula
  const filteredRecords = data.records.filter(record => {
    const linkedReports = record.fields['TuneUp Reports'] || [];
    return linkedReports.includes(reportId);
  });
  
  return filteredRecords.map(record => ({
    id: record.id,
    taskNumber: record.fields['Task Number'],
    section: record.fields['Section'],
    taskName: record.fields['Task Name'],
    taskDescription: record.fields['Task Description'],
    status: record.fields['Status'],
    notes: record.fields['Technician Notes'],
    photos: record.fields['Photos'] || [],
    actionType: record.fields['Action Type'],
    actionLink: record.fields['Action Link'],
    actionText: record.fields['Action Text'],
    showInReport: record.fields['Show in Report'],
    referralInfo: record.fields['Referral Contact Info'] || '',
  }));
}

export async function getMasterTasks() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TUNEUP_TASKS_TABLE)}?filterByFormula=AND({Master Task} = TRUE())&sort[0][field]=Task Number&sort[0][direction]=asc`;
  
  const data = await makeAirtableRequest(url);
  
  return data.records.map(record => ({
    id: record.id,
    taskNumber: record.fields['Task Number'],
    section: record.fields['Section'],
    taskName: record.fields['Task Name'],
    taskDescription: record.fields['Task Description'],
    referralInfo: record.fields['Referral Contact Info'] || '',
  }));
}
