// api/adobesign-webhook.js
export default async function handler(req, res) {
  console.log("Adobe Webhook: Received", req.method);

  if (req.method === "GET") {
    const clientId = req.headers["x-adobesign-clientid"];
    console.log("Verification request received. Client ID:", clientId);

    if (clientId) {
      res.setHeader("X-AdobeSign-ClientId", clientId);
      return res.status(200).send("Webhook Verified");
    } else {
      return res.status(400).send("Missing X-AdobeSign-ClientId header");
    }
  }

  if (req.method === "POST") {
    try {
      console.log("Webhook event received from Adobe:");
      console.log(JSON.stringify(req.body, null, 2));

      // Forward the body to NetSuite Suitelet
      const nsResponse = await fetch("https://5001454-sb2.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=1&compid=5001454_SB2&ns-at=AAEJ7tMQ3iJxCDUnFRa2Mj94TIxNYeOvy3y4P5FLVm87leMkmtY", {
       method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const nsText = await nsResponse.text();
    console.log("Response from NetSuite:", nsText);

    res.status(200).json({ success: true, nsResponse: nsText });
  } catch (error) {
    console.error("Error forwarding to NetSuite:", error);
    res.status(500).json({ success: false, error: error.message });
  }
  return;
}
}

  // Default if not GET/POST
  res.status(405).json({ error: "Method not allowed" });
}

