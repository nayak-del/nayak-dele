const fs = require('fs');
const path = require('path');

// Color Hunt Palette: #EBE2CC #DED6C1 #CFC6B1 #B7B09E
const C1 = '#EBE2CC'; // Lightest cream / off-white
const C2 = '#DED6C1'; // Light warm sand / oat
const C3 = '#CFC6B1'; // Warm stone gray / taupe
const C4 = '#B7B09E'; // Deep taupe / earthy slate
const BG_DARK = '#191816'; // Deep warm charcoal background
const BG_CARD = '#201f1c'; // Elevated card background
const BORDER = '#B7B09E';

// Ensure directories exist
const dirs = [
  'dist',
  'profile-3d-contrib',
  'profile-summary-card-output/github_dark_dimmed'
];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

// 1. Generate Snake SVG in #EBE2CC #DED6C1 #CFC6B1 #B7B09E
function generateSnakeSvg() {
  const cols = 52;
  const rows = 7;
  const size = 11;
  const gap = 3;
  const startX = 20;
  const startY = 38;

  let dotsSvg = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = startX + c * (size + gap);
      const y = startY + r * (size + gap);
      let color = '#272522'; // base empty tile
      const seed = (c * 7 + r * 13) % 20;
      if (c > 35 && c < 50) {
        if (seed > 14) color = C1;
        else if (seed > 10) color = C2;
        else if (seed > 6) color = C3;
        else if (seed > 3) color = C4;
      } else if (seed > 16) {
        color = C3;
      } else if (seed > 12) {
        color = C4;
      }
      dotsSvg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="${color}" />\n`;
    }
  }

  return `<svg width="765" height="150" viewBox="0 0 765 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes moveSnake {
      0% { transform: translate(0px, 0px); }
      25% { transform: translate(120px, 14px); }
      50% { transform: translate(250px, -14px); }
      75% { transform: translate(400px, 28px); }
      100% { transform: translate(560px, 0px); }
    }
    .snake-group {
      animation: moveSnake 10s ease-in-out infinite alternate;
    }
    .grid-header {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      fill: ${C2};
    }
  </style>
  <rect width="765" height="150" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  <text x="20" y="24" class="grid-header">CONTRIBUTION SNAKE GRID</text>
  <g>
    ${dotsSvg}
  </g>
  <!-- Animated Snake in #EBE2CC #DED6C1 #CFC6B1 #B7B09E -->
  <g class="snake-group">
    <rect x="${startX + 18 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${C1}">
      <animate attributeName="opacity" values="0.85;1;0.85" dur="1s" repeatCount="indefinite" />
    </rect>
    <circle cx="${startX + 18 * 14 + 3}" cy="${startY + 2 * 14 + 4}" r="1" fill="${BG_DARK}" />
    <circle cx="${startX + 18 * 14 + 8}" cy="${startY + 2 * 14 + 4}" r="1" fill="${BG_DARK}" />
    <rect x="${startX + 17 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${C2}" />
    <rect x="${startX + 16 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${C3}" />
    <rect x="${startX + 15 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${C4}" />
    <rect x="${startX + 15 * 14}" y="${startY + 1 * 14}" width="${size}" height="${size}" rx="2" fill="${C4}" opacity="0.8"/>
  </g>
</svg>`;
}

// 2. Generate 3D Isometric Contribution Graph SVG
function generate3DGraphSvg() {
  return `<svg width="860" height="380" viewBox="0 0 860 380" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="860" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${BG_DARK}" />
      <stop offset="100%" stop-color="${BG_CARD}" />
    </linearGradient>
  </defs>

  <rect width="860" height="380" rx="8" fill="url(#bgGrad)" stroke="${BORDER}" stroke-width="1"/>

  <!-- Date range header -->
  <text x="730" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" fill="${C3}" text-anchor="end">2026.04.12 - 2026.10.27</text>

  <!-- ISOMETRIC 3D CONTRIBUTION TILES -->
  <g transform="translate(140, 110)">
    ${(() => {
      let tiles = '';
      const rows = 14;
      const cols = 28;
      const originX = 180;
      const originY = 50;
      const dx = 12;
      const dy = 7;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = originX + (c - r) * dx;
          const y = originY + (c + r) * dy * 0.75;
          const heightSeed = Math.sin(c * 0.4) * Math.cos(r * 0.6);
          const isHigh = (c < 8 && r < 6) || (c > 20 && r > 8 && heightSeed > 0.3);
          const h = isHigh ? Math.abs(Math.floor(heightSeed * 45)) + 12 : 0;

          if (h > 0) {
            const topColor = isHigh && h > 30 ? C1 : C2;
            const leftColor = C3;
            const rightColor = C4;

            // Left Face
            tiles += `<polygon points="${x},${y - h + dy} ${x - dx},${y - h} ${x - dx},${y} ${x},${y + dy}" fill="${leftColor}" stroke="#2a2723" stroke-width="0.5"/>`;
            // Right Face
            tiles += `<polygon points="${x},${y - h + dy} ${x + dx},${y - h} ${x + dx},${y} ${x},${y + dy}" fill="${rightColor}" stroke="#2a2723" stroke-width="0.5"/>`;
            // Top Face
            tiles += `<polygon points="${x},${y - h - dy} ${x + dx},${y - h} ${x},${y - h + dy} ${x - dx},${y - h}" fill="${topColor}" stroke="${C3}" stroke-width="0.5"/>`;
          } else {
            const baseFill = ((c + r) % 5 === 0) ? "#2b2925" : "#23211e";
            tiles += `<polygon points="${x},${y - dy} ${x + dx},${y} ${x},${y + dy} ${x - dx},${y}" fill="${baseFill}" stroke="#34312c" stroke-width="0.4"/>`;
          }
        }
      }
      return tiles;
    })()}
  </g>

  <!-- RADAR CHART (Top Right) -->
  <g transform="translate(680, 150)">
    <!-- Pentagon Web -->
    <polygon points="0,-70 66,-21 41,56 -41,56 -66,-21" fill="none" stroke="${C4}" stroke-width="1" stroke-dasharray="3,3"/>
    <polygon points="0,-45 42,-14 26,36 -26,36 -42,-14" fill="none" stroke="${C4}" stroke-width="1"/>
    <polygon points="0,-20 19,-6 12,16 -12,16 -19,-6" fill="none" stroke="${C4}" stroke-width="1"/>
    
    <!-- Axis lines -->
    <line x1="0" y1="0" x2="0" y2="-70" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="66" y2="-21" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="41" y2="56" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="-41" y2="56" stroke="${C4}" stroke-width="1"/>
    <line x1="0" y1="0" x2="-66" y2="-21" stroke="${C4}" stroke-width="1"/>

    <!-- Radar Data Shape (#EBE2CC fill & outline) -->
    <polygon points="0,-58 50,-15 28,38 -20,20 -45,-12" fill="${C1}" fill-opacity="0.3" stroke="${C1}" stroke-width="1.8"/>

    <!-- Labels in #EBE2CC & #DED6C1 -->
    <text x="0" y="-76" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C1}" text-anchor="middle">Commit</text>
    <text x="74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="start">Issue</text>
    <text x="46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="start">PullReq</text>
    <text x="-46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="end">Review</text>
    <text x="-74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${C2}" text-anchor="end">Repo</text>
  </g>

  <!-- DONUT CHART (Bottom Left) -->
  <g transform="translate(100, 300)">
    <!-- SVG Donut -->
    <circle cx="40" cy="30" r="28" fill="none" stroke="#2b2925" stroke-width="14"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C1}" stroke-width="14" stroke-dasharray="80 180" stroke-dashoffset="0"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C2}" stroke-width="14" stroke-dasharray="55 180" stroke-dashoffset="-80"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="${C3}" stroke-width="14" stroke-dasharray="40 180" stroke-dashoffset="-135"/>

    <!-- Legend -->
    <rect x="95" y="10" width="8" height="8" rx="2" fill="${C1}"/>
    <text x="110" y="18" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C1}">Python</text>

    <rect x="95" y="26" width="8" height="8" rx="2" fill="${C2}"/>
    <text x="110" y="34" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C2}">Jupyter</text>

    <rect x="95" y="42" width="8" height="8" rx="2" fill="${C3}"/>
    <text x="110" y="50" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="${C3}">TypeScript</text>
  </g>

  <!-- STATS TOTALS in #EBE2CC & #DED6C1 -->
  <g transform="translate(320, 340)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">66 <tspan font-size="12" font-weight="400" fill="${C3}">contributions</tspan></text>
    <text x="150" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">★ 7 <tspan font-size="12" font-weight="400" fill="${C3}">repositories</tspan></text>
    <text x="270" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="${C1}">⑂ 2 <tspan font-size="12" font-weight="400" fill="${C3}">followers</tspan></text>
  </g>
</svg>`;
}

// 3. Generate Profile Summary Cards in the Palette
function generateReposPerLanguageSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${C1}">Top Languages by Repo</text>
  <g transform="translate(75, 115)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="#2b2925" stroke-width="20"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C1}" stroke-width="20" stroke-dasharray="115 264" stroke-dashoffset="0"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C2}" stroke-width="20" stroke-dasharray="75 264" stroke-dashoffset="-115"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C3}" stroke-width="20" stroke-dasharray="74 264" stroke-dashoffset="-190"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="${C1}"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C1}">Jupyter (43%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="${C2}"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">TypeScript (29%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="${C3}"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C3}">Python (28%)</text>
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
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C2}" stroke-width="20" stroke-dasharray="80 264" stroke-dashoffset="-130"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${C3}" stroke-width="20" stroke-dasharray="54 264" stroke-dashoffset="-210"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="${C1}"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C1}">Python (50%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="${C2}"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C2}">Jupyter (30%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="${C3}"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="${C3}">TypeScript (20%)</text>
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
        const color = h > 60 ? C1 : h > 30 ? C2 : h > 10 ? C3 : C4;
        bars += `<rect x="${x}" y="${y}" width="9" height="${h}" rx="2" fill="${color}"/>\n`;
      });
      return bars;
    })()}

    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C3}">0h</text>
    <text x="68" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C3}">6h</text>
    <text x="140" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C3}">12h</text>
    <text x="212" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C3}">18h</text>
    <text x="278" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="${C3}">24h</text>
  </g>
</svg>`;
}

function generateProfileDetailsSvg() {
  return `<svg width="860" height="200" viewBox="0 0 860 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${BG_DARK}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="860" height="200" rx="6" fill="${BG_DARK}" stroke="${BORDER}" stroke-width="1"/>
  
  <!-- Left Side: Profile Information in #EBE2CC #DED6C1 #CFC6B1 -->
  <g transform="translate(30, 36)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${C1}">nayak-del (Om)</text>
    
    <g transform="translate(0, 30)">
      <circle cx="8" cy="8" r="7" fill="${C2}"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C1}">66+ Contributions on GitHub</text>
    </g>

    <g transform="translate(0, 60)">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="${C3}"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C2}">7 Public Repositories</text>
    </g>

    <g transform="translate(0, 90)">
      <circle cx="8" cy="8" r="7" fill="none" stroke="${C3}" stroke-width="2"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="${C2}">Active on GitHub &bull; Odisha, India</text>
    </g>

    <g transform="translate(0, 120)">
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="12" font-style="italic" fill="${C3}">"In God we trust, all others must bring data."</text>
    </g>
  </g>

  <!-- Right Side: Contributions Trend Area Graph -->
  <g transform="translate(420, 25)">
    <text x="400" y="15" font-family="'Segoe UI', sans-serif" font-size="11" fill="${C3}" text-anchor="end">contributions in the last year</text>

    <!-- Axes -->
    <path d="M 0 130 L 400 130" stroke="${C4}" stroke-width="1"/>
    
    <!-- Smooth Area Path in #EBE2CC -->
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35 L 400 130 Z" fill="url(#areaGrad)"/>
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35" fill="none" stroke="${C1}" stroke-width="2.5"/>

    <!-- Month markers -->
    <text x="20" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C3}">Apr</text>
    <text x="100" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C3}">Jun</text>
    <text x="180" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C3}">Aug</text>
    <text x="260" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C3}">Oct</text>
    <text x="340" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="${C3}">Dec</text>
  </g>
</svg>`;
}

// Write files
fs.writeFileSync(path.join(__dirname, 'dist', 'github-contribution-grid-snake-dark.svg'), generateSnakeSvg());
fs.writeFileSync(path.join(__dirname, 'dist', 'github-contribution-grid-snake.svg'), generateSnakeSvg());
fs.writeFileSync(path.join(__dirname, 'github-contribution-grid-snake-dark.svg'), generateSnakeSvg());

fs.writeFileSync(path.join(__dirname, 'profile-3d-contrib', 'profile-night-view.svg'), generate3DGraphSvg());

const summaryDir = path.join(__dirname, 'profile-summary-card-output', 'github_dark_dimmed');
fs.writeFileSync(path.join(summaryDir, '1-repos-per-language.svg'), generateReposPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '2-most-commit-language.svg'), generateCommitsPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '4-productive-time.svg'), generateProductiveTimeSvg());
fs.writeFileSync(path.join(summaryDir, '0-profile-details.svg'), generateProfileDetailsSvg());

console.log('All SVGs regenerated with #EBE2CC #DED6C1 #CFC6B1 #B7B09E!');
