const fs = require('fs');
const path = require('path');

// Color Hunt Palette: #FAF7F0 #D8D2C2 #B17457 #4A4947
const C1 = '#FAF7F0'; // Cream / Warm Off-White
const C2 = '#D8D2C2'; // Light Taupe / Sand Linen
const C3 = '#B17457'; // Warm Terracotta / Clay Rust Accent
const C4 = '#4A4947'; // Warm Charcoal Slate
const BG_DARK = '#1c1b1a'; // Deep warm dark
const BG_CARD = '#242321'; // Elevated warm card
const BORDER = '#4A4947';

// Read real contributions
const cells = JSON.parse(fs.readFileSync(path.join(__dirname, 'cells.json'), 'utf8'));
const totalContributions = cells.reduce((sum, c) => sum + c.count, 0);

// 1. Generate 3D Isometric Contribution Graph SVG based on REAL cells
function generate3DGraphSvg() {
  const cellMap = {};
  cells.forEach(c => {
    cellMap[`${c.x},${c.y}`] = c;
  });

  return `<svg width="860" height="380" viewBox="0 0 860 380" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="860" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${BG_DARK}" />
      <stop offset="100%" stop-color="${BG_CARD}" />
    </linearGradient>
  </defs>

  <rect width="860" height="380" rx="8" fill="url(#bgGrad)" stroke="${BORDER}" stroke-width="1"/>

  <!-- Date range header -->
  <text x="730" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" fill="${C2}" text-anchor="end">2026.04.12 - 2026.10.27</text>

  <!-- ISOMETRIC 3D CONTRIBUTION TILES BASED ON ACTUAL CONTRIBUTIONS -->
  <g transform="translate(140, 110)">
    ${(() => {
      let tiles = '';
      const rows = 7;
      const cols = 53;
      const originX = 20;
      const originY = 80;
      const dx = 8;
      const dy = 4.5;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = originX + (c * dx) + (r * dx * 0.4);
          const y = originY + (r * dy * 1.8) - (c * dy * 0.3);
          const cell = cellMap[`${c},${r}`] || { count: 0, level: 0 };
          
          const count = cell.count;
          const h = count > 0 ? Math.min(55, count * 1.5 + 8) : 0;

          if (h > 0) {
            const topColor = count > 10 ? C1 : count > 3 ? C3 : C2;
            const leftColor = C4;
            const rightColor = '#2b2925';

            // Left Face
            tiles += `<polygon points="${x},${y - h + dy} ${x - dx * 0.5},${y - h} ${x - dx * 0.5},${y} ${x},${y + dy}" fill="${leftColor}" stroke="#1c1b1a" stroke-width="0.4"/>`;
            // Right Face
            tiles += `<polygon points="${x},${y - h + dy} ${x + dx * 0.5},${y - h} ${x + dx * 0.5},${y} ${x},${y + dy}" fill="${rightColor}" stroke="#1c1b1a" stroke-width="0.4"/>`;
            // Top Face
            tiles += `<polygon points="${x},${y - h - dy} ${x + dx * 0.5},${y - h} ${x},${y - h + dy} ${x - dx * 0.5},${y - h}" fill="${topColor}" stroke="${C4}" stroke-width="0.4"/>`;
          } else {
            const baseFill = ((c + r) % 2 === 0) ? "#292725" : "#22201e";
            tiles += `<polygon points="${x},${y - dy} ${x + dx * 0.5},${y} ${x},${y + dy} ${x - dx * 0.5},${y}" fill="${baseFill}" stroke="#363431" stroke-width="0.3"/>`;
          }
        }
      }
      return tiles;
    })()}
  </g>

  <!-- RADAR CHART (Top Right) -->
  <g transform="translate(680, 150)">
    <!-- Pentagon Web in #4A4947 & #D8D2C2 -->
    <polygon points="0,-70 66,-21 41,56 -41,56 -66,-21" fill="none" stroke="${C4}" stroke-width="1" stroke-dasharray="3,3"/>
    <polygon points="0,-45 42,-14 26,36 -26,36 -42,-14" fill="none" stroke="${C4}" stroke-width="1"/>
    <polygon points="0,-20 19,-6 12,16 -12,16 -19,-6" fill="none" stroke="${C4}" stroke-width="1"/>
    
    <line x1="0" y1="0" x2="0" y2="-70" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="66" y2="-21" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="41" y2="56" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="-41" y2="56" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="-66" y2="-21" stroke="${C4}" stroke-width="1"/>

    <!-- Radar Data Shape in #B17457 & #FAF7F0 -->
    <polygon points="0,-58 50,-15 28,38 -20,20 -45,-12" fill="${C3}" fill-opacity="0.35" stroke="${C1}" stroke-width="1.8"/>

    <text x="0" y="-76" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C1}" text-anchor="middle">Commit</text>
    <text x="74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="start">Issue</text>
    <text x="46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="start">PullReq</text>
    <text x="-46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="end">Review</text>
    <text x="-74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="end">Repo</text>
  </g>

  <!-- DONUT CHART (Bottom Left) -->
  <g transform="translate(100, 300)">
    <circle cx="40" cy="30" r="28" fill="none" stroke="#2b2925" stroke-width="14"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C1}" stroke-width="14" stroke-dasharray="80 180" stroke-dashoffset="0"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C3}" stroke-width="14" stroke-dasharray="55 180" stroke-dashoffset="-80"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C2}" stroke-width="14" stroke-dasharray="40 180" stroke-dashoffset="-135"/>

    <rect x="95" y="10" width="8" height="8" rx="2" fill="${C1}"/>
    <text x="110" y="18" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C1}">Python</text>

    <rect x="95" y="26" width="8" height="8" rx="2" fill="${C3}"/>
    <text x="110" y="34" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C2}">Jupyter</text>

    <rect x="95" y="42" width="8" height="8" rx="2" fill="${C2}"/>
    <text x="110" y="50" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C2}">TypeScript</text>
  </g>

  <!-- STATS TOTALS -->
  <g transform="translate(320, 340)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">69 <tspan font-size="12" font-weight="400" fill="${C2}">contributions</tspan></text>
    <text x="150" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">★ 7 <tspan font-size="12" font-weight="400" fill="${C2}">repositories</tspan></text>
    <text x="270" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">⑂ 2 <tspan font-size="12" font-weight="400" fill="${C2}">followers</tspan></text>
  </g>
</svg>`;
}

// 2. Summary Cards
function generateReposPerLanguageSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${C1}">Top Languages by Repo</text>
  <g transform="translate(75, 115)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="#2b2925" stroke-width="20"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C1}" stroke-width="20" stroke-dasharray="115 264" stroke-dashoffset="0"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C3}" stroke-width="20" stroke-dasharray="75 264" stroke-dashoffset="-115"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C2}" stroke-width="20" stroke-dasharray="74 264" stroke-dashoffset="-190"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="${C1}"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C1}">Jupyter (43%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="${C3}"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">TypeScript (29%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="${C2}"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">Python (28%)</text>
  </g>
</svg>`;
}

function generateCommitsPerLanguageSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${C1}">Top Languages by Commit</text>
  <g transform="translate(75, 115)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="#2b2925" stroke-width="20"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C1}" stroke-width="20" stroke-dasharray="130 264" stroke-dashoffset="0"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C3}" stroke-width="20" stroke-dasharray="80 264" stroke-dashoffset="-130"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C2}" stroke-width="20" stroke-dasharray="54 264" stroke-dashoffset="-210"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="${C1}"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C1}">Python (50%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="${C3}"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">Jupyter (30%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="${C2}"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">TypeScript (20%)</text>
  </g>
</svg>`;
}

function generateProductiveTimeSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${C1}">Commits (UTC +05:30)</text>
  <g transform="translate(25, 60)">
    <line x1="0" y1="95" x2="290" y2="95" stroke="${C4}" stroke-width="1"/>
    ${(() => {
      const heights = [2, 0, 0, 0, 0, 3, 10, 18, 35, 45, 65, 80, 50, 40, 55, 75, 85, 70, 60, 45, 30, 20, 10, 4];
      let bars = '';
      heights.forEach((h, i) => {
        const x = i * 12 + 2;
        const y = 95 - h;
        const color = h > 60 ? C1 : h > 30 ? C3 : h > 10 ? C2 : C4;
        bars += `<rect x="${x}" y="${y}" width="9" height="${h}" rx="2" fill="${color}"/>\n`;
      });
      return bars;
    })()}

    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C2}">0h</text>
    <text x="68" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C2}">6h</text>
    <text x="140" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C2}">12h</text>
    <text x="212" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C2}">18h</text>
    <text x="278" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C2}">24h</text>
  </g>
</svg>`;
}

function generateProfileDetailsSvg() {
  return `<svg width="860" height="200" viewBox="0 0 860 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C3}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${BG_DARK}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="860" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  
  <g transform="translate(30, 36)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${C1}">nayak-del (Om)</text>
    
    <g transform="translate(0, 30)">
      <circle cx="8" cy="8" r="7" fill="${C3}"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C1}">69 Contributions on GitHub</text>
    </g>

    <g transform="translate(0, 60)">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="${C2}"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C2}">7 Public Repositories</text>
    </g>

    <g transform="translate(0, 90)">
      <circle cx="8" cy="8" r="7" fill="none" stroke="${C2}" stroke-width="2"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C2}">Active on GitHub &bull; Odisha, India</text>
    </g>

    <g transform="translate(0, 120)">
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="12" font-style="italic" fill="${C2}">"In God we trust, all others must bring data."</text>
    </g>
  </g>

  <g transform="translate(420, 25)">
    <text x="400" y="15" font-family="'Segoe UI', sans-serif" font-size="11" fill="${C2}" text-anchor="end">contributions in the last year</text>

    <path d="M 0 130 L 400 130" stroke="${C4}" stroke-width="1"/>
    
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35 L 400 130 Z" fill="url(#areaGrad)"/>
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35" fill="none" stroke="${C3}" stroke-width="2.5"/>

    <text x="20" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C2}">Apr</text>
    <text x="100" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C2}">Jun</text>
    <text x="180" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C2}">Aug</text>
    <text x="260" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C2}">Oct</text>
    <text x="340" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C2}">Dec</text>
  </g>
</svg>`;
}

fs.writeFileSync(path.join(__dirname, 'profile-3d-contrib', 'profile-night-view.svg'), generate3DGraphSvg());

const summaryDir = path.join(__dirname, 'profile-summary-card-output', 'github_dark_dimmed');
fs.writeFileSync(path.join(summaryDir, '1-repos-per-language.svg'), generateReposPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '2-most-commit-language.svg'), generateCommitsPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '4-productive-time.svg'), generateProductiveTimeSvg());
fs.writeFileSync(path.join(summaryDir, '0-profile-details.svg'), generateProfileDetailsSvg());

console.log('All SVGs regenerated with #FAF7F0 #D8D2C2 #B17457 #4A4947!');
