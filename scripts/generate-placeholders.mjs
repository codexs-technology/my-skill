/**
 * Generates the temporary artwork that ships with the site:
 *   - public/projects/*.png   → 16:10 project card placeholders
 *   - public/og-image.png     → 1200x630 social share card
 *   - public/Mehboob_Masih_Resume.pdf → placeholder so the download link never 404s
 *
 * Run with: npm run placeholders
 * Uses only Node built-ins (zlib + fs), so there is nothing to install.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..');
const PROJECTS_DIR = join(ROOT, 'public', 'projects');

/* ────────────────────────────── PNG encoding ────────────────────────────── */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

/** Encodes a raw RGB buffer (width * height * 3 bytes) as a PNG. */
function encodePng(width, height, rgb) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 3 + 1; // +1 filter byte per row
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * stride] = 0; // filter: none
    rgb.copy(raw, y * stride + 1, y * width * 3, (y + 1) * width * 3);
  }

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ───────────────────────────── Tiny canvas helper ───────────────────────── */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = Buffer.alloc(width * height * 3);
  }

  blend(x, y, [r, g, b], alpha = 1) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const a = clamp01(alpha);
    if (a === 0) return;
    const i = (y * this.width + x) * 3;
    this.data[i] = Math.round(this.data[i] * (1 - a) + r * a);
    this.data[i + 1] = Math.round(this.data[i + 1] * (1 - a) + g * a);
    this.data[i + 2] = Math.round(this.data[i + 2] * (1 - a) + b * a);
  }

  /** Diagonal linear gradient across the whole canvas. */
  gradient(from, to) {
    const max = this.width + this.height || 1;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const t = (x + y) / max;
        const colour = [
          from[0] + (to[0] - from[0]) * t,
          from[1] + (to[1] - from[1]) * t,
          from[2] + (to[2] - from[2]) * t,
        ];
        const i = (y * this.width + x) * 3;
        this.data[i] = Math.round(colour[0]);
        this.data[i + 1] = Math.round(colour[1]);
        this.data[i + 2] = Math.round(colour[2]);
      }
    }
  }

  rect(x, y, width, height, colour, alpha = 1) {
    for (let py = Math.floor(y); py < Math.ceil(y + height); py += 1) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px += 1) {
        this.blend(px, py, colour, alpha);
      }
    }
  }

  circle(cx, cy, radius, colour, alpha = 1) {
    const r2 = radius * radius;
    for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py += 1) {
      for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px += 1) {
        const dx = px + 0.5 - cx;
        const dy = py + 0.5 - cy;
        if (dx * dx + dy * dy <= r2) this.blend(px, py, colour, alpha);
      }
    }
  }

  /** Rounded rectangle. Radius 0 falls back to a sharp rect. */
  roundedRect(x, y, width, height, radius, colour, alpha = 1) {
    const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
    const inner = {
      left: x + r,
      top: y + r,
      right: x + width - r,
      bottom: y + height - r,
    };

    for (let py = Math.floor(y); py < Math.ceil(y + height); py += 1) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px += 1) {
        const cx = px + 0.5;
        const cy = py + 0.5;
        const nearestX = Math.min(Math.max(cx, inner.left), inner.right);
        const nearestY = Math.min(Math.max(cy, inner.top), inner.bottom);
        const dx = cx - nearestX;
        const dy = cy - nearestY;
        if (dx * dx + dy * dy <= r * r) {
          this.blend(px, py, colour, alpha);
        }
      }
    }
  }
}


/* ──────────────────────────────── Artwork ───────────────────────────────── */

const PROJECT_ART = [
  { file: 'lehigh-valley-roofers.png', from: [30, 58, 138], to: [79, 70, 229], accent: [96, 165, 250] },
  { file: 'new-queens-nails.png', from: [88, 28, 135], to: [219, 39, 119], accent: [244, 114, 182] },
  { file: 'familia-heat-air-plumbing.png', from: [15, 76, 92], to: [37, 99, 235], accent: [56, 189, 248] },
  { file: 'auto-care-service.png', from: [30, 41, 59], to: [79, 70, 229], accent: [129, 140, 248] },
  { file: 'leadership-consulting.png', from: [49, 46, 129], to: [124, 58, 237], accent: [196, 181, 253] },
  { file: 'ai-chatbot-saas.png', from: [12, 74, 110], to: [79, 70, 229], accent: [103, 232, 249] },
  { file: 'auth-rest-api.png', from: [17, 24, 39], to: [37, 99, 235], accent: [147, 197, 253] },
  { file: 'trading-platform.png', from: [6, 78, 59], to: [37, 99, 235], accent: [110, 231, 183] },
];

const WHITE = [255, 255, 255];

/** Draws an abstract "browser window" mock — deliberately text-free. */
function drawMockWindow(canvas, accent) {
  const { width: w, height: h } = canvas;
  const x = Math.round(w * 0.09);
  const y = Math.round(h * 0.13);
  const cardW = Math.round(w * 0.82);
  const cardH = Math.round(h * 0.74);
  const radius = 22;

  // Window frame + glass body
  canvas.roundedRect(x, y, cardW, cardH, radius, WHITE, 0.28);
  canvas.roundedRect(x + 2, y + 2, cardW - 4, cardH - 4, radius - 2, [10, 14, 30], 0.55);
  canvas.roundedRect(x + 2, y + 2, cardW - 4, cardH - 4, radius - 2, WHITE, 0.06);

  // Title bar with traffic-light dots
  const barH = Math.round(cardH * 0.12);
  canvas.rect(x + 2, y + barH, cardW - 4, 1, WHITE, 0.18);
  const dotY = y + barH / 2;
  [0.045, 0.085, 0.125].forEach((ratio, index) => {
    canvas.circle(x + cardW * ratio, dotY, 5, index === 0 ? accent : WHITE, index === 0 ? 0.9 : 0.45);
  });

  // Left column: heading + copy bars
  const padX = x + Math.round(cardW * 0.05);
  let cursorY = y + barH + Math.round(cardH * 0.1);
  canvas.roundedRect(padX, cursorY, cardW * 0.4, 16, 8, WHITE, 0.55);
  cursorY += 34;
  [0.55, 0.47, 0.3].forEach((ratio) => {
    canvas.roundedRect(padX, cursorY, cardW * ratio, 10, 5, WHITE, 0.26);
    cursorY += 22;
  });

  // Media block + CTA button
  const blockY = cursorY + 16;
  canvas.roundedRect(padX, blockY, cardW * 0.4, Math.round(cardH * 0.26), 14, accent, 0.62);
  canvas.roundedRect(padX, blockY + Math.round(cardH * 0.32), cardW * 0.22, 34, 12, WHITE, 0.78);

  // Right column: chart-ish bars
  const rightX = x + Math.round(cardW * 0.55);
  let rightY = y + barH + Math.round(cardH * 0.12);
  [0.34, 0.26, 0.3].forEach((ratio) => {
    canvas.roundedRect(rightX, rightY, cardW * ratio, 10, 5, WHITE, 0.2);
    rightY += 24;
  });
  rightY += 12;
  [0.1, 0.16, 0.08, 0.2, 0.13].forEach((ratio, index) => {
    const barH = Math.round(cardH * (0.08 + index * 0.035));
    canvas.roundedRect(rightX + index * 30, rightY - barH, 18, barH, 6, accent, 0.5);
  });
}

function buildProjectPlaceholder({ from, to, accent }, width = 1200, height = 750) {
  const canvas = new Canvas(width, height);
  canvas.gradient(from, to);

  // Soft vignette so the mock window reads clearly
  const { width: w, height: h } = canvas;
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const dx = (x - w / 2) / (w / 2);
      const dy = (y - h / 2) / (h / 2);
      const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      canvas.blend(x, y, [4, 6, 16], distance * 0.28);
    }
  }

  drawMockWindow(canvas, accent);
  return encodePng(width, height, canvas.data);
}

function buildOgImage(width = 1200, height = 630) {
  const canvas = new Canvas(width, height);
  canvas.gradient([12, 20, 44], [79, 70, 229]);

  // Monogram tile
  canvas.roundedRect(96, 96, 120, 120, 28, [124, 58, 237], 0.35);
  canvas.roundedRect(108, 108, 96, 96, 22, WHITE, 0.22);

  // Name + title bars
  canvas.roundedRect(96, 262, 620, 34, 17, WHITE, 0.85);
  canvas.roundedRect(96, 320, 460, 20, 10, WHITE, 0.5);
  canvas.roundedRect(96, 372, 780, 10, 5, WHITE, 0.3);
  canvas.roundedRect(96, 396, 700, 10, 5, WHITE, 0.26);
  canvas.roundedRect(96, 420, 520, 10, 5, WHITE, 0.22);

  // Skill pills
  canvas.roundedRect(96, 476, 120, 34, 17, WHITE, 0.3);
  canvas.roundedRect(232, 476, 150, 34, 17, WHITE, 0.24);
  canvas.roundedRect(398, 476, 130, 34, 17, WHITE, 0.24);
  canvas.roundedRect(544, 476, 160, 34, 17, WHITE, 0.2);

  // Accent ring on the right
  canvas.circle(width - 190, height / 2, 150, [96, 165, 250], 0.22);
  canvas.circle(width - 190, height / 2, 96, WHITE, 0.12);

  return encodePng(width, height, canvas.data);
}



/* ───────────────────────── Placeholder resume PDF ───────────────────────── */

function buildResumePdf() {
  const lines = [
    ['F1', 20, 760, 'Mehboob Masih'],
    ['F1', 11, 736, 'Full Stack Developer | AI and Automation | Digital Marketing'],
    ['F1', 11, 714, 'Karachi, Pakistan | codexstechnology@gmail.com | +92 341 2768875'],
    ['F1', 11, 692, 'https://github.com/codexs-technology'],
    ['F2', 10, 640, 'PLACEHOLDER FILE - replace public/Mehboob_Masih_Resume.pdf with your real resume PDF.'],
    ['F2', 10, 622, 'This page exists only so the Download Resume button never returns a broken link.'],
  ];

  const content = lines
    .map(([font, size, y, text]) => `BT /${font} ${size} Tf 72 ${y} Td (${text}) Tj ET`)
    .join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const startXref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

/* ───────────────────────────────── Main ─────────────────────────────────── */

function main() {
  mkdirSync(PROJECTS_DIR, { recursive: true });

  PROJECT_ART.forEach((art) => {
    writeFileSync(join(PROJECTS_DIR, art.file), buildProjectPlaceholder(art));
    console.log(`generated  public/projects/${art.file}`);
  });

  writeFileSync(join(ROOT, 'public', 'og-image.png'), buildOgImage());
  console.log('generated  public/og-image.png');

  writeFileSync(join(ROOT, 'public', 'Mehboob_Masih_Resume.pdf'), buildResumePdf());
  console.log('generated  public/Mehboob_Masih_Resume.pdf (placeholder)');
}

main();

