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

const TASK_SHOW_MORE = {
  1: "During your inspection, we carefully examined your gutter system for debris accumulation and checked that downspouts direct water at least 6 feet away from your foundation. Proper gutter function is one of the most cost-effective ways to prevent foundation damage—a clogged gutter can dump thousands of gallons against your home's base during just one rainstorm. We also looked for signs of overflow staining on your siding, which indicates gutters aren't handling water properly. Regular maintenance protects your biggest investment.",
  2: "We walked the entire perimeter of your foundation looking for hairline cracks, settling, or water pooling near the base. We also used a flashlight to visually inspect your crawlspace opening (without entering) for standing water or moisture issues. Foundation problems rarely fix themselves—they only get worse and more expensive over time. Early detection of even minor settling can save you tens of thousands in future repair costs. This is preventive care that truly pays off.",
  3: "We inspected all exterior walls for cracks in stucco, loose or damaged siding, and any holes that could allow moisture or pest entry. Even small cracks create pathways for water infiltration, which leads to mold, wood rot, and structural damage inside your walls. We pay special attention to areas around windows and doors where problems commonly start. Catching these issues early means simple repairs instead of major reconstruction.",
  4: "Your home's exterior was checked for dirt, algae, mildew, and organic growth—both on siding and along the roofline. While this might seem cosmetic, organic growth actually eats away at your home's protective surfaces over time. Plus, a clean exterior significantly boosts curb appeal and property value. We inspected your roof from ground level (no climbing required) to spot debris accumulation that can trap moisture and accelerate wear.",
  5: "We examined all walkways, driveways, and pathways for algae, mildew, or staining that creates slippery surfaces—a major liability risk. Slip-and-fall accidents are one of the most common homeowner insurance claims, and preventable surface hazards make you vulnerable. We focused on areas near sprinklers and shaded spots where growth is most likely. A clean, safe walking surface protects both your family and your guests.",
  6: "We tested all outdoor lighting fixtures and motion sensors to ensure your property is properly illuminated after dark. Adequate exterior lighting is proven to deter break-ins and prevent nighttime accidents. We checked for burned-out bulbs and verified motion sensors activate correctly—covering sensors by hand during daylight testing. Well-lit exteriors make your home safer and more welcoming.",
  7: "We checked weatherstripping and examined window screens around every exterior door and window for signs of wear, tears, or missing pieces. We also felt for drafts around frames. Poor weatherstripping doesn't just waste energy (and money)—it also lets in pests, dust, and outdoor allergens. This simple upgrade pays for itself quickly through lower utility bills while improving your home's comfort year-round.",
  8: "We tested your garage door's critical auto-reverse safety mechanism by placing an object (never a hand!) in the door's path. This safety feature prevents serious injuries and even deaths—a malfunctioning sensor is a genuine hazard, especially with children around. We also checked sensor alignment. This is the kind of safety check that only takes minutes but could save a life.",
  9: "We opened your electrical panel to visually inspect for rust, corrosion, or any burning smell—signs of serious electrical problems. We also checked if your circuit breakers are properly labeled. During an emergency, every second counts. Unlabeled panels waste precious time when you need to cut power quickly. We can provide professional labeling service to make your electrical system safer and more user-friendly.",
  10: "We tested multiple outlets in each room, checking for loose faceplates, burn marks, or warmth—all warning signs of electrical problems. We know that warm outlets are a serious safety concern indicating dangerous current issues. Faulty outlets cause thousands of house fires annually. This inspection helps identify problems before they become catastrophes.",
  11: "We located and tested every GFCI outlet in your home—in kitchens, bathrooms, garage, and exterior locations—by pressing the TEST button to verify power cuts off, then RESET to restore it. GFCIs are your protection against electrical shock in wet areas. A non-functioning GFCI is a genuine life-safety issue, especially in homes with children. These devices are required by code for very good reason.",
  12: "We surveyed light fixtures throughout your home, noting which bulbs could be upgraded to energy-efficient LED technology. This isn't just about being 'green'—LED bulbs use 75% less energy and last 25 times longer than old incandescent bulbs. Focusing on your most-used fixtures first maximizes savings. The upgrade pays for itself through lower electric bills while reducing how often you need to change bulbs.",
  13: "We inspected your water heater for its manufacturing date (most last 8-12 years), signs of rust, corrosion, water pooling, or unusual sounds. We also checked the temperature setting for safety and efficiency. Water heater failures are catastrophic—they don't just stop working, they can flood your home with dozens of gallons. Knowing your heater's age lets you plan for replacement before an emergency, potentially saving thousands in water damage.",
  14: "We opened every sink cabinet to feel pipes for moisture, look for water stains on cabinet bottoms, and smell for mildew. Hidden leaks are insidious—they cause mold growth, wood rot, and structural damage long before you notice. We use flashlights to see deep into cabinets where problems hide. Early leak detection prevents major repairs and protects your family's health from mold exposure.",
  15: "We tested every faucet in your home for drips when off, water pressure issues, and leaks at the base. A dripping faucet seems minor but can waste thousands of gallons annually. Low pressure often indicates aerator buildup—an easy fix! We check both hot and cold water operation. Many faucet problems are simple repairs that pay for themselves through water savings.",
  16: "We listened for running water in toilets and can perform a simple food coloring test: add drops to the tank, wait 15 minutes, and check if color appears in the bowl without flushing. Running toilets waste up to 200 gallons daily—that's money flowing down the drain month after month. We also checked for base leaks. This is one of the easiest ways to cut your water bill.",
  17: "We turned on all showers to check water pressure and spray patterns, inspecting shower heads for mineral deposits and clogs. That white crusty buildup you see? It's reducing your water pressure and coverage. Good news: it's usually fixable with a simple vinegar soak. Clean shower heads mean better showers and lower water bills through improved efficiency.",
  18: "We checked expiration dates on your refrigerator water filter and any under-sink filtration systems, plus any filter indicator lights. Most filters need replacement every 6 months—old filters not only reduce water quality but actually become breeding grounds for bacteria. Fresh filters mean cleaner, better-tasting water and longer appliance life. We can help set up a replacement reminder schedule.",
  19: "We tested your garbage disposal operation, listened for unusual grinding sounds, checked underneath for leaks, and verified the reset button is accessible. Never put your hand in a disposal—we use tongs if testing is needed. Malfunctioning disposals cause kitchen clogs, leaks, and real inconvenience. Catching problems early means repair instead of replacement.",
  20: "We located and removed your dishwasher filter to check for food debris, then inspected the door gasket for cracks or mold. Here's a secret: most homeowners don't even know their dishwasher has a filter! A dirty filter dramatically reduces cleaning performance and causes odors. We also tested the door latch. Regular cleaning extends your dishwasher's life and ensures sparkling dishes.",
  21: "We removed your range hood filter to check for grease buildup, tested fan operation, and checked the exterior vent if accessible. Grease buildup isn't just gross—it's a serious fire hazard. Range hood fires spread quickly and can destroy kitchens. We also noted when it was last cleaned. This critical safety check takes minutes but protects your home and family.",
  22: "We located your HVAC filter, removed it for inspection, noted the size, and photographed the size label. A dirty filter reduces system efficiency by 15% while increasing energy costs. Filters should be changed every 1-3 months depending on type. We help you identify the right filter and can set up a replacement schedule. Clean filters mean lower bills and better air quality.",
  23: "We checked for your HVAC system's manufacturing date (average lifespan 15-20 years), listened to it running for strange noises, and inspected the outdoor unit for rust or sizing issues. Knowing your system's age helps you budget for eventual replacement and avoid emergency failures in extreme weather. We document early warning signs so you can plan ahead, not panic later.",
  24: "We inspected your dryer vent opening, pulled out visible lint, noted if flexible duct material is used (a fire code violation in many areas), checked the exterior vent flap, and assessed dryer efficiency. Clogged dryer vents cause 15,000 house fires annually—this isn't a minor issue. Lint is extremely flammable. This is one of the most important fire safety checks in your home.",
  25: "We safely accessed your attic opening and used a flashlight to inspect insulation coverage, looking for even distribution, thin spots, gaps, and any moisture or mold. We don't enter unsafe attics—visual inspection from the opening is sufficient. Poor insulation can increase heating and cooling costs by 20% or more. Proper insulation is one of the best energy investments you can make.",
  26: "We tested all bathroom exhaust fans and kitchen ventilation to ensure proper operation, then looked for window condensation and noted any musty odors. Poor ventilation leads directly to mold, mildew, and moisture damage—problems that affect both your home's structure and your family's health. Good airflow is essential to preventing expensive moisture-related repairs and maintaining healthy indoor air quality.",
  27: "We tested every smoke detector by pressing the test button, listening for chirping (low battery warning), checking manufacturing dates (they expire after 10 years!), and vacuuming detector grills to keep sensors clean. We also counted total detectors. Smoke detectors save lives, but only if they're working—expired detectors give false confidence. The 10-year expiration is real; check the back of every detector in your home.",
  28: "We located all carbon monoxide detectors, tested them with the button, checked expiration dates (5-7 year lifespan), noted placement, and verified detectors near all sleeping areas. CO poisoning is called 'the silent killer' because you can't see or smell it. Working CO detectors are your only early warning system. They're required by code near sleeping areas for very good reason—they save lives.",
  29: "We tested all stairway lighting, verified light switch locations are convenient and code-compliant, shook railings to check stability, looked for loose balusters, and noted any trip hazards on stairs. Stairway falls are a leading cause of home injuries, especially for children and seniors. Proper lighting and stable railings are simple safety measures that prevent serious accidents.",
  30: "We walked through your entire home looking for loose rugs, extension cords across walkways, uneven flooring, and door thresholds that create tripping hazards. We focused on high-traffic areas and paths to bathrooms (nighttime fall risk). Trip hazards cause thousands of preventable injuries every year. Often, simple fixes like securing rugs or rerouting cords make your home dramatically safer.",
  31: "We tested every exterior door lock and deadbolt for smooth operation, noting any sticking, difficulty turning, or misaligned strike plates. Sticking locks often just need lubrication—an easy fix. But locks can also fail completely during emergencies when you need quick exit. Smooth-operating locks are essential for both security (keeping intruders out) and safety (allowing quick escape if needed).",
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
  const [showMoreTask, setShowMoreTask] = useState(null);
  const [clickedReferral, setClickedReferral] = useState(null);

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
                          <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '10px', lineHeight: '1.5' }}>
                            {TASK_DETAILS[task.taskNumber] || task.taskDescription}
                          </div>
                          <button
                            onClick={() => setShowMoreTask(showMoreTask === task.id ? null : task.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#2A54A1',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              padding: '0',
                              textDecoration: 'underline'
                            }}
                          >
                            {showMoreTask === task.id ? '\u2190 Show Less' : 'Show More \u2192'}
                          </button>
                          {showMoreTask === task.id && (
                            <div style={{
                              marginTop: '12px',
                              padding: '14px',
                              background: '#f0f9ff',
                              border: '2px solid #2A54A1',
                              borderRadius: '8px',
                              fontSize: '13px',
                              color: '#1e40af',
                              lineHeight: '1.7'
                            }}>
                              <strong style={{ display: 'block', marginBottom: '10px', color: '#2A54A1', fontSize: '14px' }}>What We Inspected & Why It Matters:</strong>
                              {TASK_SHOW_MORE[task.taskNumber] || task.taskDescription}
                            </div>
                          )}
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

                      {serviceAction && (
                        <div style={{ marginTop: '12px', clear: 'both' }}>
                          {serviceAction.type === 'Referral' ? (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => setClickedReferral(clickedReferral === task.id ? null : task.id)}
                                  style={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px', 
                                    padding: '10px 20px',
                                    textDecoration: 'none',
                                    background: clickedReferral === task.id ? '#10b981' : '#2A54A1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {clickedReferral === task.id ? '\u2713 ' : ''}Get {serviceAction.service} Referral
                                </button>
                              </div>
                              {clickedReferral === task.id && task.referralInfo && (
                                <div style={{
                                  marginTop: '12px',
                                  padding: '16px',
                                  background: '#d1fae5',
                                  border: '2px solid #10b981',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  color: '#065f46',
                                  fontWeight: '600'
                                }}>
                                  <div style={{ marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', color: '#059669' }}>Recommended Partner:</div>
                                  {task.referralInfo}
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              
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
                                Get {serviceAction.service}
                                {serviceAction.type === 'Handld' && (
                                  <img src="/Handld_Wordmark.png" alt="Handld" style={{ height: '18px', marginLeft: '6px', filter: 'brightness(0) invert(1)' }} />
                                )}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
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
    </div>
  );
}
