import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

app.post("/fetch-pdf", async (req, res) => {
  try {
    const { url, headers } = req.body;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch PDF" });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    res.json({ base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Proxy running on port 3000"));
