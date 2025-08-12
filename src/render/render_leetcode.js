import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sizeOf from 'image-size';
import config from '../../config.js';
import Icons from '../asset/icons.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the PNG file and encode it to Base64
const image_base64 = fs.readFileSync(path.join(__dirname, '../asset/image.gif'), 'base64');
// get the dimensions of the image
const dimensions = sizeOf(path.join(__dirname, '../asset/image.gif'));

// Load the Base64 encoded fonts
const fontsBase64 = JSON.parse(fs.readFileSync(path.join(__dirname, '../asset/fontsBase64.json'), 'utf8'));

function darkenHexColor(hex, darkenFactor) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.round(r * (darkenFactor / 100));
  g = Math.round(g * (darkenFactor / 100));
  b = Math.round(b * (darkenFactor / 100));

  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertNumberUnit(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number;
}

async function calculateLeetCodeUrl(stats) {
  return `https://leetcode.com/${stats.username}`;
}

async function calculateSvgConfig(config) {
  const svg_width = config.svg.width;
  const svg_height = config.svg.height;
  return { svg_width, svg_height };
}

async function calculateElementsConfig(config) {
  const icon_color = config.colors.icon;
  const text_title_color = config.colors.textTitle;
  const text_label_color = config.colors.textLabel;
  const text_value_color = config.colors.textValue;
  return {
    icon_color,
    text_title_color,
    text_label_color,
    text_value_color,
  };
}

async function calculateLanguageRing(config, svg_width, svg_height) {
  const language_ring_radius = config.language?.ringRadius || 60;
  const language_ring_thickness = config.language?.ringThickness || 8;
  const language_ring_center_x = Math.round(svg_width / 2);
  const language_ring_center_y = Math.round(svg_height / 2 + language_ring_radius * 2);
  const language_circumference = Math.round(2 * Math.PI * language_ring_radius);
  const first_column_x_offset = Math.round(language_ring_center_x + language_ring_radius * 1.8);
  const second_column_x_offset = Math.round(first_column_x_offset + (1080 - first_column_x_offset) / 2);

  return {
    language_ring_radius,
    language_ring_thickness,
    language_ring_center_x,
    language_ring_center_y,
    language_circumference,
    first_column_x_offset,
    second_column_x_offset,
  };
}

async function calculateImagePosition(dimensions, language_ring_radius, language_ring_thickness, language_ring_center_x, language_ring_center_y) {
  const image_width = dimensions.width;
  const image_height = dimensions.height;
  const target_height = Math.round(language_ring_radius * 2 - language_ring_thickness);
  const image_y = Math.round(language_ring_center_y - target_height / 2);
  const image_x = Math.round(language_ring_center_x - (target_height / image_height * image_width / 2));
  return { target_height, image_y, image_x };
}

async function processLanguageData(languages) {
  // Language color mapping
  const languageColors = {
    'JavaScript': '#f7df1e',
    'Python': '#3776ab',
    'Java': '#007396',
    'C++': '#00599c',
    'C': '#a8b9cc',
    'TypeScript': '#007acc',
    'Go': '#00add8',
    'Rust': '#000000',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'C#': '#239120',
    'Scala': '#dc322f',
    'Dart': '#0175c2',
    'R': '#276dc3',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'Objective-C': '#438eff',
    'Perl': '#39457e',
    'Haskell': '#5e5086',
    'Lua': '#2c2d72',
    'Assembly': '#6e4c13',
    'MATLAB': '#e16737',
    'Groovy': '#e69f56',
    'Julia': '#9558b2',
    'VBA': '#867db1',
    'Fortran': '#4d41b1',
    'COBOL': '#006db0',
    'Ada': '#02f88c',
    'Pascal': '#e3f171',
    'Delphi': '#cc342d',
    'Erlang': '#b83998',
    'F#': '#b845fc',
    'OCaml': '#3be133',
    'Scheme': '#1e4aec',
    'Clojure': '#db5855',
    'Crystal': '#000100',
    'Nim': '#37775b',
    'Zig': '#ec915c',
    'Default': '#858585'
  };

  const totalProblems = languages.reduce((sum, lang) => sum + lang.problemsSolved, 0);
  
  return languages.slice(0, 10).map(lang => ({
    name: lang.languageName,
    problemsSolved: lang.problemsSolved,
    percentage: totalProblems > 0 ? (lang.problemsSolved / totalProblems) * 100 : 0,
    color: languageColors[lang.languageName] || languageColors['Default']
  }));
}

async function renderLanguageRing(languagePercentages, languageRingConfig, elementsConfig) {
  const totalSegments = languagePercentages.length;
  let accumulatedOffset = 0;
  let accumulatedPercentage = 0;

  return languagePercentages.map((languageData, index) => {
    const { name: language, percentage: value, color, problemsSolved } = languageData;
    accumulatedPercentage += value;

    const segmentLength = Math.round((accumulatedPercentage / 100) * languageRingConfig.language_circumference) - accumulatedOffset;
    
    const strokeColor = color || '#cccccc';

    const segment = `
      <circle cx="${languageRingConfig.language_ring_center_x}" cy="${languageRingConfig.language_ring_center_y}" r="${languageRingConfig.language_ring_radius}" 
        stroke="${strokeColor}" stroke-width="${languageRingConfig.language_ring_thickness}" fill="none"
        stroke-dasharray="${segmentLength} ${languageRingConfig.language_circumference - segmentLength}"
        stroke-dashoffset="${-accumulatedOffset}"
        transform="rotate(90 ${languageRingConfig.language_ring_center_x} ${languageRingConfig.language_ring_center_y})"
        style="opacity: 0; animation: change-opacity 0.5s ease-out forwards; animation-delay: ${(totalSegments - index) * 0.15}s;" />
    `;
    accumulatedOffset += segmentLength;

    const isFirstColumn = index < 5;
    const column_x_offset = isFirstColumn ? languageRingConfig.first_column_x_offset : languageRingConfig.second_column_x_offset;
    const column_index = isFirstColumn ? index : index - 5;
    const text_y_position = Math.round(languageRingConfig.language_ring_center_y - languageRingConfig.language_ring_radius - 8 + column_index * 25);

    const text_element = `
      <g transform="translate(${column_x_offset}, ${text_y_position})" class="animate" style="animation-delay: ${index * 0.15}s;">
        <rect x="0" y="0" width="16" height="16" fill="${strokeColor}" />
        <text x="20" y="8" class="language-legend" dominant-baseline="central">
          <tspan fill="${elementsConfig.text_label_color}">${language}</tspan>
          <tspan fill="${elementsConfig.text_value_color}" dx="5">${problemsSolved}</tspan>
        </text>
      </g>
    `;

    return segment + text_element;
  }).join('');
}

function getRatingLevel(rating) {
  if (rating >= 2400) return 'L';  // Legend
  if (rating >= 2100) return 'G';  // Guardian
  if (rating >= 1900) return 'K';  // Knight
  if (rating >= 1600) return 'E';  // Expert
  if (rating >= 1400) return 'S';  // Specialist
  if (rating >= 1200) return 'P';  // Pupil
  return 'N';  // Newbie
}

async function renderStats(stats) {
  const [
    leetcodeUrl,
    { svg_width, svg_height },
    elementsConfig,
    languageRingConfig,
    imagePosition,
    languagePercentages
  ] = await Promise.all([
    calculateLeetCodeUrl(stats),
    calculateSvgConfig(config),
    calculateElementsConfig(config),
    calculateLanguageRing(config, config.svg.width, config.svg.height),
    calculateImagePosition(dimensions, config.language?.ringRadius || 60, config.language?.ringThickness || 8, Math.round(config.svg.width / 2), Math.round(config.svg.height / 2 + (config.language?.ringRadius || 60) * 2)),
    processLanguageData(stats.languages || [])
  ]);

  const language_percentage_ring = await renderLanguageRing(languagePercentages, languageRingConfig, elementsConfig);
  
  const topLanguages = stats.languages?.slice(0, 5) || [];
  const topSkills = stats.skills?.advanced?.slice(0, 5) || [];
  const contests = stats.contests || { attendedContestsCount: 0, rating: 0, globalRanking: 0, topPercentage: 0 };

  const svg = `
    <svg width="${svg_width}" height="${svg_height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @font-face {
          font-family: 'Rajdhani';
          src: url('data:font/truetype;charset=utf-8;base64,${fontsBase64['Rajdhani-Regular']}') format('truetype');
        }
        @font-face {
          font-family: 'ChakraPetch';
          src: url('data:font/truetype;charset=utf-8;base64,${fontsBase64['ChakraPetch-Regular']}') format('truetype');
        }
        @font-face {
          font-family: 'LibreBarcode128';
          src: url('data:font/truetype;charset=utf-8;base64,${fontsBase64['LibreBarcode128-Regular']}') format('truetype');
        }
        
        @keyframes change-opacity {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes blinking {
          0%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes flikering {
          0% { opacity: 0; }
          ${getRandomInt(1,30)}% { opacity: 0.4; }
          ${getRandomInt(31,45)}% { opacity: 0; }
          ${getRandomInt(46,90)}% { opacity: 0.2; }
          100% { opacity: 0; } 
        }

        .animate {
          opacity: 0;
          animation: change-opacity 0.5s ease-out forwards;
        }

        .blink {
          animation: blinking 1.5s ease-out;
        }

        .background { fill: none; }

        .title { 
          font-family: 'ChakraPetch', Helvetica; 
          fill: ${elementsConfig.text_title_color}; 
          font-size: 30px; 
          font-weight: bold; 
          opacity: 0; 
          animation: flikering 0.4s 2, change-opacity 1s ease-in-out 0.8s forwards; 
        }

        .label { 
          font-family: 'Rajdhani', Helvetica; 
          fill: ${elementsConfig.text_label_color}; 
          font-size: 22px; 
        }

        .value { 
          font-family: 'Rajdhani', Helvetica; 
          fill: ${elementsConfig.text_value_color}; 
          font-size: 24px; 
          font-weight: bold; 
        }

        .barcode { 
          font-family: 'LibreBarcode128', Helvetica; 
          fill: ${elementsConfig.text_title_color};
        }

        .language-legend { 
          font-family: 'Rajdhani', Helvetica; 
          font-size: 18px; 
        }

        .icon { fill: ${elementsConfig.icon_color}; }

        .lang-box {
          fill: none;
          stroke: ${elementsConfig.icon_color};
          stroke-width: 2;
          opacity: 0;
          animation: change-opacity 0.5s ease-out forwards;
        }
      </style>

      <rect class="background" width="100%" height="100%" />

      <text x="50" y="40" class="title" font-size="36">${stats.username}'s LeetCode Stats</text>

      <clipPath id="clipPathReveal">
        <rect x="0" y="0" height="100" width="0">
          <animate attributeName="width" begin="0s" dur="1s" from="0" to="${svg_width}" fill="freeze" />
        </rect>
      </clipPath>

      <text x="${svg_width-20}" y="50" class="barcode" text-anchor="end" font-size="30" clip-path="url(#clipPathReveal)">${leetcodeUrl}</text>

      <!-- Initial dot -->
      <circle cx="10" cy="60" r="4" fill="${elementsConfig.icon_color}">
        <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="1" />
        <animate attributeName="opacity" from="1" to="0" dur="0.2s" fill="freeze" begin="0.5s" />
      </circle>

      <!-- dot change line moving to right -->  
      <line x1="10" y1="60" x2="10" y2="60" stroke="${config.colors.icon}" stroke-width="4">
        <animate attributeName="x2" from="10" to="${svg_width-10}" dur="0.5s" fill="freeze" begin="0.5s"/>
      </line>

      <g transform="translate(30, 100)" class="animate" style="animation-delay: 0.8s">
        <rect x="-10" y="-24" width="347" height="32" class="lang-box" style="animation-delay: 1.1s" />
        <path class="icon" d="${Icons.contest_icon}" transform="translate(5, -18) scale(0.04)"/>
        <text x="40" y="0" class="label">Attended Contests</text>
        <text x="320" y="0" class="value" text-anchor="end">${convertNumberUnit(contests.attendedContestsCount)}</text>
      </g>

      <g transform="translate(30, 140)" class="animate" style="animation-delay: 0.88s">
        <rect x="-10" y="-24" width="347" height="32" class="lang-box" style="animation-delay: 1.27s" />
        <path class="icon" d="${Icons.rating_icon}" transform="translate(7, -18) scale(0.04)"/>
        <text x="40" y="0" class="label">Rating</text>
        <text x="320" y="0" class="value" text-anchor="end">${Math.round(contests.rating)}</text>
      </g>

      <g transform="translate(30, 180)" class="animate" style="animation-delay: 0.96s">
        <rect x="-10" y="-24" width="347" height="32" class="lang-box" style="animation-delay: 1.44s" />
        <path class="icon" d="${Icons.ranking_icon}" transform="translate(7, -18) scale(0.04)"/>
        <text x="40" y="0" class="label">Global Ranking</text>
        <text x="320" y="0" class="value" text-anchor="end">${convertNumberUnit(contests.globalRanking)}</text>
      </g>

      <g transform="translate(30, 220)" class="animate" style="animation-delay: 1.04s">
        <rect x="-10" y="-24" width="347" height="32" class="lang-box" style="animation-delay: 1.61s" />
        <path class="icon" d="${Icons.top_percentage_icon}" transform="translate(4, -18) scale(0.04)"/>
        <text x="40" y="0" class="label">Top Percentage</text>
        <text x="320" y="0" class="value" text-anchor="end">${contests.topPercentage.toFixed(2)}%</text>
      </g>

      <!-- Language ring center: image/gif/webp/whatever -->
      <image href="data:image/png;base64,${image_base64}" x="${imagePosition.image_x}" y="${imagePosition.image_y}" height="${imagePosition.target_height}" class="blink"/>

      <!-- Language Ring -->
      ${language_percentage_ring}

      <!-- Top Languages Section -->
      <g transform="translate(400, 100)">
        <text y="0" class="title" font-size="28px">Top Languages</text>
        ${topLanguages.map((lang, i) => `
          <g transform="translate(0, ${40 + i * 40})" class="animate" style="animation-delay: ${0.4 + i * 0.1}s">
            <rect x="-10" y="-24" width="270" height="32" class="lang-box" style="animation-delay: ${0.5 + i * 0.1}s" />
            <path class="icon" d="${Icons.language_icon}" transform="translate(5, -18) scale(0.04)"/>
            <text x="40" y="0" class="label">${lang.languageName}</text>
            <text x="250" y="0" class="value" text-anchor="end">${lang.problemsSolved}</text>
          </g>
        `).join('')}
      </g>

      <!-- Top Skills Section -->
      <g transform="translate(750, 100)">
        <text y="0" class="title" font-size="28px">Top Skills</text>
        ${topSkills.map((skill, i) => `
          <g transform="translate(0, ${40 + i * 40})" class="animate" style="animation-delay: ${0.8 + i * 0.1}s">
            <rect x="-10" y="-24" width="270" height="32" class="lang-box" style="animation-delay: ${0.9 + i * 0.1}s" />
            <path class="icon" d="${Icons.skill_icon}" transform="translate(5, -18) scale(0.04)"/>
            <text x="40" y="0" class="label">${skill.tag_name}</text>
            <text x="250" y="0" class="value" text-anchor="end">${skill.problems_solved}</text>
          </g>
        `).join('')}
      </g>

      <!-- Language Ring card-like border -->
      <path d="M 200,340 L 650,340 L 660,350 L 1080,350 L 1080,540 L 1040,580 L 200,580 Z" fill="none" stroke="${elementsConfig.icon_color}" stroke-width="2" opacity="0">
        <animate attributeName="stroke-dasharray" from="0, 3500" to="3500, 0" dur="3s" fill="freeze" begin="0.7s" />
        <animate attributeName="opacity" values="0;0.3;0;1" dur="0.2s" fill="freeze" begin="0.4s" />
      </path>

      <!-- corner triangle -->
      <path d="M 1080,555 L 1080,580 L 1055,580 Z" fill="${elementsConfig.icon_color}" stroke="${elementsConfig.icon_color}" stroke-width="2" >
        <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="5" />
      </path>

      <!-- left solid part -->
      <path d="M 190,340 L 200,340 L 200,580 L 190,580 L 190,540 L 195,535 L 195,480 L 190,475 Z" fill="${elementsConfig.icon_color}" stroke="${elementsConfig.icon_color}" stroke-width="2">
        <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" />
      </path>

    </svg>
  `;
  return svg;
}

export { renderStats as default };