import HexGrid from './hexgrid.js';

export const DALESSANDRO_DEGREES = [
  { degree: 0, wilsonDegree: 0, ratio: "∅", hex: "hex-16-13", cpsCategory: "0)6 Monany / 1)6 Hexany" },
  { degree: 1, wilsonDegree: 0, ratio: "3∙7∙9∙11", hex: "hex-14-9", cpsCategory: "4)6 Pentadekany / 5)6 Hexany" },
  { degree: 2, wilsonDegree: 1, ratio: "3∙11", hex: "hex-15-10", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 3, wilsonDegree: 2, ratio: "3∙5∙9", hex: "hex-16-12", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 4, wilsonDegree: 3, ratio: "3²∙5∙9∙11", hex: "hex-15-9", splitGroup: 1, splitOption: "A", cpsCategory: "Pigtail" },
  { degree: 5, wilsonDegree: 3, ratio: "7∙11/9", hex: "hex-15-9", splitGroup: 1, splitOption: "B", cpsCategory: "Pigtail" },
  { degree: 6, wilsonDegree: 4, ratio: "5∙7", hex: "hex-16-11", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 7, wilsonDegree: 5, ratio: "9", hex: "hex-17-12", cpsCategory: "1)6 Hexany / 2)6 Pentadekany" },
  { degree: 8, wilsonDegree: 5, ratio: "3∙5∙7∙11", hex: "hex-15-8", cpsCategory: "4)6 Pentadekany / 5)6 Hexany" },
  { degree: 9, wilsonDegree: 6, ratio: "3∙9∙11", hex: "hex-16-10", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 10, wilsonDegree: 7, ratio: "7/3", hex: "hex-17-11", splitGroup: 2, splitOption: "A", cpsCategory: "Pigtail" },
  { degree: 11, wilsonDegree: 7, ratio: "9×3∙5∙9", hex: "hex-17-11", splitGroup: 2, splitOption: "B", cpsCategory: "Pigtail" },
  { degree: 12, wilsonDegree: 8, ratio: "7∙11", hex: "hex-16-9", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 13, wilsonDegree: 9, ratio: "5∙7∙9", hex: "hex-17-10", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 14, wilsonDegree: 10, ratio: "5", hex: "hex-18-12", cpsCategory: "1)6 Hexany / 2)6 Pentadekany" },
  { degree: 15, wilsonDegree: 10, ratio: "3∙5∙7∙9∙11", hex: "hex-16-8", cpsCategory: "5)6 Hexany / 6)6 Monany" },
  { degree: 16, wilsonDegree: 11, ratio: "3∙5∙11", hex: "hex-17-9", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 17, wilsonDegree: 12, ratio: "3∙7", hex: "hex-18-11", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 18, wilsonDegree: 13, ratio: "3∙5∙7∙9/11", hex: "hex-19-12", splitGroup: 3, splitOption: "A", cpsCategory: "Pigtail" },
  { degree: 19, wilsonDegree: 13, ratio: "/3", hex: "hex-19-12", splitGroup: 3, splitOption: "B", cpsCategory: "Pigtail" },
  { degree: 20, wilsonDegree: 13, ratio: "7∙9∙11", hex: "hex-17-8", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 21, wilsonDegree: 14, ratio: "11", hex: "hex-18-10", cpsCategory: "1)6 Hexany / 2)6 Pentadekany" },
  { degree: 22, wilsonDegree: 15, ratio: "5∙9", hex: "hex-19-11", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 23, wilsonDegree: 16, ratio: "3∙5∙9∙11", hex: "hex-18-9", cpsCategory: "4)6 Pentadekany / 5)6 Hexany" },
  { degree: 24, wilsonDegree: 17, ratio: "3∙7∙9", hex: "hex-19-10", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 25, wilsonDegree: 18, ratio: "3", hex: "hex-20-12", cpsCategory: "1)6 Hexany / 2)6 Pentadekany" },
  { degree: 26, wilsonDegree: 18, ratio: "5∙7∙11", hex: "hex-18-8", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 27, wilsonDegree: 19, ratio: "9∙11", hex: "hex-19-9", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 28, wilsonDegree: 20, ratio: "3²∙5∙9", hex: "hex-20-11", cpsCategory: "Pigtail (1∙3∙7∙9∙11∙15 Eikosany)" },
  { degree: 29, wilsonDegree: 21, ratio: "7∙11/3", hex: "hex-19-8", cpsCategory: "Pigtail (1∙3∙7∙9∙11∙15 Eikosany)" },
  { degree: 30, wilsonDegree: 22, ratio: "3∙5∙7", hex: "hex-20-10", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 31, wilsonDegree: 23, ratio: "3∙9", hex: "hex-21-11", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 32, wilsonDegree: 23, ratio: "5∙7∙9∙11", hex: "hex-19-7", cpsCategory: "4)6 Pentadekany / 5)6 Hexany" },
  { degree: 33, wilsonDegree: 24, ratio: "5∙11", hex: "hex-20-9", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 34, wilsonDegree: 25, ratio: "7", hex: "hex-21-10", cpsCategory: "1)6 Hexany / 2)6 Pentadekany" },
  { degree: 35, wilsonDegree: 26, ratio: "3∙7∙11", hex: "hex-20-8", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 36, wilsonDegree: 27, ratio: "3∙5∙7∙9", hex: "hex-21-9", cpsCategory: "4)6 Pentadekany / 5)6 Hexany" },
  { degree: 37, wilsonDegree: 28, ratio: "3∙5", hex: "hex-22-11", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" },
  { degree: 38, wilsonDegree: 28, ratio: "11²", hex: "hex-20-7", splitGroup: 4, splitOption: "A", cpsCategory: "Pigtail" },
  { degree: 39, wilsonDegree: 28, ratio: "3²∙5∙7∙9∙11", hex: "hex-20-7", splitGroup: 4, splitOption: "B", cpsCategory: "Pigtail" },
  { degree: 40, wilsonDegree: 29, ratio: "5∙9∙11", hex: "hex-21-8", cpsCategory: "3)6 Eikosany / 4)6 Pentadekany" },
  { degree: 41, wilsonDegree: 30, ratio: "7∙9", hex: "hex-22-10", cpsCategory: "2)6 Pentadekany / 3)6 Eikosany" }
];

export let activeHighlightSet = [];

export const splitStates = {
  1: "A",
  2: "A",
  3: "A",
  4: "A",
  octaveDown: true,
  octaveUp: true,
  octaveUp2: true
};

export const activeCategories = new Set();

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

export function shiftMosaic(hexId, direction) {
  if (direction === 0) return hexId;
  const parts = hexId.split('-');
  const col = parseInt(parts[1], 10);
  const row = parseInt(parts[2], 10);
  
  // Up mosaic (-1) = col - 2, row - 5
  // Down mosaic (1) = col + 2, row + 5
  const newCol = col + (direction * 2);
  const newRow = row + (direction * 5);
  
  return `hex-${newCol}-${newRow}`;
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

function getOctaveColorRGB(octave) {
  if (octave === 1) return "200, 100, 100"; // Rojo
  if (octave === -1) return "50, 200, 200"; // Turquesa
  if (octave === 2) return "200, 150, 50"; // Dorado
  return "100, 150, 200"; // Azul base (octava 0)
}

function getCategoryColorRGB(categoryString) {
  if (categoryString.includes("0)6 Monany")) return "100, 116, 139"; // slate
  if (categoryString.includes("1)6 Hexany")) return "245, 158, 11"; // amber
  if (categoryString.includes("2)6 Pentadekany")) return "16, 185, 129"; // emerald
  if (categoryString.includes("3)6 Eikosany")) return "59, 130, 246"; // blue
  if (categoryString.includes("4)6 Pentadekany")) return "139, 92, 246"; // violet
  if (categoryString.includes("5)6 Hexany")) return "236, 72, 153"; // pink
  if (categoryString.includes("6)6 Monany")) return "244, 63, 94"; // rose
  if (categoryString.includes("Pigtail")) return "217, 70, 239"; // fuchsia
  return "255, 255, 255";
}

export function renderDalessandroKeyboard() {
  HexGrid.clearAllText();
  HexGrid.resetAllColors();
  
  const octaves = [0];
  if (splitStates.octaveDown) octaves.push(-1);
  if (splitStates.octaveUp) octaves.push(1);

  const mosaics = [-1, 0, 1]; // -1: Arriba, 0: Principal, 1: Abajo

  octaves.forEach(octaveOffset => {
    DALESSANDRO_DEGREES.forEach(note => {
      // Si es una split key, solo renderizar la opción activa
      if (note.splitGroup) {
        if (splitStates[note.splitGroup] !== note.splitOption) {
          return; 
        }
      }

      let baseHexId = shiftOctave(note.hex, octaveOffset);
      
      mosaics.forEach(mosaicDir => {
        let targetHexId = shiftMosaic(baseHexId, mosaicDir);
        const hex = HexGrid.hexagons.find(h => h.id === targetHexId);
        
        if (hex) {
          let ratioFontSize = note.ratio.length > 8 ? "0.6em" : "0.75em";
          let wilsonColor = note.cpsCategory && note.cpsCategory.includes("Pigtail") ? "#d946ef" : "#a0a0ff";
          HexGrid.setText(targetHexId, `<tspan x="0" dy="-0.3em" font-size="${ratioFontSize}">${note.ratio}</tspan><tspan x="0" dy="1.4em" font-size="0.6em" fill="${wilsonColor}" font-weight="bold">${note.wilsonDegree}</tspan>`);
          
          // Datos OSC: Idénticos al principal
          hex.noteDegree = note.degree;
          hex.noteRatio = 1.0; 
          hex.noteOctave = octaveOffset;
          let isHighlighted = false;
          let highlightCategoryColorRGB = null;
          
          if (activeCategories.size > 0) {
            for (const cat of activeCategories) {
              if (note.cpsCategory.includes(cat)) {
                isHighlighted = true;
                highlightCategoryColorRGB = getCategoryColorRGB(cat);
                break; // Use the first matching active category's border color
              }
            }
          }

          let rgb;
          let opacity;

          if (activeCategories.size > 0) {
            if (isHighlighted) {
              // El relleno mantiene el color puro de la octava
              rgb = getOctaveColorRGB(octaveOffset);
              opacity = (mosaicDir === 0) ? 0.8 : 0.2;
            } else {
              rgb = "80, 80, 80"; // Gris apagado para las no seleccionadas
              opacity = 0.05; // Muy atenuado
            }
          } else {
            // "El teclado por defecto no debería tener las teclas resaltadas."
            rgb = getOctaveColorRGB(octaveOffset);
            opacity = (mosaicDir === 0) ? 0.2 : 0.05; 
          }
          
          HexGrid.setHexColor(targetHexId, `rgba(${rgb}, ${opacity})`);
          
          // Si está resaltado, usar el color de la categoría CPS solo para el borde
          if (isHighlighted) {
             const poly = hex.polygon;
             poly.style.stroke = (mosaicDir === 0) ? `rgb(${highlightCategoryColorRGB})` : `rgba(${highlightCategoryColorRGB}, 0.5)`;
             poly.style.strokeWidth = (mosaicDir === 0) ? "2px" : "1px";
             // Si queremos que el borde sobresalga bien sobre la caja
             poly.style.strokeDasharray = "none";
          } else {
             const poly = hex.polygon;
             poly.style.stroke = "rgba(255, 255, 255, 0.1)";
             poly.style.strokeWidth = "1px";
          }
        }
      });
    });
  });

  // El grado 0 (∅) de la octava 2 y sus mosaicos
  if (splitStates.octaveUp2) {
    const rootNote = DALESSANDRO_DEGREES.find(n => n.degree === 0);
    const baseHexId = shiftOctave(rootNote.hex, 2);
    
    mosaics.forEach(mosaicDir => {
      let targetHexId = shiftMosaic(baseHexId, mosaicDir);
      const hex = HexGrid.hexagons.find(h => h.id === targetHexId);
      
      if (hex) {
        HexGrid.setText(targetHexId, `<tspan x="0" dy="-0.3em" font-size="0.75em">${rootNote.ratio}</tspan><tspan x="0" dy="1.4em" font-size="0.6em" fill="#a0a0ff" font-weight="bold">${rootNote.wilsonDegree}</tspan>`);
        hex.noteDegree = 0;
        hex.noteRatio = 1.0;
        hex.noteOctave = 2;
        
          // Logica de resaltado también para el grado central de la octava 2
          let isHighlighted = false;
          let highlightCategoryColorRGB = null;
          
          if (activeCategories.size > 0) {
            for (const cat of activeCategories) {
              if (rootNote.cpsCategory.includes(cat)) {
                isHighlighted = true;
                highlightCategoryColorRGB = getCategoryColorRGB(cat);
                break;
              }
            }
          }

          let rgb;
          let opacity;

          if (activeCategories.size > 0) {
            if (isHighlighted) {
              rgb = getOctaveColorRGB(2);
              opacity = (mosaicDir === 0) ? 0.8 : 0.2;
            } else {
              rgb = "80, 80, 80";
              opacity = 0.05; 
            }
          } else {
            rgb = getOctaveColorRGB(2);
            opacity = (mosaicDir === 0) ? 0.2 : 0.05; 
          }
          HexGrid.setHexColor(targetHexId, `rgba(${rgb}, ${opacity})`);
          
          if (isHighlighted) {
             const poly = hex.polygon;
             poly.style.stroke = (mosaicDir === 0) ? `rgb(${highlightCategoryColorRGB})` : `rgba(${highlightCategoryColorRGB}, 0.5)`;
             poly.style.strokeWidth = (mosaicDir === 0) ? "2px" : "1px";
             poly.style.strokeDasharray = "none";
          } else {
             const poly = hex.polygon;
             poly.style.stroke = "rgba(255, 255, 255, 0.1)";
             poly.style.strokeWidth = "1px";
          }
      }
    });
  }


  // --- Aplicar Highlight Sets ---
  if (activeHighlightSet && activeHighlightSet.length > 0) {
    HexGrid.hexagons.forEach(hex => {
      if (hex.noteDegree !== undefined) {
        if (activeHighlightSet.includes(hex.noteDegree)) {
           hex.polygon.style.stroke = '#ffea00';
           hex.polygon.style.strokeWidth = '4px';
           hex.polygon.style.strokeDasharray = 'none';
        }
      }
    });
  }

  // Habilitar auto-recorte para engrandecer y centrar el teclado

  autoCropSvg();
}

export function initDalessandroModule(containerId) {
  const container = document.getElementById(containerId);
  HexGrid.generate();
  HexGrid.render(container);
  renderDalessandroKeyboard();
}
