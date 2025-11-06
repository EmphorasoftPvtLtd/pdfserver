// api/fetch-pdf.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { url, headers } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing PDF URL' });
    }

    // Fetch the PDF from given URL
    const response = await fetch(url, { headers });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch PDF' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as base64 string or file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    res.send(buffer);

  } catch (err) {
    console.error('Error fetching PDF:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
