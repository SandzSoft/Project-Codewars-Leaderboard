const elements = {};

const state = {
  usernames: [],
  validUsers: [],
  selectedLanguage: "overall",
  cachedUsers: {},
};

function setup() {
  elements.usernamesInput = document.getElementById("usernames");
  elements.addUsersButton = document.getElementById("add_users_button");
  elements.usersMessage = document.getElementById("users_message");
  elements.leaderboardMessage = document.getElementById("leaderboard_message");
  elements.leaderboardTable = document.querySelector(
    "#leaderboard_table tbody",
  );

  elements.addUsersButton.addEventListener("click", handleAddUsersClick);
}

async function handleAddUsersClick() {
  state.usernames = [
    ...new Set(
      elements.usernamesInput.value
        .split(",")
        .map((username) => username.trim())
        .filter((username) => username !== ""),
    ),
  ];

  elements.usersMessage.textContent = "";
  elements.leaderboardMessage.textContent = "";
  elements.leaderboardTable.replaceChildren();
  state.validUsers = [];

  if (state.usernames.length === 0) {
    elements.usersMessage.textContent =
      "Please enter at least one Codewars username.";
    return;
  }

  elements.addUsersButton.disabled = true;

  try {
    await getValidUsers();

    if (state.validUsers.length === 0) {
      elements.leaderboardMessage.textContent =
        "No valid users were found. Please check the usernames and try again.";
      return;
    }

    const rows = state.validUsers.map(createLeaderboardTable);
    elements.leaderboardTable.replaceChildren(...rows);
  } finally {
    elements.addUsersButton.disabled = false;
  }
}

async function getValidUsers() {
  const invalidUsers = [];
  const failedUsers = [];

  for (const username of state.usernames) {
    if (state.cachedUsers[username]) {
      state.validUsers.push(state.cachedUsers[username]);
      continue;
    }

    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${encodeURIComponent(username)}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          invalidUsers.push(username);
        } else {
          failedUsers.push(username);
        }
        continue;
      }

      const user = await response.json();

      state.cachedUsers[username] = user;
      state.validUsers.push(user);
    } catch {
      failedUsers.push(username);
    }
  }

  const messages = [];

  if (invalidUsers.length > 0) {
    messages.push(`Usernames not found: ${invalidUsers.join(", ")}.`);
  }

  if (failedUsers.length > 0) {
    messages.push(
      `Could not retrieve data for: ${failedUsers.join(", ")}. Please try again.`,
    );
  }

  elements.usersMessage.textContent = messages.join(" ");
}

function createLeaderboardTable({ username, clan, ranks }) {
  const row = document.createElement("tr");
  const rankCell = document.createElement("td");
  const usernameCell = document.createElement("td");
  const clanCell = document.createElement("td");
  const scoreCell = document.createElement("td");

  usernameCell.textContent = username;
  clanCell.textContent = clan ?? "";
  scoreCell.textContent = ranks.overall?.score ?? 0;

  row.append(rankCell, usernameCell, clanCell, scoreCell);

  return row;
}

window.addEventListener("load", setup);
