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
        // Fetch report data
        const reportRes = await fetch(`/api/reports/${reportId}`);
        if (!reportRes.ok) throw new Error('Report not found');
        const reportData = await reportRes.json();
        setReport(reportData);

        // Fetch task results
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
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading your report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Report not found</div>
      </div>
    );
  }

  // Filter tasks to show only Monitor, Repair Soon, and Urgent
  const priorityTasks = tasks.filter(task => 
    task.status === 'Monitor' || task.status === 'Repair Soon' || task.status === 'Urgent'
  );

  // Group tasks by section
  const tasksBySection = priorityTasks.reduce((acc, task) => {
    if (!acc[task.section]) acc[task.section] = [];
    acc[task.section].push(task);
    return acc;
  }, {});

  const getStatusClass = (status) => {
    if (status === 'Good') return 'status-good';
    if (status === 'Monitor') return 'status-monitor';
    if (status === 'Repair Soon') return 'status-repair-soon';
    if (status === 'Urgent') return 'status-urgent';
    return '';
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--brand-navy)' }}>
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

      {/* Summary Stats */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
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

      {/* Priority Items */}
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: 'var(--brand-navy)' }}>
            Items Requiring Attention
          </h2>

          {Object.entries(tasksBySection).map(([section, sectionTasks]) => (
            <div key={section} className="card">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--brand-navy)' }}>
                {section}
              </h3>
              
              {sectionTasks.map(task => (
                <div key={task.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                        #{task.taskNumber}: {task.taskName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        {task.taskDescription}
                      </div>
                    </div>
                    <span className={getStatusClass(task.status)} style={{ marginLeft: '12px', flexShrink: 0 }}>
                      {task.status}
                    </span>
                  </div>
                  
                  {task.notes && (
                    <div style={{ 
                      background: '#f9fafb', 
                      padding: '12px', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}>
                      <strong>Technician Notes:</strong> {task.notes}
                    </div>
                  )}

                  {task.actionType !== 'None' && (
                    <div style={{ marginTop: '12px' }}>
                      <button 
                        className="button"
                        onClick={() => window.location.href = task.actionLink}
                        style={{ fontSize: '14px', padding: '8px 16px' }}
                      >
                        {task.actionText || 'Take Action'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#999', fontSize: '14px' }}>
        <p>Questions about your report? Contact us at support@handldhome.com</p>
        <p style={{ marginTop: '8px' }}>
          Inspected by: {report.technicianName}
        </p>
      </div>
    </div>
  );
}
