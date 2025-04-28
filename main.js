// Main conversion function
function convertColor() {
    const hexInput = document.getElementById('hexInput').value.trim();
    const colorBox = document.getElementById('colorBox');
    const resultGrid = document.getElementById('resultGrid');
    
    // Validate hex input
    const hexRegex = /^#?[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(hexInput)) {
        alert('Please enter a valid hex color (e.g., #FF5733)');
        return;
    }
    
    // Ensure hex has # prefix
    const hex = hexInput.startsWith('#') ? hexInput : '#' + hexInput;
    
    // Update color preview
    colorBox.style.backgroundColor = hex;
    
    // Convert to various color spaces
    const rgb = hexToRgb(hex);
    const linearRgb = srgbToLinearRgb(rgb);
    const xyz = linearRgbToXyz(linearRgb);
    const lab = xyzToLab(xyz);
    const lch = labToLch(lab);
    const hsl = rgbToHsl(rgb);
    const hsv = rgbToHsv(rgb);
    const cmyk = rgbToCmyk(rgb);
    const oklab = xyzToOklab(xyz);
    const oklch = oklabToOklch(oklab);
    
    // Create result cards
    resultGrid.innerHTML = '';
    
    // sRGB values
    addResultCard('sRGB', [
        `R: ${rgb.r}, G: ${rgb.g}, B: ${rgb.b}`,
        `Normalized: rgb(${Math.round(rgb.r/2.55)}%, ${Math.round(rgb.g/2.55)}%, ${Math.round(rgb.b/2.55)}%)`,
        `Hex: ${hex.toUpperCase()}`
    ]);
    
    // Linear RGB
    addResultCard('Linear RGB', [
        `R: ${linearRgb.r.toFixed(6)}`,
        `G: ${linearRgb.g.toFixed(6)}`,
        `B: ${linearRgb.b.toFixed(6)}`
    ]);
    
    // CIE XYZ
    addResultCard('CIE XYZ', [
        `X: ${xyz.x.toFixed(6)}`,
        `Y: ${xyz.y.toFixed(6)}`,
        `Z: ${xyz.z.toFixed(6)}`
    ]);
    
    // CIE Lab
    addResultCard('CIE Lab', [
        `L*: ${lab.l.toFixed(2)}`,
        `a*: ${lab.a.toFixed(2)}`,
        `b*: ${lab.b.toFixed(2)}`
    ]);
    
    // CIE LCh
    addResultCard('CIE LCh', [
        `L*: ${lch.l.toFixed(2)}`,
        `C*: ${lch.c.toFixed(2)}`,
        `h°: ${lch.h.toFixed(2)}`
    ]);
    
    // HSL
    addResultCard('HSL', [
        `H: ${Math.round(hsl.h)}°`,
        `S: ${Math.round(hsl.s)}%`,
        `L: ${Math.round(hsl.l)}%`,
        `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`
    ]);
    
    // HSV/HSB
    addResultCard('HSV/HSB', [
        `H: ${Math.round(hsv.h)}°`,
        `S: ${Math.round(hsv.s)}%`,
        `V: ${Math.round(hsv.v)}%`
    ]);
    
    // CMYK
    addResultCard('CMYK', [
        `C: ${Math.round(cmyk.c)}%`,
        `M: ${Math.round(cmyk.m)}%`,
        `Y: ${Math.round(cmyk.y)}%`,
        `K: ${Math.round(cmyk.k)}%`
    ]);
    
    // Oklab
    addResultCard('Oklab', [
        `L: ${oklab.l.toFixed(6)}`,
        `a: ${oklab.a.toFixed(6)}`,
        `b: ${oklab.b.toFixed(6)}`
    ]);
    
    // Oklch
    addResultCard('Oklch', [
        `L: ${oklch.l.toFixed(6)}`,
        `C: ${oklch.c.toFixed(6)}`,
        `h: ${oklch.h.toFixed(2)}°`
    ]);
}

// Helper function to add a result card
function addResultCard(title, values) {
    const resultGrid = document.getElementById('resultGrid');
    const card = document.createElement('div');
    card.className = 'result-card';
    
    let cardContent = `<h3>${title}</h3>`;
    
    values.forEach(value => {
        cardContent += `<div class="space-value">${value} <button class="copy-btn" onclick="copyToClipboard('${value}')">Copy</button></div>`;
    });
    
    card.innerHTML = cardContent;
    resultGrid.appendChild(card);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard');
    });
}

// Color conversion functions
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function srgbToLinearRgb(rgb) {
    const toLinear = (value) => {
        const v = value / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    
    return {
        r: toLinear(rgb.r),
        g: toLinear(rgb.g),
        b: toLinear(rgb.b)
    };
}

function linearRgbToXyz(rgb) {
    // sRGB D65 reference white
    return {
        x: 0.4124 * rgb.r + 0.3576 * rgb.g + 0.1805 * rgb.b,
        y: 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b,
        z: 0.0193 * rgb.r + 0.1192 * rgb.g + 0.9505 * rgb.b
    };
}

function xyzToLab(xyz) {
    // D65 reference white
    const xn = 0.95047;
    const yn = 1.0;
    const zn = 1.08883;
    
    const epsilon = 0.008856;
    const kappa = 903.3;
    
    const xr = xyz.x / xn;
    const yr = xyz.y / yn;
    const zr = xyz.z / zn;
    
    const fx = xr > epsilon ? Math.pow(xr, 1/3) : (kappa * xr + 16) / 116;
    const fy = yr > epsilon ? Math.pow(yr, 1/3) : (kappa * yr + 16) / 116;
    const fz = zr > epsilon ? Math.pow(zr, 1/3) : (kappa * zr + 16) / 116;
    
    return {
        l: 116 * fy - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz)
    };
}

function labToLch(lab) {
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    let h = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
    
    if (h < 0) {
        h += 360;
    }
    
    return {
        l: lab.l,
        c: c,
        h: h
    };
}

function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (delta !== 0) {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        
        h *= 60;
        if (h < 0) h += 360;
    }
    
    return {
        h: h,
        s: s * 100,
        l: l * 100
    };
}

function rgbToHsv(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    const v = max;
    const s = max === 0 ? 0 : delta / max;
    
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        
        h *= 60;
        if (h < 0) h += 360;
    }
    
    return {
        h: h,
        s: s * 100,
        v: v * 100
    };
}

function rgbToCmyk(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    
    return {
        c: c * 100,
        m: m * 100,
        y: y * 100,
        k: k * 100
    };
}

// Oklab and Oklch conversions (perceptually uniform)
function xyzToOklab(xyz) {
    // Convert XYZ to Oklab
    const l = 0.8189330101 * xyz.x + 0.3618667424 * xyz.y - 0.1288597137 * xyz.z;
    const m = 0.0329845436 * xyz.x + 0.9293118715 * xyz.y + 0.0361456387 * xyz.z;
    const s = 0.0482003018 * xyz.x + 0.2643662691 * xyz.y + 0.6338517070 * xyz.z;
    
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    
    return {
        l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
}

function oklabToOklch(oklab) {
    const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
    let h = Math.atan2(oklab.b, oklab.a) * 180 / Math.PI;
    
    if (h < 0) {
        h += 360;
    }
    
    return {
        l: oklab.l,
        c: c,
        h: h
    };
}

// Initialize on page load
window.onload = function() {
    convertColor();
};