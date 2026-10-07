import HexGrid from './hexgrid.js';

// --- Math utilities for Limit analysis ---
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyRatio(ratio) {
  const divisor = gcd(Math.abs(ratio[0]), Math.abs(ratio[1]));
  return [ratio[0] / divisor, ratio[1] / divisor];
}

function divideRatios(a, b) {
  return simplifyRatio([a[0] * b[1], a[1] * b[0]]);
}

function normalizeRatio(ratio) {
  let [n, d] = simplifyRatio(ratio);
  if (n === 0) return [0, 1];
  
  while (n / d >= 2) {
    d *= 2;
  }
  while (n / d < 1) {
    n *= 2;
  }
  return simplifyRatio([n, d]);
}

function getPrimeLimit(n) {
  let maxPrime = 1;
  n = Math.abs(n);
  if (n === 0 || n === 1) return 1;
  
  while (n % 2 === 0) {
    maxPrime = 2;
    n >>= 1;
  }
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      maxPrime = i;
      n /= i;
    }
  }
  if (n > 2) {
    maxPrime = n;
  }
  return maxPrime;
}

function getRatioLimit(ratio) {
  const [n, d] = simplifyRatio(ratio);
  return Math.max(getPrimeLimit(n), getPrimeLimit(d));
}

function parseRatioStr(ratioStr) {
  if (ratioStr.includes('/')) {
    const p = ratioStr.split('/');
    return [parseInt(p[0]), parseInt(p[1])];
  }
  return [parseFloat(ratioStr), 1];
}

function getLimitColor(limit) {
    switch (limit) {
        case 1:
        case 2: return [148, 163, 184]; // #94a3b8 Gray
        case 3: return [59, 130, 246];  // #3b82f6 Blue
        case 5: return [16, 185, 129];  // #10b981 Green
        case 7: return [245, 158, 11];  // #f59e0b Amber
        case 11: return [139, 92, 246]; // #8b5cf6 Purple
        default: return [239, 68, 68];  // #ef4444 Red
    }
}
// ------------------------------------------


export const PARTCH_DEGREES = [
  { degree: 0, wilsonDegree: 0, ratio: "1/1", hex: "hex-16-12" },
  { degree: 1, wilsonDegree: 1, ratio: "81/80", hex: "hex-15-10" },
  { degree: 2, wilsonDegree: 2, ratio: "33/32", hex: "hex-18-14" },
  { degree: 3, wilsonDegree: 3, ratio: "21/20", hex: "hex-17-12" },
  { degree: 4, wilsonDegree: 4, ratio: "16/15", hex: "hex-16-11" },
  { degree: 5, wilsonDegree: 5, ratio: "12/11", hex: "hex-15-9" },
  { degree: 6, wilsonDegree: 6, ratio: "11/10", hex: "hex-18-13", splitGroup: 1, splitOption: "A" },
  { degree: 7, wilsonDegree: 6, ratio: "10/9", hex: "hex-18-13", splitGroup: 1, splitOption: "B" },
  { degree: 8, wilsonDegree: 7, ratio: "9/8", hex: "hex-17-11" },
  { degree: 9, wilsonDegree: 8, ratio: "8/7", hex: "hex-16-10" },
  { degree: 10, wilsonDegree: 9, ratio: "7/6", hex: "hex-19-13" },
  { degree: 11, wilsonDegree: 10, ratio: "32/27", hex: "hex-18-12" },
  { degree: 12, wilsonDegree: 11, ratio: "6/5", hex: "hex-17-10" },
  { degree: 13, wilsonDegree: 12, ratio: "11/9", hex: "hex-20-14" },
  { degree: 14, wilsonDegree: 13, ratio: "5/4", hex: "hex-19-12" },
  { degree: 15, wilsonDegree: 14, ratio: "14/11", hex: "hex-18-11" },
  { degree: 16, wilsonDegree: 15, ratio: "9/7", hex: "hex-17-9" },
  { degree: 17, wilsonDegree: 16, ratio: "21/16", hex: "hex-20-13" },
  { degree: 18, wilsonDegree: 17, ratio: "4/3", hex: "hex-19-11" },
  { degree: 19, wilsonDegree: 18, ratio: "27/20", hex: "hex-18-10" },
  { degree: 20, wilsonDegree: 19, ratio: "11/8", hex: "hex-21-13" },
  { degree: 21, wilsonDegree: 20, ratio: "7/5", hex: "hex-20-12" },
  { degree: 22, wilsonDegree: 21, ratio: "10/7", hex: "hex-19-10" },
  { degree: 23, wilsonDegree: 22, ratio: "16/11", hex: "hex-18-9" },
  { degree: 24, wilsonDegree: 23, ratio: "40/27", hex: "hex-21-12" },
  { degree: 25, wilsonDegree: 24, ratio: "3/2", hex: "hex-20-11" },
  { degree: 26, wilsonDegree: 25, ratio: "32/21", hex: "hex-19-9" },
  { degree: 27, wilsonDegree: 26, ratio: "14/9", hex: "hex-22-13" },
  { degree: 28, wilsonDegree: 27, ratio: "11/7", hex: "hex-21-11" },
  { degree: 29, wilsonDegree: 28, ratio: "8/5", hex: "hex-20-10" },
  { degree: 30, wilsonDegree: 29, ratio: "18/11", hex: "hex-19-8" },
  { degree: 31, wilsonDegree: 30, ratio: "5/3", hex: "hex-22-12" },
  { degree: 32, wilsonDegree: 31, ratio: "27/16", hex: "hex-21-10" },
  { degree: 33, wilsonDegree: 32, ratio: "12/7", hex: "hex-20-9" },
  { degree: 34, wilsonDegree: 33, ratio: "7/4", hex: "hex-23-12" },
  { degree: 35, wilsonDegree: 34, ratio: "16/9", hex: "hex-22-11" },
  { degree: 36, wilsonDegree: 35, ratio: "9/5", hex: "hex-21-9", splitGroup: 2, splitOption: "A" },
  { degree: 37, wilsonDegree: 35, ratio: "20/11", hex: "hex-21-9", splitGroup: 2, splitOption: "B" },
  { degree: 38, wilsonDegree: 36, ratio: "11/6", hex: "hex-24-13" },
  { degree: 39, wilsonDegree: 37, ratio: "15/8", hex: "hex-23-11" },
  { degree: 40, wilsonDegree: 38, ratio: "40/21", hex: "hex-22-10" },
  { degree: 41, wilsonDegree: 39, ratio: "64/33", hex: "hex-21-8" },
  { degree: 42, wilsonDegree: 40, ratio: "160/81", hex: "hex-24-12" }
];

export let activeHighlightSet = [];

export const splitStates = {
  1: "A", // Group 1 (hex-18-13): A = 11/10 (6.), B = 10/9 (7.)
  2: "A", // Group 2 (hex-21-9): A = 9/5 (36.), B = 20/11 (37.)
  octaveDown: true,
  octaveUp: true,
  referenceDegree: -1
};

// Map logical degree + ratio to physical hex text using tspan for multiple lines
function formatHexText(degreeObj, customRatio) {
  const ratioStr = customRatio || degreeObj.ratio;
  return `<tspan x="0" dy="-0.3em" font-weight="bold">${ratioStr}</tspan><tspan x="0" dy="1.2em" font-size="0.85em" fill="#a0a0ff">${degreeObj.wilsonDegree}</tspan>`;
}

export function shiftOctave(hexId, direction) {
  if (direction === 0) return hexId;
  let currentHex = hexId;
  const steps = Math.abs(direction);
  const stepDir = direction > 0 ? 1 : -1;
  
  for (let i = 0; i < steps; i++) {
    const parts = currentHex.split('-');
    const col = parseInt(parts[1], 10);
    const row = parseInt(parts[2], 10);
    
    if (stepDir === -1) {
      const newCol = col - 7;
      const newRow = (col % 2 === 0) ? row + 1 : row + 2;
      currentHex = `hex-${newCol}-${newRow}`;
    } else if (stepDir === 1) {
      const newCol = col + 7;
      const newRow = (col % 2 === 0) ? row - 2 : row - 1;
      currentHex = `hex-${newCol}-${newRow}`;
    }
  }
  return currentHex;
}

export function renderPartchKeyboard() {
  // Clear the whole grid first
  HexGrid.clearAllText();
  HexGrid.resetAllColors();
  
  const octaves = [0];
  if (splitStates.octaveDown) octaves.push(-1);
  if (splitStates.octaveUp) octaves.push(1);
  
  let maxOctaveRendered = 0;
  
  const mosaics = [-1, 0, 1]; // -1: Upper Mosaic, 0: Original, 1: Lower Mosaic

  const baseNote = PARTCH_DEGREES.find(n => n.degree === splitStates.referenceDegree);
  const baseRatio = baseNote ? parseRatioStr(baseNote.ratio) : [1,1];

  octaves.forEach(octaveOffset => {
    mosaics.forEach(mosaicOffset => {
      PARTCH_DEGREES.forEach(note => {
        // If it's a split key, check if it matches the current active option
        if (note.splitGroup) {
          if (splitStates[note.splitGroup] !== note.splitOption) {
            return; // Skip rendering this one, it's toggled off
          }
        }
        
        let displayRatioStr = note.ratio;
        let limit = -1;

        if (splitStates.referenceDegree !== -1) {
          const currentRatio = parseRatioStr(note.ratio);
          const interval = normalizeRatio(divideRatios(currentRatio, baseRatio));
          limit = getRatioLimit(interval);
          displayRatioStr = `${interval[0]}/${interval[1]}`;
        }
        
        let targetHexId = shiftOctave(note.hex, octaveOffset);
        
        // Aplicar la traslación geométrica del mosaico (Periodo: col 4, row 5)
        if (mosaicOffset === -1) {
          const parts = targetHexId.split('-');
          targetHexId = `hex-${parseInt(parts[1], 10) - 4}-${parseInt(parts[2], 10) - 5}`;
        } else if (mosaicOffset === 1) {
          const parts = targetHexId.split('-');
          targetHexId = `hex-${parseInt(parts[1], 10) + 4}-${parseInt(parts[2], 10) + 5}`;
        }
        
        const targetHex = HexGrid.hexagons.find(h => h.id === targetHexId);
        if (targetHex) {
          // Set the label
          HexGrid.setText(targetHexId, formatHexText(note, displayRatioStr));

          // Set logic values
          targetHex.noteDegree = note.degree; 
          let ratioVal = 1.0;
          if (note.ratio.includes('/')) {
            const parts = note.ratio.split('/');
            ratioVal = parseInt(parts[0]) / parseInt(parts[1]);
          } else {
            ratioVal = parseFloat(note.ratio);
          }
          targetHex.noteRatio = ratioVal;
          targetHex.noteOctave = octaveOffset;
          
          // Paint the key
          if (splitStates.referenceDegree !== -1) {
            // Colores por Límite Primo
            let opacity = 0.9;
            if (mosaicOffset !== 0) opacity = 0.2;
            else if (octaveOffset !== 0) opacity = 0.4;
            
            const [r, g, b] = getLimitColor(limit);
            HexGrid.setHexColor(targetHexId, `rgba(${r}, ${g}, ${b}, ${opacity})`);
          } else {
            // Colores por defecto (Blue/Red/Teal)
            let alpha = mosaicOffset === 0 ? 0.4 : 0.25; 
            if (octaveOffset === 0) {
              HexGrid.setHexColor(targetHexId, `rgba(100, 150, 200, ${alpha})`); // Base octave
            } else if (octaveOffset === -1) {
              HexGrid.setHexColor(targetHexId, `rgba(50, 200, 200, ${alpha})`); // Lower octave
            } else if (octaveOffset === 1) {
              HexGrid.setHexColor(targetHexId, `rgba(200, 50, 50, ${alpha})`); // Higher octave
            }
          }
        }
      });
    });
  });


  // --- Aplicar Highlight Sets ---
  HexGrid.hexagons.forEach(hex => {
    if (hex.noteDegree !== undefined) {
      const noteInfo = PARTCH_DEGREES.find(n => n.degree === hex.noteDegree);
      if (activeHighlightSet && activeHighlightSet.length > 0 && noteInfo && activeHighlightSet.includes(noteInfo.degree)) {
         hex.polygon.style.stroke = '#ffea00';
         hex.polygon.style.strokeWidth = '4px';
         hex.polygon.style.strokeDasharray = 'none';
      } else {
         hex.polygon.style.stroke = 'rgba(255, 255, 255, 0.1)';
         hex.polygon.style.strokeWidth = '1px';
      }
    }
  });

  // Recortar la grilla para ocultar los hexágonos vacíos y hacer zoom en los activos
  autoCropSvg();
}

// Oculta hexágonos vacíos y ajusta el viewBox del SVG para maximizar el tamaño
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

export function initPartchModule(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  renderPartchKeyboard();
}



