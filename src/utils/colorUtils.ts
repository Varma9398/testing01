import ase from 'adobe-swatch-exchange';

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: ColorInfo[];
  harmony: string;
  createdAt: string;
}

// RGB to HEX conversion
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// HEX to RGB conversion
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// RGB to HSL conversion
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Extract more comprehensive color palettes from image
export const extractColorsFromImage = (imageData: ImageData): ColorInfo[] => {
  const data = imageData.data;
  const colorMap = new Map<string, number>();
  
  // Sample every 5th pixel for better coverage
  for (let i = 0; i < data.length; i += 20) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Skip transparent pixels
    if (alpha < 125) continue;
    
    const hex = rgbToHex(r, g, b);
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }
  
  // Sort by frequency and take more colors (up to 20)
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([hex]) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      return {
        hex,
        rgb,
        hsl
      };
    });
  
  return sortedColors;
};

// Extract additional palette variations
export const extractAllColorPalettes = (imageData: ImageData): { 
  dominant: ColorInfo[];
  vibrant: ColorInfo[];
  muted: ColorInfo[];
  light: ColorInfo[];
  dark: ColorInfo[];
} => {
  const data = imageData.data;
  const allColors: ColorInfo[] = [];
  
  // Sample more comprehensively
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    if (alpha < 125) continue;
    
    const hex = rgbToHex(r, g, b);
    const rgb = { r, g, b };
    const hsl = rgbToHsl(r, g, b);
    
    allColors.push({ hex, rgb, hsl });
  }
  
  // Categorize colors
  const dominant = getTopColors(allColors, 12);
  const vibrant = allColors.filter(color => color.hsl.s > 60 && color.hsl.l > 20 && color.hsl.l < 80).slice(0, 10);
  const muted = allColors.filter(color => color.hsl.s < 50 && color.hsl.l > 30 && color.hsl.l < 70).slice(0, 8);
  const light = allColors.filter(color => color.hsl.l > 70).slice(0, 8);
  const dark = allColors.filter(color => color.hsl.l < 30).slice(0, 8);
  
  return { dominant, vibrant, muted, light, dark };
};

const getTopColors = (colors: ColorInfo[], count: number): ColorInfo[] => {
  const colorMap = new Map<string, number>();
  
  colors.forEach(color => {
    colorMap.set(color.hex, (colorMap.get(color.hex) || 0) + 1);
  });
  
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([hex]) => colors.find(c => c.hex === hex)!)
    .filter(Boolean);
};

// Generate color harmony based on base color
export const generateColorHarmony = (baseColor: ColorInfo, harmonyType: string): ColorInfo[] => {
  const { h, s, l } = baseColor.hsl;
  const colors: ColorInfo[] = [baseColor];

  switch (harmonyType) {
    case 'complementary':
      colors.push(createColorFromHsl((h + 180) % 360, s, l));
      break;
      
    case 'triadic':
      colors.push(createColorFromHsl((h + 120) % 360, s, l));
      colors.push(createColorFromHsl((h + 240) % 360, s, l));
      break;
      
    case 'analogous':
      for (let i = 1; i <= 4; i++) {
        colors.push(createColorFromHsl((h + i * 30) % 360, s, l));
      }
      break;
      
    case 'monochromatic':
      for (let i = 1; i <= 4; i++) {
        colors.push(createColorFromHsl(h, s, Math.max(10, Math.min(90, l + i * 15))));
      }
      break;
      
    case 'tetradic':
      colors.push(createColorFromHsl((h + 90) % 360, s, l));
      colors.push(createColorFromHsl((h + 180) % 360, s, l));
      colors.push(createColorFromHsl((h + 270) % 360, s, l));
      break;
  }

  return colors;
};

const createColorFromHsl = (h: number, s: number, l: number): ColorInfo => {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  
  return {
    hex,
    rgb,
    hsl: { h, s, l }
  };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
};

const SAVED_PALETTES_STORAGE_KEY = 'savedPalettes';

export const getSavedPalettes = (): ColorPalette[] => {
  const savedPalettes = localStorage.getItem(SAVED_PALETTES_STORAGE_KEY);
  return savedPalettes ? JSON.parse(savedPalettes) : [];
};

export const savePalette = (palette: ColorPalette): void => {
  const palettes = getSavedPalettes();
  const existingIndex = palettes.findIndex(p => p.id === palette.id);
  if (existingIndex > -1) {
    palettes[existingIndex] = palette;
  } else {
    if (!palette.createdAt) {
      palette.createdAt = new Date().toISOString();
    }
    palettes.unshift(palette);
  }
  localStorage.setItem(SAVED_PALETTES_STORAGE_KEY, JSON.stringify(palettes));
};

export const deletePalette = (id: string): void => {
  let palettes = getSavedPalettes();
  palettes = palettes.filter(palette => palette.id !== id);
  localStorage.setItem(SAVED_PALETTES_STORAGE_KEY, JSON.stringify(palettes));
};

export const clearAllPalettes = (): void => {
  localStorage.removeItem(SAVED_PALETTES_STORAGE_KEY);
};

// Export palette function
export const exportPalette = (palette: ColorPalette, format: string): Promise<string | Uint8Array> => {
  const colorsData = palette.colors.map(color => {
    const rgb = color.rgb;
    return {
      name: color.name || color.hex,
      model: 'RGB',
      color: [rgb.r / 255, rgb.g / 255, rgb.b / 255],
      type: 'global',
    };
  });

  switch (format) {
    case 'Adobe ASE':
      const aseFile = ase.encode({
        version: '1.0',
        groups: [],
        colors: colorsData,
      });
      return Promise.resolve(new Uint8Array(aseFile));

    case 'Adobe ACO':
      return Promise.resolve(`// Adobe ACO format for ${palette.name} is not yet implemented.`);

    case 'Figma JSON':
      const figmaColors = palette.colors.map(color => {
        const rgb = color.rgb;
        return {
          name: color.name || color.hex,
          type: 'PAINT',
          value: {
            r: rgb.r / 255,
            g: rgb.g / 255,
            b: rgb.b / 255,
            a: 1,
          },
        };
      });
      return Promise.resolve(JSON.stringify(figmaColors, null, 2));

    case 'Sketch Palette':
      const sketchColors = {
        compatibleVersion: '1.0',
        pluginVersion: '1.0',
        colors: palette.colors.map(color => {
          const rgb = color.rgb;
          return {
            red: rgb.r / 255,
            green: rgb.g / 255,
            blue: rgb.b / 255,
            alpha: 1,
            name: color.name || color.hex,
          };
        }),
      };
      return Promise.resolve(JSON.stringify(sketchColors, null, 2));

    case 'GIMP GPL':
      let gplContent = 'GIMP Palette\nName: ' + palette.name + '\nColumns: 3\n#\n';
      palette.colors.forEach(color => {
        gplContent += `${color.rgb.r}\t${color.rgb.g}\t${color.rgb.b}\t${color.name || color.hex}\n`;
      });
      return Promise.resolve(gplContent);

    case 'CorelDRAW CPL':
      return Promise.resolve(`// CorelDRAW CPL format for ${palette.name} is not yet implemented.`);

    case 'Procreate':
      return Promise.resolve(`// Procreate format for ${palette.name} is not yet implemented.`);

    case 'Adobe Illustrator AI':
      return Promise.resolve(`// Adobe Illustrator AI format for ${palette.name} is not yet implemented.`);

    case 'CSS Custom Properties':
      let cssVars = ':root {\n';
      palette.colors.forEach((color, index) => {
        cssVars += `  --color-${palette.name.toLowerCase().replace(/\s/g, '-')}-${index}: ${color.hex};\n`;
      });
      cssVars += '}';
      return Promise.resolve(cssVars);

    case 'SCSS/SASS Variables':
      let scssVars = '';
      palette.colors.forEach((color, index) => {
        scssVars += `$${palette.name.toLowerCase().replace(/\s/g, '-')}-${index}: ${color.hex};\n`;
      });
      return Promise.resolve(scssVars);

    case 'Tailwind CSS Config':
      let tailwindConfig = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${palette.name.toLowerCase().replace(/\s/g, '-')}': {\n`;
      palette.colors.forEach((color, index) => {
        tailwindConfig += `          ${index}: '${color.hex}',\n`;
      });
      tailwindConfig += `        },\n      },\n    },\n  },\n};\n`;
      return Promise.resolve(tailwindConfig);
      
    case 'Bootstrap Theme':
      let bootstrapTheme = `// Bootstrap theme variables for ${palette.name}\n`;
      palette.colors.forEach((color, index) => {
        bootstrapTheme += `$${palette.name.toLowerCase().replace(/\s/g, '-')}-${index}: ${color.hex};\n`;
      });
      return Promise.resolve(bootstrapTheme);

    case 'Material Design JSON':
      const materialColors: { [key: string]: string } = {};
      palette.colors.forEach((color, index) => {
        materialColors[`${palette.name.toLowerCase().replace(/\s/g, '-')}${index}`] = color.hex;
      });
      return Promise.resolve(JSON.stringify(materialColors, null, 2));

    case 'CSS Classes':
      let cssClasses = '';
      palette.colors.forEach((color, index) => {
        cssClasses += `.color-${palette.name.toLowerCase().replace(/\s/g, '-')}-${index} {\n  background-color: ${color.hex};\n}\n`;
      });
      return Promise.resolve(cssClasses);

    case 'JSON Object':
      return Promise.resolve(JSON.stringify(palette.colors, null, 2));
      
    case 'JavaScript Array':
      const jsArray = `const ${palette.name.replace(/\s/g, '_-').toLowerCase()} = ${JSON.stringify(palette.colors.map(c => c.hex), null, 2)};`;
      return Promise.resolve(jsArray);
      
    case 'Python Dictionary':
      let pyDict = `{\n`;
      palette.colors.forEach((color, index) => {
        pyDict += `    "${color.name || color.hex}": "${color.hex}",\n`;
      });
      pyDict += `}`; // Remove trailing comma and add closing brace
      return Promise.resolve(pyDict);

    case 'XML Format':
      let xml = '<palette>\n';
      palette.colors.forEach(color => {
        xml += `  <color hex="${color.hex}" r="${color.rgb.r}" g="${color.rgb.g}" b="${color.rgb.b}" />\n`;
      });
      xml += '</palette>';
      return Promise.resolve(xml);

    case 'Pantone Color List':
      return Promise.resolve(`// Pantone Color List for ${palette.name} is not yet implemented.`);

    case 'CMYK Values CSV':
      let cmykCsv = 'Hex,R,G,B,C,M,Y,K\n';
      palette.colors.forEach(color => {
        const r = color.rgb.r / 255;
        const g = color.rgb.g / 255;
        const b = color.rgb.b / 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        cmykCsv += `${color.hex},${color.rgb.r},${color.rgb.g},${color.rgb.b},${(c * 100).toFixed(0)},${(m * 100).toFixed(0)},${(y * 100).toFixed(0)},${(k * 100).toFixed(0)}\n`;
      });
      return Promise.resolve(cmykCsv);

    case 'LAB Color Values':
      let labContent = 'Hex,R,G,B,L,A,B\n';
      palette.colors.forEach(color => {
        labContent += `${color.hex},${color.rgb.r},${color.rgb.g},${color.rgb.b},0,0,0\n`;
      });
      return Promise.resolve(labContent);

    case 'Print-Ready PDF':
      return Promise.resolve(`// Print-Ready PDF for ${palette.name} is not yet implemented.`);

    case 'Excel Spreadsheet':
      let excelCsv = 'Hex,R,G,B,Name\n';
      palette.colors.forEach(color => {
        excelCsv += `${color.hex},${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.name || ''}\n`;
      });
      return Promise.resolve(excelCsv);

    case 'CSV Data':
      let csvData = 'Hex,R,G,B,Name\n';
      palette.colors.forEach(color => {
        csvData += `${color.hex},${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.name || ''}\n`;
      });
      return Promise.resolve(csvData);

    case 'Plain Text List':
      let textList = '';
      palette.colors.forEach(color => {
        textList += `${color.hex} (R:${color.rgb.r}, G:${color.rgb.g}, B:${color.rgb.b})\n`;
      });
      return Promise.resolve(textList);

    case 'PNG Image':
    case 'JPEG Image':
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const swatchSize = 100;
        canvas.width = palette.colors.length * swatchSize;
        canvas.height = swatchSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        palette.colors.forEach((color, index) => {
          ctx.fillStyle = color.hex;
          ctx.fillRect(index * swatchSize, 0, swatchSize, swatchSize);
        });

        const mimeType = format === 'PNG Image' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(blob => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, mimeType);
      });

    case 'SVG Image':
      let svgContent = `<svg width="${palette.colors.length * 100}" height="100" xmlns="http://www.w3.org/2000/svg">\n`;
      palette.colors.forEach((color, index) => {
        svgContent += `  <rect x="${index * 100}" y="0" width="100" height="100" fill="${color.hex}" />\n`;
      });
      svgContent += `</svg>`;
      return Promise.resolve(svgContent);
      
    default:
      return Promise.resolve(`Unsupported format: ${format}`);
  }
};
