'use client';

import { useState } from 'react';
import '../../globals.css';

const CHECKLIST_ITEMS = [
  // Exterior (6 items)
  { number: 1, section: 'Exterior', name: 'Driveway, Walkways & Patio Surfaces', description: 'Staining, oil, moss, algae, cracks, or surface deterioration' },
  { number: 2, section: 'Exterior', name: 'Home Exterior & Entry', description: 'Walls, siding, steps \u2014 dirt buildup, mildew, oxidation, peeling paint' },
  { number: 3, section: 'Exterior', name: 'Gutters & Downspouts', description: 'Debris, sagging, overflow staining, discharge point clear of pooling' },
  { number: 4, section: 'Exterior', name: 'Windows - Exterior', description: 'Glass cleanliness, screen condition, latch and hardware function' },
  { number: 5, section: 'Exterior', name: 'Outdoor Surfaces & Furniture', description: 'Bins, furniture, fabric or hard surfaces showing grime or mildew' },
  { number: 6, section: 'Exterior', name: 'Exterior Fixtures & Hardware', description: 'Lighting, door hardware, fence/gate latches \u2014 anything loose or broken' },

  // Interior (6 items)
  { number: 7, section: 'Interior', name: 'Kitchen Plumbing', description: 'Sink drainage, faucet drips, leaks under cabinet, disposal condition' },
  { number: 8, section: 'Interior', name: 'Bathroom Plumbing', description: 'Sink drains, toilet running/rocking/staining, hose connections' },
  { number: 9, section: 'Interior', name: 'Showers & Tubs', description: 'Caulk gaps, mold, grout condition, drain speed' },
  { number: 10, section: 'Interior', name: 'Electrical Panel', description: 'Labeled clearly, accessible, no tripped breakers, corrosion, or overcrowding' },
  { number: 11, section: 'Interior', name: 'Electrical Basics', description: 'GFCI outlets present and functional, smoke/CO detectors present and working' },
  { number: 12, section: 'Interior', name: 'General Interior Hardware', description: 'Cabinet hardware, door hinges, sticking doors, anything loose or broken' },
];

const TECHNICIAN_OPTIONS = [
  'Benny Sanches',
  'Mike Rodriguez',
  'Carlos Santos',
];

const STORAGE_KEY = 'handld-health-check-progress';

export default function HealthCheckForm() {
  const [currentStep, setCurrentStep] = useState('customer-info');

  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    address: '',
    technicianName: '',
    customerPhone: '',
  });

  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState({});
  const [generalNotes, setGeneralNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleRating = (itemNumber, rating) => {
    setRatings(prev => ({ ...prev, [itemNumber]: rating }));
    // Clear notes if switching back to Good
    if (rating === 'Good') {
      setNotes(prev => {
        const next = { ...prev };
        delete next[itemNumber];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Validate all items have ratings
    const missingRatings = CHECKLIST_ITEMS.filter(item => !ratings[item.number]);
    if (missingRatings.length > 0) {
      setError(`Please rate all items. Missing: ${missingRatings.map(i => i.name).join(', ')}`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const items = CHECKLIST_ITEMS.map(item => ({
        number: item.number,
        section: item.section,
        name: item.name,
        rating: ratings[item.number],
        notes: notes[item.number] || '',
      }));

      const response = await fetch('/api/health-check/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.customerName,
          address: customerInfo.address,
          techName: customerInfo.technicianName,
          inspectionDate: new Date().toISOString().split('T')[0],
          notes: generalNotes,
          customerPhone: customerInfo.customerPhone,
          items,
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

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '150px', marginBottom: '24px' }} />
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>&#10003;</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2A54A1', marginBottom: '16px' }}>
            Report Submitted!
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
            The customer will receive a link via text shortly.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecting to new form in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  // ── Customer Info Screen ────────────────────────────────────────────────────
  if (currentStep === 'customer-info') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px' }} />
          </div>

          <div className="card">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#2A54A1' }}>
              Home Health Check
            </h1>
            <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
              Free 12-point visual inspection
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('checklist'); }}>
              <input
                type="text"
                className="input"
                placeholder="Customer Name *"
                value={customerInfo.customerName}
                onChange={(e) => handleCustomerInfoChange('customerName', e.target.value)}
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
                type="tel"
                className="input"
                placeholder="Customer Phone (for report link)"
                value={customerInfo.customerPhone}
                onChange={(e) => handleCustomerInfoChange('customerPhone', e.target.value)}
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

  // ── Checklist Screen ────────────────────────────────────────────────────────
  if (currentStep === 'checklist') {
    const completedCount = Object.keys(ratings).length;
    const exteriorItems = CHECKLIST_ITEMS.filter(i => i.section === 'Exterior');
    const interiorItems = CHECKLIST_ITEMS.filter(i => i.section === 'Interior');

    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '150px' }} />
          </div>

          {/* Progress */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {completedCount} of {CHECKLIST_ITEMS.length} items rated
            </div>
            <div style={{ background: '#e0e0e0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                background: '#2A54A1',
                height: '100%',
                width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Exterior Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: '#2A54A1',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '700'
            }}>
              Exterior
            </div>

            {exteriorItems.map(item => (
              <ChecklistItemCard
                key={item.number}
                item={item}
                rating={ratings[item.number]}
                note={notes[item.number]}
                onRate={(r) => handleRating(item.number, r)}
                onNote={(n) => setNotes(prev => ({ ...prev, [item.number]: n }))}
              />
            ))}
          </div>

          {/* Interior Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: '#2A54A1',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '700'
            }}>
              Interior
            </div>

            {interiorItems.map(item => (
              <ChecklistItemCard
                key={item.number}
                item={item}
                rating={ratings[item.number]}
                note={notes[item.number]}
                onRate={(r) => handleRating(item.number, r)}
                onNote={(n) => setNotes(prev => ({ ...prev, [item.number]: n }))}
              />
            ))}
          </div>

          {/* General Notes */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2A54A1' }}>
              General Notes (optional)
            </label>
            <textarea
              className="textarea"
              placeholder="Any additional notes about the inspection..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              style={{ minHeight: '100px' }}
            />
          </div>

          {/* Error */}
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

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => setCurrentStep('customer-info')}
              className="button"
              style={{ flex: 1, background: '#9ca3af' }}
              disabled={submitting}
            >
              &larr; Back
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
    );
  }

  return null;
}

// ── Checklist Item Card Component ─────────────────────────────────────────────

function ChecklistItemCard({ item, rating, note, onRate, onNote }) {
  const ratingOptions = [
    { value: 'Good', label: '\u2705 Good', color: '#10b981', bg: '#d1fae5' },
    { value: 'Fair', label: '\u26a0\ufe0f Fair', color: '#f59e0b', bg: '#fef3c7' },
    { value: 'Needs Attention', label: '\ud83d\udd34 Needs Attention', color: '#ef4444', bg: '#fee2e2' },
  ];

  const isSelected = (value) => rating === value;
  const showNotes = rating === 'Fair' || rating === 'Needs Attention';

  return (
    <div className="card" style={{ marginBottom: '12px' }}>
      <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px', color: '#1f2937' }}>
        {item.name}
      </div>
      <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
        {item.description}
      </div>

      {/* Rating Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: showNotes ? '12px' : '0', flexWrap: 'wrap' }}>
        {ratingOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onRate(opt.value)}
            style={{
              flex: 1,
              minWidth: '90px',
              padding: '12px 8px',
              border: isSelected(opt.value) ? `3px solid ${opt.color}` : '2px solid #e0e0e0',
              borderRadius: '8px',
              background: isSelected(opt.value) ? opt.bg : 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isSelected(opt.value) ? '700' : '500',
              color: isSelected(opt.value) ? opt.color : '#666',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Notes (shown when Fair or Needs Attention) */}
      {showNotes && (
        <input
          type="text"
          className="input"
          placeholder="Notes (optional) \u2014 what did you observe?"
          value={note || ''}
          onChange={(e) => onNote(e.target.value)}
          style={{ marginBottom: '0' }}
        />
      )}
    </div>
  );
}
