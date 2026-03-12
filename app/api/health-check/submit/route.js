// app/api/health-check/submit/route.js
// API endpoint to create a new Home Health Check report

import {
  createHealthCheckReport,
  createHealthCheckItems,
  calculateOverallRating,
  getPriorityItems,
  getServicesRecommended,
  lookupCustomerQuote,
  createQuoteFromHealthCheck,
} from '../../../../lib/healthCheck'
import { getDb } from '../../../../lib/supabase'
import { cleanUpNotes } from '../../../../lib/cleanNotes'

export async function POST(request) {
  try {
    const body = await request.json()
    const { customerName, address, techName, inspectionDate, notes, customerPhone, items } = body

    // Validate required fields
    if (!customerName || !address || !techName) {
      return Response.json(
        { error: 'Missing required fields: customerName, address, techName' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return Response.json(
        { error: 'No checklist items provided' },
        { status: 400 }
      )
    }

    // Clean up technician notes with Claude before saving
    const cleanedItems = await cleanUpNotes(items)
    console.log('[HealthCheck API] Notes cleaned up')

    // Auto-calculate overall rating, priority items, and services
    const overallRating = calculateOverallRating(cleanedItems)
    const priorityItems = getPriorityItems(cleanedItems)
    const servicesRecommended = getServicesRecommended(cleanedItems)

    console.log('[HealthCheck API] Creating report...')

    // Step 1: Create the report
    const report = await createHealthCheckReport({
      customerName,
      address,
      techName,
      inspectionDate: inspectionDate || new Date().toISOString().split('T')[0],
      notes: notes || '',
      overallRating,
      priorityItems,
      servicesRecommended,
      customerPhone: customerPhone || '',
    })

    console.log('[HealthCheck API] Report created:', report.id)

    // Step 2: Create checklist items linked to this report (with cleaned notes)
    const itemRecords = cleanedItems.map(item => ({
      reportId: report.id,
      itemNumber: item.number,
      section: item.section,
      itemName: item.name,
      rating: item.rating,
      notes: item.notes || '',
    }))

    const savedItems = await createHealthCheckItems(itemRecords)
    console.log('[HealthCheck API] Items created:', savedItems.length)

    // Step 3: Auto-generate a quote if customer exists in the system
    let quoteLink = ''
    try {
      const customerMatch = await lookupCustomerQuote(customerPhone, address)
      if (customerMatch) {
        console.log('[HealthCheck API] Found existing customer quote, generating new quote...')
        const quoteId = await createQuoteFromHealthCheck({
          items: cleanedItems,
          customerQuote: customerMatch.quote,
          customerId: customerMatch.customerId,
        })
        if (quoteId) {
          quoteLink = `https://handld-quote-viewer.vercel.app/quote/${quoteId}`
          // Store quote link on the health check report
          await getDb()
            .from('health_check_reports')
            .update({ quote_link: quoteLink })
            .eq('id', report.id)
          console.log('[HealthCheck API] Quote created:', quoteId)
        }
      } else {
        console.log('[HealthCheck API] No existing customer found, skipping quote generation')
      }
    } catch (quoteErr) {
      console.error('[HealthCheck API] Quote generation failed (non-fatal):', quoteErr.message)
    }

    return Response.json({
      success: true,
      reportId: report.id,
      reportLink: `https://tuneup.handldhome.com/health-check/reports/${report.id}`,
      quoteLink,
      overallRating,
      itemCount: savedItems.length,
    })

  } catch (error) {
    console.error('[HealthCheck API] Error:', error)
    return Response.json(
      { error: 'Failed to create report', details: error.message },
      { status: 500 }
    )
  }
}
