'use client';

import { useState, useEffect } from 'react';
import './globals.css';

const TASKS = [
  // Exterior (8 tasks)
  { number: 1, section: "Exterior", name: "Gutter & Downspout Flow", description: "Check gutters for clogs and verify downspouts direct water 6+ feet from foundation", details: "• Inspect gutters for debris\n• Check downspout positioning\n• Test water flow\n• Look for signs of overflow", tips: "Look for staining on siding below gutters, which indicates overflow issues" },
  { number: 2, section: "Exterior", name: "Foundation Perimeter Inspection", description: "Inspect foundation for cracks or water pooling. Use flashlight to check crawlspace for standing water", details: "• Walk perimeter checking for cracks\n• Look for water pooling near foundation\n• Shine flashlight into crawlspace\n• Note any moisture or standing water", tips: "Don't enter crawlspace - just visual check from opening. Safety first!" },
  { number: 3, section: "Exterior", name: "Exterior Wall Integrity", description: "Check stucco/siding for cracks, holes, or deterioration", details: "• Inspect all exterior walls\n• Look for cracks in stucco\n• Check for loose/damaged siding\n• Note any holes or deterioration", tips: "Pay attention to areas around windows and doors - common problem spots" },
  { number: 4, section: "Exterior", name: "Home Exterior & Roof", description: "Inspect siding/stucco for dirt, algae, or mildew buildup. Check roof for debris accumulation", details: "• Check for algae/mildew on walls\n• Look for dirt accumulation\n• Inspect roof line for debris\n• Note any organic growth", tips: "Can often spot roof issues from ground with binoculars - don't need to climb" },
  { number: 5, section: "Exterior", name: "Walkway & Driveway Surface", description: "Check for algae, mildew or staining that creates slip hazards", details: "• Inspect all walkways\n• Check driveway surface\n• Look for slippery algae/mildew\n• Note trip hazards", tips: "Wet areas near sprinklers are most prone to algae growth" },
  { number: 6, section: "Exterior", name: "Exterior Security Lighting", description: "Test outdoor lighting to ensure proper illumination", details: "• Test all exterior lights\n• Check motion sensors\n• Note burned out bulbs\n• Verify adequate coverage", tips: "Test during daylight by covering motion sensors with hand" },
  { number: 7, section: "Exterior", name: "Window & Door Weatherstripping", description: "Inspect weatherstripping and screens (torn/missing) around all exterior doors and windows. Check for drafts", details: "• Check weatherstripping condition\n• Inspect all window screens\n• Note torn or missing screens\n• Feel for drafts around doors", tips: "Run hand around door/window frames to feel for air leaks" },
  { number: 8, section: "Exterior", name: "Garage Door Safety Sensor", description: "Test auto-reverse safety mechanism", details: "• Place object in door path\n• Test auto-reverse function\n• Check sensor alignment\n• Note any issues", tips: "Use a cardboard box or roll of paper towels for testing - never use hand!" },
  
  // Electrical (4 tasks)
  { number: 9, section: "Electrical", name: "Electrical Panel Visual Inspection", description: "Check panel for rust, moisture, or burning smell. Note if circuit breakers are properly labeled", details: "• Open panel door\n• Look for rust or corrosion\n• Smell for burning odor\n• Check if breakers are labeled\n• Note panel age if visible", tips: "Don't touch any breakers - visual inspection only! Offer labeling service if needed" },
  { number: 10, section: "Electrical", name: "Outlet & Switch Safety", description: "Inspect outlets/switches for loose connections or damage", details: "• Test multiple outlets per room\n• Check for loose faceplates\n• Look for burn marks\n• Note any warm outlets", tips: "Warm outlets are a safety concern - note immediately" },
  { number: 11, section: "Electrical", name: "GFCI Outlet Protection", description: "Test all GFCI outlets (kitchens, bathrooms, garage, exterior)", details: "• Locate all GFCI outlets\n• Press TEST button\n• Verify power cuts off\n• Press RESET button\n• Confirm power restored", tips: "If GFCI doesn't trip, it needs replacement - safety issue!" },
  { number: 12, section: "Electrical", name: "Light Bulb Energy Efficiency", description: "Note which bulbs could be upgraded to LED throughout home", details: "• Check light fixtures in each room\n• Note incandescent bulbs\n• Count bulbs that could be LED\n• Identify specialty bulbs needed", tips: "Focus on frequently-used lights first for maximum savings" },
  
  // Plumbing (9 tasks)
  { number: 13, section: "Plumbing", name: "Water Heater Condition & Age", description: "Inspect water heater for age and visible issues", details: "• Check manufacturing date label\n• Look for rust or corrosion\n• Check for water pooling\n• Note any unusual sounds\n• Check temperature setting", tips: "Most water heaters last 8-12 years. If older, recommend monitoring" },
  { number: 14, section: "Plumbing", name: "Under-Sink Leak Detection", description: "Check all sink cabinets for moisture or leaks", details: "• Open all sink cabinets\n• Feel pipes for moisture\n• Look for water stains\n• Check cabinet bottom for warping\n• Smell for mildew", tips: "Use phone flashlight to see far back in cabinets" },
  { number: 15, section: "Plumbing", name: "Faucet & Fixture Efficiency", description: "Test all faucets for drips or low water pressure", details: "• Turn on every faucet\n• Check for drips when off\n• Note water pressure\n• Test hot and cold water\n• Check for leaks at base", tips: "Low pressure might be aerator buildup - easy fix!" },
  { number: 16, section: "Plumbing", name: "Toilet Water Loss Prevention", description: "Check for phantom flushes or running water", details: "• Listen for running water\n• Add food coloring to tank\n• Wait 15 minutes\n• Check if color appears in bowl\n• Note any leaks at base", tips: "Running toilet can waste 200 gallons per day!" },
  { number: 17, section: "Plumbing", name: "Shower Head Performance", description: "Inspect shower heads for clogs or mineral buildup", details: "• Turn on all showers\n• Check water pressure\n• Look for mineral deposits\n• Note spray pattern issues\n• Check for leaks", tips: "White crusty buildup = mineral deposits. Usually easy vinegar soak fix" },
  { number: 18, section: "Plumbing", name: "Water Filter Status", description: "Check expiration dates on refrigerator and under-sink water filters", details: "• Check fridge water filter\n• Look for under-sink filters\n• Note expiration dates\n• Check filter indicator lights", tips: "Filters typically need replacement every 6 months" },
  { number: 19, section: "Plumbing", name: "Garbage Disposal Function", description: "Test garbage disposal operation and check for leaks", details: "• Turn on disposal\n• Listen for unusual sounds\n• Check for leaks underneath\n• Test reset button location\n• Note age if visible", tips: "Never put hand in disposal - use tongs if testing needed" },
  { number: 20, section: "Plumbing", name: "Dishwasher Filter & Seal", description: "Check dishwasher filter for debris. Inspect door seal for damage", details: "• Locate and remove filter\n• Check for food debris\n• Inspect door gasket\n• Look for cracks or mold\n• Test door latch", tips: "Most homeowners don't know dishwasher has a filter that needs cleaning!" },
  { number: 21, section: "Plumbing", name: "Kitchen Exhaust Grease Buildup", description: "Check range hood filter for grease accumulation", details: "• Remove range hood filter\n• Check grease buildup\n• Test fan operation\n• Check exterior vent (if accessible)\n• Note last cleaning date", tips: "Grease buildup is fire hazard - important safety item" },
  
  // HVAC & Air Quality (5 tasks)
  { number: 22, section: "HVAC & Air Quality", name: "HVAC Filter Condition", description: "Check filter condition and note replacement needs", details: "• Locate HVAC filter\n• Remove and inspect\n• Note size if visible\n• Check for dirt/dust\n• Take photo of size label", tips: "Filters should be changed every 1-3 months depending on type" },
  { number: 23, section: "HVAC & Air Quality", name: "HVAC System Age & Early Warning", description: "Note system age and unusual noises", details: "• Check for manufacturing date\n• Listen to system running\n• Note any strange noises\n• Check for rust on outdoor unit\n• Note if system is oversized/undersized for home", tips: "Most HVAC systems last 15-20 years" },
  { number: 24, section: "HVAC & Air Quality", name: "Dryer Vent Fire Prevention", description: "Inspect dryer vent for lint buildup", details: "• Check dryer vent opening\n• Pull out visible lint\n• Note vent material (flexible = bad)\n• Check exterior vent flap\n• Test dryer efficiency", tips: "Lint buildup is major fire hazard - critical safety item" },
  { number: 25, section: "HVAC & Air Quality", name: "Attic Insulation Visual Check", description: "Inspect attic for adequate insulation coverage (if accessible)", details: "• Safely access attic opening\n• Shine light to inspect\n• Look for even coverage\n• Note any gaps or thin spots\n• Check for moisture/mold", tips: "Don't enter attic if unsafe - just visual check from opening" },
  { number: 26, section: "HVAC & Air Quality", name: "Ventilation & Moisture", description: "Check bathroom exhaust fans work properly. Look for condensation on windows", details: "• Test all bathroom fans\n• Check kitchen vent fan\n• Look for window condensation\n• Note any musty odors\n• Check for visible mold", tips: "Poor ventilation leads to mold - important to catch early" },
  
  // Safety Systems (5 tasks)
  { number: 27, section: "Safety Systems", name: "Smoke Detector Functionality", description: "Test all smoke detectors and battery capacity. Vacuum filters to keep clean", details: "• Press test button on each detector\n• Note any chirping (low battery)\n• Check manufacturing date (10yr max)\n• Vacuum detector grill\n• Count total detectors", tips: "Detectors expire after 10 years - check date on back!" },
  { number: 28, section: "Safety Systems", name: "Carbon Monoxide Detector Check", description: "Test CO detectors and battery capacity near bedrooms and gas appliances", details: "• Locate all CO detectors\n• Press test button\n• Check expiration date (5-7yr)\n• Note locations\n• Verify placement near bedrooms", tips: "CO detectors required near all sleeping areas - check local codes" },
  { number: 29, section: "Safety Systems", name: "Stairway Safety & Lighting", description: "Check stair lighting and railing stability", details: "• Test stair lighting\n• Check light switch location\n• Shake railing for stability\n• Look for loose balusters\n• Note any trip hazards on stairs", tips: "Stair falls are leading cause of home injuries - important safety check" },
  { number: 30, section: "Safety Systems", name: "Trip Hazard Scan", description: "Look for loose rugs, cords, or uneven flooring", details: "• Walk through all rooms\n• Check for loose rugs\n• Note extension cords across walkways\n• Look for uneven flooring\n• Check door thresholds", tips: "Focus on high-traffic areas and paths to bathrooms (nighttime risk)" },
  { number: 31, section: "Safety Systems", name: "Door Lock & Deadbolt Function", description: "Test all exterior door locks and deadbolts operate smoothly", details: "• Test every exterior door\n• Check lock operation\n• Test deadbolt smoothness\n• Note any sticking\n• Check strike plate alignment", tips: "Sticking locks often just need lubrication - easy fix" },
];

const SECTIONS = [
  "Exterior",
  "Electrical",
  "Plumbing",
  "HVAC & Air Quality",
  "Safety Systems"
];

const TECHNICIAN_OPTIONS = [
  "Benny Sanches",
  "Mike Rodriguez",
  "Carlos Santos",
];

const STORAGE_KEY = 'handld-tuneup-progress';

export default function TechnicianForm() {
  const [currentStep, setCurrentStep] = useState('customer-info');
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
  const [showDetails, setShowDetails] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setCustomerInfo(data.customerInfo || customerInfo);
        setTaskStatuses(data.taskStatuses || {});
        setTaskNotes(data.taskNotes || {});
        setSectionNotes(data.sectionNotes || {});
        setCurrentStep(data.currentStep || 'customer-info');
        setCurrentTaskIndex(data.currentTaskIndex || 0);
      }
    } catch (err) {
      console.error('Failed to load saved progress:', err);
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    try {
      const dataToSave = {
        customerInfo,
        taskStatuses,
        taskNotes,
        sectionNotes,
        currentStep,
        currentTaskIndex,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [customerInfo, taskStatuses, taskNotes, sectionNotes, currentStep, currentTaskIndex]);

  const currentTask = TASKS[currentTaskIndex];
  const isLastTask = currentTaskIndex === TASKS.length - 1;
  const isFirstTask = currentTaskIndex === 0;

  const handleVoiceInput = (taskNumber) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported on this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setIsRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTaskNotes(prev => ({
        ...prev,
        [taskNumber]: (prev[taskNumber] || '') + ' ' + transcript
      }));
      setIsRecording(false);
    };
    
    recognition.onerror = () => {
      setIsRecording(false);
      alert('Voice input failed. Please try again.');
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
  };

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
    
    if (nextTaskIndex < TASKS.length) {
      const currentSection = TASKS[currentTaskIndex].section;
      const nextSection = TASKS[nextTaskIndex].section;
      
      if (currentSection !== nextSection) {
        const sectionIndex = SECTIONS.indexOf(currentSection);
        setCurrentSectionIndex(sectionIndex);
        setCurrentStep('section-notes');
      } else {
        setCurrentTaskIndex(nextTaskIndex);
      }
    } else {
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
      setCurrentStep('review');
    }
  };

  const handleSectionNotesPrevious = () => {
    // Go back to last task of the section we just finished
    setCurrentStep('tasks');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    setError('');

    try {
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

      localStorage.removeItem(STORAGE_KEY);
      setSuccess(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 5000);

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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px' }} />
          </div>

          <div className="card">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              Home TuneUp Check
            </h1>
            <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
              Complete the 31-point inspection
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
              style={{ minHeight: '150px', marginBottom: '8px' }}
            />

            <button
              onClick={() => handleVoiceInput(`section-${section}`)}
              className="button"
              type="button"
              style={{ width: '100%', background: '#10b981', marginBottom: '16px' }}
              disabled={isRecording}
            >
              {isRecording ? '🎤 Listening...' : '🎤 Voice Input'}
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSectionNotesPrevious}
                className="button"
                style={{ flex: 1, background: '#9ca3af' }}
              >
                ← Previous
              </button>
              <button
                onClick={handleSectionNotesSubmit}
                className="button"
                style={{ flex: 1, background: '#2A54A1' }}
              >
                {currentTaskIndex >= TASKS.length - 1 ? 'Review Report' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen (keeping same as before - just showing it exists)
  if (currentStep === 'review') {
    const nonGoodTasks = TASKS.filter(task => {
      const status = taskStatuses[task.number];
      return status && status !== 'Good';
    });

    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                Report Summary
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
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              {currentTask.description}
            </p>

            {/* Info Button + Details */}
            <button
              onClick={() => setShowDetails(prev => ({ ...prev, [currentTask.number]: !prev[currentTask.number] }))}
              style={{
                background: '#E8F4F8',
                border: '1px solid #2A54A1',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                color: '#2A54A1',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px',
                width: '100%'
              }}
            >
              {showDetails[currentTask.number] ? '▼' : '▶'} What to check
            </button>

            {showDetails[currentTask.number] && (
              <div style={{ 
                background: '#f0f9ff', 
                border: '1px solid #bfdbfe',
                borderRadius: '8px', 
                padding: '12px', 
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <div style={{ whiteSpace: 'pre-line', marginBottom: '12px', color: '#1e40af' }}>
                  {currentTask.details}
                </div>
                <div style={{ 
                  background: '#fef3c7', 
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  color: '#92400e'
                }}>
                  <strong>💡 Tip:</strong> {currentTask.tips}
                </div>
              </div>
            )}

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
                style={{ marginBottom: '8px' }}
              />
              <button
                onClick={() => handleVoiceInput(currentTask.number)}
                className="button"
                type="button"
                style={{ width: '100%', background: '#10b981' }}
                disabled={isRecording}
              >
                {isRecording ? '🎤 Listening...' : '🎤 Voice Input'}
              </button>
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
                Photos (optional)
              </label>
              <input
                key={`photo-${currentTask.number}`}
                type="file"
                accept="image/*,video/*"
                multiple
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
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '150px', marginBottom: '24px' }} />
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2A54A1', marginBottom: '16px' }}>
            Handld TuneUp Report Submission Successful!
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
            Thank you for your hard work.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecting to new form in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
