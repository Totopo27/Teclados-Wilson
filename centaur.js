import HexGrid from './hexgrid.js';

export const CENTAUR_12_DEGREES = [
  { degree: 0, hex: "hex-14-11" },
  { degree: 1, hex: "hex-15-11" },
  { degree: 2, hex: "hex-15-10" },
  { degree: 3, hex: "hex-16-11" },
  { degree: 4, hex: "hex-16-10" },
  { degree: 5, hex: "hex-17-10" },
  { degree: 6, hex: "hex-18-11" },
  { degree: 7, hex: "hex-18-10" },
  { degree: 8, hex: "hex-19-10" },
  { degree: 9, hex: "hex-19-9" },
  { degree: 10, hex: "hex-20-10" },
  { degree: 11, hex: "hex-20-9" },
  { degree: 12, hex: "hex-21-9" } // Octave +1 representation
];

export const CENTAUR_17_DEGREES = [
  { degree: 0, hex: "hex-8-12" },
  { degree: 1, hex: "hex-9-12" },
  { degree: 2, hex: "hex-8-11" },
  { degree: 3, hex: "hex-9-11" },
  { degree: 4, hex: "hex-10-12" },
  { degree: 5, hex: "hex-11-12" },
  { degree: 6, hex: "hex-10-11" },
  { degree: 7, hex: "hex-11-11" },
  { degree: 8, hex: "hex-12-12" },
  { degree: 9, hex: "hex-11-10" },
  { degree: 10, hex: "hex-12-11" },
  { degree: 11, hex: "hex-13-11" },
  { degree: 12, hex: "hex-14-12" },
  { degree: 13, hex: "hex-13-10" },
  { degree: 14, hex: "hex-14-11" },
  { degree: 15, hex: "hex-15-11" },
  { degree: 16, hex: "hex-14-10" },
  { degree: 17, hex: "hex-15-10" }
];

export const CENTAUR_19_DEGREES = [
  { degree: 0, hex: "hex-12-13" },
  { degree: 1, hex: "hex-12-12" },
  { degree: 2, hex: "hex-12-11" },
  { degree: 3, hex: "hex-13-12" },
  { degree: 4, hex: "hex-13-11" },
  { degree: 5, hex: "hex-14-13" },
  { degree: 6, hex: "hex-14-12" },
  { degree: 7, hex: "hex-14-11" },
  { degree: 8, hex: "hex-15-12" },
  { degree: 9, hex: "hex-15-11" },
  { degree: 10, hex: "hex-15-10" },
  { degree: 11, hex: "hex-16-12" },
  { degree: 12, hex: "hex-16-11" },
  { degree: 13, hex: "hex-17-12" },
  { degree: 14, hex: "hex-17-11" },
  { degree: 15, hex: "hex-17-10" },
  { degree: 16, hex: "hex-18-12" },
  { degree: 17, hex: "hex-18-11" },
  { degree: 18, hex: "hex-18-10" },
  { degree: 19, hex: "hex-19-11" }
];


function shiftHex(col, row, octaves) {
  let newCol = col + octaves * 7;
  let newRow = row;
  
  if (octaves > 0) {
    for (let i = 0; i < octaves; i++) {
      let currentCol = col + i * 7;
      if (currentCol % 2 === 0) newRow -= 2;
      else newRow -= 1;
    }
  } else if (octaves < 0) {
    for (let i = 0; i > octaves; i--) {
      let currentCol = col + i * 7;
      if (currentCol % 2 === 0) newRow += 1;
      else newRow += 2;
    }
  }
  return `hex-${newCol}-${newRow}`;
}

function getFillColor(degree, octave) {
  // User requested uniform color for now
  let rgbaStr = 'rgba(255, 255, 255, 0.9)'; // White base
  
  let alpha = 0.95;
  if (octave === 1) alpha = 0.65;
  if (octave === -1) alpha = 0.35;
  if (octave === 2) alpha = 0.35;
  
  return rgbaStr.replace(/[\d.]+\)$/, `${alpha})`);
}

function getTextColor(degree, octave) {
  return '#0d0d12'; // Dark text for white keys
}

function formatHexText(degree, octave) {
  const color = getTextColor(degree, octave);
  let octIndicator = '';
  if (octave === -1) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">-1</tspan>`;
  if (octave === 1) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">+1</tspan>`;
  if (octave === 2) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">+2</tspan>`;
  
  return `<tspan x="0" dy="${octave === 0 ? '0' : '-0.2em'}" font-weight="bold" fill="${color}">${degree}</tspan>${octIndicator}`;
}

function renderKey(targetHex, renderDegree, octave) {
  HexGrid.setText(targetHex.id, formatHexText(renderDegree, octave));
  targetHex.noteDegree = renderDegree;
  targetHex.noteOctave = octave;
  
  HexGrid.setHexColor(targetHex.id, getFillColor(renderDegree, octave));
  
  const poly = targetHex.polygon;
  poly.style.fill = '';
  poly.style.stroke = 'rgba(0, 0, 0, 0.5)';
  poly.style.strokeWidth = '1px';
}

export function renderCentaurKeyboard(size = 12) {
  HexGrid.clearAllText();
  HexGrid.resetAllColors();
  
  HexGrid.hexagons.forEach(hex => {
    delete hex.noteDegree;
    delete hex.noteOctave;
    if (hex.polygon) hex.polygon.style.display = '';
  });
  
  HexGrid.config.activeColor = '#b2ff00';
  
  let degreesToRender = CENTAUR_12_DEGREES;
  if (size === 17) degreesToRender = CENTAUR_17_DEGREES;
  if (size === 19) degreesToRender = CENTAUR_19_DEGREES;
  
  // Dynamically create all octaves
  let allNotes = [];
  
  // Octave -1
  degreesToRender.forEach(note => {
      let parts = note.hex.split('-');
      let hexId = shiftHex(parseInt(parts[1]), parseInt(parts[2]), -1);
      allNotes.push({ degree: note.degree, hex: hexId, octave: -1 });
  });
  
  // Octave 0
  degreesToRender.forEach(note => {
      allNotes.push({ degree: note.degree, hex: note.hex, octave: 0 });
  });
  
  // Octave 1
  degreesToRender.forEach(note => {
      let parts = note.hex.split('-');
      let hexId = shiftHex(parseInt(parts[1]), parseInt(parts[2]), 1);
      allNotes.push({ degree: note.degree, hex: hexId, octave: 1 });
  });
  
  // Degree 0 of Octave 2
  let root0 = degreesToRender[0];
  let root0parts = root0.hex.split('-');
  let root2hex = shiftHex(parseInt(root0parts[1]), parseInt(root0parts[2]), 2);
  allNotes.push({ degree: 0, hex: root2hex, octave: 2 });
  
  allNotes.forEach(note => {
    let targetHex = HexGrid.hexagons.find(h => h.id === note.hex);
    if (!targetHex) return;
    
    renderKey(targetHex, note.degree, note.octave);
  });

  // Hide unused hexagons
  HexGrid.hexagons.forEach(hex => {
    if (hex.noteDegree === undefined && hex.polygon) {
      hex.polygon.style.display = 'none';
    }
  });
  
  autoCropSvg();
}

function autoCropSvg() {
  const svg = document.querySelector('#hex-container svg');
  if (!svg) return;
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let activeCount = 0;
  
  HexGrid.hexagons.forEach(hex => {
    if (hex.noteDegree !== undefined || hex.text) {
      hex.polygon.style.display = 'block';
      if (hex.textNode) hex.textNode.style.display = 'block';
      activeCount++;
      
      const size = HexGrid.config.size;
      const hexWidth = 2 * size;
      const hexHeight = Math.sqrt(3) * size;
      const xSpacing = 1.5 * size;
      const ySpacing = hexHeight;
      
      const cx = hex.col * xSpacing + size;
      const yOffset = (hex.col % 2 === 1) ? hexHeight / 2 : 0;
      const cy = hex.row * ySpacing + yOffset + hexHeight / 2;
      
      if (cx - hexWidth/2 < minX) minX = cx - hexWidth/2;
      if (cy - hexHeight/2 < minY) minY = cy - hexHeight/2;
      if (cx + hexWidth/2 > maxX) maxX = cx + hexWidth/2;
      if (cy + hexHeight/2 > maxY) maxY = cy + hexHeight/2;
    } else {
      hex.polygon.style.display = 'none';
      if (hex.textNode) hex.textNode.style.display = 'none';
    }
  });
  
  if (activeCount > 0) {
    const padding = HexGrid.config.size * 1.5;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    svg.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width} ${height}`);
  }
}

export function initCentaurModule(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  
  renderCentaurKeyboard(12);
  
  const sizeSelect = document.getElementById('centaur-size');
  if (sizeSelect) {
     sizeSelect.addEventListener('change', (e) => {
        renderCentaurKeyboard(parseInt(e.target.value, 10));
     });
  }
}
