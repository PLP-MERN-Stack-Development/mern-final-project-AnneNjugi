# Kenya Forest Monitor

A real-time satellite analysis system for monitoring Kenya's forest heritage. This platform provides comprehensive monitoring of 18 major Kenyan forests using advanced satellite imagery and AI-powered analysis to track deforestation patterns and forest health.

## 🌲 Features

- **18 Forest Coverage**: Monitor major Kenyan forests across all regions (Nairobi, Central, Rift Valley, Western, Eastern, Coast)
- **Satellite Imagery**: Real-time satellite images from Sentinel Hub and NASA GIBS
- **AI-Powered Analysis**: Advanced vegetation index analysis using simplified NDVI calculations to detect forest degradation
- **Hugging Face Integration**: AI-generated analysis and recommendations using Mistral-7B-Instruct model (optional)
- **Request Validation**: Comprehensive validation for dates, forest names, and URLs
- **Contact Management**: Contact form with status tracking (new, read, responded)
- **Time Comparison**: Compare satellite imagery across different time periods to track changes
- **Change Detection Maps**: Visual representation of forest cover loss
- **Degradation Metrics**: Percentage-based forest loss calculations with severity levels (LOW, MEDIUM, HIGH)
- **Contact System**: Integrated contact form for user feedback and inquiries
- **Rate Limiting**: Built-in API rate limiting for resource protection
- **🌍 Multi-Language Support**: Full internationalization with English and Swahili (Kiswahili) translations
- **📱 Responsive Design**: Optimized for mobile phones, tablets, and desktop computers with cross-browser compatibility
- **♿ Accessibility**: Support for high contrast mode, reduced motion preferences, and screen readers

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Leaflet** - Map visualization (react-leaflet)
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React i18next** - Internationalization and localization
- **i18next** - Translation management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Sharp** - Image processing
- **Sentinel Hub API** - Satellite imagery (Sentinel-2 L2A)
- **Hugging Face Inference** - AI analysis and text generation
- **Express Rate Limit** - API rate limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Sentinel Hub account and credentials ([Get them here](https://www.sentinel-hub.com/))
- Hugging Face API token (optional, for AI features)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "REAL-TIME MONITOR"
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure Environment Variables

#### Backend Configuration

Copy the example environment file and configure it:

```bash
cd ../Backend
cp env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/vibeDB

# Server Configuration
PORT=5000
BACKEND_URL=http://localhost:5000

# Sentinel Hub API Credentials
SENTINEL_HUB_CLIENT_ID=your_client_id_here
SENTINEL_HUB_CLIENT_SECRET=your_client_secret_here
SENTINEL_HUB_INSTANCE_ID=your_instance_id_here

# Hugging Face API Token (optional)
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
```

#### Frontend Configuration

Create a `.env` file in the `Frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000
```

If not set, the frontend defaults to `http://localhost:5000`.

## 🏃 Running the Application

### Start the Backend Server

```bash
cd Backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000` (or your configured PORT).

### Start the Frontend Development Server

```bash
cd Frontend
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite default port).

### Production Build

```bash
cd Frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
REAL-TIME MONITOR/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Contact.js         # Contact form model (with status tracking)
│   ├── routes/
│   │   ├── images.js          # Satellite image endpoints
│   │   ├── analysis.js        # Forest analysis endpoints
│   │   └── contact.js         # Contact form endpoints
│   ├── services/
│   │   ├── sentinelHubService.js  # Sentinel Hub integration (Sentinel-2 L2A)
│   │   └── aiService.js           # AI analysis service (Hugging Face)
│   ├── utils/
│   │   ├── ndvi.js            # Vegetation index calculation (simplified NDVI)
│   │   └── validation.js      # Request validation (dates, forests, URLs)
│   ├── server.js              # Express server setup with rate limiting
│   ├── package.json
│   └── env.example            # Environment variables template
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js         # API client functions
    │   ├── App.jsx            # Main app component (all pages/components)
    │   ├── App.test.jsx       # Test file
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── public/
    │   └── index.html         # HTML template
    ├── package.json
    ├── vite.config.js         # Vite configuration
    └── vercel.json            # Vercel deployment configuration
```

## 🔌 API Endpoints

### Images

- `GET /api/images/forests` - Get list of all available forests
- `GET /api/images/gibs?forest={name}&date={YYYY-MM-DD}` - Fetch satellite image for a forest
- `GET /api/images/health` - Health check endpoint

### Analysis

- `POST /api/analysis/compare` - Compare two images and analyze forest degradation
  - Body: `{ forest, beforeDate, afterDate }` or `{ beforeUrl, afterUrl }`
  - Date format: `YYYY-MM-DD` (must be after 2015-06-23, not in future, afterDate > beforeDate)
  - Returns: `{ lossPct, changeMap, before, after }`
  - `lossPct`: Percentage of forest cover loss detected
  - `changeMap`: Base64-encoded PNG showing change detection
  - `before`/`after`: Base64-encoded JPEG images used for comparison

### Contact

- `POST /api/contact/submit` - Submit contact form
  - Body: `{ name, email, message }`
  - Validation: Email format, message length (10-1000 characters)
  - Returns: `{ success, message, contactId }`
- `GET /api/contact/messages` - Get all contact messages (admin)
  - Returns: `{ success, count, messages }` (sorted by newest first, limit 100)
- `GET /api/contact/count` - Get message count statistics
  - Returns: `{ success, total, new }` (new messages with status 'new')

## 🌍 Monitored Forests

The system monitors 18 major Kenyan forests:

1. Mau Forest Complex (400,000 ha)
2. Aberdare Forest (76,619 ha)
3. Kakamega Forest (23,000 ha)
4. Mount Kenya Forest (71,759 ha)
5. Arabuko-Sokoke Forest (41,600 ha)
6. Karura Forest (1,063 ha)
7. Ngong Hills (Ngong Forest) (2,324 ha)
8. Chyulu Hills (47,100 ha)
9. Mount Elgon Forest (16,916 ha)
10. Shimba Hills (25,300 ha)
11. Ngare Ndare Forest (5,400 ha)
12. Loita Forest (33,000 ha)
13. Cherangani Hills Forest (112,000 ha)
14. Nandi Forests (20,000 ha)
15. Kereita Forest (3,500 ha)
16. Eburu Forest (3,600 ha)
17. Ololua Forest (140 ha)
18. Kaya Kinondo (30 ha)

## 🔒 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Analysis Endpoint**: 20 requests per hour per IP (more resource-intensive)
- Rate limit headers are included in responses
- Exceeding limits returns HTTP 429 with error message

## 🌍 Multi-Language Support

The application supports full internationalization with:
- **English**: Default language with comprehensive translations
- **Swahili (Kiswahili)**: Complete translations for all interface elements
- **Language Switcher**: Easy language switching in the header
- **Persistent Selection**: Language preference saved in browser localStorage

## 📱 Responsive Design & Accessibility

- **Mobile-First Approach**: Optimized for phones (320px+), tablets (768px+), and desktops (1024px+)
- **Cross-Browser Compatibility**: Tested and compatible with modern browsers (Chrome, Firefox, Safari, Edge)
- **Touch-Friendly**: Optimized for touch interactions on mobile devices
- **Accessibility Features**:
  - High contrast mode support
  - Reduced motion preferences
  - Screen reader compatibility
  - Keyboard navigation support

## 📊 How It Works

1. **Forest Selection**: Users select a region and then a specific forest from 18 available options
2. **Date Selection**: Choose "before" and "after" dates (YYYY-MM format, converted to YYYY-MM-01)
   - Dates must be after 2015-06-23 (Sentinel-2 launch date)
   - Dates cannot be in the future
   - After date must be after before date
3. **Image Fetching**: System fetches satellite imagery from Sentinel Hub (Sentinel-2 L2A)
   - Uses bounding boxes for each forest to fetch precise area
   - Falls back to placeholder SVG if Sentinel Hub is unavailable
   - Images are processed to 1024x1024 for display, 512x512 for analysis
   - Max cloud coverage: 30%
4. **Vegetation Index Analysis**: Calculates simplified vegetation index using (G-R)/(G+R) formula
   - Not true NDVI (which requires NIR band), but effective for change detection
   - Detects pixels with significant vegetation loss (threshold: -0.2 index difference)
5. **Change Detection**: Compares before/after images pixel-by-pixel
   - Generates change map highlighting areas of degradation
   - Calculates percentage of pixels showing forest loss
   - Loss percentage determines severity: LOW (<10%), MEDIUM (10-20%), HIGH (>20%)
6. **AI Analysis** (if configured): Uses Hugging Face Mistral-7B-Instruct for:
   - Forest health summaries with status indicators
   - Degradation analysis text
   - Priority-based actionable recommendations
   - Falls back to rule-based analysis if AI unavailable
7. **Visualization**: Displays change maps, degradation percentages, severity levels, and recommendations

## 🧪 Development

### Running in Development Mode

Backend with auto-reload (using nodemon):
```bash
cd Backend
npm run dev
```

Frontend with hot-reload (Vite):
```bash
cd Frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend.

### Testing

Run frontend tests:
```bash
cd Frontend
npm test
```

## 🚀 Deployment

### Vercel Deployment

The project includes `vercel.json` for easy deployment on Vercel. The configuration handles SPA routing.

### Production Build

Build the frontend for production:
```bash
cd Frontend
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 5000) | No |
| `BACKEND_URL` | Backend base URL for API calls | Yes |
| `SENTINEL_HUB_CLIENT_ID` | Sentinel Hub OAuth client ID | Yes |
| `SENTINEL_HUB_CLIENT_SECRET` | Sentinel Hub OAuth client secret | Yes |
| `SENTINEL_HUB_INSTANCE_ID` | Sentinel Hub instance ID | Yes |
| `HUGGINGFACE_API_TOKEN` | Hugging Face API token for AI features | No (optional) |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) | No |

See `Backend/env.example` for the complete template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of a real-time forest monitoring system for Kenya.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your cloud MongoDB connection string
- Verify `MONGO_URI` in `.env` is correct

### Sentinel Hub API Errors
- Verify your `SENTINEL_HUB_CLIENT_ID` and `SENTINEL_HUB_CLIENT_SECRET` are correct
- Check your Sentinel Hub account has sufficient credits
- The system will fall back to placeholder images if Sentinel Hub is unavailable

### Image Loading Issues
- Check that dates are in `YYYY-MM-DD` format (or `YYYY-MM` which gets converted)
- Dates must be after 2015-06-23 (Sentinel-2 launch date)
- Dates cannot be in the future
- Ensure the selected dates have available satellite imagery
- Some dates may not have cloud-free imagery available (max 30% cloud coverage filter)
- If Sentinel Hub is unavailable, placeholder images will be shown

### AI Analysis Not Working
- Verify `HUGGINGFACE_API_TOKEN` is set correctly in `.env`
- Check your Hugging Face account has sufficient API credits
- The system will use fallback analysis if AI is unavailable
- AI features are optional - core analysis works without it

## 🔬 Technical Details

### Vegetation Index Calculation

The system uses a simplified vegetation index formula: `(G - R) / (G + R + ε)` where:
- G = Green channel value (normalized 0-1)
- R = Red channel value (normalized 0-1)
- ε = Small epsilon (1e-6) to prevent division by zero

This is not true NDVI (which requires NIR and Red bands), but provides effective change detection for forest monitoring.

### Sentinel Hub Integration

- **Satellite**: Sentinel-2 L2A (Level 2A - atmospherically corrected)
- **Image Format**: JPEG (1024x1024 for display) or TIFF (512x512 for NDVI analysis)
- **Cloud Filter**: Maximum 30% cloud coverage
- **Evalscript**: Custom scripts for true color visualization and NDVI calculation
- **Fallback**: SVG placeholder images when API is unavailable

### Database Schema

**Contact Model**:
- `name` (String, required)
- `email` (String, required, lowercase)
- `message` (String, required, 10-1000 characters)
- `status` (Enum: 'new', 'read', 'responded', default: 'new')
- `createdAt` (Date, auto-generated)

## 📧 Contact

For questions or support, use the contact form in the application or reach out through the project repository.

---

**Note**: This system is designed for monitoring and analysis purposes. For official forest management decisions, consult with relevant authorities and use verified data sources.
