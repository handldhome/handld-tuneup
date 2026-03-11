// API endpoint to fetch job data for pre-populating the tuneup form
import { getJobForTuneup } from '../../../../lib/db'

export async function GET(request, { params }) {
  try {
    const { jobId } = await params

    if (!jobId) {
      return Response.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const job = await getJobForTuneup(jobId)

    return Response.json(job)
  } catch (error) {
    console.error('[API] Error fetching job for tuneup:', error)
    return Response.json(
      { error: 'Failed to fetch job', details: error.message },
      { status: 500 }
    )
  }
}
