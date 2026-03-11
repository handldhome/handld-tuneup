// lib/healthCheck.js
// Constants, helpers, and Supabase functions for the Free Home Health Check

import { getDb } from './supabase'

// ── Checklist Items ──────────────────────────────────────────────────────────

export const CHECKLIST_ITEMS = [
  // Exterior (6 items)
  { number: 1, section: 'Exterior', name: 'Driveway, Walkways & Patio Surfaces', description: 'Staining, oil, moss, algae, cracks, or surface deterioration' },
  { number: 2, section: 'Exterior', name: 'Home Exterior & Entry', description: 'Walls, siding, steps — dirt buildup, mildew, oxidation, peeling paint' },
  { number: 3, section: 'Exterior', name: 'Gutters & Downspouts', description: 'Debris, sagging, overflow staining, discharge point clear of pooling' },
  { number: 4, section: 'Exterior', name: 'Windows - Exterior', description: 'Glass cleanliness, screen condition, latch and hardware function' },
  { number: 5, section: 'Exterior', name: 'Outdoor Surfaces & Furniture', description: 'Bins, furniture, fabric or hard surfaces showing grime or mildew' },
  { number: 6, section: 'Exterior', name: 'Exterior Fixtures & Hardware', description: 'Lighting, door hardware, fence/gate latches — anything loose or broken' },

  // Interior (6 items)
  { number: 7, section: 'Interior', name: 'Kitchen Plumbing', description: 'Sink drainage, faucet drips, leaks under cabinet, disposal condition' },
  { number: 8, section: 'Interior', name: 'Bathroom Plumbing', description: 'Sink drains, toilet running/rocking/staining, hose connections' },
  { number: 9, section: 'Interior', name: 'Showers & Tubs', description: 'Caulk gaps, mold, grout condition, drain speed' },
  { number: 10, section: 'Interior', name: 'Electrical Panel', description: 'Labeled clearly, accessible, no tripped breakers, corrosion, or overcrowding' },
  { number: 11, section: 'Interior', name: 'Electrical Basics', description: 'GFCI outlets present and functional, smoke/CO detectors present and working' },
  { number: 12, section: 'Interior', name: 'General Interior Hardware', description: 'Cabinet hardware, door hinges, sticking doors, anything loose or broken' },
]

export const SECTIONS = ['Exterior', 'Interior']

// ── Service Mapping (for "Handld Can Help With" section) ─────────────────────

export const SERVICE_MAP = {
  'Driveway, Walkways & Patio Surfaces': ['Pressure Washing - Driveway & Patio'],
  'Home Exterior & Entry': ['Pressure Washing - Home Exterior'],
  'Gutters & Downspouts': ['Gutter Cleaning'],
  'Windows - Exterior': ['Window Washing - Exterior'],
  'Outdoor Surfaces & Furniture': ['Outdoor Furniture Cleaning', 'Trash Bin Cleaning'],
  'Exterior Fixtures & Hardware': ['Handyman', 'Electrical Repairs'],
  'Kitchen Plumbing': ['Plumbing Repairs', 'Handyman'],
  'Bathroom Plumbing': ['Plumbing Repairs'],
  'Showers & Tubs': ['Handyman', 'Plumbing Repairs'],
  'Electrical Panel': ['Handyman', 'Electrical Repairs'],
  'Electrical Basics': ['Electrical Repairs', 'Handyman'],
  'General Interior Hardware': ['Handyman'],
}

// ── Rating Helpers ───────────────────────────────────────────────────────────

export function calculateOverallRating(items) {
  const total = items.length
  let score = 0
  items.forEach(i => {
    if (i.rating === 'Good') score += 1
    else if (i.rating === 'Fair') score += 0.5
    // Needs Attention = 0
  })
  return `${score % 1 === 0 ? score : score.toFixed(1)} / ${total}`
}

export function getServicesRecommended(items) {
  const services = []
  items.forEach(i => {
    if (i.rating === 'Fair' || i.rating === 'Needs Attention') {
      const mapped = SERVICE_MAP[i.name]
      if (mapped) {
        mapped.forEach(s => {
          if (!services.includes(s)) services.push(s)
        })
      }
    }
  })
  return services.join(', ')
}

export function getPriorityItems(items) {
  return items
    .filter(i => i.rating === 'Fair' || i.rating === 'Needs Attention')
    .map(i => i.name)
    .join(', ')
}

export function getRatingColor(rating) {
  if (rating === 'Fair') return '#f59e0b'
  if (rating === 'Needs Attention') return '#ef4444'
  return '#10b981'
}

export function getRatingBgColor(rating) {
  if (rating === 'Fair') return '#fef3c7'
  if (rating === 'Needs Attention') return '#fee2e2'
  return '#d1fae5'
}

export function getRatingIcon(rating) {
  if (rating === 'Fair') return '\u26a0\ufe0f'
  if (rating === 'Needs Attention') return '\ud83d\udd34'
  return '\u2705'
}

// ── Supabase DB Functions ────────────────────────────────────────────────────

export async function createHealthCheckReport(reportData) {
  const db = getDb()

  const record = {
    customer_name: reportData.customerName,
    address: reportData.address,
    tech_name: reportData.techName,
    inspection_date: reportData.inspectionDate,
    notes: reportData.notes || '',
    overall_rating: reportData.overallRating || 'Good',
    priority_items: reportData.priorityItems || '',
    services_recommended: reportData.servicesRecommended || '',
    customer_phone: reportData.customerPhone || '',
  }

  const { data, error } = await db
    .from('health_check_reports')
    .insert(record)
    .select('id')
    .single()

  if (error) {
    console.error('[HealthCheck] Error creating report:', error)
    throw error
  }

  // Update with report link now that we have the ID
  const reportLink = `https://tuneup.handldhome.com/health-check/reports/${data.id}`
  await db
    .from('health_check_reports')
    .update({ report_link: reportLink })
    .eq('id', data.id)

  return { id: data.id, reportLink }
}

export async function createHealthCheckItems(items) {
  const db = getDb()

  const records = items.map(item => ({
    report_id: item.reportId,
    item_number: item.itemNumber,
    section: item.section,
    item_name: item.itemName,
    rating: item.rating,
    notes: item.notes || '',
  }))

  const { data, error } = await db
    .from('health_check_items')
    .insert(records)
    .select('id')

  if (error) {
    console.error('[HealthCheck] Error creating items:', error)
    throw error
  }

  return data
}

// ── Quote Generation (from Health Check) ─────────────────────────────────────

export async function generateQuoteId() {
  const db = getDb()
  const { data } = await db
    .from('quote_requests')
    .select('quote_id')
    .like('quote_id', 'HNDLD%')
    .order('quote_id', { ascending: false })
    .limit(1)

  let nextNum = 400
  if (data && data.length > 0) {
    const lastNum = parseInt(data[0].quote_id.replace('HNDLD', ''), 10)
    if (!isNaN(lastNum)) nextNum = lastNum + 1
  }

  return 'HNDLD' + String(nextNum).padStart(4, '0')
}

export async function lookupCustomerQuote(phone, address) {
  const db = getDb()

  // Try matching by phone first (via customers table)
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    const { data: customers } = await db
      .from('customers')
      .select('id, phone')

    if (customers) {
      const match = customers.find(c => {
        if (!c.phone) return false
        return c.phone.replace(/\D/g, '').slice(-10) === cleanPhone
      })

      if (match) {
        const { data: quotes } = await db
          .from('quote_requests')
          .select('*')
          .eq('customer_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (quotes && quotes.length > 0) {
          return { quote: quotes[0], customerId: match.id }
        }
      }
    }
  }

  // Fallback: match by address on quote_requests
  if (address) {
    const { data: quotes } = await db
      .from('quote_requests')
      .select('*, customer_id')
      .ilike('address', `%${address.split(',')[0].trim()}%`)
      .order('created_at', { ascending: false })
      .limit(1)

    if (quotes && quotes.length > 0) {
      return { quote: quotes[0], customerId: quotes[0].customer_id }
    }
  }

  return null
}

export async function createQuoteFromHealthCheck({ items, customerQuote, customerId }) {
  const db = getDb()

  // Collect unique services from flagged items
  const services = []
  items.forEach(item => {
    if (item.rating === 'Fair' || item.rating === 'Needs Attention') {
      const mapped = SERVICE_MAP[item.name]
      if (mapped) {
        mapped.forEach(s => { if (!services.includes(s)) services.push(s) })
      }
    }
  })

  if (services.length === 0) return null

  const quoteId = await generateQuoteId()

  // Create quote request, copying property details from existing quote
  const quoteRequest = {
    quote_id: quoteId,
    customer_id: customerId || null,
    address: customerQuote.address || '',
    city: customerQuote.city || '',
    state: customerQuote.state || '',
    zip_code: customerQuote.zip_code || '',
    selected_services: services,
    exact_square_footage: customerQuote.exact_square_footage || null,
    exact_lot_size: customerQuote.exact_lot_size || null,
    exact_stories: customerQuote.exact_stories || null,
    square_footage: customerQuote.square_footage || '',
    lot_size: customerQuote.lot_size || '',
    stories: customerQuote.stories || '',
    property_data_source: customerQuote.property_data_source || '',
    bundle_type: 'Single Service',
  }

  const { data: newQuote, error: quoteError } = await db
    .from('quote_requests')
    .insert(quoteRequest)
    .select('id, quote_id')
    .single()

  if (quoteError) {
    console.error('[HealthCheck] Error creating quote:', quoteError)
    throw quoteError
  }

  // Create line items for each service
  for (const service of services) {
    const { error: lineError } = await db
      .from('quote_line_items')
      .insert({
        quote_request_id: newQuote.id,
        service,
        name: service,
        service_selected: true,
      })

    if (lineError) {
      console.error(`[HealthCheck] Error creating line item for ${service}:`, lineError)
    }
  }

  return newQuote.quote_id
}

export async function getHealthCheckReport(reportId) {
  const db = getDb()

  const { data, error } = await db
    .from('health_check_reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (error) {
    console.error('[HealthCheck] Error fetching report:', error)
    throw error
  }

  // Count ratings
  const { data: items } = await db
    .from('health_check_items')
    .select('rating')
    .eq('report_id', reportId)

  const counts = { Good: 0, Fair: 0, 'Needs Attention': 0 }
  if (items) {
    items.forEach(i => {
      if (counts[i.rating] !== undefined) counts[i.rating]++
    })
  }

  return {
    id: data.id,
    customerName: data.customer_name,
    address: data.address,
    techName: data.tech_name,
    inspectionDate: data.inspection_date,
    notes: data.notes,
    overallRating: data.overall_rating,
    priorityItems: data.priority_items,
    servicesRecommended: data.services_recommended,
    customerPhone: data.customer_phone,
    reportSent: data.report_sent,
    quoteLink: data.quote_link || '',
    totalGood: counts['Good'],
    totalFair: counts['Fair'],
    totalNeedsAttention: counts['Needs Attention'],
  }
}

export async function getHealthCheckItems(reportId) {
  const db = getDb()

  const { data, error } = await db
    .from('health_check_items')
    .select('*')
    .eq('report_id', reportId)
    .order('item_number', { ascending: true })

  if (error) {
    console.error('[HealthCheck] Error fetching items:', error)
    throw error
  }

  return data.map(i => ({
    id: i.id,
    itemNumber: i.item_number,
    section: i.section,
    itemName: i.item_name,
    rating: i.rating,
    notes: i.notes,
  }))
}
