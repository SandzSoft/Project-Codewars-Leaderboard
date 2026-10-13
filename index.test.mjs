import { describe, test } from "node:test";
import assert from "node:assert/strict";
import nock from "nock";
import { makeFetchRequest, sortUsersBySelectedLanguage } from "./functions.js";

// Sample user data for sorting and filtering tests
const users = [
  {
    username: "user1",
    ranks: {
      overall: { score: 10 },
      languages: {
        javascript: { score: 15 },
        java: { score: 50 },
      },
    },
  },
  {
    username: "user2",
    ranks: {
      overall: { score: 105 },
      languages: {
        javascript: { score: 90 },
        python: { score: 30 },
        java: { score: 10 },
      },
    },
  },
  {
    username: "user3",
    ranks: {
      overall: { score: 30 },
      languages: {
        javascript: { score: 105 },
      },
    },
  },
  {
    username: "user4",
    ranks: {
      overall: { score: 200 },
      languages: {
        javascript: { score: 200 },
        python: { score: 20 },
        java: { score: 80 },
      },
    },
  },
  {
    username: "user5",
    ranks: {
      overall: { score: 0 },
      languages: {
        python: { score: 10 },
      },
    },
  },
  {
    username: "user6",
    ranks: {
      overall: { score: 0 },
      languages: {},
    },
  },
];

// API request test
test("makes a fetch request for a Codewars user", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/someone")
    .reply(200, { username: "someone" });

  const response = await makeFetchRequest("someone");
  const parsedResponse = await response.json();

  assert.equal(response.status, 200);
  assert.equal(parsedResponse.username, "someone");
  assert.equal(scope.isDone(), true, "No matching fetch request was made");
});

// Sorting and filtering tests
describe("sortUsersBySelectedLanguage", () => {
  test("sorts users by overall score, highest first", () => {
    const sortedUsers = sortUsersBySelectedLanguage(users, "overall");

    assert.deepEqual(
      sortedUsers.map((user) => user.username),
      ["user4", "user2", "user3", "user1", "user5", "user6"],
    );
  });

  test("filters and sorts users by JavaScript score", () => {
    const sortedUsers = sortUsersBySelectedLanguage(users, "javascript");

    assert.deepEqual(
      sortedUsers.map((user) => user.username),
      ["user4", "user3", "user2", "user1"],
    );
  });

  test("filters and sorts users by Python score", () => {
    const sortedUsers = sortUsersBySelectedLanguage(users, "python");

    assert.deepEqual(
      sortedUsers.map((user) => user.username),
      ["user2", "user4", "user5"],
    );
  });

  test("filters and sorts users by Java score", () => {
    const sortedUsers = sortUsersBySelectedLanguage(users, "java");

    assert.deepEqual(
      sortedUsers.map((user) => user.username),
      ["user4", "user1", "user2"],
    );
  });

  test("returns an empty array when no users have the selected language", () => {
    const sortedUsers = sortUsersBySelectedLanguage(users, "nonexistent");

    assert.deepEqual(sortedUsers, []);
  });

  test("does not change the original users array", () => {
    const originalOrder = users.map((user) => user.username);

    sortUsersBySelectedLanguage(users, "javascript");

    assert.deepEqual(
      users.map((user) => user.username),
      originalOrder,
    );
  });
});
