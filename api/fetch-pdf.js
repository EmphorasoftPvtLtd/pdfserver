import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try {
    const { url, headers } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' in request body" });
    }

    const response = await fetch(url, { headers });
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    res.status(200).json({ base64: base64Data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
