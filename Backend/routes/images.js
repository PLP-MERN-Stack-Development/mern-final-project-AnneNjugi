import express from "express";
import mongoose from "mongoose";
import { fetchSentinelImage } from "../services/sentinelHubService.js";
import { validateGibsRequest, getValidForests } from "../utils/validation.js";
import { logInfo, logError } from "../utils/logger.js";

const router = express.Router();

// Forest data with detailed information
const forestsData = [
  { id: 1, name: 'Mau Forest Complex', area: '400,000 ha', location: 'Rift Valley', region: 'Rift Valley' },
  { id: 2, name: 'Aberdare Forest', area: '76,619 ha', location: 'Central Kenya', region: 'Central' },
  { id: 3, name: 'Kakamega Forest', area: '23,000 ha', location: 'Western Kenya', region: 'Western' },
  { id: 4, name: 'Mount Kenya Forest', area: '71,759 ha', location: 'Central Kenya', region: 'Central' },
  { id: 5, name: 'Arabuko-Sokoke Forest', area: '41,600 ha', location: 'Coastal Kenya', region: 'Coast' },
  { id: 6, name: 'Karura Forest', area: '1,063 ha', location: 'Nairobi', region: 'Nairobi' },
  { id: 7, name: 'Ngong Hills (Ngong Forest)', area: '2,324 ha', location: 'Nairobi', region: 'Nairobi' },
  { id: 8, name: 'Chyulu Hills', area: '47,100 ha', location: 'Eastern Kenya', region: 'Eastern' },
  { id: 9, name: 'Mount Elgon Forest', area: '16,916 ha', location: 'Western Kenya', region: 'Western' },
  { id: 10, name: 'Shimba Hills', area: '25,300 ha', location: 'Coastal Kenya', region: 'Coast' },
  { id: 11, name: 'Ngare Ndare Forest', area: '5,400 ha', location: 'Central Kenya', region: 'Central' },
  { id: 12, name: 'Loita Forest', area: '33,000 ha', location: 'Rift Valley', region: 'Rift Valley' },
  { id: 13, name: 'Cherangani Hills Forest', area: '112,000 ha', location: 'Rift Valley', region: 'Rift Valley' },
  { id: 14, name: 'Nandi Forests', area: '20,000 ha', location: 'Rift Valley', region: 'Rift Valley' },
  { id: 15, name: 'Kereita Forest', area: '3,500 ha', location: 'Central Kenya', region: 'Central' },
  { id: 16, name: 'Eburu Forest', area: '3,600 ha', location: 'Rift Valley', region: 'Rift Valley' },
  { id: 17, name: 'Ololua Forest', area: '140 ha', location: 'Nairobi', region: 'Nairobi' },
  { id: 18, name: 'Kaya Kinondo', area: '30 ha', location: 'Coastal Kenya', region: 'Coast' },
];

router.get("/forests", (_req, res) => {
  res.json({
    forests: forestsData,
    count: forestsData.length
  });
});

router.get("/gibs", validateGibsRequest, async (req, res) => {
  try {
    const { forest, date } = req.query;
    logInfo(`Fetching image for ${forest} on ${date}`);
    
    const imgBuffer = await fetchSentinelImage(forest, date);
    if (!imgBuffer) {
      logInfo("No image buffer returned");
      return res.status(404).json({
        error: "No image found for the specified forest and date"
      });
    }

    // Check if it's SVG (placeholder) or JPEG (real image)
    const isSvg = imgBuffer.toString('utf8', 0, 5) === '<?xml' || imgBuffer.toString('utf8', 0, 4) === '<svg';
    logInfo(`Returning ${isSvg ? 'SVG placeholder' : 'JPEG image'}`);
    
    res.setHeader("Content-Type", isSvg ? "image/svg+xml" : "image/jpeg");
    res.send(imgBuffer);
  } catch (err) {
    logError("Error in /gibs route:", { error: err.message });
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

export default router;