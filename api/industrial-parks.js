// api/industrial-parks.js - Vercel serverless function for Industrial Parks
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variable (secure)
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SHEET_ID = process.env.INDUSTRIAL_PARKS_SHEETS_ID;
    
    if (!API_KEY || !SHEET_ID) {
      return res.status(500).json({ 
        error: 'Missing configuration',
        debug: {
          hasApiKey: !!API_KEY,
          hasSheetId: !!SHEET_ID
        }
      });
    }

    const RANGE = 'Industrial Park Database!A2:X50';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?valueRenderOption=UNFORMATTED_VALUE&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Industrial Parks API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch industrial parks data',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
