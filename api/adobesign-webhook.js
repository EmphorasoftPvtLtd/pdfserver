export default async function handler(req, res) {
  try {
    const netsuiteUrl = "https://5001454-sb2.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=5&compid=5001454_SB2&ns-at=AAEJ7tMQTNPk-V_NBbVpqKan7vSOLaOg9aX5yMJu9v45XlCLJjs";

    const response = await fetch(netsuiteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"x-webhook-secret": "abc123" // same secret as in Suitelet
      },
      body: JSON.stringify({
        testFrom: "Vercel",
        timestamp: new Date().toISOString()
      })
    });

    const text = await response.text();

    res.status(200).send({
      status: response.status,
      netsuiteResponse: text
    });
  } catch (error) {
    console.error("Error posting to NetSuite:", error);
    res.status(500).send({ error: error.message });
  }
}


