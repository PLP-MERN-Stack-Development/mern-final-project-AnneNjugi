// Input: sharp().raw() result with { data, info } where info.channels == 3
export function ndviFromBuffer(sharpResult) {
    const { data, info } = sharpResult;
    const { width, height, channels } = info;
    const out = new Float32Array(width * height);
  
    for (let i=0, p=0; i<width*height; i++, p += channels) {
      const r = data[p] / 255;
      const g = data[p+1] / 255;
      // Simple vegetation index: (G - R) / (G + R + eps)
      const eps = 1e-6;
      out[i] = (g - r) / (g + r + eps);
    }
    return out;
  }
  