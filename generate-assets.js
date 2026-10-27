const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  'dist',
  'profile-3d-contrib',
  'profile-summary-card-output/github_dark_dimmed',
  '.github/workflows'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

// 1. Generate Snake SVG (dark theme with gray / off-white palette)
function generateSnakeSvg(isDark = true) {
  const bg = isDark ? '#0d1117' : '#ffffff';
  const border = isDark ? '#30363d' : '#d0d7de';
  const text = isDark ? '#8b949e' : '#57606a';
  const dot0 = isDark ? '#161b22' : '#ebedf0';
  const dot1 = isDark ? '#21262d' : '#9be9a8';
  const dot2 = isDark ? '#30363d' : '#40c463';
  const dot3 = isDark ? '#6e7681' : '#30a14e';
  const dot4 = isDark ? '#8b949e' : '#216e39';
  const snakeHead = isDark ? '#f0f6fc' : '#24292f';
  const snakeBody = isDark ? '#c9d1d9' : '#57606a';
  const snakeTail = isDark ? '#8b949e' : '#8c959f';

  const cols = 52;
  const rows = 7;
  const size = 11;
  const gap = 3;
  const startX = 20;
  const startY = 38;

  let dotsSvg = '';
  // Deterministic pattern of contributions
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = startX + c * (size + gap);
      const y = startY + r * (size + gap);
      let color = dot0;
      const seed = (c * 7 + r * 13) % 20;
      if (c > 35 && c < 50) {
        if (seed > 14) color = dot4;
        else if (seed > 10) color = dot3;
        else if (seed > 6) color = dot2;
        else if (seed > 3) color = dot1;
      } else if (seed > 16) {
        color = dot2;
      } else if (seed > 12) {
        color = dot1;
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      fill: ${text};
    }
  </style>
  <rect width="765" height="150" rx="6" fill="${bg}" stroke="${border}" stroke-width="1"/>
  <text x="20" y="24" class="grid-header">CONTRIBUTION SNAKE GRID</text>
  <g>
    ${dotsSvg}
  </g>
  <!-- Animated Snake in Gray / Off-White -->
  <g class="snake-group">
    <rect x="${startX + 18 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${snakeHead}">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="1s" repeatCount="indefinite" />
    </rect>
    <circle cx="${startX + 18 * 14 + 3}" cy="${startY + 2 * 14 + 4}" r="1" fill="#0d1117" />
    <circle cx="${startX + 18 * 14 + 8}" cy="${startY + 2 * 14 + 4}" r="1" fill="#0d1117" />
    <rect x="${startX + 17 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${snakeBody}" />
    <rect x="${startX + 16 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${snakeBody}" />
    <rect x="${startX + 15 * 14}" y="${startY + 2 * 14}" width="${size}" height="${size}" rx="2" fill="${snakeTail}" />
    <rect x="${startX + 15 * 14}" y="${startY + 1 * 14}" width="${size}" height="${size}" rx="2" fill="${snakeTail}" opacity="0.8"/>
  </g>
</svg>`;
}

// 2. Generate 3D Isometric Contribution Graph SVG
function generate3DGraphSvg() {
  return `<svg width="860" height="380" viewBox="0 0 860 380" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="860" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0d1117" />
      <stop offset="100%" stop-color="#161b22" />
    </linearGradient>
    <linearGradient id="barGradHigh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0f6fc"/>
      <stop offset="100%" stop-color="#8b949e"/>
    </linearGradient>
  </defs>

  <rect width="860" height="380" rx="8" fill="url(#bgGrad)" stroke="#30363d" stroke-width="1"/>

  <!-- Date range header -->
  <text x="730" y="32" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-size="11" fill="#8b949e" text-anchor="end">2026.04.12 - 2026.10.26</text>

  <!-- ISOMETRIC 3D CONTRIBUTION TILES -->
  <g transform="translate(140, 110)">
    <!-- Base Isometric Grid -->
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
            // Extruded 3D block
            const topColor = isHigh && h > 30 ? "#f0f6fc" : "#c9d1d9";
            const leftColor = "#6e7681";
            const rightColor = "#30363d";

            // Left Face
            tiles += `<polygon points="${x},${y - h + dy} ${x - dx},${y - h} ${x - dx},${y} ${x},${y + dy}" fill="${leftColor}" stroke="#21262d" stroke-width="0.5"/>`;
            // Right Face
            tiles += `<polygon points="${x},${y - h + dy} ${x + dx},${y - h} ${x + dx},${y} ${x},${y + dy}" fill="${rightColor}" stroke="#21262d" stroke-width="0.5"/>`;
            // Top Face
            tiles += `<polygon points="${x},${y - h - dy} ${x + dx},${y - h} ${x},${y - h + dy} ${x - dx},${y - h}" fill="${topColor}" stroke="#8b949e" stroke-width="0.5"/>`;
          } else {
            // Flat tile
            const baseFill = ((c + r) % 5 === 0) ? "#21262d" : "#161b22";
            tiles += `<polygon points="${x},${y - dy} ${x + dx},${y} ${x},${y + dy} ${x - dx},${y}" fill="${baseFill}" stroke="#30363d" stroke-width="0.4"/>`;
          }
        }
      }
      return tiles;
    })()}
  </g>

  <!-- RADAR CHART (Top Right) -->
  <g transform="translate(680, 150)">
    <!-- Pentagon Web -->
    <polygon points="0,-70 66,-21 41,56 -41,56 -66,-21" fill="none" stroke="#30363d" stroke-width="1" stroke-dasharray="3,3"/>
    <polygon points="0,-45 42,-14 26,36 -26,36 -42,-14" fill="none" stroke="#30363d" stroke-width="1"/>
    <polygon points="0,-20 19,-6 12,16 -12,16 -19,-6" fill="none" stroke="#30363d" stroke-width="1"/>
    
    <!-- Axis lines -->
    <line x1="0" y1="0" x2="0" y2="-70" stroke="#30363d" stroke-width="1"/>
    <line x1="0" y1="0" x2="66" y2="-21" stroke="#30363d" stroke-width="1"/>
    <line x1="0" y1="0" x2="41" y2="56" stroke="#30363d" stroke-width="1"/>
    <line x1="0" y1="0" x2="-41" y2="56" stroke="#30363d" stroke-width="1"/>
    <line x1="0" y1="0" x2="-66" y2="-21" stroke="#30363d" stroke-width="1"/>

    <!-- Radar Data Shape (Off-White & Gray) -->
    <polygon points="0,-58 50,-15 28,38 -20,20 -45,-12" fill="#f0f6fc" fill-opacity="0.25" stroke="#f0f6fc" stroke-width="1.8"/>

    <!-- Labels -->
    <text x="0" y="-76" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#f0f6fc" text-anchor="middle">Commit</text>
    <text x="74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#8b949e" text-anchor="start">Issue</text>
    <text x="46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#8b949e" text-anchor="start">PullReq</text>
    <text x="-46" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#8b949e" text-anchor="end">Review</text>
    <text x="-74" y="-18" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#8b949e" text-anchor="end">Repo</text>
  </g>

  <!-- DONUT CHART (Bottom Left) -->
  <g transform="translate(100, 300)">
    <!-- SVG Donut -->
    <circle cx="40" cy="30" r="28" fill="none" stroke="#21262d" stroke-width="14"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="#f0f6fc" stroke-width="14" stroke-dasharray="80 180" stroke-dashoffset="0"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="#8b949e" stroke-width="14" stroke-dasharray="55 180" stroke-dashoffset="-80"/>
    <circle cx="40" cy="30" r="28" fill="none" stroke="#484f58" stroke-width="14" stroke-dasharray="40 180" stroke-dashoffset="-135"/>

    <!-- Legend -->
    <rect x="95" y="10" width="8" height="8" rx="2" fill="#f0f6fc"/>
    <text x="110" y="18" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="#c9d1d9">Python</text>

    <rect x="95" y="26" width="8" height="8" rx="2" fill="#8b949e"/>
    <text x="110" y="34" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="#c9d1d9">Jupyter</text>

    <rect x="95" y="42" width="8" height="8" rx="2" fill="#484f58"/>
    <text x="110" y="50" font-family="'Segoe UI', sans-serif" font-size="10.5" fill="#c9d1d9">TypeScript</text>
  </g>

  <!-- STATS TOTALS -->
  <g transform="translate(320, 340)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="#f0f6fc">66 <tspan font-size="12" font-weight="400" fill="#8b949e">contributions</tspan></text>
    <text x="150" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="#f0f6fc">★ 7 <tspan font-size="12" font-weight="400" fill="#8b949e">repositories</tspan></text>
    <text x="270" y="0" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="#f0f6fc">⑂ 2 <tspan font-size="12" font-weight="400" fill="#8b949e">followers</tspan></text>
  </g>
</svg>`;
}

// 3. Generate Profile Summary Cards (1-repos-per-language, 2-most-commit-language, 4-productive-time, 0-profile-details)
function generateReposPerLanguageSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="#f0f6fc">Top Languages by Repo</text>
  <g transform="translate(75, 115)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="#21262d" stroke-width="20"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#f0f6fc" stroke-width="20" stroke-dasharray="115 264" stroke-dashoffset="0"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#8b949e" stroke-width="20" stroke-dasharray="75 264" stroke-dashoffset="-115"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#484f58" stroke-width="20" stroke-dasharray="74 264" stroke-dashoffset="-190"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="#f0f6fc"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">Jupyter (43%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="#8b949e"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">TypeScript (29%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="#484f58"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">Python (28%)</text>
  </g>
</svg>`;
}

function generateCommitsPerLanguageSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="#f0f6fc">Top Languages by Commit</text>
  <g transform="translate(75, 115)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="#21262d" stroke-width="20"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#e6edf3" stroke-width="20" stroke-dasharray="130 264" stroke-dashoffset="0"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#8b949e" stroke-width="20" stroke-dasharray="80 264" stroke-dashoffset="-130"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="#30363d" stroke-width="20" stroke-dasharray="54 264" stroke-dashoffset="-210"/>
  </g>
  <g transform="translate(160, 75)">
    <rect x="0" y="0" width="10" height="10" rx="2" fill="#e6edf3"/>
    <text x="18" y="9" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">Python (50%)</text>

    <rect x="0" y="24" width="10" height="10" rx="2" fill="#8b949e"/>
    <text x="18" y="33" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">Jupyter (30%)</text>

    <rect x="0" y="48" width="10" height="10" rx="2" fill="#30363d"/>
    <text x="18" y="57" font-family="'Segoe UI', sans-serif" font-size="11.5" fill="#c9d1d9">TypeScript (20%)</text>
  </g>
</svg>`;
}

function generateProductiveTimeSvg() {
  return `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="200" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  <text x="20" y="32" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="#f0f6fc">Commits (UTC +05:30)</text>
  <g transform="translate(25, 60)">
    <!-- Horizontal axis -->
    <line x1="0" y1="95" x2="290" y2="95" stroke="#30363d" stroke-width="1"/>
    
    <!-- Hourly bars in sleek off-white and gray -->
    ${(() => {
      const heights = [2, 0, 0, 0, 0, 3, 10, 18, 35, 45, 65, 80, 50, 40, 55, 75, 85, 70, 60, 45, 30, 20, 10, 4];
      let bars = '';
      heights.forEach((h, i) => {
        const x = i * 12 + 2;
        const y = 95 - h;
        const color = h > 60 ? '#f0f6fc' : h > 30 ? '#c9d1d9' : h > 10 ? '#8b949e' : '#30363d';
        bars += `<rect x="${x}" y="${y}" width="9" height="${h}" rx="2" fill="${color}"/>\n`;
      });
      return bars;
    })()}

    <text x="0" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="#8b949e">0h</text>
    <text x="68" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="#8b949e">6h</text>
    <text x="140" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="#8b949e">12h</text>
    <text x="212" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="#8b949e">18h</text>
    <text x="278" y="112" font-family="'Segoe UI', sans-serif" font-size="9" fill="#8b949e">24h</text>
  </g>
</svg>`;
}

function generateProfileDetailsSvg() {
  return `<svg width="860" height="200" viewBox="0 0 860 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0f6fc" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#161b22" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="860" height="200" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>
  
  <!-- Left Side: Profile Information -->
  <g transform="translate(30, 36)">
    <text x="0" y="0" font-family="'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="#f0f6fc">nayak-del (Om)</text>
    
    <g transform="translate(0, 30)">
      <!-- Octocat icon -->
      <circle cx="8" cy="8" r="7" fill="#8b949e"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="#c9d1d9">66+ Contributions on GitHub</text>
    </g>

    <g transform="translate(0, 60)">
      <!-- Repo icon -->
      <rect x="2" y="2" width="12" height="12" rx="2" fill="#8b949e"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="#c9d1d9">7 Public Repositories</text>
    </g>

    <g transform="translate(0, 90)">
      <!-- Calendar icon -->
      <circle cx="8" cy="8" r="7" fill="none" stroke="#8b949e" stroke-width="2"/>
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="13" fill="#c9d1d9">Active on GitHub &bull; Odisha, India</text>
    </g>

    <g transform="translate(0, 120)">
      <text x="24" y="12" font-family="'Segoe UI', sans-serif" font-size="12" font-style="italic" fill="#8b949e">"In God we trust, all others must bring data."</text>
    </g>
  </g>

  <!-- Right Side: Contributions Trend Area Graph -->
  <g transform="translate(420, 25)">
    <text x="400" y="15" font-family="'Segoe UI', sans-serif" font-size="11" fill="#8b949e" text-anchor="end">contributions in the last year</text>

    <!-- Axes -->
    <path d="M 0 130 L 400 130" stroke="#30363d" stroke-width="1"/>
    
    <!-- Smooth Area Path -->
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35 L 400 130 Z" fill="url(#areaGrad)"/>
    <path d="M 0 130 Q 50 110 90 60 T 170 85 T 260 40 T 340 70 T 400 35" fill="none" stroke="#f0f6fc" stroke-width="2.5"/>

    <!-- Month markers -->
    <text x="20" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="#8b949e">Apr</text>
    <text x="100" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="#8b949e">Jun</text>
    <text x="180" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="#8b949e">Aug</text>
    <text x="260" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="#8b949e">Oct</text>
    <text x="340" y="148" font-family="'Segoe UI', sans-serif" font-size="10" fill="#8b949e">Dec</text>
  </g>
</svg>`;
}

// Write files
fs.writeFileSync(path.join(__dirname, 'dist', 'github-contribution-grid-snake-dark.svg'), generateSnakeSvg(true));
fs.writeFileSync(path.join(__dirname, 'dist', 'github-contribution-grid-snake.svg'), generateSnakeSvg(false));
// Root level copy as well
fs.writeFileSync(path.join(__dirname, 'github-contribution-grid-snake-dark.svg'), generateSnakeSvg(true));

fs.writeFileSync(path.join(__dirname, 'profile-3d-contrib', 'profile-night-view.svg'), generate3DGraphSvg());

const summaryDir = path.join(__dirname, 'profile-summary-card-output', 'github_dark_dimmed');
fs.writeFileSync(path.join(summaryDir, '1-repos-per-language.svg'), generateReposPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '2-most-commit-language.svg'), generateCommitsPerLanguageSvg());
fs.writeFileSync(path.join(summaryDir, '4-productive-time.svg'), generateProductiveTimeSvg());
fs.writeFileSync(path.join(summaryDir, '0-profile-details.svg'), generateProfileDetailsSvg());

console.log('All SVGs generated successfully in gray / off-white palette!');
