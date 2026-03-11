'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../../globals.css';

const SERVICE_MAP = {
  'Driveway, Walkways & Patio Surfaces': ['Pressure Washing \u2013 Driveway & Patio'],
  'Home Exterior & Entry': ['Pressure Washing \u2013 Home Exterior'],
  'Gutters & Downspouts': ['Gutter Cleaning'],
  'Windows - Exterior': ['Window Washing \u2013 Exterior'],
  'Outdoor Surfaces & Furniture': ['Outdoor Furniture Cleaning', 'Trash Bin Cleaning'],
  'Exterior Fixtures & Hardware': ['Handyman Services', 'Electrical Repairs'],
  'Kitchen Plumbing': ['Plumbing Repairs', 'Handyman Services'],
  'Bathroom Plumbing': ['Plumbing Repairs'],
  'Showers & Tubs': ['Handyman Services', 'Plumbing Repairs'],
  'Electrical Panel': ['Handyman Services', 'Electrical Repairs'],
  'Electrical Basics': ['Electrical Repairs', 'Handyman Services'],
  'General Interior Hardware': ['Handyman Services'],
};

function getRatingColor(rating) {
  if (rating === 'Fair') return '#f59e0b';
  if (rating === 'Needs Attention') return '#ef4444';
  return '#10b981';
}

function getRatingBgColor(rating) {
  if (rating === 'Fair') return '#fef3c7';
  if (rating === 'Needs Attention') return '#fee2e2';
  return '#d1fae5';
}

function getRatingIcon(rating) {
  if (rating === 'Fair') return '\u26a0\ufe0f';
  if (rating === 'Needs Attention') return '\ud83d\udd34';
  return '\u2705';
}

export default function HealthCheckReport() {
  const params = useParams();
  const reportId = params?.recordId;

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      try {
        const reportRes = await fetch(`/api/health-check/${reportId}`);
        if (!reportRes.ok) throw new Error('Report not found');
        const reportData = await reportRes.json();
        setReport(reportData.report);
        setItems(reportData.items);
      } catch (err) {
        console.error('[HealthCheck Report] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (reportId) fetchReport();
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

  if (error || !report) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#ef4444' }}>{error || 'Report not found'}</div>
        </div>
      </div>
    );
  }

  const exteriorItems = items.filter(i => i.section === 'Exterior');
  const interiorItems = items.filter(i => i.section === 'Interior');
  const flaggedItems = items.filter(i => i.rating === 'Fair' || i.rating === 'Needs Attention');
  const needsAttentionItems = items.filter(i => i.rating === 'Needs Attention');
  const fairItems = items.filter(i => i.rating === 'Fair');

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '16px' }}>
          <img src="/Handld_Logo_Transparent.png" alt="Handld" style={{ width: '200px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', color: '#2A54A1' }}>
            Home Health Check
          </h1>
          <p style={{ fontSize: '15px', color: '#888', marginBottom: '16px', fontStyle: 'italic' }}>
            A free visual inspection by Handld Home
          </p>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>
            {report.customerName}
          </div>
          <div style={{ fontSize: '15px', color: '#999' }}>
            {report.address}
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
            Inspected: {new Date(report.inspectionDate).toLocaleDateString()}
          </div>
        </div>

        {/* Summary Card */}
        <div className="card" style={{
          background: 'white',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #2A54A1',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#2A54A1', textAlign: 'center' }}>
            Inspection Summary
          </h2>

          {/* Overall Rating */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '16px',
            background: '#eff6ff',
            borderRadius: '12px',
            border: '2px solid #2A54A1'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Overall Score</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2A54A1' }}>
              {report.overallRating}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#d1fae5', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#10b981' }}>{report.totalGood}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#059669' }}>Good</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fef3c7', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#f59e0b' }}>{report.totalFair}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#d97706' }}>Fair</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ef4444' }}>{report.totalNeedsAttention}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#dc2626' }}>Needs Attention</div>
            </div>
          </div>
        </div>

        {/* All Good Message */}
        {flaggedItems.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '50px 30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{'\u2713'}</div>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>
              Everything Looks Good!
            </h2>
            <p style={{ color: '#666', fontSize: '15px' }}>
              No items were flagged during your inspection. Your home is in great shape!
            </p>
          </div>
        )}

        {/* Items Needing Attention (red) */}
        {needsAttentionItems.length > 0 && (
          <div className="card" style={{ marginBottom: '20px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#ef4444' }}>
              {'\ud83d\udd34'} Needs Attention ({needsAttentionItems.length})
            </h2>
            {needsAttentionItems.map(item => (
              <div key={item.id} style={{
                marginBottom: '12px',
                padding: '16px',
                background: '#fee2e2',
                borderRadius: '10px',
                borderLeft: '5px solid #ef4444'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                    {item.itemName}
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: '#ef4444',
                    color: 'white'
                  }}>
                    Needs Attention
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: item.notes ? '8px' : '0' }}>
                  {item.section}
                </div>
                {item.notes && (
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    border: '1px solid #d1d5db'
                  }}>
                    <strong style={{ color: '#2A54A1' }}>Technician Notes:</strong> {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Items to Monitor (fair - yellow) */}
        {fairItems.length > 0 && (
          <div className="card" style={{ marginBottom: '20px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px', color: '#f59e0b' }}>
              {'\u26a0\ufe0f'} Items to Monitor ({fairItems.length})
            </h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
              These items are in acceptable condition but worth keeping an eye on.
            </p>
            {fairItems.map(item => (
              <div key={item.id} style={{
                marginBottom: '12px',
                padding: '16px',
                background: '#fef3c7',
                borderRadius: '10px',
                borderLeft: '5px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                    {item.itemName}
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: '#f59e0b',
                    color: 'white'
                  }}>
                    Fair
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: item.notes ? '8px' : '0' }}>
                  {item.section}
                </div>
                {item.notes && (
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    border: '1px solid #d1d5db'
                  }}>
                    <strong style={{ color: '#2A54A1' }}>Technician Notes:</strong> {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Complete Checklist Grid */}
        <div className="card" style={{ marginTop: '24px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#2A54A1', textAlign: 'center' }}>
            Complete 12-Point Inspection
          </h2>

          {/* Exterior */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2A54A1', marginBottom: '10px', borderBottom: '2px solid #2A54A1', paddingBottom: '6px' }}>
            Exterior
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {exteriorItems.map(item => (
              <div key={item.id} style={{
                padding: '10px',
                background: getRatingBgColor(item.rating),
                borderRadius: '8px',
                borderLeft: `4px solid ${getRatingColor(item.rating)}`,
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937', fontSize: '13px' }}>
                  {item.itemName}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: getRatingColor(item.rating),
                  color: 'white'
                }}>
                  {getRatingIcon(item.rating)} {item.rating}
                </span>
              </div>
            ))}
          </div>

          {/* Interior */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2A54A1', marginBottom: '10px', borderBottom: '2px solid #2A54A1', paddingBottom: '6px' }}>
            Interior
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {interiorItems.map(item => (
              <div key={item.id} style={{
                padding: '10px',
                background: getRatingBgColor(item.rating),
                borderRadius: '8px',
                borderLeft: `4px solid ${getRatingColor(item.rating)}`,
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937', fontSize: '13px' }}>
                  {item.itemName}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: getRatingColor(item.rating),
                  color: 'white'
                }}>
                  {getRatingIcon(item.rating)} {item.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Handld Can Help With (only if flagged items exist) */}
        {flaggedItems.length > 0 && (
          <div className="card" style={{ marginTop: '24px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#2A54A1', textAlign: 'center' }}>
              Handld Can Help With
            </h2>

            {flaggedItems.map(item => {
              const services = SERVICE_MAP[item.itemName] || [];
              if (services.length === 0) return null;

              return (
                <div key={item.id} style={{
                  marginBottom: '12px',
                  padding: '14px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getRatingColor(item.rating)}`
                }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '6px' }}>
                    {getRatingIcon(item.rating)} {item.itemName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    {services.join(' \u00b7 ')}
                  </div>
                </div>
              );
            })}

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#eff6ff',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '15px',
              color: '#1e40af',
              lineHeight: '1.6'
            }}>
              Ready to get these taken care of? Reply to your text or visit{' '}
              <a href="https://handldhome.com" style={{ color: '#2A54A1', fontWeight: '600' }}>handldhome.com</a>
              {' '}to book.
            </div>
          </div>
        )}

        {/* General Notes */}
        {report.notes && (
          <div className="card" style={{ marginTop: '24px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2A54A1' }}>
              Additional Notes
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {report.notes}
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="card" style={{ background: '#2A54A1', color: 'white', textAlign: 'center', marginTop: '32px', padding: '32px 24px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '12px' }}>
            Questions About Your Report?
          </h3>
          <p style={{ marginBottom: '20px', opacity: 0.95, fontSize: '15px', lineHeight: '1.5' }}>
            Our team is here to help you maintain a safe and healthy home.
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
              href="https://handldhome.com"
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

        {/* Footer */}
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
            Inspected by: <strong style={{ color: '#2A54A1' }}>{report.techName}</strong>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Handld Home Services | Keeping Your Home Safe & Sound
          </p>
        </div>
      </div>
    </div>
  );
}
