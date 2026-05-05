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
