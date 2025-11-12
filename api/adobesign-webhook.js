import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("Webhook received:", req.body);

    // Forward to NetSuite (use internal domain)
    const netsuiteUrl = "https://5001454-sb2.app.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=4";

    // Optional: add auth headers if required
    const response = await axios.post(netsuiteUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "NLAuth nlauth_account=5001454_SB2, nlauth_email=rajasekhar.patakota@emphorasoft.com, nlauth_signature=NSP.raja@526, nlauth_role=3"
      }
    });

    res.status(200).json({ status: "Forwarded to NetSuite", netsuiteResponse: response.data });
  } catch (error) {
    console.error("Error forwarding:", error);
    res.status(500).json({ error: error.message });
  }
}
