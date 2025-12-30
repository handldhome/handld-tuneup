'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../globals.css';

const TASK_DETAILS = {
  1: "Clogged gutters can cause water damage to your foundation, leading to costly repairs. We ensure proper drainage to protect your home's structural integrity.",
  2: "Foundation issues can escalate quickly. Early detection of cracks or water pooling can save thousands in repair costs.",
  3: "Small cracks in stucco or siding allow moisture and pests to enter your home. Address these early to prevent major damage.",
  4: "Algae and mildew don't just look bad—they can deteriorate your home's exterior and reduce curb appeal and property value.",
  5: "Slippery walkways are a liability risk. Keep your family and guests safe with clean, slip-free surfaces.",
  6: "Proper outdoor lighting deters intruders and prevents accidents. Well-lit exteriors keep your home safe and welcoming.",
  7: "Air leaks around doors and windows waste energy and money. Good weatherstripping keeps your home comfortable year-round.",
  8: "A malfunctioning garage door sensor is a serious safety hazard. Ensure your family's safety with a properly functioning system.",
  9: "Unlabeled electrical panels waste time during emergencies. Proper labeling ensures quick, safe power shutoffs when needed.",
  10: "Faulty outlets are fire hazards. Warm or sparking outlets should be addressed immediately to protect your home.",
  11: "GFCI outlets prevent electrical shocks in wet areas. Non-functioning GFCIs put your family at serious risk.",
  12: "LED bulbs use 75% less energy and last 25x longer than incandescent bulbs. Save money while helping the environment.",
  13: "Water heaters typically last 8-12 years. Knowing yours is aging helps you plan for replacement before it fails catastrophically.",
  14: "Hidden leaks under sinks cause mold, rot, and water damage. Early detection prevents expensive repairs and health issues.",
  15: "Dripping faucets waste thousands of gallons annually. Fix them to reduce your water bill and environmental impact.",
  16: "Running toilets can waste 200 gallons per day. That's money literally going down the drain.",
  17: "Mineral buildup reduces water pressure and efficiency. Clean shower heads provide better showers and lower water bills.",
  18: "Old filters reduce water quality and appliance efficiency. Fresh filters mean cleaner water and longer-lasting appliances.",
  19: "Malfunctioning disposals can cause clogs, leaks, and kitchen disruptions. Keep your kitchen running smoothly.",
  20: "Dirty dishwasher filters reduce cleaning performance and can cause odors. Regular cleaning extends your appliance's life.",
  21: "Grease buildup in range hoods is a fire hazard. Regular cleaning protects your home and improves air quality.",
  22: "Dirty HVAC filters reduce efficiency by 15% and increase energy costs. Clean filters mean lower bills and better air quality.",
  23: "HVAC systems last 15-20 years. Knowing yours is aging helps you budget for replacement and avoid emergency failures.",
  24: "Clogged dryer vents cause 15,000 house fires annually. This simple maintenance could save your home and family.",
  25: "Poor attic insulation wastes energy and money. Proper insulation can reduce heating/cooling costs by 20%.",
  26: "Poor ventilation leads to mold, mildew, and moisture damage. Good airflow protects your home's structure and air quality.",
  27: "Smoke detectors save lives but expire after 10 years. Regular testing and replacement ensures your family's safety.",
  28: "CO poisoning kills hundreds annually. Working detectors are your only early warning against this silent killer.",
  29: "Stairway falls are a leading cause of home injuries. Proper lighting and stable railings prevent accidents.",
  30: "Trip hazards cause thousands of preventable injuries yearly. Simple fixes keep your family safe.",
  31: "Sticking locks can fail completely during emergencies. Smooth-operating locks ensure your home's security.",
};

const SERVICE_ACTIONS = {
  "Gutter & Downspout Flow": { service: "Gutter Cleaning", link: "#", type: "Handld" },
  "Foundation Perimeter Inspection": { service: "Foundation Repair Referral", link: "#", type: "Referral" },
  "Exterior Wall Integrity": { service: "Stucco/Siding Repair", link: "#", type: "Handld" },
  "Home Exterior & Roof": { service: "Pressure Washing", link: "#", type: "Handld" },
  "Walkway & Driveway Surface": { service: "Pressure Washing", link: "#", type: "Handld" },
  "Exterior Security Lighting": { service: "Lighting Installation", link: "#", type: "Handld" },
  "Window & Door Weatherstripping": { service: "Weatherstripping Service", link: "#", type: "Handld" },
  "Garage Door Safety Sensor": { service: "Garage Door Repair", link: "#", type: "Referral" },
  "Electrical Panel Visual Inspection": { service: "Panel Labeling Service", link: "#", type: "Handld" },
  "Outlet & Switch Safety": { service: "Electrical Repair", link: "#", type: "Handld" },
  "GFCI Outlet Protection": { service: "GFCI Installation", link: "#", type: "Handld" },
  "Light Bulb Energy Efficiency": { service: "LED Conversion", link: "#", type: "Handld" },
  "Water Heater Condition & Age": { service: "Water Heater Replacement", link: "#", type: "Referral" },
  "Under-Sink Leak Detection": { service: "Leak Repair", link: "#", type: "Handld" },
  "Faucet & Fixture Efficiency": { service: "Faucet Repair", link: "#", type: "Handld" },
  "Toilet Water Loss Prevention": { service: "Toilet Repair", link: "#", type: "Handld" },
  "Shower Head Performance": { service: "Shower Head Replacement", link: "#", type: "Handld" },
  "Water Filter Status": { service: "Filter Replacement", link: "#", type: "Handld" },
  "Garbage Disposal Function": { service: "Disposal Repair", link: "#", type: "Handld" },
  "Dishwasher Filter & Seal": { service: "Appliance Service", link: "#", type: "Referral" },
  "Kitchen Exhaust Grease Buildup": { service: "Hood Cleaning", link: "#", type: "Handld" },
  "HVAC Filter Condition": { service: "Filter Replacement", link: "#", type: "Handld" },
  "HVAC System Age & Early Warning": { service: "HVAC Maintenance", link: "#", type: "Referral" },
  "Dryer Vent Fire Prevention": { service: "Dryer Vent Cleaning", link: "#", type: "Handld" },
  "Attic Insulation Visual Check": { service: "Insulation Service", link: "#", type: "Referral" },
  "Ventilation & Moisture": { service: "Ventilation Repair", link: "#", type: "Handld" },
  "Smoke Detector Functionality": { service: "Detector Replacement", link: "#", type: "Handld" },
  "Carbon Monoxide Detector Check": { service: "CO Detector Installation", link: "#", type: "Handld" },
  "Stairway Safety & Lighting": { service: "Safety Upgrades", link: "#", type: "Handld" },
  "Trip Hazard Scan": { service: "Handyman Service", link: "#", type: "Handld" },
  "Door Lock & Deadbolt Function": { service: "Lock Service", link: "#", type: "Handld" },
};

export default function ReportViewer() {
  const params = useParams();
  const reportId = params?.id;
  
  const [report, setReport] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const generatePunchList = () => {
    const priorityTasks = tasks.filter(task => 
      task.status === 'Repair Soon' || task.status === 'Urgent'
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Handyman Punch List - ${report.customerName}</title>
  <style>
    @media print {
      @page { margin: 0.5in; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #FBF7F0;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2A54A1;
    }
    .logo {
      width: 200px;
      margin-bottom: 20px;
    }
    h1 {
      color: #2A54A1;
      font-size: 32px;
      margin: 0 0 10px 0;
    }
    .info {
      color: #666;
      font-size: 14px;
      margin: 5px 0;
    }
    .task {
      background: white;
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 8px;
      border-left: 5px solid #f59e0b;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .task.urgent {
      border-left-color: #ef4444;
    }
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
    .task-title {
      font-weight: bold;
      font-size: 18px;
      color: #1f2937;
      flex: 1;
    }
    .task-status {
      background: #f59e0b;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 12px;
    }
    .task-status.urgent {
      background: #ef4444;
    }
    .task-notes {
      color: #4b5563;
      font-size: 14px;
      line-height: 1.6;
      margin-top: 8px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="/Handld_Logo_Transparent.png" alt="Handld" class="logo">
    <h1>Handyman Punch List</h1>
    <div class="info">${report.customerName}</div>
    <div class="info">${report.address}, ${report.city}</div>
    <div class="info">Inspection Date: ${new Date(report.dateCompleted).toLocaleDateString()}</div>
  </div>

  ${priorityTasks.map(task => `
    <div class="task ${task.status === 'Urgent' ? 'urgent' : ''}">
      <div class="task-header">
        <div class="task-title">#${task.taskNumber}: ${task.taskName}</div>
        <div class="task-status ${task.status === 'Urgent' ? 'urgent' : ''}">${task.status}</div>
      </div>
      ${task.notes ? `<div class="task-notes"><strong>Notes:</strong> ${task.notes}</div>` : ''}
    </div>
  `).join('')}

  <div class="footer">
    <p>© ${new Date().getFullYear()} Handld Home Services</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

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
    task.status === 'Repair Soon' || task.status === 'Urgent'
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

  const getStatusBgColor = (status) => {
    if (status === 'Monitor') return '#dbeafe';
    if (status === 'Repair Soon') return '#fef3c7';
    if (status === 'Urgent') return '#fee2e2';
    return '#d1fae5';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '16px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
            Handld Home TuneUp
          </h1>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>
            {report.customerName}
          </div>
          <div style={{ fontSize: '15px', color: '#999' }}>
            {report.address}, {report.city}
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
            Completed: {new Date(report.dateCompleted).toLocaleDateString()}
          </div>
        </div>

        <div className="card" style={{ 
          background: 'white',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #2A54A1',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#2A54A1', textAlign: 'center' }}>
            Report Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#d1fae5', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#10b981' }}>{report.totalGood}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#059669', marginBottom: '2px' }}>Good</div>
              <div style={{ fontSize: '11px', color: '#047857' }}>Everything looks great!</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#dbeafe', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#3b82f6' }}>{report.totalMonitor}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#2563eb', marginBottom: '2px' }}>Monitor</div>
              <div style={{ fontSize: '11px', color: '#1d4ed8' }}>Keep an eye on these</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fef3c7', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#f59e0b' }}>{report.totalRepairSoon}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#d97706', marginBottom: '2px' }}>Repair Soon</div>
              <div style={{ fontSize: '11px', color: '#b45309' }}>Address in 2-3 months</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ef4444' }}>{report.totalUrgent}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#dc2626', marginBottom: '2px' }}>Urgent</div>
              <div style={{ fontSize: '11px', color: '#b91c1c' }}>Needs immediate attention</div>
            </div>
          </div>
        </div>

        {priorityTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px 30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>
              All Systems Good!
            </h2>
            <p style={{ color: '#666', fontSize: '15px' }}>
              No urgent or repair-soon items found. Your home is in great shape!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#2A54A1' }}>
                Items Requiring Attention
              </h2>
              <button
                onClick={generatePunchList}
                style={{
                  background: '#2A54A1',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Download Punch List
              </button>
            </div>

            {Object.entries(tasksBySection).map(([section, sectionTasks]) => (
              <div key={section} className="card" style={{ marginBottom: '20px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px', 
                  color: '#2A54A1', 
                  borderBottom: '3px solid #2A54A1', 
                  paddingBottom: '10px' 
                }}>
                  {section}
                </h3>
                
                {sectionTasks.map(task => {
                  const serviceAction = SERVICE_ACTIONS[task.taskName];
                  const isExpanded = expandedTask === task.id;

                  return (
                    <div key={task.id} style={{
                      marginBottom: '20px',
                      paddingBottom: '20px',
                      borderBottom: '2px solid #e5e7eb',
                      background: getStatusBgColor(task.status),
                      padding: '16px',
                      borderRadius: '10px',
                      borderLeft: `5px solid ${getStatusColor(task.status)}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '6px', color: '#1f2937' }}>
                            #{task.taskNumber}: {task.taskName}
                          </div>
                        </div>
                        <span style={{
                          marginLeft: '12px',
                          flexShrink: 0,
                          padding: '5px 14px',
                          borderRadius: '18px',
                          fontSize: '13px',
                          fontWeight: '700',
                          background: getStatusColor(task.status),
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {task.status}
                        </span>
                      </div>

                      {isExpanded && (
                        <>
                          <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '10px', lineHeight: '1.5' }}>
                            {TASK_DETAILS[task.taskNumber] || task.taskDescription}
                          </div>

                          {task.notes && (
                            <div style={{
                              background: 'white',
                              padding: '14px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              marginTop: '10px',
                              border: '1px solid #d1d5db',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                              <strong style={{ color: '#2A54A1' }}>Technician Notes:</strong> {task.notes}
                            </div>
                          )}

                          {mounted && task.photos && task.photos.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#2A54A1', marginBottom: '8px' }}>
                                Photos ({task.photos.length})
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {task.photos.map((photo, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setModalPhoto(photo)}
                                    style={{
                                      width: '80px',
                                      height: '80px',
                                      borderRadius: '8px',
                                      border: '2px solid #2A54A1',
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      padding: '0',
                                      background: 'white',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                  >
                                    <img
                                      src={photo.url}
                                      alt={`Photo ${index + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                          style={{
                            background: 'white',
                            color: '#2A54A1',
                            border: '2px solid #2A54A1',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2A54A1';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#2A54A1';
                          }}
                        >
                          {isExpanded ? '▲ Show Less' : '▼ Show More'}
                        </button>

                        {serviceAction && (
                          <a
                            href={serviceAction.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              padding: '10px 20px',
                              textDecoration: 'none',
                              background: '#2A54A1',
                              color: 'white',
                              borderRadius: '8px',
                              fontWeight: '700',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            {serviceAction.type === 'Handld'
                              ? `--> Get ${serviceAction.service} Handld`
                              : '--> Make an introduction to a trusted vendor'
                            }
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {report.sectionNotes && report.sectionNotes[section] && (
                  <div style={{ 
                    background: '#eff6ff', 
                    border: '2px solid #2A54A1',
                    padding: '16px', 
                    borderRadius: '10px',
                    marginTop: '16px'
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px', color: '#2A54A1' }}>
                      Additional Notes for {section}
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e40af', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                      {report.sectionNotes[section]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div className="card" style={{ marginTop: '32px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#2A54A1', textAlign: 'center' }}>
            Complete 31-Point Inspection Checklist
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px', alignItems: 'start' }}>
            {tasks.sort((a, b) => a.taskNumber - b.taskNumber).map(task => (
              <div 
                key={task.id} 
                style={{ 
                  padding: '10px',
                  background: getStatusBgColor(task.status),
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getStatusColor(task.status)}`,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937', fontSize: '13px' }}>
                  #{task.taskNumber}: {task.taskName}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: getStatusColor(task.status),
                  color: 'white'
                }}>
                  {task.status}
                </div>
                {expandedTask === task.id && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d1d5db' }}>
                    <div style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.4', marginBottom: '6px' }}>
                      {TASK_DETAILS[task.taskNumber] || task.taskDescription}
                    </div>
                    {task.notes && (
                      <div style={{ fontSize: '11px', color: '#2A54A1', fontStyle: 'italic' }}>
                        <strong>Notes:</strong> {task.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: '#2A54A1', color: 'white', textAlign: 'center', marginTop: '32px', padding: '32px 24px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '12px' }}>
            Questions About Your Report?
          </h3>
          <p style={{ marginBottom: '20px', opacity: 0.95, fontSize: '15px', lineHeight: '1.5' }}>
            Our team is here to help you maintain a safe and healthy home. Schedule services or get expert advice.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:support@handldhome.com"
              style={{ 
                background: 'white',
                color: '#2A54A1',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '15px',
                padding: '12px 28px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
            >
              Contact Us
            </a>
            <a
              href="#"
              style={{ 
                background: '#10b981',
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '15px',
                padding: '12px 28px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
            >
              Book Services
            </a>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '2px solid #e5e7eb',
          color: '#999',
          fontSize: '13px',
          paddingBottom: '32px'
        }}>
          <p style={{ marginBottom: '6px' }}>
            Inspected by: <strong style={{ color: '#2A54A1' }}>{report.technicianName}</strong>
          </p>
          <p>
            © {new Date().getFullYear()} Handld Home Services | Keeping Your Home Safe & Sound
          </p>
        </div>
      </div>

      {/* Photo Modal */}
      {mounted && modalPhoto && (
        <div
          onClick={() => setModalPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={() => setModalPhoto(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#2A54A1',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1e3a70'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2A54A1'}
            >
              ×
            </button>
            <img
              src={modalPhoto.url}
              alt="Full size"
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 40px)',
                display: 'block',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
