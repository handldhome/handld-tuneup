'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../globals.css';

export default function ReportViewer() {
  const params = useParams();
  const reportId = params?.id;
  
  const [report, setReport] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      try {
        const reportRes = await fetch(`/api/reports/${reportId}`);
        if (!reportRes.ok) throw new Error('Report not found');
        const reportData = await reportRes.json();
        setReport(reportData);

        const tasksRes = await fetch(`/api/reports/${reportId}/tasks`);
        if (!tasksRes.ok) throw new Error('Tasks not found');
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading your report...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Report not found</div>
        </div>
      </div>
    );
  }

  const priorityTasks = tasks.filter(task => 
    task.status === 'Monitor' || task.status === 'Repair Soon' || task.status === 'Urgent'
  );

  const tasksBySection = priorityTasks.reduce((acc, task) => {
    if (!acc[task.section]) acc[task.section] = [];
    acc[task.section].push(task);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    if (status === 'Monitor') return '#3b82f6';
    if (status === 'Repair Soon') return '#f59e0b';
    if (status === 'Urgent') return '#ef4444';
    return '#10b981';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
            Home Safety & Wellness Check
          </h1>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '4px' }}>
            {report.customerName}
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            {report.address}, {report.city}
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Completed: {new Date(report.dateCompleted).toLocaleDateString()}
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #2A54A1 0%, #1e3a8a 100%)', color: 'white', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Inspection Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{report.totalGood}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Good</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{report.totalMonitor}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Monitor</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{report.totalRepairSoon}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Repair Soon</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{report.totalUrgent}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Urgent</div>
            </div>
          </div>
        </div>

        {priorityTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              All Systems Good!
            </h2>
            <p style={{ color: '#666' }}>
              No priority items found. Your home is in great shape!
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: '#2A54A1' }}>
              Items Requiring Attention
            </h2>

            {Object.entries(tasksBySection).map(([section, sectionTasks]) => (
              <div key={section} className="card" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#2A54A1', borderBottom: '2px solid #2A54A1', paddingBottom: '8px' }}>
                  {section}
                </h3>
                
                {sectionTasks.map(task => (
                  <div key={task.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                          {task.taskName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          {task.taskDescription}
                        </div>
                      </div>
                      <span style={{ 
                        marginLeft: '12px', 
                        flexShrink: 0,
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: getStatusColor(task.status),
                        color: 'white'
                      }}>
                        {task.status}
                      </span>
                    </div>
                    
                    {task.notes && (
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '12px', 
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginTop: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <strong>Technician Notes:</strong> {task.notes}
                      </div>
                    )}
                  </div>
                ))}

                {report.sectionNotes && report.sectionNotes[section] && (
                  <div style={{ 
                    background: '#f0f9ff', 
                    border: '2px solid #2A54A1',
                    padding: '16px', 
                    borderRadius: '8px',
                    marginTop: '16px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
                      Additional Notes for {section}
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e40af', whiteSpace: 'pre-line' }}>
                      {report.sectionNotes[section]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div className="card" style={{ background: '#2A54A1', color: 'white', textAlign: 'center', marginTop: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            Questions About Your Report?
          </h3>
          <p style={{ marginBottom: '16px', opacity: 0.9 }}>
            Our team is here to help you maintain a safe and healthy home.
          </p>
          <a
            href="mailto:support@handldhome.com"
            style={{ 
              background: 'white',
              color: '#2A54A1',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '8px'
            }}
          >
            Contact Handld Home
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', color: '#999', fontSize: '14px' }}>
          <p>Inspected by: {report.technicianName}</p>
          <p style={{ marginTop: '8px' }}>
            © {new Date().getFullYear()} Handld Home Services
          </p>
        </div>
      </div>
    </div>
  );
}
