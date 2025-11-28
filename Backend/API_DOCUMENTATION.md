# Forest Monitoring API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Admin endpoints require API key authentication. Include the API key in the `x-api-key` header or as a query parameter `apiKey`.

Example:
```
GET /api/contact/messages?apiKey=your-admin-key
```

## Endpoints

### Images

#### GET /images/forests
Get list of all Kenyan forests with detailed information.

**Response:**
```json
{
  "forests": [
    {
      "id": 1,
      "name": "Mau Forest Complex",
      "area": "400,000 ha",
      "location": "Rift Valley",
      "region": "Rift Valley"
    }
  ],
  "count": 18
}
```

#### GET /images/gibs
Fetch satellite image for a specific forest and date.

**Query Parameters:**
- `forest` (required): Forest name
- `date` (required): Date in YYYY-MM-DD format

**Response:** JPEG image or SVG placeholder

#### GET /images/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Analysis

#### POST /analysis/compare
Compare two satellite images and perform NDVI analysis.

**Request Body (Option 1 - URLs):**
```json
{
  "beforeUrl": "https://example.com/image1.jpg",
  "afterUrl": "https://example.com/image2.jpg"
}
```

**Request Body (Option 2 - Forest + Dates):**
```json
{
  "forest": "Mau Forest Complex",
  "beforeDate": "2023-01-01",
  "afterDate": "2024-01-01"
}
```

**Response:**
```json
{
  "lossPct": 15.5,
  "changeMap": "base64-encoded-png",
  "before": "base64-encoded-jpeg",
  "after": "base64-encoded-jpeg"
}
```

### Contact

#### POST /contact/submit
Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We'll get back to you soon.",
  "contactId": "507f1f77bcf86cd799439011"
}
```

#### GET /contact/messages (Admin Only)
Get all contact messages.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "messages": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "status": "new"
    }
  ]
}
```

#### GET /contact/count (Admin Only)
Get contact message count.

**Response:**
```json
{
  "success": true,
  "total": 25,
  "new": 5
}
```

## Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Analysis API: 20 requests per hour per IP

## Error Responses
All endpoints return errors in the following format:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details"
}
```

## Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `SENTINEL_HUB_CLIENT_ID`: Sentinel Hub API client ID
- `SENTINEL_HUB_CLIENT_SECRET`: Sentinel Hub API client secret
- `ADMIN_API_KEY`: API key for admin endpoints
- `BACKEND_URL`: Base URL for internal API calls