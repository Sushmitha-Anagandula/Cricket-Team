const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Get Players
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM players ORDER BY player_id
    `;
  const playerArray = await db.all(getPlayersQuery);
  response.send(playerArray);
});
//create Players
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
      book (playerName,jerseyNumber,Role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role},
         '
      );`;

  const dbResponse = await db.run(ddPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//get playerId

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      players
    WHERE
      player_id = ${bookId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

// put update
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
      players
    SET
      playerName='${playerName}',
      jerseyNumber=${jerseyNumber},
      role=${role},
     '
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

// Delete Player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      players
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
