import HexGrid from './hexgrid.js';

export const EDO31_DEGREES = [
  { degree: 0, hex: "hex-14-10" },
  { degree: 1, hex: "hex-14-9" },
  { degree: 2, hex: "hex-15-10" },
  { degree: 3, hex: "hex-15-9" },
  { degree: 4, hex: "hex-16-11" },
  { degree: 5, hex: "hex-16-10" },
  { degree: 6, hex: "hex-16-9" },
  { degree: 7, hex: "hex-17-10" },
  { degree: 8, hex: "hex-17-9" },
  { degree: 9, hex: "hex-17-8" },
  { degree: 10, hex: "hex-18-10" },
  { degree: 11, hex: "hex-18-9" },
  { degree: 12, hex: "hex-19-10" },
  { degree: 13, hex: "hex-19-9" },
  { degree: 14, hex: "hex-19-8" },
  { degree: 15, hex: "hex-20-10" },
  { degree: 16, hex: "hex-20-9" },
  { degree: 17, hex: "hex-21-10" },
  { degree: 18, hex: "hex-21-9" },
  { degree: 19, hex: "hex-21-8" },
  { degree: 20, hex: "hex-22-10" },
  { degree: 21, hex: "hex-22-9" },
  { degree: 22, hex: "hex-23-10" },
  { degree: 23, hex: "hex-23-9" },
  { degree: 24, hex: "hex-23-8" },
  { degree: 25, hex: "hex-24-10" },
  { degree: 26, hex: "hex-24-9" },
  { degree: 27, hex: "hex-24-8" },
  { degree: 28, hex: "hex-25-9" },
  { degree: 29, hex: "hex-25-8" },
  { degree: 30, hex: "hex-26-10" },
  { degree: 31, hex: "hex-26-9" },
];

export function initEdo31Module(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  
  renderEdo31Keyboard(-1, true);
}

function autoCropSvg() {
  const svg = document.querySelector('#hex-container svg');
  if (!svg) return;
  const bbox = svg.getBBox();
  const padding = 20;
  const viewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
  svg.setAttribute('viewBox', viewBox);
}

const colors = {
  white: 'rgba(255, 255, 255, 0.95)',
  lightBlue: 'rgba(135, 206, 235, 0.9)', 
  teal: 'rgba(0, 150, 136, 0.9)',       
  gray: 'rgba(96, 110, 128, 0.9)'
};

// 31 EDO Diatonic MOS: 5, 5, 3, 5, 5, 5, 3
const degreeColors = {
  0: colors.white, 1: colors.lightBlue, 2: colors.teal, 3: colors.teal, 4: colors.lightBlue, 
  5: colors.white, 6: colors.lightBlue, 7: colors.teal, 8: colors.teal, 9: colors.lightBlue, 
  10: colors.white, 11: colors.lightBlue, 12: colors.lightBlue, 
  13: colors.white, 14: colors.lightBlue, 15: colors.teal, 16: colors.teal, 17: colors.lightBlue, 
  18: colors.white, 19: colors.lightBlue, 20: colors.teal, 21: colors.teal, 22: colors.lightBlue, 
  23: colors.white, 24: colors.lightBlue, 25: colors.teal, 26: colors.teal, 27: colors.lightBlue, 
  28: colors.white, 29: colors.lightBlue, 30: colors.lightBlue, 
  31: colors.white
};

function getTextColor(degree, octave, mosaic) {
  if (octave !== 0 || mosaic !== 0) return '#ffffff'; // Highly transparent background means we need white text for contrast
  const isLight = [0, 1, 4, 5, 6, 9, 10, 11, 12, 13, 14, 17, 18, 19, 22, 23, 24, 27, 28, 29, 30, 31].includes(degree);
  return isLight ? '#0d0d12' : '#ffffff';
}

function getDirectionsFromDegree(refDegree) {
    const directions = {};
    directions[refDegree] = 'root';
    
    let current = refDegree;
    let limitCount = 0;
    while (current !== 14 && limitCount < 33) {
        current = (current + 18) % 31;
        directions[current] = 'ascending';
        limitCount++;
    }
    
    current = refDegree;
    limitCount = 0;
    while (current !== 1 && limitCount < 33) {
        current = (current + 13) % 31;
        directions[current] = 'descending';
        limitCount++;
    }
    
    return directions;
}

function getFillColor(degree, octave, mosaic, referenceDegree = -1) {
  let rgbaStr = degreeColors[degree];
  
  if (referenceDegree !== -1) {
     const directions = getDirectionsFromDegree(referenceDegree);
     const dir = directions[degree];
     if (dir === 'root') {
        rgbaStr = 'rgba(59, 130, 246, 0.9)'; // Blue
     } else if (dir === 'ascending') {
        rgbaStr = 'rgba(34, 197, 94, 0.9)'; // Green
     } else if (dir === 'descending') {
        rgbaStr = 'rgba(245, 158, 11, 0.9)'; // Orange
     } else {
        rgbaStr = 'rgba(239, 68, 68, 0.9)'; // Red (Fallback/Wolf)
     }
  }
  let alpha = 0.95;
  if (octave === 1) alpha = 0.65;
  if (octave === -1) alpha = 0.35;
  if (octave === 2) alpha = 0.35;
  
  if (mosaic !== 0) alpha *= 0.5; // Tessellations are more transparent
  
  return rgbaStr.replace(/[\d.]+\)$/, `${alpha})`);
}

function formatHexText(degree, octave, mosaic) {
  const color = getTextColor(degree, octave, mosaic);
  
  let octIndicator = '';
  if (octave === -1) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">-1</tspan>`;
  if (octave === 1) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">+1</tspan>`;
  if (octave === 2) octIndicator = `<tspan font-size="0.6em" dy="1.2em" x="0" fill="${color}">+2</tspan>`;
  
  const opacityAttr = mosaic !== 0 ? ' opacity="0.6"' : '';
  
  return `<tspan x="0" dy="${octave === 0 ? '0' : '-0.2em'}" font-weight="bold" fill="${color}"${opacityAttr}>${degree}</tspan>${octIndicator}`;
}

export function renderEdo31Keyboard(referenceDegree = -1, isInit = false) {
  HexGrid.clearAllText();
  HexGrid.resetAllColors();
  
  // Clear custom states and unhide all before rendering
  HexGrid.hexagons.forEach(hex => {
    delete hex.noteDegree;
    delete hex.noteOctave;
    if (hex.polygon) hex.polygon.style.display = '';
  });
  
  HexGrid.config.activeColor = '#b2ff00'; // Bright lime green
  
  const octaves = [-1, 0, 1];
  const mosaics = [-1, 0, 1]; // -1 = Tessellate Down, 0 = Center, 1 = Tessellate Up
  
  function getHexByExactOffset(hexId, dCol, dRow) {
    const parts = hexId.split('-');
    const c = parseInt(parts[1]) + dCol;
    const r = parseInt(parts[2]) + dRow;
    return HexGrid.hexagons.find(h => h.id === `hex-${c}-${r}`);
  }

  function applyMosaicOffset(hexId, mosaic) {
    if (mosaic === 0) return HexGrid.hexagons.find(h => h.id === hexId);
    const parts = hexId.split('-');
    let c = parseInt(parts[1]);
    let r = parseInt(parts[2]);
    const isEven = (c % 2 === 0);
    
    if (mosaic === 1) { // UP
      c -= 1;
      r += isEven ? -3 : -2;
    } else if (mosaic === -1) { // DOWN
      c += 1;
      r += isEven ? 2 : 3;
    }
    return HexGrid.hexagons.find(h => h.id === `hex-${c}-${r}`);
  }
  
  mosaics.forEach(mosaic => {
    octaves.forEach(octave => {
      EDO31_DEGREES.forEach(note => {
        // Avoid duplicate root/octave in rendering
        if (note.degree === 31) return;
        
        // Geometric Octave Offset in 31 EDO: dCol = 12, dRow = -1
        let targetHex = getHexByExactOffset(note.hex, 12 * octave, -1 * octave);
        if (!targetHex) return;
        
        // Mosaico Offset
        targetHex = applyMosaicOffset(targetHex.id, mosaic);
        if (!targetHex) return;
        
        // Prevent overwriting a center tile with a faint tessellation tile
        if (targetHex.noteDegree !== undefined && mosaic !== 0) return; 
        
        renderKey(targetHex, note.degree, octave, mosaic, referenceDegree);
      });
    });

    // Render degree 0 of octave 2
    const rootNote = EDO31_DEGREES.find(n => n.degree === 0);
    let oct2Root = getHexByExactOffset(rootNote.hex, 12 * 2, -1 * 2);
    if (oct2Root) {
      oct2Root = applyMosaicOffset(oct2Root.id, mosaic);
      if (oct2Root && !(oct2Root.noteDegree !== undefined && mosaic !== 0)) {
        renderKey(oct2Root, 0, 2, mosaic, referenceDegree);
      }
    }
  });

  // Hide all unused hexagons
  HexGrid.hexagons.forEach(hex => {
    if (hex.noteDegree === undefined && hex.polygon) {
      hex.polygon.style.display = 'none';
    }
  });

  if (isInit) {
    autoCropSvg();
  }
}

function renderKey(targetHex, renderDegree, octave, mosaic, referenceDegree) {
  HexGrid.setText(targetHex.id, formatHexText(renderDegree, octave, mosaic));
  targetHex.noteDegree = renderDegree;
  targetHex.noteOctave = octave;
  
  const color = getFillColor(renderDegree, octave, mosaic, referenceDegree);
  HexGrid.setHexColor(targetHex.id, color);
  
  const poly = targetHex.polygon;
  poly.style.fill = '';
  
  poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)';
  poly.style.strokeWidth = '1px';
  
  const isDiatonic = [0, 5, 10, 13, 18, 23, 28].includes(renderDegree);
  if (isDiatonic) {
     poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)';
     poly.style.strokeWidth = '2px';
  }
}
