## Comprehensive Testing Setup for MoodFLOW

### Summary of added tests
* **Frontend Unit Tests (Validation):** Added unit tests for the `SignUpPage` component using Jest and React Testing Library. Specifically handles empty field default browser validation and password mismatch states by making sure correct UI error messages populate on-screen without communicating with the backend. Mocked `firebase/auth` functions to ensure pure frontend validation verification.
* **Frontend Integration Tests (API Interaction):** Wired up the Dashboard `Save Entry` button to interact with the backend `/analyzeMood` endpoint. Wrote integration tests that mock the global `fetch` API. Handled both successful responses (200 OK) fetching positive mock data mapping to a success message and failed responses correctly popping error alerts.
* **E2E Test (Signup Validation):** Set up Playwright to test the user flow of navigating to the `/signup` page, typing mismatched passwords ("password123" and "password456"), clicking "Sign Up", and strictly checking that the explicit "Passwords must match." text appears onscreen correctly maintaining the URL state. 

### Coverage Improvement
This PR vastly expands test coverage for critical client-side paths. Prior to these changes, the React component tree and navigation logic remained largely untested manually. By implementing mocked integration components and Playwright suites, we provide automated guarantees around UI bounds, form restrictions, regression catches, and API data rendering without overlapping the backend routes/tests.

### Flows Tested
1. **Signup Form Bounds:** Correct routing mapping for success states vs specific error checks for missing properties / invalid patterns.
2. **Dashboard Fetch Mechanism:** Verifies mapping payload (notes translated into emojis) constructs a correctly packaged HTTP request and properly unwraps the server's HTTP JSON response back into readable format.
3. **Signup Password Discrepancy Flow:** A Playwright full-browser recreation to verify client-side visual reactivity when entering incorrectly matching double-authentication fields.

### Instructions to run tests locally
1. Run `npm install:all` to fetch all dependencies.
2. For Frontend Unit and Integration tests, navigate to `cd frontend` and run `npm test`.
3. For Frontend E2E tests, execute `npx playwright test` in the `frontend` directory.

> **Note for Instructor:** Please do not merge this PR as it encompasses the individual assignment components ensuring independent setups decoupled from teammate work layers. Add instructor as reviewer.
