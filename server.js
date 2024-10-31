const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/api/participants", async (req, res) => {
  const retweetLink = req.query.retweetLink;

  // Pseudo function to fetch participants
  const participants = await getTwitterParticipants(retweetLink);

  // Limit to 20, filter followers
  const topParticipants = participants.slice(0, 20).filter(isFollowingUser);
  res.json(topParticipants);
});

app.post("/api/draw", async (req, res) => {
  const participants = req.body.participants;
  const seed = await generateRandomSeed();

  // Draw random winner
  const winnerIndex = Math.floor(Math.random() * participants.length);
  const winner = participants[winnerIndex];
  const timestamp = Date.now();
  
  res.json({ winner, seed, timestamp });
});

async function generateRandomSeed() {
  const response = await fetch("https://api.random.org/json-rpc/2/invoke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "generateSignedIntegers",
      params: {
        apiKey: process.env.RANDOM_ORG_API_KEY,
        n: 1,
        min: 0,
        max: 1000000,
        replacement: true
      },
      id: 42
    })
  });
  const data = await response.json();
  return data.result.random.data[0];
}

// Placeholder functions
async function getTwitterParticipants(link) {
  // Pseudo function for fetching participants from Twitter
  return [
    { username: "User1" }, { username: "User2" }, { username: "User3" } // etc.
  ];
}
function isFollowingUser(participant) {
  // Pseudo validation function
  return true;
}

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
