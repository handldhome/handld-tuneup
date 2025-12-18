'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../globals.css';

// Marketing-focused task details
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

// Service mapping for action buttons
const SERVICE_ACTIONS = {
  "Gutter & Downspout Flow": { service: "Gutter Cleaning", link: "https://handldhome.com/services/gutter-cleaning" },
  "Foundation Perimeter Inspection": { service: "Foundation Repair Referral", link: "https://handldhome.com/services/foundation-repair" },
  "Exterior Wall Integrity": { service: "Stucco/Siding Repair", link: "https://handldhome.com/services/exterior-repair" },
  "Home Exterior & Roof": { service: "Pressure Washing", link: "https://handldhome.com/services/pressure-washing" },
  "Walkway & Driveway Surface": { service: "Pressure Washing", link: "https://handldhome.com/services/pressure-washing" },
  "Exterior Security Lighting": { service: "Lighting Installation", link: "https://handldhome.com/services/electrical" },
  "Window & Door Weatherstripping": { service: "Weatherstripping Service", link: "https://handldhome.com/services/weatherstripping" },
  "Garage Door Safety Sensor": { service: "Garage Door Repair", link: "https://handldhome.com/services/garage-door" },
  "Electrical Panel Visual Inspection": { service: "Panel Labeling Service", link: "https://handldhome.com/services/electrical" },
  "Outlet & Switch Safety": { service: "Electrical Repair", link: "https://handldhome.com/services/electrical" },
  "GFCI Outlet Protection": { service: "GFCI Installation", link: "https://handldhome.com/services/electrical" },
  "Light Bulb Energy Efficiency": { service: "LED Conversion", link: "https://handldhome.com/services/lighting" },
  "Water Heater Condition & Age": { service: "Water Heater Replacement", link: "https://handldhome.com/services/plumbing" },
  "Under-Sink Leak Detection": { service: "Leak Repair", link: "https://handldhome.com/services/plumbing" },
  "Faucet & Fixture Efficiency": { service: "Faucet Repair", link: "https://handldhome.com/services/plumbing" },
  "Toilet Water Loss Prevention": { service: "Toilet Repair", link: "https://handldhome.com/services/plumbing" },
  "Shower Head Performance": { service: "Shower Head Replacement", link: "https://handldhome.com/services/plumbing" },
  "Water Filter Status": { service: "Filter Replacement", link: "https://handldhome.com/services/plumbing" },
  "Garbage Disposal Function": { service: "Disposal Repair", link: "https://handldhome.com/services/plumbing" },
  "Dishwasher Filter & Seal": { service: "Appliance Service", link: "https://handldhome.com/services/appliances" },
  "Kitchen Exhaust Grease Buildup": { service: "Hood Cleaning", link: "https://handldhome.com/services/cleaning" },
  "HVAC Filter Condition": { service: "Filter Replacement", link: "https://handldhome.com/services/hvac" },
  "HVAC System Age & Early Warning": { service: "HVAC Maintenance", link: "https://handldhome.com/services/hvac" },
  "Dryer Vent Fire Prevention": { service: "Dryer Vent Cleaning", link: "https://handldhome.com/services/dryer-vent" },
  "Attic Insulation Visual Check": { service: "Insulation Service", link: "https://handldhome.com/services/insulation" },
  "Ventilation & Moisture": { service: "Ventilation Repair", link: "https://handldhome.com/services/hvac" },
  "Smoke Detector Functionality": { service: "Detector Replacement", link: "https://handldhome.com/services/safety" },
  "Carbon Monoxide Detector Check": { service: "CO Detector Installation", link: "https://handldhome.com/services/safety" },
  "Stairway Safety & Lighting": { service: "Safety Upgrades", link: "https://handldhome.com/services/handyman" },
  "Trip Hazard Scan": { service: "Handyman Service", link: "https://handldhome.com/services/handyman" },
  "Door Lock & Deadbolt Function": { service: "Lock Service", link: "https://handldhome.com/services/handyman" },
};

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

  const generatePunchList = () => {
    const priorityTasks = tasks.filter(task => 
      task.status !== 'Good'
    );

    let pdfContent = `HANDYMAN PUNCH LIST
${report.customerName}
${report.address}, ${report.city}
Inspection Date: ${new Date(report.dateCompleted).toLocaleDateString()}

ITEMS REQUIRING ATTENTION:
`;

    priorityTasks.forEach(task => {
      pdfContent += `
[${task.status.toUpperCase()}] ${task.taskName}
${task.taskDescription}
${task.notes ? `Notes: ${task.notes}` : ''}
---
`;
    });

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Handld-Punch-List-${report.customerName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  const getStatusBgColor = (status) => {
    if (status === 'Monitor') return '#dbeafe';
    if (status === 'Repair Soon') return '#fef3c7';
    if (status === 'Urgent') return '#fee2e2';
    return '#d1fae5';
  };

  const getStatusExplanation = (status) => {
    if (status === 'Good') return 'Everything looks great!';
    if (status === 'Monitor') return 'Keep an eye on these';
    if (status === 'Repair Soon') return 'Address in 2-3 months';
    if (status === 'Urgent') return 'Needs immediate attention';
    return '';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '220px', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', color: '#2A54A1' }}>
            Handld Home TuneUp
          </h1>
          <div style={{ fontSize: '20px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
            {report.customerName}
          </div>
          <div style={{ fontSize: '16px', color: '#999' }}>
            {report.address}, {report.city}
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
            Completed: {new Date(report.dateCompleted).toLocaleDateString()}
          </div>
        </div>

        {/* Summary Stats - Enhanced */}
        <div className="card" style={{ 
          background: 'white',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #2A54A1'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#2A54A1', textAlign: 'center' }}>
            Inspection Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#d1fae5', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>{report.totalGood}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669', marginBottom: '4px' }}>Good</div>
              <div style={{ fontSize: '12px', color: '#047857' }}>Everything looks great!</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#dbeafe', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6' }}>{report.totalMonitor}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>Monitor</div>
              <div style={{ fontSize: '12px', color: '#1d4ed8' }}>Keep an eye on these</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#fef3c7', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b' }}>{report.totalRepairSoon}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#d97706', marginBottom: '4px' }}>Repair Soon</div>
              <div style={{ fontSize: '12px', color: '#b45309' }}>Address in 2-3 months</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#fee2e2', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>{report.totalUrgent}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>Urgent</div>
              <div style={{ fontSize: '12px', color: '#b91c1c' }}>Needs immediate attention</div>
            </div>
          </div>
        </div>

        {/* Priority Items */}
        {priorityTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✓</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '12px' }}>
              All Systems Good!
            </h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              No priority items found. Your home is in great shape!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2A54A1' }}>
                Items Requiring Attention
              </h2>
              <button
                onClick={generatePunchList}
                style={{
                  background: '#2A54A1',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                📋 Download Punch List
              </button>
            </div>

            {Object.entries(tasksBySection).map(([section, sectionTasks]) => (
              <div key={section} className="card" style={{ marginBottom: '24px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3 style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  marginBottom: '20px', 
                  color: '#2A54A1', 
                  borderBottom: '3px solid #2A54A1', 
                  paddingBottom: '12px' 
                }}>
                  {section}
                </h3>
                
                {sectionTasks.map(task => {
                  const serviceAction = SERVICE_ACTIONS[task.taskName];
                  
                  return (
                    <div key={task.id} style={{ 
                      marginBottom: '24px', 
                      paddingBottom: '24px', 
                      borderBottom: '2px solid #e5e7eb',
                      background: getStatusBgColor(task.status),
                      padding: '20px',
                      borderRadius: '12px',
                      borderLeft: `6px solid ${getStatusColor(task.status)}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
                            #{task.taskNumber}: {task.taskName}
                          </div>
                          <div style={{ fontSize: '15px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.6' }}>
                            {TASK_DETAILS[task.taskNumber] || task.taskDescription}
                          </div>
                        </div>
                        <span style={{ 
                          marginLeft: '16px', 
                          flexShrink: 0,
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '700',
                          background: getStatusColor(task.status),
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.notes && (
                        <div style={{ 
                          background: 'white', 
                          padding: '16px', 
                          borderRadius: '8px',
                          fontSize: '14px',
                          marginTop: '12px',
                          border: '1px solid #d1d5db',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          <strong style={{ color: '#2A54A1' }}>Technician Notes:</strong> {task.notes}
                        </div>
                      )}

                      {serviceAction && (
                        <div style={{ marginTop: '16px' }}>
                          
                            href={serviceAction.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-block',
                              fontSize: '15px', 
                              padding: '12px 24px',
                              textDecoration: 'none',
                              background: '#2A54A1',
                              color: 'white',
                              borderRadius: '8px',
                              fontWeight: '700',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s'
                            }}>
                            🛠️ Get {serviceAction.service} Handld
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Section Notes */}
                {report.sectionNotes && report.sectionNotes[section] && (
                  <div style={{ 
                    background: '#eff6ff', 
                    border: '2px solid #2A54A1',
                    padding: '20px', 
                    borderRadius: '12px',
                    marginTop: '20px'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#2A54A1' }}>
                      💡 Additional Notes for {section}
                    </div>
                    <div style={{ fontSize: '15px', color: '#1e40af', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                      {report.sectionNotes[section]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* All Tasks Grid */}
        <div className="card" style={{ marginTop: '40px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#2A54A1', textAlign: 'center' }}>
            Complete 31-Point Inspection Checklist
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {tasks.sort((a, b) => a.taskNumber - b.taskNumber).map(task => (
              <div 
                key={task.id} 
                style={{ 
                  padding: '12px',
                  background: getStatusBgColor(task.status),
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getStatusColor(task.status)}`,
                  fontSize: '13px'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                  #{task.taskNumber}: {task.taskName}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: getStatusColor(task.status),
                  color: 'white'
                }}>
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="card" style={{ background: '#2A54A1', color: 'white', textAlign: 'center', marginTop: '40px', padding: '40px 30px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
            Questions About Your Report?
          </h3>
          <p style={{ marginBottom: '24px', opacity: 0.95, fontSize: '16px', lineHeight: '1.6' }}>
            Our team is here to help you maintain a safe and healthy home. Schedule services or get expert advice.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            
              href="mailto:support@handldhome.com"
              style={{ 
                background: 'white',
                color: '#2A54A1',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px 32px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
            >
              📧 Contact Us
            </a>
            
              href="https://handldhome.com/services"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                background: '#10b981',
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px 32px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
            >
              🛠️ Book Services
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          paddingTop: '24px', 
          borderTop: '2px solid #e5e7eb', 
          color: '#999', 
          fontSize: '14px',
          paddingBottom: '40px'
        }}>
          <p style={{ marginBottom: '8px' }}>
            Inspected by: <strong style={{ color: '#2A54A1' }}>{report.technicianName}</strong>
          </p>
          <p>
            © {new Date().getFullYear()} Handld Home Services | Keeping Your Home Safe & Sound
          </p>
        </div>
      </div>
    </div>
  );
}
