// lib/db.js
// Supabase functions for TuneUp (replaces airtable-tuneup.js)

import { getDb } from './supabase'

// Helper function to capitalize action type
function capitalizeActionType(actionType) {
  if (!actionType) return 'None'
  return actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase()
}

// Create a new report
export async function createReport(reportData) {
  const db = getDb()

  const record = {
    customer_name: reportData.customerName,
    customer_email: reportData.customerEmail,
    address: reportData.address,
    city: reportData.city || 'Pasadena',
    date_completed: reportData.dateCompleted,
    technician_name: reportData.technicianName,
    status: reportData.status || 'Draft',
    internal_notes: reportData.internalNotes || '',
  }

  // Add section notes if provided
  if (reportData.sectionNotes) {
    const sn = reportData.sectionNotes
    record.section_notes_exterior = sn['Exterior & Curb Appeal'] || sn['Exterior'] || null
    record.section_notes_electrical = sn['Electrical Systems'] || sn['Electrical'] || null
    record.section_notes_kitchen = sn['Kitchen & Appliances'] || null
    record.section_notes_plumbing = sn['Plumbing & Water Systems'] || sn['Plumbing'] || null
    record.section_notes_bathrooms = sn['Bathrooms & Wet Areas'] || null
    record.section_notes_hvac = sn['HVAC & Air Quality'] || null
    record.section_notes_safety = sn['Safety Systems'] || null
  }

  const { data, error } = await db
    .from('tuneup_reports')
    .insert(record)
    .select('id')
    .single()

  if (error) {
    console.error('[TuneUp] Error creating report:', error)
    throw error
  }

  return {
    id: data.id,
    recordId: data.id,
  }
}

// Create task results (batch)
export async function createTaskResults(taskResults) {
  const db = getDb()

  const records = taskResults.map(task => ({
    report_id: task.reportId,
    task_number: task.taskNumber,
    section: task.section,
    task_name: task.taskName,
    task_description: task.taskDescription,
    status: task.status,
    technician_notes: task.notes || '',
    action_type: capitalizeActionType(task.actionType),
    action_link: task.actionLink || '',
    action_text: task.actionText || '',
    photos: (task.photos && task.photos.length > 0) ? task.photos : null,
  }))

  // Insert in batches (Supabase handles larger batches but let's be safe)
  const allResults = []
  for (let i = 0; i < records.length; i += 50) {
    const batch = records.slice(i, i + 50)
    const { data, error } = await db
      .from('tuneup_task_results')
      .insert(batch)
      .select('id')

    if (error) {
      console.error('[TuneUp] Error creating task results batch:', error)
      throw error
    }
    allResults.push(...data)
  }

  return allResults
}

// Get all master tasks (for populating form)
export async function getMasterTasks() {
  const db = getDb()

  const { data, error } = await db
    .from('tuneup_tasks')
    .select('*')
    .order('task_number', { ascending: true })

  if (error) {
    console.error('[TuneUp] Error fetching master tasks:', error)
    throw error
  }

  return data.map(t => ({
    id: t.id,
    taskNumber: t.task_number,
    section: t.section,
    taskName: t.task_name,
    taskDescription: t.task_description,
    defaultActionType: t.default_action_type,
    defaultActionLink: t.default_action_link,
    defaultActionText: t.default_action_text,
  }))
}

// Get report by ID (for customer viewing)
export async function getReport(reportId) {
  const db = getDb()

  const { data, error } = await db
    .from('tuneup_reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (error) {
    console.error('[TuneUp] Error fetching report:', error)
    throw error
  }

  // Count task statuses via a separate query
  const { data: tasks } = await db
    .from('tuneup_task_results')
    .select('status')
    .eq('report_id', reportId)

  const counts = { Good: 0, Monitor: 0, 'Repair Soon': 0, Urgent: 0 }
  if (tasks) {
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++
    })
  }

  return {
    id: data.id,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    address: data.address,
    city: data.city,
    dateCompleted: data.date_completed,
    technicianName: data.technician_name,
    status: data.status,
    reportLink: `https://tuneup.handldhome.com/reports/${data.id}`,
    totalGood: counts['Good'],
    totalMonitor: counts['Monitor'],
    totalRepairSoon: counts['Repair Soon'],
    totalUrgent: counts['Urgent'],
    quoteRequestId: data.quote_request_id || null,
    sectionNotes: {
      'Exterior': data.section_notes_exterior || '',
      'Electrical': data.section_notes_electrical || '',
      'Plumbing': data.section_notes_plumbing || '',
      'HVAC & Air Quality': data.section_notes_hvac || '',
      'Safety Systems': data.section_notes_safety || '',
    },
  }
}

// Get task results for a report
export async function getTaskResults(reportId) {
  const db = getDb()

  const { data, error } = await db
    .from('tuneup_task_results')
    .select('*')
    .eq('report_id', reportId)
    .order('task_number', { ascending: true })

  if (error) {
    console.error('[TuneUp] Error fetching task results:', error)
    throw error
  }

  return data.map(t => ({
    id: t.id,
    taskNumber: t.task_number,
    section: t.section,
    taskName: t.task_name,
    taskDescription: t.task_description,
    status: t.status,
    notes: t.technician_notes,
    photos: t.photos || [],
    actionType: t.action_type,
    actionLink: t.action_link,
    actionText: t.action_text,
    showInReport: t.show_in_report,
  }))
}

// Link a TuneUp Report to a Quote Request by matching email
export async function linkReportToQuoteRequest(reportId, customerEmail) {
  const db = getDb()

  try {
    // Search for Quote Request by email
    const { data: qr } = await db
      .from('quote_requests')
      .select('id')
      .ilike('email', customerEmail)
      .limit(1)
      .single()

    if (!qr) {
      return { linked: false, reason: 'No matching quote request found' }
    }

    // Update the report to link to this quote request
    await db
      .from('tuneup_reports')
      .update({ quote_request_id: qr.id })
      .eq('id', reportId)

    return {
      linked: true,
      quoteRequestId: qr.id,
    }
  } catch (error) {
    console.error('[TuneUp] Error linking to Quote Request:', error)
    return { linked: false, reason: error.message }
  }
}

// Upload a photo to an existing task result
export async function uploadPhotoToTask(reportId, taskNumber, photo) {
  const db = getDb()

  // Find the task result for this report and task number
  const { data: task, error: findError } = await db
    .from('tuneup_task_results')
    .select('id, photos')
    .eq('report_id', reportId)
    .eq('task_number', taskNumber)
    .single()

  if (findError || !task) {
    throw new Error(`Task result not found for report ${reportId}, task ${taskNumber}`)
  }

  // Append the new photo
  const existingPhotos = task.photos || []
  const updatedPhotos = [...existingPhotos, { url: photo.url, filename: photo.filename }]

  const { error: updateError } = await db
    .from('tuneup_task_results')
    .update({ photos: updatedPhotos })
    .eq('id', task.id)

  if (updateError) {
    console.error('[TuneUp] Error updating task photos:', updateError)
    throw updateError
  }

  return {
    taskId: task.id,
    photoCount: updatedPhotos.length,
  }
}

// Get a job by ID from the scheduling jobs table (for pre-populating the form)
export async function getJobForTuneup(jobId) {
  const db = getDb()

  const { data, error } = await db
    .from('jobs')
    .select('*, technician:technicians(first_name, last_name), quote_request:quote_requests(address, city, email, first_name, last_name)')
    .eq('id', jobId)
    .single()

  if (error) {
    console.error('[TuneUp] Error fetching job:', error)
    throw error
  }

  return {
    id: data.id,
    customerName: data.name || '',
    customerEmail: data.quote_request?.email || '',
    address: data.quote_request?.address || '',
    city: data.quote_request?.city || 'Pasadena',
    technicianName: data.technician
      ? `${data.technician.first_name || ''} ${data.technician.last_name || ''}`.trim()
      : '',
  }
}
