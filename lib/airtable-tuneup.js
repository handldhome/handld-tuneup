// lib/airtable-tuneup.js
// Dedicated Airtable functions for TuneUp only

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Helper function for Airtable API requests
async function airtableRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Airtable API error response:', error);
    throw new Error(error.error?.message || 'Airtable API error');
  }

  return response.json();
}

// Helper function to capitalize action type
function capitalizeActionType(actionType) {
  if (!actionType) return 'None';
  return actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase();
}

// Create a new report
export async function createReport(reportData) {
  console.log('[TuneUp] createReport called');
  console.log('[TuneUp] Report data:', JSON.stringify(reportData, null, 2));
  
  const tableName = 'TuneUp Reports';
  console.log('[TuneUp] Using table:', tableName);
  
  try {
    const payload = {
      fields: {
        'Customer Name': reportData.customerName,
        'Customer Email': reportData.customerEmail,
        'Address': reportData.address,
        'City': reportData.city || 'Pasadena',
        'Date Completed': reportData.dateCompleted,
        'Technician Name': reportData.technicianName,
        'Status': reportData.status || 'Draft',
        'Internal Notes': reportData.internalNotes || '',
      },
    };
    
    // Add section notes if provided
    if (reportData.sectionNotes) {
      if (reportData.sectionNotes['Exterior & Curb Appeal']) {
        payload.fields['Section Notes: Exterior & Curb Appeal'] = reportData.sectionNotes['Exterior & Curb Appeal'];
      }
      if (reportData.sectionNotes['Exterior']) {
        payload.fields['Section Notes: Exterior & Curb Appeal'] = reportData.sectionNotes['Exterior'];
      }
      if (reportData.sectionNotes['Electrical Systems']) {
        payload.fields['Section Notes: Electrical Systems'] = reportData.sectionNotes['Electrical Systems'];
      }
      if (reportData.sectionNotes['Electrical']) {
        payload.fields['Section Notes: Electrical Systems'] = reportData.sectionNotes['Electrical'];
      }
      if (reportData.sectionNotes['Kitchen & Appliances']) {
        payload.fields['Section Notes: Kitchen & Appliances'] = reportData.sectionNotes['Kitchen & Appliances'];
      }
      if (reportData.sectionNotes['Plumbing & Water Systems']) {
        payload.fields['Section Notes: Plumbing & Water Systems'] = reportData.sectionNotes['Plumbing & Water Systems'];
      }
      if (reportData.sectionNotes['Plumbing']) {
        payload.fields['Section Notes: Plumbing & Water Systems'] = reportData.sectionNotes['Plumbing'];
      }
      if (reportData.sectionNotes['Bathrooms & Wet Areas']) {
        payload.fields['Section Notes: Bathrooms & Wet Areas'] = reportData.sectionNotes['Bathrooms & Wet Areas'];
      }
      if (reportData.sectionNotes['HVAC & Air Quality']) {
        payload.fields['Section Notes: HVAC & Air Quality'] = reportData.sectionNotes['HVAC & Air Quality'];
      }
      if (reportData.sectionNotes['Safety Systems']) {
        payload.fields['Section Notes: Safety Systems'] = reportData.sectionNotes['Safety Systems'];
      }
    }
    
    console.log('[TuneUp] Payload:', JSON.stringify(payload, null, 2));
    
    const data = await airtableRequest(`/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log('[TuneUp] Report created:', data.id);

    // Store the record ID BEFORE spreading fields to prevent overwriting
    const reportRecordId = data.id;

    const reportObject = {
      ...data.fields,
      id: reportRecordId,
      recordId: reportRecordId,
    };

    // Verify ID wasn't overwritten by a field
    if (reportObject.id !== reportRecordId) {
      console.error('[TuneUp] CRITICAL: Report ID was overwritten! Fixing...');
      reportObject.id = reportRecordId;
      reportObject.recordId = reportRecordId;
    }

    console.log('[TuneUp] Returning report with ID:', reportObject.id);

    return reportObject;
  } catch (error) {
    console.error('[TuneUp] Error in createReport:', error);
    throw error;
  }
}

// Create task results (batch)
export async function createTaskResults(taskResults) {
  console.log('[TuneUp] createTaskResults called');
  console.log('[TuneUp] Number of tasks:', taskResults.length);
  
  const tableName = 'TuneUp Task Results';
  
  try {
    // Airtable allows max 10 records per request
    const batches = [];
    for (let i = 0; i < taskResults.length; i += 10) {
      batches.push(taskResults.slice(i, i + 10));
    }

    const allResults = [];
    for (const batch of batches) {
      const records = batch.map(task => {
        const fields = {
          'TuneUp Reports': [task.reportId],
          'Task Number': task.taskNumber,
          'Section': task.section,
          'Task Name': task.taskName,
          'Task Description': task.taskDescription,
          'Status': task.status,
          'Technician Notes': task.notes || '',
          'Action Type': capitalizeActionType(task.actionType),
          'Action Link': task.actionLink || '',
          'Action Text': task.actionText || '',
        };

        // Add photos if present
        if (task.photos && task.photos.length > 0) {
          fields['Photos'] = task.photos.map(photo => ({
            url: photo.url,
            filename: photo.filename,
          }));
        }

        return { fields };
      });

      console.log('[TuneUp] Sending batch to Airtable');

      const data = await airtableRequest(`/${tableName}`, {
        method: 'POST',
        body: JSON.stringify({ records }),
      });

      console.log('[TuneUp] Batch created:', data.records.length, 'records');
      allResults.push(...data.records);
    }

    return allResults;
  } catch (error) {
    console.error('[TuneUp] Error in createTaskResults:', error);
    throw error;
  }
}

// Get all master tasks (for populating form)
export async function getMasterTasks() {
  const tableName = 'TuneUp Tasks';
  const data = await airtableRequest(`/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc`);
  
  return data.records.map(record => ({
    id: record.id,
    taskNumber: record.fields['Task Number'],
    section: record.fields['Section'],
    taskName: record.fields['Task Name'],
    taskDescription: record.fields['Task Description'],
    defaultActionType: record.fields['Default Action Type'],
    defaultActionLink: record.fields['Default Action Link'],
    defaultActionText: record.fields['Default Action Text'],
  }));
}

// Get report by ID (for customer viewing)
export async function getReport(reportId) {
  const tableName = 'TuneUp Reports';
  const data = await airtableRequest(`/${tableName}/${reportId}`);

  console.log('[getReport] Raw Airtable data fields:', Object.keys(data.fields));
  console.log('[getReport] Quote Request (Link) field value:', data.fields['Quote Request (Link)']);

  // Get linked Quote Request ID if available
  const quoteRequestIds = data.fields['Quote Request (Link)'] || [];
  const quoteRequestId = quoteRequestIds.length > 0 ? quoteRequestIds[0] : null;

  console.log('[getReport] Extracted Quote Request IDs array:', quoteRequestIds);
  console.log('[getReport] Final Quote Request ID:', quoteRequestId);

  return {
    id: data.id,
    customerName: data.fields['Customer Name'],
    customerEmail: data.fields['Customer Email'],
    address: data.fields['Address'],
    city: data.fields['City'],
    dateCompleted: data.fields['Date Completed'],
    technicianName: data.fields['Technician Name'],
    status: data.fields['Status'],
    reportLink: data.fields['Report Link'],
    totalGood: data.fields['Total Good (Rollup)'] || 0,
    totalMonitor: data.fields['Total Monitor (Rollup)'] || 0,
    totalRepairSoon: data.fields['Total Repair Soon (Rollup)'] || 0,
    totalUrgent: data.fields['Total Urgent (Rollup)'] || 0,
    quoteRequestId: quoteRequestId, // Add Quote Request ID
    sectionNotes: {
      'Exterior': data.fields['Section Notes: Exterior & Curb Appeal'] || data.fields['Section Notes: Exterior'] || '',
      'Electrical': data.fields['Section Notes: Electrical Systems'] || data.fields['Section Notes: Electrical'] || '',
      'Plumbing': data.fields['Section Notes: Plumbing & Water Systems'] || data.fields['Section Notes: Plumbing'] || '',
      'HVAC & Air Quality': data.fields['Section Notes: HVAC & Air Quality'] || '',
      'Safety Systems': data.fields['Section Notes: Safety Systems'] || '',
    },
  };
}

// Get task results for a report
export async function getTaskResults(reportId, retryCount = 0) {
  console.log('[TuneUp] getTaskResults called for:', reportId, 'retry:', retryCount);
  const tableName = 'TuneUp Task Results';
  const reportsTableName = 'TuneUp Reports';
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  try {
    // NEW APPROACH: Query the report first to get linked task IDs, then query those specific tasks
    // This avoids the caching issue with querying all tasks
    console.log('[TuneUp] Fetching report to get linked task IDs');

    const reportData = await airtableRequest(`/${reportsTableName}/${reportId}`);
    const linkedTaskIds = reportData.fields['Task Results (Link)'] || [];

    console.log('[TuneUp] Report has', linkedTaskIds.length, 'linked task IDs');

    if (linkedTaskIds.length === 0) {
      console.log('[TuneUp] No linked tasks found in report record');

      // Retry if no tasks linked yet
      if (retryCount < maxRetries) {
        console.log(`[TuneUp] Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return getTaskResults(reportId, retryCount + 1);
      }

      return [];
    }

    // Fetch each task by ID
    console.log('[TuneUp] Fetching', linkedTaskIds.length, 'tasks by ID');
    const tasks = [];

    for (const taskId of linkedTaskIds) {
      try {
        const taskData = await airtableRequest(`/${tableName}/${taskId}`);
        tasks.push(taskData);
      } catch (error) {
        console.error('[TuneUp] Error fetching task', taskId, ':', error.message);
      }
    }

    console.log('[TuneUp] Successfully fetched', tasks.length, 'tasks');

    return tasks.map(record => ({
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
    }));
  } catch (error) {
    console.error('[TuneUp] Error fetching tasks:', error);
    throw error;
  }
}

// Link a TuneUp Report to a Quote Request by matching email
export async function linkReportToQuoteRequest(reportId, customerEmail) {
  console.log('[TuneUp] linkReportToQuoteRequest called for:', reportId, 'email:', customerEmail);
  const quoteRequestsTable = 'Quote Requests';
  const reportsTable = 'TuneUp Reports';

  try {
    // Search for Quote Request by email
    const formula = `{Email} = "${customerEmail}"`;
    const encodedFormula = encodeURIComponent(formula);
    // Note: Removed sort parameter - if you need to sort by creation date,
    // replace 'Created' with the actual field name from your Quote Requests table
    const url = `/${quoteRequestsTable}?filterByFormula=${encodedFormula}&maxRecords=1`;

    console.log('[TuneUp] Searching for Quote Request with email:', customerEmail);
    console.log('[TuneUp] Query URL:', url);

    const data = await airtableRequest(url);

    if (!data.records || data.records.length === 0) {
      console.log('[TuneUp] No Quote Request found for email:', customerEmail);
      return { linked: false, reason: 'No matching quote request found' };
    }

    const quoteRequest = data.records[0];
    console.log('[TuneUp] Found Quote Request:', quoteRequest.id);

    // Update the TuneUp Report to link to this Quote Request
    const updateData = await airtableRequest(`/${reportsTable}/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Quote Request (Link)': [quoteRequest.id],
        },
      }),
    });

    console.log('[TuneUp] Successfully linked report to Quote Request:', quoteRequest.id);

    return {
      linked: true,
      quoteRequestId: quoteRequest.id,
      quoteRequestFields: quoteRequest.fields,
    };
  } catch (error) {
    console.error('[TuneUp] Error linking to Quote Request:', error);
    return { linked: false, reason: error.message };
  }
}

// Upload a photo to an existing task result
export async function uploadPhotoToTask(reportId, taskNumber, photo) {
  console.log('[TuneUp] uploadPhotoToTask called for report:', reportId, 'task:', taskNumber);
  const tableName = 'TuneUp Task Results';

  try {
    // First, find the task result record for this report and task number
    const data = await airtableRequest(
      `/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc`
    );

    const taskRecord = data.records.find(record => {
      const linkedReports = record.fields['TuneUp Reports'] || [];
      const recordTaskNumber = record.fields['Task Number'];
      return linkedReports.includes(reportId) && recordTaskNumber === taskNumber;
    });

    if (!taskRecord) {
      throw new Error(`Task result not found for report ${reportId}, task ${taskNumber}`);
    }

    console.log('[TuneUp] Found task record:', taskRecord.id);

    // Get existing photos and append the new one
    const existingPhotos = taskRecord.fields['Photos'] || [];
    const updatedPhotos = [
      ...existingPhotos,
      {
        url: photo.url,
        filename: photo.filename,
      }
    ];

    // Update the task record with the new photos array
    const updateData = await airtableRequest(`/${tableName}/${taskRecord.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Photos': updatedPhotos,
        },
      }),
    });

    console.log('[TuneUp] Photo added to task:', taskRecord.id);

    return {
      taskId: updateData.id,
      photoCount: updatedPhotos.length,
    };
  } catch (error) {
    console.error('[TuneUp] Error in uploadPhotoToTask:', error);
    throw error;
  }
}
