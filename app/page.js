'use client';

import { useState, useEffect } from 'react';
import './globals.css';

const TASKS = [
  // Exterior & Curb Appeal (Start outside)
  { number: 1, section: "Exterior & Curb Appeal", name: "Gutter & Downspout Flow", description: "Check gutters for clogs and verify downspouts direct water 6+ feet from foundation" },
  { number: 2, section: "Exterior & Curb Appeal", name: "Foundation Perimeter Inspection", description: "Inspect foundation for cracks or water pooling" },
  { number: 3, section: "Exterior & Curb Appeal", name: "Exterior Wall Integrity", description: "Check stucco/siding for cracks, holes, or deterioration" },
  { number: 4, section: "Exterior & Curb Appeal", name: "Home Exterior Surface Cleanliness", description: "Inspect siding/stucco for dirt, algae, or mildew buildup" },
  { number: 5, section: "Exterior & Curb Appeal", name: "Walkway & Driveway Surface", description: "Check for algae, mildew or staining that creates slip hazards" },
  { number: 6, section: "Exterior & Curb Appeal", name: "Exterior Security Lighting Test", description: "Test outdoor lighting to ensure proper illumination" },
  { number: 7, section: "Exterior & Curb Appeal", name: "Window & Door Weatherstripping", description: "Inspect weatherstripping around all exterior doors and windows" },
  
  // Electrical Systems (Move inside)
  { number: 8, section: "Electrical Systems", name: "Electrical Panel Visual Inspection", description: "Check panel for rust, moisture, or burning smell" },
  { number: 9, section: "Electrical Systems", name: "GFCI Outlet Protection Test", description: "Test all GFCI outlets (kitchens, bathrooms, garage, exterior)" },
  { number: 10, section: "Electrical Systems", name: "Outlet & Switch Safety Check", description: "Inspect outlets/switches for loose connections or damage" },
  
  // Kitchen & Appliances
  { number: 11, section: "Kitchen & Appliances", name: "Kitchen Exhaust Grease Buildup", description: "Check range hood filter for grease accumulation" },
  { number: 12, section: "Kitchen & Appliances", name: "Light Bulb Energy Efficiency", description: "Note which bulbs could be upgraded to LED" },
  
  // Plumbing & Water Systems (Kitchen sinks, then bathrooms)
  { number: 13, section: "Plumbing & Water Systems", name: "Under-Sink Leak Detection", description: "Check all sink cabinets for moisture or leaks" },
  { number: 14, section: "Plumbing & Water Systems", name: "Faucet & Fixture Efficiency", description: "Test all faucets for drips or low water pressure" },
  { number: 15, section: "Plumbing & Water Systems", name: "Water Heater Condition & Age", description: "Inspect water heater for age and visible issues" },
  { number: 16, section: "Plumbing & Water Systems", name: "Main Water Shut-Off Accessibility", description: "Locate and test main shut-off valve" },
  
  // Bathrooms & Wet Areas
  { number: 17, section: "Bathrooms & Wet Areas", name: "Toilet Water Loss Prevention", description: "Check for phantom flushes or running water" },
  { number: 18, section: "Bathrooms & Wet Areas", name: "Shower Head Performance", description: "Inspect shower heads for clogs or mineral buildup" },
  { number: 19, section: "Bathrooms & Wet Areas", name: "Window & Door Draft Check", description: "Feel for air leaks around windows and doors" },
  
  // HVAC & Air Quality (Throughout home)
  { number: 20, section: "HVAC & Air Quality", name: "HVAC Filter Condition & Age", description: "Check filter condition and unusual system age" },
  { number: 21, section: "HVAC & Air Quality", name: "HVAC System Age & Early Warning", description: "Note system age and unusual noises" },
  { number: 22, section: "HVAC & Air Quality", name: "Thermostat Accuracy", description: "Verify thermostat displays accurate temperature" },
  { number: 23, section: "HVAC & Air Quality", name: "Indoor Air Quality Assessment", description: "Check for musty odors, visible mold" },
  { number: 24, section: "HVAC & Air Quality", name: "Dryer Vent Fire Prevention", description: "Inspect dryer vent for lint buildup" },
  { number: 25, section: "HVAC & Air Quality", name: "Attic Insulation Visual Check", description: "Inspect attic for adequate insulation coverage" },
  
  // Safety Systems (Throughout home)
  { number: 26, section: "Safety Systems", name: "Smoke Detector Functionality", description: "Test all smoke detectors to ensure they work" },
  { number: 27, section: "Safety Systems", name: "Carbon Monoxide Detector Check", description: "Test CO detectors near bedrooms and gas appliances" },
  { number: 28, section: "Safety Systems", name: "Stairway Safety & Lighting", description: "Check stair lighting and railing stability" },
  { number: 29, section: "Safety Systems", name: "Trip Hazard Scan", description: "Look for loose rugs, cords, or uneven flooring" },
  { number: 30, section: "Safety Systems", name: "Garage Door Safety Sensor", description: "Test auto-reverse safety mechanism" },
];

const SECTIONS = [
  "Exterior & Curb Appeal",
  "Electrical Systems",
  "Kitchen & Appliances",
  "Plumbing & Water Systems",
  "Bathrooms & Wet Areas",
  "HVAC & Air Quality",
  "Safety Systems"
];

const TECHNICIAN_OPTIONS = [
  "Benny Sanches",
  "Mike Rodriguez",
  "Carlos Santos",
];

export default function TechnicianForm() {
  const [currentStep, setCurrentStep] = useState('customer-info'); // 'customer-info', 'tasks', 'section-notes', 'review'
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    address: '',
    city: 'Pasadena',
    technicianName: '',
  });

  const [taskStatuses, setTaskStatuses] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [taskPhotos, setTaskPhotos] = useState({});
  const [sectionNotes, setSectionNotes] = useState({});
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentTask = TASKS[currentTaskIndex];
  const isLastTask = currentTaskIndex === TASKS.length - 1;
  const isFirstTask = currentTaskIndex === 0;

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('tasks');
  };

  const handlePhotoUpload = (taskNumber, files) => {
    setTaskPhotos(prev => ({ ...prev, [taskNumber]: files }));
  };

  const handleNextTask = () => {
    const nextTaskIndex = currentTaskIndex + 1;
    
    // Check if we're moving to a new section
    if (nextTaskIndex < TASKS.length) {
      const currentSection = TASKS[currentTaskIndex].section;
      const nextSection = TASKS[nextTaskIndex].section;
      
      if (currentSection !== nextSection) {
        // Moving to new section - show section notes
        const sectionIndex = SECTIONS.indexOf(currentSection);
        setCurrentSectionIndex(sectionIndex);
        setCurrentStep('section-notes');
      } else {
        // Same section - continue to next task
        setCurrentTaskIndex(nextTaskIndex);
      }
    } else {
      // Last task - show final section notes
      const sectionIndex = SECTIONS.indexOf(TASKS[currentTaskIndex].section);
      setCurrentSectionIndex(sectionIndex);
      setCurrentStep('section-notes');
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleSectionNotesSubmit = () => {
    const nextTaskIndex = currentTaskIndex + 1;
    
    if (nextTaskIndex < TASKS.length) {
      setCurrentTaskIndex(nextTaskIndex);
      setCurrentStep('tasks');
    } else {
      // All done - go to review screen
      setCurrentStep('review');
    }
  };

  const handleSubmit = async () => {
    if (submitting) return; // Prevent double submission
    
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
        actionType: (taskStatuses[task.number] === 'Good' || !taskStatuses[task.number]) ? 'None' : 'Handld',
        actionLink: '',
        actionText: '',
        photos: taskPhotos[task.number] || [],
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
          sectionNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create report');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Customer Info Screen
  if (currentStep === 'customer-info') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px' }} />
          </div>

          <div className="card">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              Home TuneUp Check
            </h1>
            <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
              Complete the 30-point inspection
            </p>

            <form onSubmit={handleCustomerInfoSubmit}>
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
              
              <select
                className="select"
                value={customerInfo.technicianName}
                onChange={(e) => handleCustomerInfoChange('technicianName', e.target.value)}
                required
                style={{ marginBottom: '12px' }}
              >
                <option value="">Select Technician *</option>
                {TECHNICIAN_OPTIONS.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>

              <button type="submit" className="button" style={{ width: '100%', background: '#2A54A1' }}>
                Start Inspection
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Section Notes Screen
  if (currentStep === 'section-notes') {
    const section = SECTIONS[currentSectionIndex];
    
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '150px' }} />
          </div>

          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              {section}
            </h2>
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              Any additional notes for this section?
            </p>

            <textarea
              className="textarea"
              placeholder={`Other notes for ${section} (optional)`}
              value={sectionNotes[section] || ''}
              onChange={(e) => setSectionNotes(prev => ({ ...prev, [section]: e.target.value }))}
              style={{ minHeight: '150px' }}
            />

            <button
              onClick={handleSectionNotesSubmit}
              className="button"
              style={{ width: '100%', background: '#2A54A1', marginTop: '16px' }}
            >
              {currentTaskIndex >= TASKS.length - 1 ? 'Review Report' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen
  if (currentStep === 'review') {
    const tasksBySection = TASKS.reduce((acc, task) => {
      if (!acc[task.section]) acc[task.section] = [];
      acc[task.section].push(task);
      return acc;
    }, {});

    const getNonGoodTasks = () => {
      return TASKS.filter(task => {
        const status = taskStatuses[task.number];
        return status && status !== 'Good';
      });
    };

    const nonGoodTasks = getNonGoodTasks();

    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '150px' }} />
          </div>

          <div className="card">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              Review Your Report
            </h1>
            <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
              Review all details before submitting
            </p>

            {/* Customer Info */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2A54A1' }}>
                Customer Information
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div><strong>Name:</strong> {customerInfo.customerName}</div>
                <div><strong>Email:</strong> {customerInfo.customerEmail}</div>
                <div><strong>Address:</strong> {customerInfo.address}</div>
                <div><strong>City:</strong> {customerInfo.city}</div>
                <div><strong>Technician:</strong> {customerInfo.technicianName}</div>
              </div>
            </div>

            {/* Summary Stats */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#2A54A1', color: 'white', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                Inspection Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {TASKS.filter(t => !taskStatuses[t.number] || taskStatuses[t.number] === 'Good').length}
                  </div>
                  <div style={{ fontSize: '12px' }}>Good</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {TASKS.filter(t => taskStatuses[t.number] === 'Monitor').length}
                  </div>
                  <div style={{ fontSize: '12px' }}>Monitor</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {TASKS.filter(t => taskStatuses[t.number] === 'Repair Soon').length}
                  </div>
                  <div style={{ fontSize: '12px' }}>Repair Soon</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {TASKS.filter(t => taskStatuses[t.number] === 'Urgent').length}
                  </div>
                  <div style={{ fontSize: '12px' }}>Urgent</div>
                </div>
              </div>
            </div>

            {/* Items Requiring Attention */}
            {nonGoodTasks.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2A54A1' }}>
                  Items Requiring Attention ({nonGoodTasks.length})
                </h3>
                {nonGoodTasks.map(task => (
                  <div key={task.number} style={{ marginBottom: '12px', padding: '12px', background: '#fff9f0', border: '1px solid #fed7aa', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        #{task.number}: {task.name}
                      </div>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        background: taskStatuses[task.number] === 'Urgent' ? '#ef4444' : 
                                  taskStatuses[task.number] === 'Repair Soon' ? '#f59e0b' : '#3b82f6',
                        color: 'white'
                      }}>
                        {taskStatuses[task.number]}
                      </span>
                    </div>
                    {taskNotes[task.number] && (
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        {taskNotes[task.number]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Section Notes */}
            {Object.keys(sectionNotes).some(key => sectionNotes[key]) && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2A54A1' }}>
                  Section Notes
                </h3>
                {Object.entries(sectionNotes).map(([section, notes]) => notes && (
                  <div key={section} style={{ marginBottom: '12px', padding: '12px', background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#2A54A1' }}>
                      {section}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {notes}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ 
                background: '#fee2e2', 
                border: '1px solid #fca5a5',
                color: '#991b1b', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setCurrentStep('tasks');
                  setCurrentTaskIndex(0);
                }}
                className="button"
                style={{ flex: 1, background: '#9ca3af' }}
                disabled={submitting}
              >
                ← Edit Report
              </button>
              <button
                onClick={handleSubmit}
                className="button"
                style={{ flex: 1, background: '#2A54A1' }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Task Screen
  if (currentStep === 'tasks') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '120px' }} />
          </div>

          {/* Progress */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              Task {currentTask.number} of {TASKS.length}
            </div>
            <div style={{ background: '#e0e0e0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                background: '#2A54A1',
                height: '100%',
                width: `${((currentTaskIndex + 1) / TASKS.length) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Task Card */}
          <div className="card">
            <div style={{ 
              background: '#2A54A1', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {currentTask.section}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              #{currentTask.number}: {currentTask.name}
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              {currentTask.description}
            </p>

            {/* Status */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
                Status *
              </label>
              <select
                className="select"
                value={taskStatuses[currentTask.number] || 'Good'}
                onChange={(e) => setTaskStatuses(prev => ({ ...prev, [currentTask.number]: e.target.value }))}
              >
                <option value="Good">✓ Good</option>
                <option value="Monitor">○ Monitor</option>
                <option value="Repair Soon">⚠ Repair Soon</option>
                <option value="Urgent">✕ Urgent</option>
              </select>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
                Notes (optional)
              </label>
              <textarea
                className="textarea"
                placeholder="Add any notes..."
                value={taskNotes[currentTask.number] || ''}
                onChange={(e) => setTaskNotes(prev => ({ ...prev, [currentTask.number]: e.target.value }))}
              />
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
                Photos (optional)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                capture="environment"
                onChange={(e) => handlePhotoUpload(currentTask.number, Array.from(e.target.files))}
                style={{ width: '100%', padding: '12px', border: '2px dashed #2A54A1', borderRadius: '8px', cursor: 'pointer' }}
              />
              {taskPhotos[currentTask.number] && taskPhotos[currentTask.number].length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
                  ✓ {taskPhotos[currentTask.number].length} file(s) selected
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isFirstTask && (
                <button
                  onClick={handlePreviousTask}
                  className="button"
                  style={{ flex: 1, background: '#9ca3af' }}
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={handleNextTask}
                className="button"
                style={{ flex: 1, background: '#2A54A1' }}
              >
                {isLastTask ? 'Finish Section' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            Report Submitted!
          </h1>
          <p style={{ color: '#666' }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
