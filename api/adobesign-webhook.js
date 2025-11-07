// api/adobesign-webhook.js
export default async function handler(req, res) {
  try {
    // Adobe Sign first sends a verification challenge
    if (req.method === "GET") {
      const challenge = req.query.challenge;
      if (challenge) {
        console.log("Received webhook verification challenge:", challenge);
        return res.status(200).send(challenge);
      }
      return res.status(400).send("Missing challenge");
    }

    // Handle webhook POST payload
    if (req.method === "POST") {
      const event = req.body;

      console.log("✅ Webhook Event Received:", JSON.stringify(event, null, 2));

      // Example: if agreement is signed
      if (event.event && event.event.eventType === "AGREEMENT_SIGNED") {
        console.log("Agreement signed:", event.event.agreement.id);

        // Forward to NetSuite RESTlet or Scriptable deployment
        const netsuiteResponse = await fetch(
          "https://<YOUR_NETSUITE_RESTLET_URL>", // Replace with your NetSuite RESTlet or Suitelet URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "NLAuth nlauth_account=XXXX, nlauth_email=XXXX, nlauth_signature=XXXX, nlauth_role=3"
            },
            body: JSON.stringify({
              agreementId: event.event.agreement.id,
              status: event.event.eventType,
              payload: event
            })
          }
        );

        const nsText = await netsuiteResponse.text();
        console.log("NetSuite response:", nsText);
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).send("Method not allowed");
    }
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.status(500).json({ error: err.message });
  }
}
