import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// ✅ API route
app.post("/fetch-pdf", async (req, res) => {
  try {
    const { url, headers } = req.body;
    const response = await fetch(url, { headers });
    const buffer = await response.arrayBuffer();

    // Send back Base64
    const base64Data = Buffer.from(buffer).toString("base64");
    res.json({ base64: base64Data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ For Vercel: export handler
export default app;
