// lib/cleanNotes.js
// Uses Claude to clean up technician notes into professional language

import Anthropic from '@anthropic-ai/sdk'

let _client = null

function getClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

/**
 * Takes an array of health check items with raw tech notes
 * and returns the same array with cleaned-up notes.
 * Only processes items that have notes.
 */
export async function cleanUpNotes(items) {
  const itemsWithNotes = items.filter(item => item.notes && item.notes.trim())

  if (itemsWithNotes.length === 0) return items

  // Build a single prompt with all notes to minimize API calls
  const notesPayload = itemsWithNotes.map(item => ({
    number: item.number,
    name: item.name,
    rating: item.rating,
    notes: item.notes,
  }))

  try {
    const client = getClient()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are editing technician notes for a home inspection report that will be sent to a homeowner. Clean up each note to be professional, clear, and concise. Keep the same meaning and technical details — just improve grammar, spelling, and tone. Write in third person (e.g. "The faucet shows signs of..." not "I noticed the faucet..."). Keep each note to 1-2 sentences max. Do not add information that wasn't in the original note.

Return ONLY a JSON array with objects containing "number" and "notes" fields. No other text.

Here are the notes to clean up:
${JSON.stringify(notesPayload, null, 2)}`,
        },
      ],
    })

    const responseText = message.content[0].text.trim()
    // Parse the JSON response — handle potential markdown code fences
    const jsonStr = responseText.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    const cleanedNotes = JSON.parse(jsonStr)

    // Merge cleaned notes back into original items
    const cleanedMap = new Map()
    cleanedNotes.forEach(cn => cleanedMap.set(cn.number, cn.notes))

    return items.map(item => ({
      ...item,
      notes: cleanedMap.has(item.number) ? cleanedMap.get(item.number) : item.notes,
    }))
  } catch (err) {
    console.error('[CleanNotes] Error cleaning notes, using originals:', err.message)
    // Non-fatal — return original notes if Claude fails
    return items
  }
}
