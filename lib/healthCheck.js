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
  'Driveway, Walkways & Patio Surfaces': ['Pressure Washing \u2013 Driveway & Patio'],
  'Home Exterior & Entry': ['Pressure Washing \u2013 Home Exterior'],
  'Gutters & Downspouts': ['Gutter Cleaning'],
  'Windows - Exterior': ['Window Washing \u2013 Exterior'],
  'Outdoor Surfaces & Furniture': ['Outdoor Furniture Cleaning', 'Trash Bin Cleaning'],
  'Exterior Fixtures & Hardware': ['Handyman Services', 'Electrical Repairs'],
  'Kitchen Plumbing': ['Plumbing Repairs', 'Handyman Services'],
  'Bathroom Plumbing': ['Plumbing Repairs'],
  'Showers & Tubs': ['Handyman Services', 'Plumbing Repairs'],
  'Electrical Panel': ['Handyman Services', 'Electrical Repairs'],
  'Electrical Basics': ['Electrical Repairs', 'Handyman Services'],
  'General Interior Hardware': ['Handyman Services'],
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
