import { sortUsersBySelectedLanguage, makeFetchRequest } from "./functions.js";

const elements = {};

const state = {
  usernames: [],
  validUsers: [],
  selectedLanguage: "overall",
  languages: [],
};

function setup() {
  elements.usernamesInput = document.getElementById("usernames");
  elements.addUsersButton = document.getElementById("add_users_button");
  elements.usersMessage = document.getElementById("users_message");
  elements.languageSelect = document.getElementById("ranking_select");
  elements.leaderboardTable = document.querySelector(
    "#leaderboard_table tbody",
  );

  elements.addUsersButton.addEventListener("click", handleAddUsersClick);
  elements.languageSelect.addEventListener("change", handleLanguageChange);
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
  elements.leaderboardTable.replaceChildren();
  state.validUsers = [];
  state.languages = [];
  elements.languageSelect.value = "overall";
  while (elements.languageSelect.options.length > 1) {
    elements.languageSelect.remove(1);
  }
  state.selectedLanguage = "overall";

  if (state.usernames.length === 0) {
    elements.usersMessage.textContent =
      "Please enter at least one Codewars username.";
    return;
  }
  elements.addUsersButton.disabled = true;

  try {
    await getValidUsers();
    if (state.validUsers.length === 0) {
      return;
    }
    createLanguageSelect();
    renderLeaderboard();
  } finally {
    elements.addUsersButton.disabled = false;
  }
}

function renderLeaderboard() {
  const rows = sortUsersBySelectedLanguage(
    state.validUsers,
    state.selectedLanguage,
  ).map((user, index) => createLeaderboardTable(user, index + 1));
  elements.leaderboardTable.replaceChildren(...rows);
}

async function getValidUsers() {
  const invalidUsers = [];
  const failedUsers = [];

  for (const username of state.usernames) {
    try {
      const response = await makeFetchRequest(username);
      if (!response.ok) {
        if (response.status === 404) {
          invalidUsers.push(username);
        } else {
          failedUsers.push(username);
        }
        continue;
      }
      const user = await response.json();
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
      `Could not retrieve data for: ${failedUsers.join(", ")}. ` +
        "Check your internet connection and try again. " +
        "If the problem continues, please try again later.",
    );
  }
  elements.usersMessage.textContent = messages.join(" ");
}

function createLeaderboardTable({ username, clan, ranks }, rank) {
  const row = document.createElement("tr");
  const rankCell = document.createElement("td");
  const usernameCell = document.createElement("td");
  const clanCell = document.createElement("td");
  const scoreCell = document.createElement("td");

  usernameCell.textContent = username;
  clanCell.textContent = clan ?? "";
  const selectedRank =
    state.selectedLanguage === "overall"
      ? ranks.overall
      : ranks.languages[state.selectedLanguage];

  scoreCell.textContent = selectedRank?.score ?? 0;
  rankCell.textContent = rank;

  if (rank === 1) {
    row.classList.add("winner-row");
  }
  row.append(rankCell, usernameCell, clanCell, scoreCell);

  return row;
}

function createLanguageSelect() {
  const languagesList = [];

  state.validUsers.forEach((user) => {
    languagesList.push(...Object.keys(user.ranks.languages ?? {}));
  });
  state.languages = [...new Set(languagesList)].sort();
  state.languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    elements.languageSelect.appendChild(option);
  });
}

function handleLanguageChange(event) {
  state.selectedLanguage = event.target.value;
  renderLeaderboard();
}

window.addEventListener("load", setup);
