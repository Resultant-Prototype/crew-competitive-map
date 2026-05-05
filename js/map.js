// ── Crew Location Data ────────────────────────────────────────────────
const LOCATIONS = [
  {"id":6029,"name":"Indy – Thompson & Emerson","street":"5045 S. Emerson Avenue","city":"Indianapolis","state":"IN","zip":"46237","phone":"","hours":"","lat":39.69358823123011,"lng":-86.08256143523512,"coming_soon":true,"closed":false},
  {"id":6026,"name":"Fishers – 116th & Allisonville","street":"11578 Allisonville Road","city":"Fishers","state":"IN","zip":"46038","phone":"(317) 787-9820","hours":"Every Day 7am to 9pm","lat":39.9546,"lng":-86.0232,"coming_soon":false,"closed":false},
  {"id":150,"name":"Carmel – 106th and Michigan","street":"10580 N. Michigan Rd.","city":"Carmel","state":"IN","zip":"46032","phone":"(317) 824-0035","hours":"Every Day 7am to 9pm","lat":39.9396722,"lng":-86.2369832,"coming_soon":false,"closed":false},
  {"id":160,"name":"Carmel – Rangeline & Carmel Dr","street":"1250 Rangeline Rd.","city":"Carmel","state":"IN","zip":"46032","phone":"(317) 571-1929","hours":"Every Day 7am to 9pm","lat":39.960577,"lng":-86.1281363,"coming_soon":false,"closed":false},
  {"id":127,"name":"Castleton – Allisonville and I-465","street":"8252 Kelly Lane","city":"Indianapolis","state":"IN","zip":"46250","phone":"(317) 845-8868","hours":"Every Day 7am to 9pm","lat":39.906666,"lng":-86.0788409,"coming_soon":false,"closed":false},
  {"id":149,"name":"Downtown Indy – 12th and Meridian","street":"1219 N. Meridian St.","city":"Indianapolis","state":"IN","zip":"46204","phone":"(317) 423-2470","hours":"Every Day 7am to 9pm","lat":39.784065,"lng":-86.1569338,"coming_soon":false,"closed":false},
  {"id":2123,"name":"Fishers","street":"11650 Exit 5 Pkwy","city":"Fishers","state":"IN","zip":"46037","phone":"(463) 215-2311","hours":"Every Day 7am to 9pm","lat":39.9584342,"lng":-86.003028,"coming_soon":false,"closed":false},
  {"id":2006,"name":"Indy – 38th & Illinois","street":"111 W. 38th St.","city":"Indianapolis","state":"IN","zip":"46208","phone":"(463) 213-3280","hours":"Every Day 7am to 9pm","lat":39.8244109,"lng":-86.1597947,"coming_soon":false,"closed":false},
  {"id":135,"name":"Indy – I-69 and 96th St","street":"9550 Corporation Dr.","city":"Indianapolis","state":"IN","zip":"46256","phone":"(317) 849-4244","hours":"Every Day 7am to 9pm","lat":39.9264887,"lng":-86.0336586,"coming_soon":false,"closed":false},
  {"id":158,"name":"Keystone – Glendale – 62nd and Keystone","street":"6221 N. Keystone Ave.","city":"Indianapolis","state":"IN","zip":"46220","phone":"(317) 254-1949","hours":"Every Day 7am to 9pm","lat":39.8697575,"lng":-86.1214757,"coming_soon":false,"closed":false},
  {"id":4096,"name":"Noblesville – 146th & River Road","street":"14650 Umber Avenue","city":"Noblesville","state":"IN","zip":"46062","phone":"(463) 777-6776","hours":"Every Day 7am to 9pm","lat":40.0025543,"lng":-86.0355241,"coming_soon":false,"closed":false},
  {"id":4099,"name":"Noblesville – 32 & Hazel Dell","street":"5830 Trace Pointe Ave","city":"Noblesville","state":"IN","zip":"46062","phone":"463-777-6608","hours":"Exterior Wash: Every Day 7am to 9pm","lat":40.0420897,"lng":-86.069899,"coming_soon":false,"closed":false},
  {"id":161,"name":"Noblesville – Exit 210 at I-69","street":"13425 Tegler Dr.","city":"Noblesville","state":"IN","zip":"46060","phone":"(317) 776-0936","hours":"Exterior Wash: Every Day 7am to 9pm","lat":39.9937682,"lng":-85.9263763,"coming_soon":false,"closed":false},
  {"id":137,"name":"Noblesville – S.R. 37 and Mercantile Blvd","street":"17115 Mercantile Blvd.","city":"Noblesville","state":"IN","zip":"46060","phone":"(317) 776-9331","hours":"Every Day 7am to 9pm","lat":40.0370784,"lng":-85.9944952,"coming_soon":false,"closed":false},
  {"id":2607,"name":"Nora","street":"1501 E 86th St","city":"Indianapolis","state":"IN","zip":"46240","phone":"(317) 983-7707","hours":"Every Day 7am to 9pm","lat":39.9120715,"lng":-86.134589,"coming_soon":false,"closed":false},
  {"id":140,"name":"Westfield/Carmel – Greyhound Pass & 146th","street":"14837 Thatcher Lane","city":"Carmel","state":"IN","zip":"46032","phone":"(317) 815-5804","hours":"Every Day 7am to 9pm","lat":40.004276,"lng":-86.1263763,"coming_soon":false,"closed":false},
  {"id":1449,"name":"Westfield – S.R. 32 and Grand Park","street":"777 E. SR 32","city":"Westfield","state":"IN","zip":"46074","phone":"(317) 399-3041","hours":"Every Day 7am to 9pm","lat":40.0422214,"lng":-86.1445334,"coming_soon":false,"closed":false},
  {"id":4098,"name":"Whitestown","street":"6480 Center Drive","city":"Zionsville","state":"IN","zip":"46077","phone":"317-359-1865","hours":"Exterior Wash: Every Day 7am to 9pm","lat":39.9482727,"lng":-86.3470005,"coming_soon":false,"closed":false},
  {"id":147,"name":"Avon – Rockville Rd","street":"10764 E. US Hwy. 36","city":"Avon","state":"IN","zip":"46123","phone":"(317) 209-1700","hours":"Exterior Wash: Every Day 7am to 9pm","lat":39.7642913,"lng":-86.3307536,"coming_soon":false,"closed":false},
  {"id":827,"name":"Avon – West/US-36","street":"7127 E. US Hwy. 36","city":"Avon","state":"IN","zip":"46123","phone":"(317) 204-0208","hours":"Every Day 7am to 9pm","lat":39.76239,"lng":-86.397563,"coming_soon":false,"closed":false},
  {"id":366,"name":"Brownsburg – I-74 & Green St","street":"1275 N. Green St.","city":"Brownsburg","state":"IN","zip":"46112","phone":"(317) 456-1741","hours":"Every Day 7am to 9pm","lat":39.8611383,"lng":-86.3919513,"coming_soon":false,"closed":false},
  {"id":132,"name":"Indy – Michigan & W 86th St","street":"3345 West 86th St.","city":"Indianapolis","state":"IN","zip":"46268","phone":"(317) 876-1160","hours":"Every Day 7am to 9pm","lat":39.9112285,"lng":-86.2186686,"coming_soon":false,"closed":false},
  {"id":143,"name":"Indy – Lafayette Rd and Georgetown","street":"4280 Lafayette Rd.","city":"Indianapolis","state":"IN","zip":"46254","phone":"(317) 291-9727","hours":"Every Day 7am to 9pm","lat":39.8329509,"lng":-86.2445481,"coming_soon":false,"closed":false},
  {"id":141,"name":"Plainfield – US 40","street":"2674 E. Main St.","city":"Plainfield","state":"IN","zip":"46168","phone":"(317) 839-0220","hours":"Every Day 7am to 9pm","lat":39.7193792,"lng":-86.3548438,"coming_soon":false,"closed":false},
  {"id":2122,"name":"Speedway","street":"2505 Founders Square Dr.","city":"Speedway","state":"IN","zip":"46224","phone":"(317) 743-0639","hours":"Every Day 7am to 9pm","lat":39.8017711,"lng":-86.2714455,"coming_soon":false,"closed":false},
  {"id":5286,"name":"Camby","street":"8380 Windfall Lane","city":"Camby","state":"IN","zip":"46113","phone":"317-845-0948","hours":"Every Day 7am to 9pm","lat":39.64141421674915,"lng":-86.3346408834864,"coming_soon":false,"closed":false},
  {"id":5447,"name":"Center Grove – South SR 135","street":"2840 S SR 135","city":"Greenwood","state":"IN","zip":"46143","phone":"(317) 423-0084","hours":"Every Day 7am to 9pm","lat":39.57607618055865,"lng":-86.15860991334434,"coming_soon":false,"closed":false},
  {"id":1935,"name":"Greenwood – Main St.","street":"1151 South Park Dr.","city":"Greenwood","state":"IN","zip":"46143","phone":"(317) 743-0660","hours":"Every Day 7am to 9pm","lat":39.6148529,"lng":-86.0801777,"coming_soon":false,"closed":false},
  {"id":155,"name":"Greenwood – SR 135","street":"530 N State Rd 135","city":"Greenwood","state":"IN","zip":"46142","phone":"(317) 885-9956","hours":"Every Day 7am to 9pm","lat":39.6041479,"lng":-86.1591157,"coming_soon":false,"closed":false},
  {"id":153,"name":"Greenwood – US 31","street":"8230 US 31 South","city":"Greenwood","state":"IN","zip":"46227","phone":"(317) 881-6299","hours":"Every Day 7am to 9pm","lat":39.6452715,"lng":-86.134557,"coming_soon":false,"closed":false},
  {"id":136,"name":"Indy – South East St","street":"3501 South East St.","city":"Indianapolis","state":"IN","zip":"46227","phone":"(317) 787-9821","hours":"Every Day 7am to 9pm","lat":39.714811,"lng":-86.1484414,"coming_soon":false,"closed":false},
  {"id":145,"name":"Indy – Southport & Emerson","street":"7060 Emblem Dr.","city":"Indianapolis","state":"IN","zip":"46237","phone":"(317) 885-1470","hours":"Every Day 7am to 9pm","lat":39.6652804,"lng":-86.0820936,"coming_soon":false,"closed":false},
  {"id":2141,"name":"Greenfield","street":"1726 N. State St.","city":"Greenfield","state":"IN","zip":"46140","phone":"(317) 436-1637","hours":"Every Day 7am to 9pm","lat":39.8088104,"lng":-85.7705493,"coming_soon":false,"closed":false},
  {"id":142,"name":"Indy – Pendleton Pike and 56th St","street":"10305 Pendleton Pike","city":"Indianapolis","state":"IN","zip":"46236","phone":"(317) 823-9030","hours":"Every Day 7am to 9pm","lat":39.8560539,"lng":-85.9846545,"coming_soon":false,"closed":false},
  {"id":3684,"name":"Indy – Pendleton Pike and Franklin Rd","street":"4405 N Franklin Road","city":"Indianapolis","state":"IN","zip":"46226","phone":"(463) 205-0434","hours":"Every Day 7am to 9pm","lat":39.8372766,"lng":-86.0267847,"coming_soon":false,"closed":false},
  {"id":139,"name":"Indy – Washington Square","street":"10229 E. Washington St.","city":"Indianapolis","state":"IN","zip":"46229","phone":"(317) 890-8360","hours":"Every Day 7am to 9pm","lat":39.7745541,"lng":-85.9847645,"coming_soon":false,"closed":false},
  {"id":138,"name":"Indy – Washington St","street":"7424 E. Washington","city":"Indianapolis","state":"IN","zip":"46219","phone":"(317) 359-1818","hours":"Every Day 7am to 9pm","lat":39.7729332,"lng":-86.0363022,"coming_soon":false,"closed":false},
  {"id":2606,"name":"McCordsville","street":"6963 W Broadway","city":"McCordsville","state":"IN","zip":"46055","phone":"(463) 345-3995","hours":"Every Day 7am to 9pm","lat":39.8878505,"lng":-85.9357677,"coming_soon":false,"closed":false},
  {"id":5285,"name":"Terre Haute – IN-46","street":"2102 South State Rd 46","city":"Terre Haute","state":"IN","zip":"47803","phone":"(812) 558-0942","hours":"Every Day 7am to 9pm","lat":39.44084896268376,"lng":-87.33226471616402,"coming_soon":false,"closed":true},
  {"id":168,"name":"Anderson","street":"5010 S. Scatterfield Rd.","city":"Anderson","state":"IN","zip":"46016","phone":"(765) 622-5339","hours":"Every Day 7am to 9pm","lat":40.0637211,"lng":-85.652358,"coming_soon":false,"closed":false},
  {"id":4969,"name":"Bloomington – East","street":"235 S Pete Ellis Dr.","city":"Bloomington","state":"IN","zip":"47408","phone":"(930) 260-0192","hours":"Every Day 7am to 9pm","lat":39.164561019482804,"lng":-86.49458252965292,"coming_soon":false,"closed":false},
  {"id":826,"name":"Bloomington – West","street":"3430 W. 3rd Street","city":"Bloomington","state":"IN","zip":"47404","phone":"(812) 558-7204","hours":"Every Day 7am to 9pm","lat":39.1651251,"lng":-86.5779578,"coming_soon":false,"closed":false},
  {"id":163,"name":"Columbus","street":"1525 National Rd.","city":"Columbus","state":"IN","zip":"47201","phone":"(812) 418-8791","hours":"Every Day 7am to 9pm","lat":39.2154829,"lng":-85.8816831,"coming_soon":false,"closed":false},
  {"id":164,"name":"Kokomo","street":"1824 E. Hoffer St.","city":"Kokomo","state":"IN","zip":"46902","phone":"(765) 459-9254","hours":"Every Day 7am to 9pm","lat":40.4667415,"lng":-86.1086522,"coming_soon":false,"closed":false},
  {"id":169,"name":"Lafayette","street":"4023 State Road 26 E","city":"Lafayette","state":"IN","zip":"47905","phone":"(765) 446-2622","hours":"Every Day 7am to 9pm","lat":40.4170778,"lng":-86.8297135,"coming_soon":false,"closed":false},
  {"id":825,"name":"Merrillville","street":"501 W 81st Ave","city":"Merrillville","state":"IN","zip":"46410","phone":"(219) 525-6694","hours":"Every Day 7am to 9pm","lat":41.470438,"lng":-87.3430815,"coming_soon":false,"closed":false},
  {"id":1129,"name":"Muncie","street":"601 W. McGalliard Road","city":"Muncie","state":"IN","zip":"47303","phone":"(765) 288-3252","hours":"Every Day 7am to 9pm","lat":40.2185689,"lng":-85.392624,"coming_soon":false,"closed":false},
  {"id":3581,"name":"Munster","street":"111 Ridge Road","city":"Munster","state":"IN","zip":"46321","phone":"219-985-3890","hours":"Every Day 7am to 9pm","lat":41.56361428423305,"lng":-87.52348949770125,"coming_soon":false,"closed":false},
  {"id":4587,"name":"Schererville","street":"605 U.S. 41","city":"Schererville","state":"IN","zip":"46375","phone":"(219) 247-8897","hours":"Every Day 7am to 9pm","lat":41.514841294732456,"lng":-87.47077164219449,"coming_soon":false,"closed":false},
  {"id":2005,"name":"South Lafayette","street":"1805 Troxel Dr.","city":"Lafayette","state":"IN","zip":"47909","phone":"(765) 385-9039","hours":"Every Day 7am to 9pm","lat":40.3675785,"lng":-86.8752054,"coming_soon":false,"closed":false},
  {"id":1936,"name":"St. John","street":"9705 Wicker Ave.","city":"St John","state":"IN","zip":"46373","phone":"(219) 351-3090","hours":"Every Day 7am to 9pm","lat":41.4428894,"lng":-87.469355,"coming_soon":false,"closed":false},
  {"id":167,"name":"Terre Haute – US-41","street":"5010 S. US Hwy. 41","city":"Terre Haute","state":"IN","zip":"47802","phone":"(812) 298-1330","hours":"Every Day 7am to 9pm","lat":39.4066674,"lng":-87.4075209,"coming_soon":false,"closed":true},
  {"id":1825,"name":"Valparaiso","street":"2615 LaPorte Ave.","city":"Valparaiso","state":"IN","zip":"46383","phone":"(219) 224-3395","hours":"Every Day 7am to 9pm","lat":41.4694408,"lng":-87.0280817,"coming_soon":false,"closed":false},
  {"id":162,"name":"West Lafayette","street":"277 Sagamore Pkwy West","city":"West Lafayette","state":"IN","zip":"47906","phone":"(765) 463-1138","hours":"Every Day 7am to 9pm","lat":40.4525683,"lng":-86.9106773,"coming_soon":false,"closed":false},
  {"id":4318,"name":"Eden Prairie","street":"16345 Terrey Pine Drive","city":"Eden Prairie","state":"MN","zip":"55344","phone":"612-682-8177","hours":"Exterior Wash: Every Day 7am to 9pm","lat":44.8615824,"lng":-93.484951,"coming_soon":false,"closed":false},
  {"id":2094,"name":"Maple Grove","street":"13370 Grove Dr.","city":"Maple Grove","state":"MN","zip":"55369","phone":"(763) 520-8667","hours":"Every Day 7am to 9pm","lat":45.1043738,"lng":-93.4509665,"coming_soon":false,"closed":false},
  {"id":2095,"name":"St. Cloud","street":"4118 Division St.","city":"St. Cloud","state":"MN","zip":"56301","phone":"763-398-0874","hours":"Every Day 7am to 9pm","lat":45.552775,"lng":-94.2094117,"coming_soon":false,"closed":false},
  {"id":3422,"name":"Wayzata","street":"1405 Wayzata Blvd","city":"Wayzata","state":"MN","zip":"55391","phone":"(952) 960-8980","hours":"Every Day 7am to 9pm","lat":44.9716905,"lng":-93.495433,"coming_soon":false,"closed":false},
  {"id":2627,"name":"West St. Paul","street":"1949 South Robert St","city":"West St Paul","state":"MN","zip":"55118","phone":"(651) 400-8944","hours":"Every Day 7am to 9pm","lat":44.8874382,"lng":-93.0809851,"coming_soon":false,"closed":false},
  {"id":5283,"name":"Champaign","street":"2029 N Prospect Ave","city":"Champaign","state":"IL","zip":"61822","phone":"(217) 303-5779","hours":"Every Day 7am to 9pm","lat":40.13989257845443,"lng":-88.2585349230213,"coming_soon":false,"closed":false}
];

// ── Utilities ────────────────────────────────────────────────────────
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


// ── Map Functions ────────────────────────────────────────────────────
document.getElementById('overlay-btn').addEventListener('click', () => {
  document.getElementById('overlay').style.display = 'none';
});
document.getElementById('mister-toggle').addEventListener('click', toggleMister);
document.querySelectorAll('.wisc-card[data-fly]').forEach(card => {
  card.addEventListener('click', () => {
    const [lat, lng, zoom] = card.dataset.fly.split(',').map(Number);
    flyTo(lat, lng, zoom);
  });
});

let misterVisible = false;

function setMisterVisibility(show) {
  misterVisible = show;
  const vis = show ? 'visible' : 'none';
  ['mister-heat','mister-circles','tommys-heat','tommys-circles']
    .forEach(id => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', vis));
  const btn = document.getElementById('mister-toggle');
  btn.textContent = show ? 'Hide Competitors' : 'Show Competitors';
  btn.classList.toggle('active', show);
}

function toggleMister() { setMisterVisibility(!misterVisible); }

function flyTo(lat, lng, zoom) {
  map.flyTo({ center: [lng, lat], zoom, duration: 1500 });
  setMisterVisibility(true);
}

const PRESSURE_COLOR = { high: '#DC2626', medium: '#EA580C', low: '#D97706', none: '#16A34A' };

function distanceMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2
    + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computePressure(loc) {
  function chainDists(locs, chainName) {
    return locs.map(m => ({
      city: m.city, state: m.state, chain: chainName,
      d: distanceMi(loc.lat, loc.lng, m.lat, m.lng)
    })).sort((a, b) => a.d - b.d);
  }
  function counts(dists) {
    return {
      within1: dists.filter(d => d.d <= 1).length,
      within3: dists.filter(d => d.d <= 3).length,
      within5: dists.filter(d => d.d <= 5).length,
    };
  }
  const mDists = chainDists(MISTER_DATA, 'Mister CW');
  const tDists = chainDists(TOMMYS_DATA, "Tommy's");
  const allDists = [...mDists, ...tDists].sort((a, b) => a.d - b.d);
  const nearest = allDists.slice(0, 3).filter(d => d.d <= 10);
  const all = counts(allDists);
  let level;
  if (all.within1 >= 1 || all.within3 >= 3) level = 'high';
  else if (all.within3 >= 1)                 level = 'medium';
  else if (all.within5 >= 1)                 level = 'low';
  else                                        level = 'none';
  return { mister: counts(mDists), tommys: counts(tDists), nearest, level };
}

function pressureHTML(p) {
  const label = { high: 'High', medium: 'Medium', low: 'Low', none: 'None' }[p.level];
  const nearbyRows = p.nearest.length
    ? p.nearest.map(n => `<div>${n.chain}, ${n.city} &middot; ${n.d.toFixed(1)} mi</div>`).join('')
    : '<div>None within 10 mi</div>';
  return `
    <hr class="popup-divider">
    <div class="competitor-header">
      <span class="competitor-label">Competitive Pressure</span>
      <span class="pressure-badge pressure-${p.level}">${label}</span>
    </div>
    <div class="chain-table">
      <div class="chain-row chain-header"><span></span><span>1 mi</span><span>3 mi</span><span>5 mi</span></div>
      <div class="chain-row"><span>Mister CW</span><span>${p.mister.within1}</span><span>${p.mister.within3}</span><span>${p.mister.within5}</span></div>
      <div class="chain-row"><span>Tommy's</span><span>${p.tommys.within1}</span><span>${p.tommys.within3}</span><span>${p.tommys.within5}</span></div>
    </div>
    <div class="nearby-list">${nearbyRows}</div>`;
}

function addMarkers() {
  LOCATIONS.forEach(loc => {
    const pressure = (!loc.closed && !loc.coming_soon)
      ? computePressure(loc) : null;

    const el = document.createElement('div');
    if (loc.closed) {
      el.className = 'marker closed';
    } else if (loc.coming_soon) {
      el.className = 'marker soon';
    } else {
      el.className = 'marker active';
      if (pressure) el.style.background = PRESSURE_COLOR[pressure.level];
    }

    const addr = `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`;
    let badge = '';
    if (loc.coming_soon) badge = '<span class="popup-badge badge-soon">Coming Soon</span>';
    if (loc.closed)      badge = '<span class="popup-badge badge-closed">Closed</span>';

    const popup = new maplibregl.Popup({ offset: 10, closeButton: false })
      .setHTML(`<div class="popup-name">${loc.name}</div><div class="popup-addr">${addr}</div>${badge}${pressure ? pressureHTML(pressure) : ''}`);

    new maplibregl.Marker({ element: el })
      .setLngLat([loc.lng, loc.lat])
      .setPopup(popup)
      .addTo(map);
  });
}

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [-86.15, 39.9],
  zoom: 7
});


function addChainLayer(id, data, heatPalette, circleColor) {
  map.addSource(id + '-source', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data.map(m => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [m.lng, m.lat] },
        properties: { name: m.name, city: m.city }
      }))
    }
  });
  map.addLayer({
    id: id + '-heat', type: 'heatmap', source: id + '-source', maxzoom: 13,
    paint: {
      'heatmap-weight': 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-radius':   ['interpolate', ['linear'], ['zoom'], 0, 4, 9, 30],
      'heatmap-opacity':  ['interpolate', ['linear'], ['zoom'], 10, 1, 13, 0],
      'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
        0, heatPalette[0], 0.2, heatPalette[1], 0.5, heatPalette[2], 0.8, heatPalette[3], 1, heatPalette[4]
      ]
    },
    layout: { visibility: 'none' }
  });
  map.addLayer({
    id: id + '-circles', type: 'circle', source: id + '-source', minzoom: 10,
    paint: {
      'circle-radius': 7, 'circle-color': circleColor,
      'circle-stroke-width': 1.5, 'circle-stroke-color': '#fff',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0, 12, 0.9]
    },
    layout: { visibility: 'none' }
  });
}

map.on('load', () => {
  addMarkers();
  addChainLayer('mister', MISTER_DATA,
    ['rgba(139,92,246,0)','rgba(139,92,246,0.35)','rgba(139,92,246,0.65)','rgba(109,40,217,0.85)','rgba(109,40,217,1)'],
    '#8B5CF6'
  );
  addChainLayer('tommys', TOMMYS_DATA,
    ['rgba(217,70,239,0)','rgba(217,70,239,0.35)','rgba(217,70,239,0.65)','rgba(190,24,93,0.85)','rgba(190,24,93,1)'],
    '#D946EF'
  );
});

// ── Operating Picture ─────────────────────────────────────────────────────

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

