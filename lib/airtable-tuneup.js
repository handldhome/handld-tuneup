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

// Verify Airtable field configuration for task results
export async function verifyTaskResultsTableConfiguration() {
  console.log('[TuneUp] Verifying Task Results table configuration...');

  try {
    // Use Airtable Metadata API to get table schema
    const metadataUrl = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;
    const response = await fetch(metadataUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn('[TuneUp] Could not fetch table metadata for verification');
      return; // Don't block on verification failure
    }

    const metadata = await response.json();
    const taskResultsTable = metadata.tables.find(t => t.name === 'TuneUp Task Results');

    if (!taskResultsTable) {
      throw new Error('TuneUp Task Results table not found in base');
    }

    const tuneupReportsField = taskResultsTable.fields.find(f => f.name === 'TuneUp Reports');

    if (!tuneupReportsField) {
      throw new Error('TuneUp Reports field not found in Task Results table');
    }

    // Verify it's a linked record field
    if (tuneupReportsField.type !== 'multipleRecordLinks') {
      throw new Error(
        `TuneUp Reports field is type "${tuneupReportsField.type}" but should be "multipleRecordLinks"`
      );
    }

    // Verify it links to the correct table
    const linkedTableId = tuneupReportsField.options?.linkedTableId;
    const reportsTable = metadata.tables.find(t => t.name === 'TuneUp Reports');

    if (linkedTableId !== reportsTable?.id) {
      throw new Error(
        'TuneUp Reports field is not linked to the TuneUp Reports table'
      );
    }

    console.log('[TuneUp] ✓ Task Results table configuration verified successfully');
    console.log('[TuneUp] ✓ TuneUp Reports field is correctly configured as linked record field');
  } catch (error) {
    console.error('[TuneUp] Field verification error:', error.message);
    throw new Error(`Airtable configuration error: ${error.message}`);
  }
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

    console.log('[TuneUp] Report created with ID:', data.id);
    console.log('[TuneUp] Report ID type:', typeof data.id);
    console.log('[TuneUp] Full report data:', JSON.stringify(data, null, 2));

    // CRITICAL: Store the record ID before spreading fields to prevent overwrite
    const reportRecordId = data.id;

    const reportObject = {
      id: reportRecordId,
      recordId: reportRecordId,
      ...data.fields,
    };

    // Verify ID wasn't overwritten by field spread
    if (reportObject.id !== reportRecordId) {
      console.error('[TuneUp] CRITICAL: Report ID was overwritten by field spread!');
      console.error('[TuneUp] Original ID:', reportRecordId);
      console.error('[TuneUp] Overwritten with:', reportObject.id);
      // Fix the overwrite
      reportObject.id = reportRecordId;
      reportObject.recordId = reportRecordId;
    }

    console.log('[TuneUp] Returning report object with id:', reportObject.id);
    console.log('[TuneUp] Report object id matches record id?', reportObject.id === reportRecordId);

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
        console.log('[TuneUp] Processing task - reportId:', task.reportId, 'type:', typeof task.reportId);

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
      console.log('[TuneUp] First record in batch:', JSON.stringify(records[0], null, 2));
      console.log('[TuneUp] Batch size:', records.length);

      const data = await airtableRequest(`/${tableName}`, {
        method: 'POST',
        body: JSON.stringify({ records }),
      });

      console.log('[TuneUp] Batch created:', data.records.length, 'records');
      if (data.records.length > 0) {
        console.log('[TuneUp] First created task ID:', data.records[0].id);
        console.log('[TuneUp] First created task fields:', JSON.stringify(data.records[0].fields, null, 2));
      }
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
export async function getTaskResults(reportId) {
  console.log('[TuneUp] getTaskResults called for:', reportId);
  const tableName = 'TuneUp Task Results';

  try {
    // Fetch all task results and filter client-side
    // Note: Airtable's filterByFormula doesn't work reliably with linked record fields
    console.log('[TuneUp] Fetching all task results for client-side filtering');

    // Airtable API returns max 100 records per request - need to handle pagination
    let allRecords = [];
    let offset = null;
    let pageCount = 0;

    do {
      pageCount++;
      const url = offset
        ? `/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc&offset=${encodeURIComponent(offset)}`
        : `/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc`;

      console.log('[TuneUp] Fetching page', pageCount, offset ? `(offset: ${offset})` : '(first page)');
      const data = await airtableRequest(url);

      console.log('[TuneUp] Page', pageCount, 'returned', data.records.length, 'records');
      allRecords.push(...data.records);

      offset = data.offset || null;
      if (offset) {
        console.log('[TuneUp] More records available, fetching next page...');
      }
    } while (offset);

    console.log('[TuneUp] Fetched', allRecords.length, 'total task results across', pageCount, 'page(s)');

    // Filter to only tasks linked to this report
    console.error('[TuneUp] ========== TASK FILTERING DEBUG ==========');
    console.error('[TuneUp] Filtering for reportId:', reportId);
    console.error('[TuneUp] reportId type:', typeof reportId);
    console.error('[TuneUp] Total records fetched:', allRecords.length);

    // Debug: Show first record's linked reports field
    if (allRecords.length > 0) {
      const sampleRecord = allRecords[0];
      console.error('[TuneUp] Sample task record ID:', sampleRecord.id);
      console.error('[TuneUp] Sample task Task Number:', sampleRecord.fields['Task Number']);
      console.error('[TuneUp] Sample "TuneUp Reports" field:', sampleRecord.fields['TuneUp Reports']);
      console.error('[TuneUp] Sample "TuneUp Reports" type:', typeof sampleRecord.fields['TuneUp Reports']);
      console.error('[TuneUp] Sample "TuneUp Reports" is array?', Array.isArray(sampleRecord.fields['TuneUp Reports']));

      if (sampleRecord.fields['TuneUp Reports'] && Array.isArray(sampleRecord.fields['TuneUp Reports'])) {
        console.error('[TuneUp] Sample linked report IDs:', sampleRecord.fields['TuneUp Reports']);
      }

      // Check if there's a "Report ID (Lookup)" field
      if (sampleRecord.fields['Report ID (Lookup)']) {
        console.error('[TuneUp] Sample "Report ID (Lookup)" field:', sampleRecord.fields['Report ID (Lookup)']);
      }
    } else {
      console.error('[TuneUp] No task records exist in Airtable!');
    }

    const filteredRecords = allRecords.filter(record => {
      const linkedReports = record.fields['TuneUp Reports'] || [];

      // Check if reportId matches either directly or with a date prefix (e.g., "20251230-recXXX")
      const matches = linkedReports.some(linkedId => {
        // Direct match
        if (linkedId === reportId) return true;
        // Match with date prefix stripped (format: "YYYYMMDD-recXXX")
        if (linkedId.includes('-') && linkedId.split('-')[1] === reportId) return true;
        // Match if reportId has prefix but stored value doesn't
        if (reportId.includes('-') && reportId.split('-')[1] === linkedId) return true;
        return false;
      });

      // Debug logging for first few records
      if (allRecords.indexOf(record) < 3) {
        console.log(`[TuneUp] Task #${record.fields['Task Number']} - Linked Reports:`, linkedReports, 'Match:', matches);
      }

      return matches;
    });

    console.error('[TuneUp] FILTERING COMPLETE: Found', filteredRecords.length, 'task results for report', reportId);
    console.error('[TuneUp] ========================================');

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
    }));
  } catch (error) {
    console.error('[TuneUp] Error fetching tasks:', error);
    throw error;
  }
}

// Upload a photo to an existing task result
export async function uploadPhotoToTask(reportId, taskNumber, photo) {
  console.log('[TuneUp] uploadPhotoToTask called for report:', reportId, 'task:', taskNumber);
  const tableName = 'TuneUp Task Results';

  try {
    // First, find the task result record for this report and task number
    // Handle pagination to fetch all records
    let allRecords = [];
    let offset = null;

    do {
      const url = offset
        ? `/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc&offset=${encodeURIComponent(offset)}`
        : `/${tableName}?sort%5B0%5D%5Bfield%5D=Task%20Number&sort%5B0%5D%5Bdirection%5D=asc`;

      const data = await airtableRequest(url);
      allRecords.push(...data.records);
      offset = data.offset || null;
    } while (offset);

    console.log('[TuneUp] Searched', allRecords.length, 'task records for photo upload');

    const taskRecord = allRecords.find(record => {
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
