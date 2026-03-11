'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../../../globals.css';

const SERVICE_MAP = {
  'Driveway, Walkways & Patio Surfaces': ['Pressure Washing - Driveway & Patio'],
  'Home Exterior & Entry': ['Pressure Washing - Home Exterior'],
  'Gutters & Downspouts': ['Gutter Cleaning'],
  'Windows - Exterior': ['Window Washing - Exterior'],
  'Outdoor Surfaces & Furniture': ['Outdoor Furniture Cleaning', 'Trash Bin Cleaning'],
  'Exterior Fixtures & Hardware': ['Handyman', 'Electrical Repairs'],
  'Kitchen Plumbing': ['Plumbing Repairs', 'Handyman'],
  'Bathroom Plumbing': ['Plumbing Repairs'],
  'Showers & Tubs': ['Handyman', 'Plumbing Repairs'],
  'Electrical Panel': ['Handyman', 'Electrical Repairs'],
  'Electrical Basics': ['Electrical Repairs', 'Handyman'],
  'General Interior Hardware': ['Handyman'],
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
  const [modalItem, setModalItem] = useState(null);

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

  // ── Punch List Generator (matches TuneUp) ──────────────────────────────────
  const generatePunchList = () => {
    const priorityItems = items.filter(item =>
      item.rating === 'Fair' || item.rating === 'Needs Attention'
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Home Health Check Punch List - ${report.customerName}</title>
  <style>
    @media print { @page { margin: 0.5in; } }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #FBF7F0;
    }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2A54A1; }
    .logo { width: 200px; margin-bottom: 20px; }
    h1 { color: #2A54A1; font-size: 32px; margin: 0 0 10px 0; }
    .info { color: #666; font-size: 14px; margin: 5px 0; }
    .task {
      background: white; padding: 20px; margin-bottom: 16px; border-radius: 8px;
      border-left: 5px solid #f59e0b; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .task.urgent { border-left-color: #ef4444; }
    .task-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
    .task-title { font-weight: bold; font-size: 18px; color: #1f2937; flex: 1; }
    .task-status {
      background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px;
      font-size: 12px; font-weight: 600; margin-left: 12px;
    }
    .task-status.urgent { background: #ef4444; }
    .task-notes {
      color: #4b5563; font-size: 14px; line-height: 1.6; margin-top: 8px;
      padding: 12px; background: #f9fafb; border-radius: 6px;
    }
    .task-services { color: #2A54A1; font-size: 13px; margin-top: 8px; font-weight: 600; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <img src="/Handld_Logo_Transparent.png" alt="Handld" class="logo">
    <h1>Home Health Check Punch List</h1>
    <div class="info">${report.customerName}</div>
    <div class="info">${report.address}</div>
    <div class="info">Inspection Date: ${new Date(report.inspectionDate).toLocaleDateString()}</div>
  </div>

  ${priorityItems.map(item => {
    const services = SERVICE_MAP[item.itemName] || [];
    return `
    <div class="task ${item.rating === 'Needs Attention' ? 'urgent' : ''}">
      <div class="task-header">
        <div class="task-title">#${item.itemNumber}: ${item.itemName}</div>
        <div class="task-status ${item.rating === 'Needs Attention' ? 'urgent' : ''}">${item.rating}</div>
      </div>
      ${item.notes ? `<div class="task-notes"><strong>Notes:</strong> ${item.notes}</div>` : ''}
      ${services.length > 0 ? `<div class="task-services">Recommended: ${services.join(', ')}</div>` : ''}
    </div>
  `;
  }).join('')}

  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Handld Home Services</p>
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

          {/* Overall Score */}
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

        {/* Items Needing Attention (red) — with CTA buttons */}
        {needsAttentionItems.length > 0 && (
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#ef4444' }}>
              {'\ud83d\udd34'} Needs Attention
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
        )}
        {needsAttentionItems.length > 0 && (
          <div className="card" style={{ marginBottom: '20px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
            {needsAttentionItems.map(item => {
              const services = SERVICE_MAP[item.itemName] || [];
              return (
                <div key={item.id} style={{
                  marginBottom: '16px',
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
                      border: '1px solid #d1d5db',
                      marginBottom: '12px'
                    }}>
                      <strong style={{ color: '#2A54A1' }}>Technician Notes:</strong> {item.notes}
                    </div>
                  )}
                  {services.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {report.quoteLink ? (
                        <a
                          href={report.quoteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            padding: '8px 16px',
                            background: '#2A54A1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          View Your Quote
                        </a>
                      ) : services.map(service => (
                        <a
                          key={service}
                          href={`https://handldhome.com/quote?service=${encodeURIComponent(service)}&name=${encodeURIComponent(report.customerName || '')}&phone=${encodeURIComponent(report.customerPhone || '')}&address=${encodeURIComponent(report.address || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            padding: '8px 16px',
                            background: '#2A54A1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          Book {service}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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

        {/* Complete Checklist Grid — numbered, clickable */}
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
              <div
                key={item.id}
                onClick={() => setModalItem(item)}
                style={{
                  padding: '10px',
                  background: getRatingBgColor(item.rating),
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getRatingColor(item.rating)}`,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937', fontSize: '13px' }}>
                  {item.itemNumber}. {item.itemName}
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
              <div
                key={item.id}
                onClick={() => setModalItem(item)}
                style={{
                  padding: '10px',
                  background: getRatingBgColor(item.rating),
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getRatingColor(item.rating)}`,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937', fontSize: '13px' }}>
                  {item.itemNumber}. {item.itemName}
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

        {/* Item Detail Modal */}
        {modalItem && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setModalItem(null)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setModalItem(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                &times;
              </button>

              <div style={{ padding: '32px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: getRatingColor(modalItem.rating),
                  color: 'white',
                  marginBottom: '12px'
                }}>
                  {getRatingIcon(modalItem.rating)} {modalItem.rating}
                </div>

                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  #{modalItem.itemNumber}: {modalItem.itemName}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  {modalItem.section}
                </p>

                {modalItem.notes ? (
                  <div style={{
                    background: '#eff6ff',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2A54A1',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2A54A1',
                      marginBottom: '8px'
                    }}>
                      Technician Notes
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#1e40af',
                      lineHeight: '1.6'
                    }}>
                      {modalItem.notes}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>
                      No additional notes from technician.
                    </p>
                  </div>
                )}

                {(modalItem.rating === 'Fair' || modalItem.rating === 'Needs Attention') && (SERVICE_MAP[modalItem.itemName] || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {report.quoteLink ? (
                      <a
                        href={report.quoteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          padding: '8px 16px',
                          background: '#2A54A1',
                          color: 'white',
                          borderRadius: '8px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        View Your Quote
                      </a>
                    ) : (SERVICE_MAP[modalItem.itemName] || []).map(service => (
                      <a
                        key={service}
                        href={`https://handldhome.com/quote?service=${encodeURIComponent(service)}&name=${encodeURIComponent(report.customerName || '')}&phone=${encodeURIComponent(report.customerPhone || '')}&address=${encodeURIComponent(report.address || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          padding: '8px 16px',
                          background: '#2A54A1',
                          color: 'white',
                          borderRadius: '8px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        Book {service}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
              href="sms:6262987128"
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
              Text Us
            </a>
            <a
              href={report.quoteLink || 'https://handldhome.com/quote'}
              target="_blank"
              rel="noopener noreferrer"
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
              {report.quoteLink ? 'View Your Quote' : 'Book Services'}
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
