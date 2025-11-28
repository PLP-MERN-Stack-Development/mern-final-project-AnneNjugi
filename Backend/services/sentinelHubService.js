import axios from "axios";
import FormData from "form-data";

// Forest bounding boxes [lon_min, lat_min, lon_max, lat_max]
export const FOREST_BBOXES = {
  "Mau Forest Complex": [35.14800, -1.05000, 36.14800, -0.05000],
  "Aberdare Forest": [36.53250, -0.63000, 36.93250, -0.23000],
  "Kakamega Forest": [34.80330, 0.19600, 34.92330, 0.31600],
  "Mount Kenya Forest": [37.00840, -0.17500, 37.60840, 0.42500],
  "Arabuko-Sokoke Forest": [39.76670, -3.43333, 39.96670, -3.23333],
  "Karura Forest": [36.81333, -1.25333, 36.85333, -1.21333],
  "Ngong Hills (Ngong Forest)": [36.66100, -1.40200, 36.76100, -1.30200],
  "Chyulu Hills": [37.50000, -2.70000, 37.90000, -2.30000],
  "Mount Elgon Forest": [34.33300, 0.70800, 34.93300, 1.30800],
  "Shimba Hills": [39.30780, -4.33720, 39.46780, -4.17720],
  "Ngare Ndare Forest": [37.58300, 0.03300, 37.68300, 0.13300],
  "Loita Forest": [35.30000, -1.20000, 35.70000, -0.80000],
  "Cherangani Hills Forest": [34.70000, 0.20000, 35.30000, 0.80000],
  "Nandi Forests": [35.01670, 0.01670, 35.21670, 0.21670],
  "Kereita Forest": [36.67670, -1.14000, 36.75670, -1.06000],
  "Eburu Forest": [36.06670, -0.38330, 36.16670, -0.28330],
  "Ololua Forest": [36.70670, -1.32670, 36.72670, -1.30670],
  "Kaya Kinondo": [39.30000, -4.39000, 39.34000, -4.35000],
};

// Get OAuth token from Sentinel Hub
async function getAccessToken() {
  const clientId = process.env.SENTINEL_HUB_CLIENT_ID;
  const clientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Sentinel Hub credentials not configured");
  }

  const formData = new FormData();
  formData.append("grant_type", "client_credentials");
  formData.append("client_id", clientId);
  formData.append("client_secret", clientSecret);

  try {
    const response = await axios.post(
      "https://services.sentinel-hub.com/oauth/token",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to get Sentinel Hub token:", error.message);
    throw new Error("Failed to authenticate with Sentinel Hub");
  }
}

// Fetch satellite image from Sentinel Hub
export async function fetchSentinelImage(forestName, dateStr) {
  const bbox = FOREST_BBOXES[forestName];
  if (!bbox) {
    throw new Error(`Unknown forest: ${forestName}`);
  }

  const [lon_min, lat_min, lon_max, lat_max] = bbox;

  try {
    const token = await getAccessToken();

    // Sentinel Hub Process API request
    const requestBody = {
      input: {
        bounds: {
          bbox: [lon_min, lat_min, lon_max, lat_max],
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: `${dateStr}T00:00:00Z`,
                to: `${dateStr}T23:59:59Z`,
              },
              maxCloudCoverage: 30,
            },
          },
        ],
      },
      output: {
        width: 1024,
        height: 1024,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/jpeg",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B03", "B02"],
            output: { bands: 3 }
          };
        }
        function evaluatePixel(sample) {
          return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
        }
      `,
    };

    const response = await axios.post(
      "https://services.sentinel-hub.com/api/v1/process",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Sentinel Hub API error:", error.response?.data || error.message);
    console.log("Falling back to placeholder image...");
    
    // Return a simple placeholder image as fallback
    return generatePlaceholderImage(forestName, dateStr);
  }
}

// Generate a placeholder image when Sentinel Hub is unavailable
function generatePlaceholderImage(forestName, dateStr) {
  // Create a simple SVG placeholder
  const svg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#1a5f4f"/>
  <text x="512" y="450" font-family="Arial" font-size="32" fill="#10b981" text-anchor="middle">${forestName}</text>
  <text x="512" y="500" font-family="Arial" font-size="24" fill="#6ee7b7" text-anchor="middle">Date: ${dateStr}</text>
  <text x="512" y="550" font-family="Arial" font-size="18" fill="#d1fae5" text-anchor="middle">Satellite imagery unavailable</text>
  <text x="512" y="580" font-family="Arial" font-size="16" fill="#d1fae5" text-anchor="middle">Please configure Sentinel Hub credentials</text>
</svg>`;
  
  return Buffer.from(svg);
}

// Fetch NDVI data for analysis
export async function fetchSentinelNDVI(forestName, dateStr) {
  const bbox = FOREST_BBOXES[forestName];
  if (!bbox) {
    throw new Error(`Unknown forest: ${forestName}`);
  }

  const [lon_min, lat_min, lon_max, lat_max] = bbox;

  try {
    const token = await getAccessToken();

    const requestBody = {
      input: {
        bounds: {
          bbox: [lon_min, lat_min, lon_max, lat_max],
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: `${dateStr}T00:00:00Z`,
                to: `${dateStr}T23:59:59Z`,
              },
              maxCloudCoverage: 30,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/tiff",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: { bands: 1, sampleType: "FLOAT32" }
          };
        }
        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
          return [ndvi];
        }
      `,
    };

    const response = await axios.post(
      "https://services.sentinel-hub.com/api/v1/process",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Sentinel Hub NDVI error:", error.response?.data || error.message);
    throw new Error(`Failed to fetch NDVI data: ${error.message}`);
  }
}
