const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint 1: POST /business-data
app.post('/business-data', (req, res) => {
  const { name, location } = req.body;
  console.log(`Received business data: ${name} in ${location}`);

  res.json({
    rating: 4.3,
    reviews: 127,
    headline: `Why ${name} is ${location}'s Sweetest Spot in 2025`
  });
});

// Static headlines for simulation
const headlines = [
  "Experience the Magic of Cakes Like Never Before!",
  "Unveiling the Secret to Mumbai’s Best Desserts!",
  "2025's Hottest Bakery Trend Starts Here!",
  "Why Everyone’s Talking About This Sweet Spot in Mumbai!",
  "Your Ultimate Destination for Irresistible Cakes!"
];

// Endpoint 2: GET /regenerate-headline?name=...&location=...
app.get('/regenerate-headline', (req, res) => {
  const { name, location } = req.query;
  console.log(`Regenerating headline for: ${name} in ${location}`);

  // Pick a random headline and personalize it
  const randomIndex = Math.floor(Math.random() * headlines.length);
  const selected = headlines[randomIndex];
  const personalized = selected.replace("This Sweet Spot", `${name}`);

  res.json({
    headline: personalized
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
