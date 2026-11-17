// Crops the brand logos in public/products/LOGO/ to their artwork bounds and
// writes ASCII-named copies to public/brand/. Re-run after replacing a logo:
//   npm run logos
// Dependency-free: decodes/encodes 8-bit RGBA, non-interlaced PNGs with zlib.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SRC = "public/products/LOGO";
const OUT = "public/brand";
const PAD = 4; // px of breathing room kept around the artwork

const logos = {
  "לוגו ראשי.png": "cu29-mark.png", // primary: CU monogram
  "לוגו ללא רקע-02.png": "cu29-seal.png", // round seal: 99.9% PURE COPPER
  "לוגו ללא רקע-03.png": "cu29-element.png", // periodic-table tile
};

function decode(buf) {
  let p = 8;
  let w, h;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("ascii", p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 6 || data[12] !== 0)
        throw new Error("Expected 8-bit RGBA, non-interlaced PNG");
    }
    if (type === "IDAT") idat.push(data);
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * 4;
  const px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? px[y * stride + x - 4] : 0;
      const b = y ? px[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y ? px[(y - 1) * stride + x - 4] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
  }
  return { w, h, px };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function encode(w, h, px) {
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

fs.mkdirSync(OUT, { recursive: true });
for (const [src, dest] of Object.entries(logos)) {
  const { w, h, px } = decode(fs.readFileSync(path.join(SRC, src)));
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (px[(y * w + x) * 4 + 3] > 8) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
  x0 = Math.max(0, x0 - PAD); y0 = Math.max(0, y0 - PAD);
  x1 = Math.min(w - 1, x1 + PAD); y1 = Math.min(h - 1, y1 + PAD);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++)
    px.copy(out, y * cw * 4, ((y0 + y) * w + x0) * 4, ((y0 + y) * w + x1 + 1) * 4);
  fs.writeFileSync(path.join(OUT, dest), encode(cw, ch, out));
  console.log(`${dest}: ${cw}x${ch}`);
}
