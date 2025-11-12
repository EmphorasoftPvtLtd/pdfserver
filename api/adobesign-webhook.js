import crypto from "crypto";
import oauth1a from "oauth-1.0a";
import axios from "axios";

const oauth = oauth1a({
  consumer: { key: "CONSUMER_KEY", secret: "CONSUMER_SECRET" },
  signature_method: "HMAC-SHA256",
  hash_function(baseString, key) {
    return crypto.createHmac("sha256", key).update(baseString).digest("base64");
  },
});

const request_data = {
  url: "https://5001454-sb2.app.netsuite.com/app/site/hosting/scriptlet.nl?script=3490&deploy=4",
  method: "POST",
  data: { hello: "world" },
};

const token = { key: "TOKEN_ID", secret: "TOKEN_SECRET" };

const headers = oauth.toHeader(oauth.authorize(request_data, token));
headers["Content-Type"] = "application/json";

await axios.post(request_data.url, request_data.data, { headers });
