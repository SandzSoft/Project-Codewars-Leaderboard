// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

/*export function makeFetchRequest() {
  return fetch("https://example.com/test");
}*/

const elements = {};

// State object to hold application data
const state = {
  usernames: [],
  validUsers: [],
  selectedUsers: [],
  selectedUsersData: [],
  selectedLanguage: "overall",
  cachedUsers: {},
};

// Setup function to initialize the application
function setup() {
  elements.usernamesInput = document.getElementById("usernames");
  elements.addUsersButton = document.getElementById("add_users_button");
  elements.compareUsersButton = document.getElementById("compare_users_button");
  elements.usersMessage = document.getElementById("users_message");

  elements.usersTable = document.querySelector("#users_table tbody");
  elements.leaderboardTable = document.querySelector(
    "#leaderboard_table tbody",
  );

  elements.addUsersButton.addEventListener("click", handleAddUsersClick);
  elements.compareUsersButton.addEventListener(
    "click",
    handleCompareUsersClick,
  );
}

function handleAddUsersClick() {
  state.usernames = [
    ...new Set(
      elements.usernamesInput.value
        .split(",")
        .map((username) => username.trim())
        .filter((username) => username !== ""),
    ),
  ];
  elements.usersMessage.textContent = "";
  state.selectedUsers = []; // Reset selected users when rendering the table
  state.selectedUsersData = []; // Reset selected users data when rendering the table
  state.validUsers = []; // Reset valid users when rendering the table
  elements.leaderboardTable.replaceChildren();
  elements.usersTable.replaceChildren();
  renderUsersTable();
}

async function renderUsersTable() {
  await getValidUsers();
  const users = state.validUsers.map(createUsersTable);
  elements.usersTable.replaceChildren(...users);
}

async function getValidUsers() {
  const invalidUsers = [];
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
        invalidUsers.push(username);
        continue;
      }
      const user = await response.json();
      state.cachedUsers[username] = user;
      state.validUsers.push(user);
    } catch {
      elements.usersMessage.textContent = `Could not retrieve "${username}". Please check your connection and try again.`;
    }
  }
  if (invalidUsers.length > 0) {
    elements.usersMessage.textContent = `The following usernames are invalid: ${invalidUsers.join(
      ", ",
    )}`;
  }
}

function createUsersTable({ username }) {
  const row = document.createElement("tr");
  const cell1 = document.createElement("td");
  const cell2 = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      state.selectedUsers.push(username);
    } else {
      state.selectedUsers = state.selectedUsers.filter(
        (user) => user !== username,
      );
    }
  });

  cell1.textContent = username;
  cell2.appendChild(checkbox);
  row.appendChild(cell1);
  row.appendChild(cell2);
  return row;
}

function handleCompareUsersClick() {}

// Initialize the application when the window loads
window.onload = setup;
