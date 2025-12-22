import { getReport, getTaskResults } from '@/lib/airtable-tuneup';
import ReportClient from './ReportClient';
import '../../globals.css';

export default async function ReportPage({ params }) {
  const { id } = params;

  try {
    // Fetch data server-side
    const report = await getReport(id);
    const tasks = await getTaskResults(id);

    // Pass data to client component
    return <ReportClient report={report} tasks={tasks} />;
  } catch (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#ef4444' }}>
            Error: {error.message}
          </div>
        </div>
      </div>
    );
  }
}
