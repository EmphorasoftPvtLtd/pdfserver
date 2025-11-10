// api/adobesign-webhook.js

export default async function handler(req, res) {
  try {
    // ✅ 1. Webhook verification challenge (Adobe sends GET first)
    const resJ = JSON.stringify(res.body)
      //console.log("req", req);
     // console.log("res", res);
     // if (resJ.agreement.status === "SIGNED") {
      
      const eventBody = res;
      console.log("✅ Adobe Webhook Event Received:", resJ );

      // Replace this with your Suitelet deployment URL
      const netsuiteSuiteletUrl =
        "https://5001454-sb2.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=1&compid=5001454_SB2&ns-at=AAEJ7tMQ3iJxCDUnFRa2Mj94TIxNYeOvy3y4P5FLVm87leMkmtY";

      // Forward to your Suitelet as JSON
      const suiteletResponse = await fetch(netsuiteSuiteletUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: eventBody,//JSON.stringify(eventBody),
      });

      const nsText = await suiteletResponse.text();
      console.log("🔁 Forwarded to Suitelet. Response:", nsText);

      return res.status(200).json({ forwarded: true, nsResponse: nsText });
    //}
    // ✅ 1. Webhook verification challenge (Adobe sends GET first)
    if (req.method === "GET") {
      const challenge = req.query.challenge;
      const adobeClientId = req.headers["x-adobesign-clientid"];

      console.log("🔹 Verification Request Received");
      console.log("Client ID:", adobeClientId);
      console.log("Challenge:", challenge);

      if (challenge) {
        // Echo the challenge string as per Adobe's spec
        return res.status(200).send(challenge);
      }

      // Suitelet expects a header echo — optionally forward this
      if (adobeClientId) {
        return res
          .setHeader("X-AdobeSign-ClientId", adobeClientId)
          .status(200)
          .send("Webhook Verified");
      }

      return res.status(400).send("Missing verification data");
    }

    // ✅ 2. Webhook event POST payload
    if (req.method === "POST") {
      const eventBody = req.body;
      console.log("✅ Adobe Webhook Event Received:", eventBody);

      // Replace this with your Suitelet deployment URL
      const netsuiteSuiteletUrl =
        "https://5001454-sb2.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=1&compid=5001454_SB2&ns-at=AAEJ7tMQ3iJxCDUnFRa2Mj94TIxNYeOvy3y4P5FLVm87leMkmtY";

      // Forward to your Suitelet as JSON
      const suiteletResponse = await fetch(netsuiteSuiteletUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      });

      const nsText = await suiteletResponse.text();
      console.log("🔁 Forwarded to Suitelet. Response:", nsText);

      return res.status(200).json({ forwarded: true, nsResponse: nsText });
    }

    // ❌ Invalid HTTP method
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({ error: error.message });
  }
}








