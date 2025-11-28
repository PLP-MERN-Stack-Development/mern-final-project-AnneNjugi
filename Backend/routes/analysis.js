import express from "express";
import axios from "axios";
import sharp from "sharp";
import { ndviFromBuffer } from "../utils/ndvi.js";
import { validateCompareRequest } from "../utils/validation.js";

const router = express.Router();

// Internal API base URL
const INTERNAL_API_BASE = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

// POST /api/analysis/compare
// body: { beforeUrl, afterUrl } or { forest, beforeDate, afterDate }
router.post("/compare", validateCompareRequest, async (req, res) => {
  try {
    const { beforeUrl, afterUrl, forest, beforeDate, afterDate } = req.body;

    // Either fetch via URLs or via our GIBS endpoint
    const beforeResp = beforeUrl ? await axios.get(beforeUrl, { responseType: "arraybuffer" })
                                 : await axios.get(`${INTERNAL_API_BASE}/api/images/gibs?forest=${encodeURIComponent(forest)}&date=${beforeDate}`, { responseType: "arraybuffer" });
    const afterResp = afterUrl ? await axios.get(afterUrl, { responseType: "arraybuffer" })
                                 : await axios.get(`${INTERNAL_API_BASE}/api/images/gibs?forest=${encodeURIComponent(forest)}&date=${afterDate}`, { responseType: "arraybuffer" });

    // Convert to standard size and raw RGB
    const beforeBuf = Buffer.from(beforeResp.data);
    const afterBuf = Buffer.from(afterResp.data);

    const beforeRaw = await sharp(beforeBuf).resize(512,512).raw().toBuffer({ resolveWithObject: true });
    const afterRaw = await sharp(afterBuf).resize(512,512).raw().toBuffer({ resolveWithObject: true });

    const beforeNDVI = ndviFromBuffer(beforeRaw);
    const afterNDVI = ndviFromBuffer(afterRaw);

    // difference map
    const diff = new Uint8ClampedArray(beforeNDVI.length);
    let lossPixels = 0;
    for (let i=0;i<beforeNDVI.length;i++){
      const d = afterNDVI[i] - beforeNDVI[i];
      diff[i] = Math.max(0, Math.min(255, Math.round((d + 1) * 127))); // map to 0-255 for visualization
      if (d < -0.2) lossPixels++;
    }
    const lossPct = (lossPixels / beforeNDVI.length) * 100;

    // Return metrics and encoded images (base64) so frontend can display
    const changeMap = await sharp(Buffer.from(diff), { raw: { width: 512, height: 512, channels: 1 } })
                          .toFormat("png")
                          .toBuffer();

    res.json({
      lossPct: lossPct,
      changeMap: changeMap.toString("base64"),
      before: beforeBuf.toString("base64"),
      after: afterBuf.toString("base64")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison error", details: err.message });
  }
});

export default router;
