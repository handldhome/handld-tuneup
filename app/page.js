'use client';

import { useState, useEffect } from 'react';
import './globals.css';

const TASKS = [
  { number: 1, section: "Exterior & Curb Appeal", name: "Gutter & Downspout Flow", description: "Check gutters for clogs and verify downspouts direct water 6+ feet from foundation" },
  { number: 2, section: "Exterior & Curb Appeal", name: "Foundation Perimeter Inspection", description: "Inspect foundation for cracks or water pooling" },
  { number: 3, section: "Exterior & Curb Appeal", name: "Exterior Wall Integrity", description: "Check stucco/siding for cracks, holes, or deterioration" },
  { number: 4, section: "Exterior & Curb Appeal", name: "Window & Door Weatherstripping", description: "Inspect weatherstripping around all exterior doors and windows" },
  { number: 5, section: "Exterior & Curb Appeal", name: "Walkway & Driveway Surface", description: "Check for algae, mildew or staining that creates slip hazards" },
  { number: 6, section: "Exterior & Curb Appeal", name: "Home Exterior Surface Cleanliness", description: "Inspect siding/stucco for dirt, algae, or mildew buildup" },
  { number: 7, section: "Electrical Systems", name: "GFCI Outlet Protection Test", description: "Test all GFCI outlets (kitchens, bathrooms, garage, exterior)" },
  { number: 8, section: "Electrical Systems", name: "Outlet & Switch Safety Check", description: "Inspect outlets/switches for loose connections or damage" },
  { number: 9, section: "Electrical Systems", name: "Electrical Panel Visual Inspection", description: "Check panel for rust, moisture, or burning smell" },
  { number: 10, section: "Electrical Systems", name: "Exterior Security Lighting Test", description: "Test outdoor lighting to ensure proper illumination" },
  { number: 11, section: "Plumbing & Water Systems", name: "Water Heater Condition & Age", description: "Inspect water heater for age and visible issues" },
  { number: 12, section: "Plumbing & Water Systems", name: "Under-Sink Leak Detection", description: "Check all sink cabinets for moisture or leaks" },
  { number: 13, section: "Plumbing & Water Systems", name: "Faucet & Fixture Efficiency", description: "Test all faucets for drips or low water pressure" },
  { number: 14, section: "Plumbing & Water Systems", name: "Toilet Water Loss Prevention", description: "Check for phantom flushes or running water" },
  { number: 15, section: "Plumbing & Water Systems", name: "Shower Head Performance", description: "Inspect shower heads for clogs or mineral buildup" },
  { number: 16, section: "Plumbing & Water Systems", name: "Main Water Shut-Off Accessibility", description: "Locate and test main shut-off valve" },
  { number: 17, section: "HVAC & Air Quality", name: "HVAC Filter Condition & Age", description: "Check filter condition and unusual system age" },
  { number: 18, section: "HVAC & Air Quality", name: "HVAC System Age & Early Warning", description: "Note system age and unusual noises" },
  { number: 19, section: "HVAC & Air Quality", name: "Dryer Vent Fire Prevention", description: "Inspect dryer vent for lint buildup" },
  { number: 20, section: "HVAC & Air Quality", name: "Kitchen Exhaust Grease Buildup", description: "Check range hood filter for grease accumulation" },
  { number: 21, section: "HVAC & Air Quality", name: "Indoor Air Quality Assessment", description: "Check for musty odors, visible mold" },
  { number: 22, section: "Safety Systems", name: "Smoke Detector Functionality", description: "Test all smoke detectors to ensure they work" },
  { number: 23, section: "Safety Systems", name: "Carbon Monoxide Detector Check", description: "Test CO detectors near bedrooms and gas appliances" },
  { number: 24, section: "Safety Systems", name: "Stairway Safety & Lighting", description: "Check stair lighting and railing stability" },
  { number: 25, section: "Safety Systems", name: "Trip Hazard Scan", description: "Look for loose rugs, cords, or uneven flooring" },
  { number: 26, section: "Safety Systems", name: "Garage Door Safety Sensor", description: "Test auto-reverse safety mechanism" },
  { number: 27, section: "Energy & Efficiency", name: "Window & Door Draft Check", description: "Feel for air leaks around windows and doors" },
  { number: 28, section: "Energy & Efficiency", name: "Attic Insulation Visual Check", description: "Inspect attic for adequate insulation coverage" },
  { number: 29, section: "Energy & Efficiency", name: "Thermostat Accuracy", description: "Verify thermostat displays accurate temperature" },
  { number: 30, section: "Energy & Efficiency", name: "Light Bulb Energy Efficiency", description: "Note which bulbs could be upgraded to LED" },
];

export default function TechnicianForm() {
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    address: '',
    city: 'Pasadena',
    technicianName: '',
  });

  const [taskStatuses, setTaskStatuses] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (taskNumber, status) => {
    setTaskStatuses(prev => ({ ...prev, [taskNumber]: status }));
  };

  const handleNotesChange = (taskNumber, notes) => {
    setTaskNotes(prev => ({ ...prev, [taskNumber]: notes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare task results
      const taskResults = TASKS.map(task => ({
        taskNumber: task.number,
        section: task.section,
        taskName: task.name,
        taskDescription: task.description,
        status: taskStatuses[task.number] || 'Good',
        notes: taskNotes[task.number] || '',
        actionType: 'none',
        actionLink: '',
        actionText: '',
      }));

      // Submit to API
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportData: {
            ...customerInfo,
            dateCompleted: new Date().toISOString().split('T')[0],
            status: 'Draft',
          },
          taskResults,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setCustomerInfo({
          customerName: '',
          customerEmail: '',
          address: '',
          city: 'Pasadena',
          technicianName: '',
        });
        setTaskStatuses({});
        setTaskNotes({});
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Group tasks by section
  const tasksBySection = TASKS.reduce((acc, task) => {
    if (!acc[task.section]) acc[task.section] = [];
    acc[task.section].push(task);
    return acc;
  }, {});

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--brand-navy)' }}>
        Home TuneUp Check
      </h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Complete the 30-point inspection
      </p>

      {success && (
        <div style={{ 
          background: '#10b981', 
          color: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          ✓ Report created successfully!
        </div>
      )}

      {error && (
        <div style={{ 
          background: '#ef4444', 
          color: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Customer Information
          </h2>
          
          <input
            type="text"
            className="input"
            placeholder="Customer Name *"
            value={customerInfo.customerName}
            onChange={(e) => handleCustomerInfoChange('customerName', e.target.value)}
            required
          />
          
          <input
            type="email"
            className="input"
            placeholder="Customer Email *"
            value={customerInfo.customerEmail}
            onChange={(e) => handleCustomerInfoChange('customerEmail', e.target.value)}
            required
          />
          
          <input
            type="text"
            className="input"
            placeholder="Address *"
            value={customerInfo.address}
            onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
            required
          />
          
          <input
            type="text"
            className="input"
            placeholder="City"
            value={customerInfo.city}
            onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
          />
          
          <input
            type="text"
            className="input"
            placeholder="Technician Name *"
            value={customerInfo.technicianName}
            onChange={(e) => handleCustomerInfoChange('technicianName', e.target.value)}
            required
          />
        </div>

        {/* Tasks by Section */}
        {Object.entries(tasksBySection).map(([section, tasks]) => (
          <div key={section} className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--brand-navy)' }}>
              {section}
            </h2>
            
            {tasks.map(task => (
              <div key={task.number} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>#{task.number}: {task.name}</strong>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  {task.description}
                </div>
                
                <select
                  className="select"
                  value={taskStatuses[task.number] || 'Good'}
                  onChange={(e) => handleStatusChange(task.number, e.target.value)}
                  style={{ marginBottom: '8px' }}
                >
                  <option value="Good">✓ Good</option>
                  <option value="Monitor">○ Monitor</option>
                  <option value="Repair Soon">⚠ Repair Soon</option>
                  <option value="Urgent">✕ Urgent</option>
                </select>
                
                <textarea
                  className="textarea"
                  placeholder="Notes (optional)"
                  value={taskNotes[task.number] || ''}
                  onChange={(e) => handleNotesChange(task.number, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="button"
          disabled={submitting}
          style={{ width: '100%', padding: '16px', fontSize: '18px' }}
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
