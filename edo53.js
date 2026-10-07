import HexGrid from './hexgrid.js';
import { PYTHAGOREAN_53, getIntervalsForPythagoreanDegree } from './pythagorean53.js';

export const EDO53_DEGREES = [
  { degree: 0, hex: "hex-14-12" },
  { degree: 1, hex: "hex-14-11" },
  { degree: 2, hex: "hex-14-10" },
  { degree: 3, hex: "hex-15-13" },
  { degree: 4, hex: "hex-15-12" },
  { degree: 5, hex: "hex-15-11" },
  { degree: 6, hex: "hex-15-10" },
  { degree: 7, hex: "hex-16-14" },
  { degree: 8, hex: "hex-16-13" },
  { degree: 9, hex: "hex-16-12" },
  { degree: 10, hex: "hex-16-11" },
  { degree: 11, hex: "hex-16-10" },
  { degree: 12, hex: "hex-17-13" },
  { degree: 13, hex: "hex-17-12" },
  { degree: 14, hex: "hex-17-11" },
  { degree: 15, hex: "hex-17-10" },
  { degree: 16, hex: "hex-18-14" },
  { degree: 17, hex: "hex-18-13" },
  { degree: 18, hex: "hex-18-12" },
  { degree: 19, hex: "hex-18-11" },
  { degree: 20, hex: "hex-19-14" },
  { degree: 21, hex: "hex-19-13" },
  { degree: 22, hex: "hex-19-12" },
  { degree: 23, hex: "hex-19-11" },
  { degree: 24, hex: "hex-19-10" },
  { degree: 25, hex: "hex-20-14" },
  { degree: 26, hex: "hex-20-13" },
  { degree: 27, hex: "hex-20-12" },
  { degree: 28, hex: "hex-20-11" },
  { degree: 29, hex: "hex-21-14" },
  { degree: 30, hex: "hex-21-13" },
  { degree: 31, hex: "hex-21-12" },
  { degree: 32, hex: "hex-21-11" },
  { degree: 33, hex: "hex-21-10" },
  { degree: 34, hex: "hex-22-14" },
  { degree: 35, hex: "hex-22-13" },
  { degree: 36, hex: "hex-22-12" },
  { degree: 37, hex: "hex-22-11" },
  { degree: 38, hex: "hex-23-14" },
  { degree: 39, hex: "hex-23-13" },
  { degree: 40, hex: "hex-23-12" },
  { degree: 41, hex: "hex-23-11" },
  { degree: 42, hex: "hex-24-15" },
  { degree: 43, hex: "hex-24-14" },
  { degree: 44, hex: "hex-24-13" },
  { degree: 45, hex: "hex-24-12" },
  { degree: 46, hex: "hex-24-11" },
  { degree: 47, hex: "hex-25-14" },
  { degree: 48, hex: "hex-25-13" },
  { degree: 49, hex: "hex-25-12" },
  { degree: 50, hex: "hex-25-11" },
  { degree: 51, hex: "hex-26-15" },
  { degree: 52, hex: "hex-26-14" },
  { degree: 53, hex: "hex-26-13" } // Representing octave 0 of next octave visually
];

const colors = {
  white: 'rgba(255, 255, 255, 0.95)',
  lightBlue: 'rgba(135, 206, 235, 0.9)', 
  teal: 'rgba(0, 150, 136, 0.9)',       
  purple: 'rgba(142, 36, 170, 0.9)',    
  gray: 'rgba(120, 144, 156, 0.9)'      
};

const degreeColors = {
  0: colors.white, 1: colors.lightBlue, 2: colors.teal, 3: colors.purple, 4: colors.gray, 5: colors.gray,
  6: colors.purple, 7: colors.teal, 8: colors.lightBlue, 9: colors.white, 10: colors.lightBlue,
  11: colors.teal, 12: colors.purple, 13: colors.gray, 14: colors.gray, 15: colors.purple,
  16: colors.teal, 17: colors.lightBlue, 18: colors.white, 19: colors.lightBlue, 20: colors.gray,
  21: colors.lightBlue, 22: colors.white, 23: colors.lightBlue, 24: colors.teal, 25: colors.purple,
  26: colors.gray, 27: colors.gray, 28: colors.purple, 29: colors.teal, 30: colors.lightBlue,
  31: colors.white, 32: colors.lightBlue, 33: colors.teal, 34: colors.purple, 35: colors.gray,
  36: colors.gray, 37: colors.purple, 38: colors.teal, 39: colors.lightBlue, 40: colors.white,
  41: colors.lightBlue, 42: colors.teal, 43: colors.purple, 44: colors.gray, 45: colors.gray,
  46: colors.purple, 47: colors.teal, 48: colors.lightBlue, 49: colors.white, 50: colors.lightBlue,
  51: colors.gray, 52: colors.lightBlue
};

function getTextColor(degree, octave, mosaic) {
  if (octave !== 0 || mosaic !== 0) return '#ffffff'; // App bg is dark, so high transparency needs white text
  const isLight = [0, 1, 8, 9, 10, 17, 18, 19, 21, 22, 23, 30, 31, 32, 39, 40, 41, 48, 49, 50, 52].includes(degree);
  return isLight ? '#0d0d12' : '#ffffff';
}

function getDirectionsFromDegree(refDegree) {
    const directions = {};
    directions[refDegree] = 'root';
    
    let current = refDegree;
    let limitCount = 0;
    while (current !== 51 && limitCount < 55) {
        current = (current + 31) % 53;
        directions[current] = 'ascending';
        limitCount++;
    }
    
    current = refDegree;
    limitCount = 0;
    while (current !== 29 && limitCount < 55) {
        current = (current + 22) % 53;
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
  
  if (mosaic !== 0) alpha *= 0.5; // Tessellations are 50% more transparent
  
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

export function renderEdo53Keyboard(referenceDegree = -1, isInit = false) {
  HexGrid.clearAllText();
  HexGrid.resetAllColors();
  
  // Clear custom states and unhide all before rendering
  HexGrid.hexagons.forEach(hex => {
    delete hex.noteDegree;
    delete hex.noteOctave;
    if (hex.polygon) hex.polygon.style.display = '';
  });
  
  // Change active click color so it contrasts against white diatonic keys
  HexGrid.config.activeColor = '#b2ff00'; // Bright lime green
  
  const octaves = [-1, 0, 1];
  const mosaics = [-1, 0, 1]; // -1 = Tessellate Down, 0 = Center, 1 = Tessellate Up
  const tessDx = -5; // Wilson vector for 53 EDO tessellation up
  const tessDy = 4;
  
  mosaics.forEach(mosaic => {
    octaves.forEach(octave => {
      EDO53_DEGREES.forEach(note => {
        // Avoid duplicate root/octave in rendering
        if (note.degree === 53) return;
        
        let targetHex = HexGrid.getHexByWilsonCoords(note.hex, 7 * octave, 5 * octave);
        if (!targetHex) return;
        
        targetHex = HexGrid.getHexByWilsonCoords(targetHex.id, tessDx * mosaic, tessDy * mosaic);
        if (!targetHex) return;
        
        // Prevent overwriting a center tile with a faint tessellation tile
        if (targetHex.noteDegree !== undefined && mosaic !== 0) return; 

        renderKey(targetHex, note.degree, octave, mosaic, referenceDegree);
      });
    });

    // Render degree 0 of octave 2
    const rootNote = EDO53_DEGREES.find(n => n.degree === 0);
    let oct2Root = HexGrid.getHexByWilsonCoords(rootNote.hex, 7 * 2, 5 * 2);
    if (oct2Root) {
      oct2Root = HexGrid.getHexByWilsonCoords(oct2Root.id, tessDx * mosaic, tessDy * mosaic);
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

function renderKey(targetHex, renderDegree, octave, mosaic, referenceDegree = -1) {
  HexGrid.setText(targetHex.id, formatHexText(renderDegree, octave, mosaic));
  targetHex.noteDegree = renderDegree;
  targetHex.noteOctave = octave;
  
  // Use setHexColor so hexgrid.js remembers the color for the Note OFF animation
  HexGrid.setHexColor(targetHex.id, getFillColor(renderDegree, octave, mosaic, referenceDegree));
  
  const poly = targetHex.polygon;
  // Clear any inline fill style that would override the SVG fill attribute used by click events
  poly.style.fill = '';
  
  // We keep stroke as an inline style so it survives the generic stroke resets in hexgrid.js
  poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)';
  poly.style.strokeWidth = '1px';
  
  // Stronger border for diatonic (white) keys
  if ([0, 9, 18, 22, 31, 40, 49].includes(renderDegree)) {
     poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)';
     poly.style.strokeWidth = '2px';
  }
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

export function initEdo53Module(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  
  renderEdo53Keyboard(-1, true);
}
