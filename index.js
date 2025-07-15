const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

const API_BASE_URL = "https://app.takedeals.com";
const API_TOKEN = "af1e8c0403fa027140a97276d4633ade370d5cde9bed486a7dbbd5d7a3987df1"; // Replace this securely!  

app.use(cors());
app.use(express.json());

app.use("/public_api", async (req, res) => {
  const path = req.originalUrl.replace("/public_api", "");
  const url = new URL(API_BASE_URL + path);

  // Add query params
  for (const [key, value] of Object.entries(req.query)) {
    if (Array.isArray(value)) {
      value.forEach(val => url.searchParams.append(key, val));
    } else {
      url.searchParams.append(key, value);
    }
  }

  const options = {
    method: req.method,
    headers: {
      Authorization: `Token ${API_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
  };

  try {
    const response = await fetch(url.toString(), options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
