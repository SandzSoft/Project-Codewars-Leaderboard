## Testing

### Automated Tests

Run the following command in the project directory:

```bash
npm test
```

The tests in `index.test.mjs` cover:

- API request functionality.
- Sorting users by overall, JavaScript, Python and Java scores.
- Filtering users without the selected language ranking.
- Ensuring the original users array remains unchanged.

### Manual Tests

| Requirement        | Test                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Username input     | Submit a comma-separated list of usernames.                                              |
| Empty input        | Click **Add User** without entering a username and check that a helpful message appears. |
| API data           | Submit valid usernames and verify their current data.                                    |
| Ranking dropdown   | Check that all available languages and Overall appear.                                   |
| Default ranking    | Verify that Overall is selected by default.                                              |
| Table              | Check rank, username, clan and score columns.                                            |
| Ranking changes    | Select different languages and verify that the table updates.                            |
| Sorting            | Verify that scores are sorted from highest to lowest.                                    |
| Missing language   | Verify that users without the selected language ranking are hidden.                      |
| Top user highlight | Verify that the highest-scoring user is highlighted.                                     |
| Invalid usernames  | Search for nonexistent usernames and check that a helpful error message appears.         |
| API/network errors | Test failed requests and verify that useful error messages appear.                       |
| Accessibility      | Run Lighthouse in Desktop Snapshot mode for every view and verify 100% accessibility.    |
| Dead code          | Review JavaScript for unused code.                                                       |
| Deployment         | Verify the live website and automatic deployment after merging changes.                  |

### Test Results

Record the actual results after completing the tests.

- **Automated tests:** [Pass]
- **Manual tests:** [Pass]
- **Lighthouse accessibility:** [100%]
- **Deployment:** [Verified]
