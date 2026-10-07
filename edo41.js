import HexGrid from './hexgrid.js';

export const EDO41_DEGREES = [
  { degree: 0, hex: "hex-14-11" },
  { degree: 1, hex: "hex-14-10" },
  { degree: 2, hex: "hex-15-12" },
  { degree: 3, hex: "hex-15-11" },
  { degree: 4, hex: "hex-15-10" },
  { degree: 5, hex: "hex-15-9" },
  { degree: 6, hex: "hex-16-12" },
  { degree: 7, hex: "hex-16-11" },
  { degree: 8, hex: "hex-16-10" },
  { degree: 9, hex: "hex-17-12" },
  { degree: 10, hex: "hex-17-11" },
  { degree: 11, hex: "hex-17-10" },
  { degree: 12, hex: "hex-18-13" },
  { degree: 13, hex: "hex-18-12" },
  { degree: 14, hex: "hex-18-11" },
  { degree: 15, hex: "hex-18-10" },
  { degree: 16, hex: "hex-19-12" },
  { degree: 17, hex: "hex-19-11" },
  { degree: 18, hex: "hex-19-10" },
  { degree: 19, hex: "hex-20-13" },
  { degree: 20, hex: "hex-20-12" },
  { degree: 21, hex: "hex-20-11" },
  { degree: 22, hex: "hex-20-10" },
  { degree: 23, hex: "hex-21-12" },
  { degree: 24, hex: "hex-21-11" },
  { degree: 25, hex: "hex-21-10" },
  { degree: 26, hex: "hex-22-13" },
  { degree: 27, hex: "hex-22-12" },
  { degree: 28, hex: "hex-22-11" },
  { degree: 29, hex: "hex-22-10" },
  { degree: 30, hex: "hex-23-12" },
  { degree: 31, hex: "hex-23-11" },
  { degree: 32, hex: "hex-23-10" },
  { degree: 33, hex: "hex-24-13" },
  { degree: 34, hex: "hex-24-12" },
  { degree: 35, hex: "hex-24-11" },
  { degree: 36, hex: "hex-25-13" },
  { degree: 37, hex: "hex-25-12" },
  { degree: 38, hex: "hex-25-11" },
  { degree: 39, hex: "hex-25-10" },
  { degree: 40, hex: "hex-26-13" }
];

export function initEdo41Module(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  
  renderEdo41Keyboard(-1, true);
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

const degreeColors = {
  0: colors.white, 1: colors.lightBlue, 2: colors.teal, 3: colors.gray, 4: colors.gray, 5: colors.teal, 6: colors.lightBlue, 7: colors.white,
  8: colors.lightBlue, 9: colors.teal, 10: colors.gray, 11: colors.gray, 12: colors.teal, 13: colors.lightBlue, 14: colors.white,
  15: colors.lightBlue, 16: colors.lightBlue, 17: colors.white,
  18: colors.lightBlue, 19: colors.teal, 20: colors.gray, 21: colors.gray, 22: colors.teal, 23: colors.lightBlue, 24: colors.white,
  25: colors.lightBlue, 26: colors.teal, 27: colors.gray, 28: colors.gray, 29: colors.teal, 30: colors.lightBlue, 31: colors.white,
  32: colors.lightBlue, 33: colors.teal, 34: colors.gray, 35: colors.gray, 36: colors.teal, 37: colors.lightBlue, 38: colors.white,
  39: colors.lightBlue, 40: colors.lightBlue
};

function getTextColor(degree, octave, mosaic) {
  if (octave !== 0 || mosaic !== 0) return '#ffffff'; // Highly transparent background means we need white text for contrast
  const isLight = [0, 1, 6, 7, 8, 13, 14, 15, 16, 17, 18, 23, 24, 25, 30, 31, 32, 37, 38, 39, 40].includes(degree);
  return isLight ? '#0d0d12' : '#ffffff';
}

function getFillColor(degree, octave, mosaic) {
  const rgbaStr = degreeColors[degree];
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

export function renderEdo41Keyboard(referenceDegree = -1, isInit = false) {
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
  const tessDx = -4; // Wilson vector for 41 EDO tessellation up
  const tessDy = 3;
  
  mosaics.forEach(mosaic => {
    octaves.forEach(octave => {
      EDO41_DEGREES.forEach(note => {
        // Avoid duplicate root/octave in rendering
        if (note.degree === 41) return;
        
        let targetHex = HexGrid.getHexByWilsonCoords(note.hex, 7 * octave, 5 * octave);
        if (!targetHex) return;
        
        targetHex = HexGrid.getHexByWilsonCoords(targetHex.id, tessDx * mosaic, tessDy * mosaic);
        if (!targetHex) return;
        
        // Prevent overwriting a center tile with a faint tessellation tile
        if (targetHex.noteDegree !== undefined && mosaic !== 0) return; 

        renderKey(targetHex, note.degree, octave, mosaic);
      });
    });

    // Render degree 0 of octave 2
    const rootNote = EDO41_DEGREES.find(n => n.degree === 0);
    let oct2Root = HexGrid.getHexByWilsonCoords(rootNote.hex, 7 * 2, 5 * 2);
    if (oct2Root) {
      oct2Root = HexGrid.getHexByWilsonCoords(oct2Root.id, tessDx * mosaic, tessDy * mosaic);
      if (oct2Root && !(oct2Root.noteDegree !== undefined && mosaic !== 0)) {
        renderKey(oct2Root, 0, 2, mosaic);
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

function renderKey(targetHex, renderDegree, octave, mosaic) {
  HexGrid.setText(targetHex.id, formatHexText(renderDegree, octave, mosaic));
  targetHex.noteDegree = renderDegree;
  targetHex.noteOctave = octave;
  
  const color = getFillColor(renderDegree, octave, mosaic);
  HexGrid.setHexColor(targetHex.id, color);
  
  const poly = targetHex.polygon;
  poly.style.fill = '';
  
  poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)';
  poly.style.strokeWidth = '1px';
  
  const isDiatonic = [0, 7, 14, 17, 24, 31, 38].includes(renderDegree);
  if (isDiatonic) {
     poly.style.stroke = mosaic !== 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)';
     poly.style.strokeWidth = '2px';
  }
}
