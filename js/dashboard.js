// ── Utilities & Constants ────────────────────────────────────────────
function fmt$(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
function fmtPct(n) { return (n * 100).toFixed(1) + '%'; }
function fmtDelta(n) {
  const sign = n >= 0 ? '+' : '−';
  return sign + (Math.abs(n) * 100).toFixed(1) + '%';
}

const AREA_BOOST = {
  'North': 1.22, 'West': 1.08, 'South': 1.10, 'East': 1.00,
  'Maple Grove': 0.92, 'West St. Paul': 0.90, 'St. Cloud': 0.82,
  'Illinois': 0.88, 'Other Indiana Locations': 0.76
};

// Per-site prestige multiplier for known high-traffic locations
const SITE_BOOST = {
  160: 1.18,  // Carmel Rangeline
  150: 1.12,  // Carmel 106th
  6026: 1.10, // Fishers 116th
  2123: 1.10, // Fishers Exit 5
  4099: 1.15, // Noblesville Hazel Dell
  140: 1.10,  // Westfield/Carmel 146th
  127: 1.08,  // Castleton
};

const PILOT_ID  = 5283; // Champaign IL
const MAPLE_ID  = 2094; // Maple Grove MN
const HAZEL_ID  = 4099; // Noblesville 32 & Hazel Dell
const CARMEL_ID = 160;  // Carmel Rangeline


// ── Data Generation ────────────────────────────────────────────────────
function genSiteData(loc) {
  const r = mulberry32(loc.id * 997 + 20260505);
  const boost = (AREA_BOOST[loc.area] || 0.86) * (SITE_BOOST[loc.id] || 1.0);
  const cars = Math.round((260 + r() * 160) * boost);
  const avgTicket = 17.5 + r() * 8.5;
  const revenue = Math.round(cars * avgTicket);

  // Membership: Champaign ramps slowly, Carmel and North skew high
  let memBase = 0.29 + r() * 0.23;
  if (loc.id === PILOT_ID) memBase = 0.18 + r() * 0.09;   // early ramp
  if (loc.id === CARMEL_ID) memBase = Math.max(memBase, 0.46);
  if (loc.area === 'North') memBase = Math.min(memBase + 0.04, 0.52);

  // Labor: Maple Grove slightly elevated on weather underperformance
  let laborPct = 0.19 + r() * 0.12;
  if (loc.id === MAPLE_ID) laborPct = Math.min(laborPct + 0.04, 0.32);

  // New members: Carmel gets a bump
  let newMembers = Math.round(1 + r() * 11);
  if (loc.id === CARMEL_ID) newMembers = Math.max(newMembers, 10);
  if (loc.id === PILOT_ID) newMembers = Math.min(newMembers, 4);

  // Day-over-day: weather boost for IN-North, dip for MN
  let revDelta = -0.07 + r() * 0.18;
  if (['North','West','South'].includes(loc.area)) revDelta += 0.05;
  if ([MAPLE_ID, 3422, 2627, 2095, 4318].includes(loc.id)) revDelta -= 0.07;

  // Data quality score: Champaign lower due to pilot variance
  const dq = loc.id === PILOT_ID ? 91.8 + r() * 2.5 : 95.2 + r() * 4.7;

  return { cars, revenue, memberRate: memBase, newMembers, laborPct, revDelta, dq };
}

const NARRATIVES = [
  { id: HAZEL_ID, tag: 'tag-top', tagLabel: 'Top Performer',
    text: d => `Noblesville Hazel Dell led the North region today with ${d.cars.toLocaleString()} cars washed and revenue of ${fmt$(d.revenue)} — ${fmtDelta(d.revDelta)} vs. yesterday. Early-morning rainfall activated deferred-wash demand, and plan entitlement metrics were fully utilized: interior detail attach rate ran 18 pts above network average. Membership penetration at ${fmtPct(d.memberRate)} continues to compound the site's revenue floor.` },
  { id: CARMEL_ID, tag: 'tag-velocity', tagLabel: 'Membership Velocity',
    text: d => `Carmel Rangeline added ${d.newMembers} new Unlimited Wash Club members today — strongest velocity in the network. The Rinsed CRM integration surfaced 34 lapsed members via win-back sequence; 8 re-activated today. Overall penetration is ${fmtPct(d.memberRate)}, 11 pts above network average. Revenue of ${fmt$(d.revenue)} reflects a high-value suburban demographic responding well to the loyalty stack.` },
  { id: PILOT_ID, tag: 'tag-pilot', tagLabel: 'Pilot Site',
    text: d => `Champaign is tracking a 2.3% variance in plan activation records post-launch — ${d.newMembers} new members signed today against a Rinsed CRM target of 6. A mismatch between NXTWash plan SKUs and Snowflake dimension keys is under investigation; data quality score is ${d.dq.toFixed(1)}%, flagging below the 95% threshold. Ops and data engineering are aligned on a fix by EOD tomorrow. Revenue of ${fmt$(d.revenue)} is in line with the new-market ramp curve.` },
  { id: MAPLE_ID, tag: 'tag-weather', tagLabel: 'Weather Effect',
    text: d => `Maple Grove posted ${d.cars.toLocaleString()} cars (${fmtDelta(d.revDelta)} vs. yesterday) as dry conditions in the Twin Cities held back wash demand relative to the rain-boosted Indiana fleet. Labor as a % of revenue ticked to ${fmtPct(d.laborPct)} — a predictable weather-driven inefficiency. Membership retention at ${fmtPct(d.memberRate)} is the strongest outside Indiana, providing a stable revenue floor even in soft volume weeks.` }
];

// ── Dashboard ────────────────────────────────────────────────────────────
let dashboardBuilt = false;
let velChartInst = null;

function buildDashboard() {
  if (dashboardBuilt) return;
  dashboardBuilt = true;

  const active = LOCATIONS.filter(l => !l.coming_soon && !l.closed);
  const siteData = active.map(l => ({ loc: l, ...genSiteData(l) }));

  // ── KPI cards ──────────────────────────────────────────────────────────
  const totalRev  = siteData.reduce((s, d) => s + d.revenue, 0);
  const totalCars = siteData.reduce((s, d) => s + d.cars, 0);
  const avgMem    = siteData.reduce((s, d) => s + d.memberRate, 0) / siteData.length;
  const avgLabor  = siteData.reduce((s, d) => s + d.laborPct, 0) / siteData.length;

  const laborDir = avgLabor <= 0.255;
  document.getElementById('kpi-row').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Network Revenue · Today</div>
      <div class="kpi-value">${fmt$(totalRev)}</div>
      <div class="kpi-delta delta-up">↑ 4.2% vs. yesterday</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Cars Washed · Today</div>
      <div class="kpi-value">${totalCars.toLocaleString()}</div>
      <div class="kpi-delta delta-up">↑ 6.8% vs. yesterday · rain effect IN-North</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Membership Penetration</div>
      <div class="kpi-value">${fmtPct(avgMem)}</div>
      <div class="kpi-delta delta-neu">+0.3 pts vs. last week</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Labor % of Revenue</div>
      <div class="kpi-value">${fmtPct(avgLabor)}</div>
      <div class="kpi-delta ${laborDir ? 'delta-up' : 'delta-dn'}">${laborDir ? '↓' : '↑'} ${(Math.abs(avgLabor - 0.25)*100).toFixed(1)} pts vs. 25% target</div>
    </div>
    <div class="kpi-card kpi-migration">
      <div class="kpi-tooltip-icon" data-tip="Tracks data fidelity across Transaction, Plan, and Customer domains from NXTWash → Snowflake → Rinsed CRM.">?</div>
      <div class="kpi-label">Migration Readiness Score</div>
      <div class="kpi-value">97.3%</div>
      <div class="kpi-delta">↑ 1.1 pts vs. last sprint · 1 site flagged</div>
      <div class="prog-track"><div class="prog-fill" id="mig-bar" style="width:0%"></div></div>
    </div>`;

  // Animate progress bar after paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const bar = document.getElementById('mig-bar');
    if (bar) bar.style.width = '97.3%';
  }));

  // ── Narrative cards ────────────────────────────────────────────────────
  document.getElementById('narrative-grid').innerHTML = NARRATIVES.map(n => {
    const entry = siteData.find(d => d.loc.id === n.id);
    if (!entry) return '';
    return `<div class="narrative-card">
      <div class="nar-tag-row"><span class="nar-tag ${n.tag}">${n.tagLabel}</span></div>
      <div class="nar-site">${entry.loc.name}</div>
      <div class="nar-meta">${entry.loc.city}, ${entry.loc.state} · ${entry.loc.street}</div>
      <div class="nar-text">${n.text(entry)}</div>
    </div>`;
  }).join('');

  // ── Membership velocity Chart.js bar ───────────────────────────────────
  const top10 = [...siteData].sort((a, b) => b.newMembers - a.newMembers).slice(0, 10);
  const velGradient = [11, 10, 10, 9, 8, 8, 7, 7, 6, 5];
  top10.forEach((d, i) => { d.newMembers = velGradient[i]; });
  const ctx = document.getElementById('vel-chart').getContext('2d');
  if (velChartInst) velChartInst.destroy();
  velChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(d => d.loc.name.replace(/\s*[–-]\s*/g, ' · ').replace(' & ', ' & ')),
      datasets: [{
        data: top10.map(d => d.newMembers),
        backgroundColor: top10.map(d =>
          d.loc.id === CARMEL_ID ? '#005FA3' :
          d.loc.id === PILOT_ID  ? '#DC2626' : '#3B82F6'
        ),
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} new members today`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#F3F4F6' },
          ticks: { font: { size: 11 }, color: '#6B7280' },
          title: { display: true, text: 'New Sign-ups Today', font: { size: 11 }, color: '#9CA3AF' }
        },
        y: { ticks: { font: { size: 11 }, color: '#374151' }, grid: { display: false } }
      }
    }
  });

  // ── Site table ─────────────────────────────────────────────────────────
  let sortCol = 'revenue', sortDir = -1;

  function memPill(v)   { return v > 0.40 ? 'pill-g' : v > 0.27 ? 'pill-y' : 'pill-r'; }
  function laborPill(v) { return v < 0.24 ? 'pill-g' : v < 0.29 ? 'pill-y' : 'pill-r'; }
  function deltaColor(v){ return v >= 0.05 ? '#16A34A' : v <= -0.05 ? '#DC2626' : 'var(--txt-3)'; }
  function dqIcon(v, id) {
    if (id === PILOT_ID) return `<span class="dq-warn" title="${v.toFixed(1)}% — below 95% threshold">⚠</span>`;
    return `<span class="dq-ok" title="${v.toFixed(1)}% complete">✓</span>`;
  }

  function renderTable() {
    const sorted = [...siteData].sort((a, b) => {
      let av, bv;
      if (sortCol === 'name')  { av = a.loc.name;  bv = b.loc.name; }
      else if (sortCol === 'state') { av = a.loc.state; bv = b.loc.state; }
      else { av = a[sortCol] ?? 0; bv = b[sortCol] ?? 0; }
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });

    document.getElementById('site-tbody').innerHTML = sorted.map(d => {
      const isPilot = d.loc.id === PILOT_ID;
      return `<tr>
        <td class="td-name">${d.loc.name}${isPilot ? '<span class="badge-pilot">Pilot</span>' : ''}</td>
        <td>${d.loc.state}</td>
        <td>${d.cars.toLocaleString()}</td>
        <td>${fmt$(d.revenue)}</td>
        <td><span class="pill ${memPill(d.memberRate)}">${fmtPct(d.memberRate)}</span></td>
        <td><span class="pill ${laborPill(d.laborPct)}">${fmtPct(d.laborPct)}</span></td>
        <td style="color:${deltaColor(d.revDelta)};font-weight:600">${fmtDelta(d.revDelta)}</td>
        <td>${dqIcon(d.dq, d.loc.id)}</td>
      </tr>`;
    }).join('');

    document.querySelectorAll('#site-table th').forEach(th => {
      th.classList.remove('sort-asc','sort-desc');
      if (th.dataset.col === sortCol) th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
    });
  }

  document.querySelectorAll('#site-table th').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortDir *= -1;
      else { sortCol = th.dataset.col; sortDir = -1; }
      renderTable();
    });
  });

  renderTable();
}
