document.getElementById("draw-button").addEventListener("click", async () => {
    const retweetLink = document.getElementById("retweet-link").value;
    if (!retweetLink) {
      alert("Please enter a valid retweet link.");
      return;
    }
  
    // Fetch participants from backend
    const participants = await fetchParticipants(retweetLink);
    displayParticipants(participants);
  
    // Draw winner and display result
    const { winner, seed, timestamp } = await drawWinner(participants);
    displayWinner(winner, seed, timestamp);
  });
  
  async function fetchParticipants(retweetLink) {
    // Request to backend for participants
    const response = await fetch(`/api/participants?retweetLink=${retweetLink}`);
    return response.json();
  }
  
  function displayParticipants(participants) {
    const listContainer = document.getElementById("participants-list");
    listContainer.innerHTML = "";
    participants.forEach(participant => {
      const item = document.createElement("div");
      item.textContent = participant.username;
      listContainer.appendChild(item);
    });
  }
  
  async function drawWinner(participants) {
    const response = await fetch("/api/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participants })
    });
    return response.json();
  }
  
  function displayWinner(winner, seed, timestamp) {
    const winnerDetails = document.getElementById("winner-details");
    winnerDetails.innerHTML = `
      <h2>Winner: ${winner.username}</h2>
      <p>Validation Seed: ${seed}</p>
      <p>Timestamp (UTC): ${new Date(timestamp).toUTCString()}</p>
    `;
  }
  