import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ Main Webhook route
app.all("/api/adobesign-webhook", async (req, res) => {
  console.log("Adobe webhook method:", req.method);

  // ✅ Step 1: Verification (GET)
  if (req.method === "GET") {
    const clientId = req.headers["x-adobesign-clientid"];
    console.log("Verification request from Adobe:", clientId);

    if (clientId) {
      res.set("X-AdobeSign-ClientId", clientId);
      res.status(200).send("Webhook Verified");
      return;
    }

    res.status(400).send("Missing X-AdobeSign-ClientId");
    return;
  }

  // ✅ Step 2: Webhook Event (POST)
  if (req.method === "POST") {
    console.log("Webhook event received from Adobe:");
    console.log(JSON.stringify(req.body, null, 2));

    try {
      // 🔗 Forward webhook payload to your NetSuite Suitelet
      const nsUrl =
        "https://5001454-sb2.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=1&compid=5001454_SB2&ns-at=AAEJ7tMQ3iJxCDUnFRa2Mj94TIxNYeOvy3y4P5FLVm87leMkmtY";

      const nsResponse = await fetch(nsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const nsText = await nsResponse.text();
      console.log("✅ Response from NetSuite:", nsResponse.status, nsText);

      res.status(200).json({
        success: true,
        nsStatus: nsResponse.status,
        nsResponse: nsText,
      });
    } catch (err) {
      console.error("❌ Error forwarding to NetSuite:", err);
      res.status(500).json({ success: false, error: err.message });
    }

    return;
  }

  // Fallback
  res.status(405).json({ error: "Method not allowed" });
});

export default app;
