# GitHub API Testing Projects With Cypress

> **_This is the another implementation of this project: https://github.com/primprum/behat-github-api_**
>
> **_In here, instead of using Behat, we're gonna use Cypress with Cucumber BDD as the automation tool, and also instead of separating each feature into it's separated repo, we're gonna include all of the features into one project in one repo for running all of the tests._**
>
> **_Complete Step Definition => [StepDef.js](https://github.com/primprum/cypress-github-api/blob/master/cypress/e2e/stepDef/StepDef.js)_**

<br>

### 1. Establish My Environment

This is the feature file:

```gherkin
Feature: Establish my Environment

Scenario: I want to prove my environment is working as expected
    Given I have 2 monkeys
    When I get 2 more monkeys
    Then I should have 4 monkeys
```

Cypress code implementation:

```js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let monkeyCount = 0;

// Check the working environment
Given("I have {int} monkeys", (count) => {
  monkeyCount = count;
});

When("I get {int} more monkeys", (count) => {
  monkeyCount += count;
});

Then("I should have {int} monkeys", (expectedCount) => {
  expect(monkeyCount).to.equal(expectedCount);
});

// Precondition as an authenticated user
Given("I am an authenticated user", () => {
  cy.log("I am an authenticated user");
});
```

<br>

#### Comparison with the code in Behat => [prove-environment](https://github.com/primprum/prove-environment/blob/master/features/bootstrap/FeatureContext.php)

**Variable Access:** <br> Behat uses `$this->variableName` within class methods, while Cypress allows direct access to variables. This is because `$this` refers to the current instance of the class, allowing us to access properties and methods within that class.

**Assertion:** <br> Behat relies on PHPUnit for assertions, using `Assert::assertEquals()`, while Cypress provides its own assertion library with methods like `expect()`.

**Dependencies:** <br> Behat integrates Gherkin syntax into PHP, while Cypress relies on packages like `@badeball/cypress-cucumber-preprocessor` for Cucumber-style syntax.

**Structure:** <br> In Behat, step definitions are typically organized within a context class, commonly named `FeatureContext`. This class implements the `Context` interface and contains the step definition methods, while in Cypress it offers flexibility in structuring tests by allowing step definitions to be placed directly within test files, or in separate files as per the developer's preference.

<br>

### 2. Get a List of Issues

This is the feature file:

```gherkin
Feature: Get a list of issues with variables

  Scenario: I want to get a list of the issues for the Symfony repository
    Given I am an authenticated user
    When I request a list of issues from user "torvalds" for the repository "linux"
    Then I should get at least 1 result
```

Cypress code implementation:

```js
// Check the availability of issues
When("I request a list of issues from user {string} for the repository {string}", (user, repository) => {
  cy.request({
    method: "GET",
    url: `https://api.github.com/repos/${user}/${repository}/issues`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 200);
    results = response.body;
  });
});

Then("I should get at least {int} result", (expectedCount) => {
  expect(results.length).to.be.at.least(expectedCount);
});
```

<br>

For the `checkResponseStatus()` function:

```js
class PageObject {
  checkResponseStatus(response, expectedStatusCode) {
    if (response.status !== expectedStatusCode) {
      throw new Error(`Expected a ${expectedStatusCode} status code but got ${response.status} instead!`);
    }
  }
}

export default new PageObject();
```

It's being included into the [PageObject.js](https://github.com/primprum/cypress-github-api/blob/master/cypress/e2e/pageObject/PageObject.js) in it's own separate class.

<br>

#### Comparison with the code in Behat => [get-issues-var](https://github.com/primprum/get-issues-var/blob/master/features/bootstrap/FeatureContext.php)

**HTTP Requests:** <br> Behat Relies on external PHP libraries like `github/client` for making HTTP requests. These libraries encapsulate the functionality needed to interact with HTTP services such as the GitHub API.

> The GitHub client library (github/client) is a PHP library that provides a convenient way to interact with the GitHub API. It handles tasks such as authentication, making requests, and handling responses to and from the GitHub API endpoints.

Meanwhile, Cypress Provides built-in methods like `cy.request()` for making HTTP requests directly within test scripts. This allows Cypress tests to interact with external services asynchronously and handle responses seamlessly within the test flow.

**Authorization** <br> In the Cypress code, we need to manually specify all headers, including the Authorization header, to include the necessary authentication token for the request. Cypress itself doesn't have built-in support for handling authorization tokens, so we need to explicitly define it in our test code.

```js
headers: {
  Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
},
```

And the token itself is being saved at `cypress.config.js`

While in Behat, it uses external libraries like `github/client` to interact with APIs, the library handles many aspects of the HTTP request process, including handling authorization tokens. Libraries like `github/client` are specifically designed to abstract away the complexities of making HTTP requests, including managing headers such as Authorization.

```php
$issues = $this->client->issues()->all($arg1, $arg2);
```

This method internally handles adding the necessary Authorization header with the provided credentials, abstracting away the need for us to manually specify it in our test code.

<br>

### 3. Check Repo Availability

This is the feature file:

```gherkin
Feature: Get list of repositories

  Scenario: I want to check the availability of repository
    Given I am an authenticated user
    When I request a list of repositories from user "primprum"
    Then the results should include a repository named "get-issues"
```

Cypress code implementation:

```js
// Check repo availability
When("I request a list of repositories from user {string}", (user) => {
  cy.request({
    method: "GET",
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 200);
    results = response.body;
  });
});

Then("the results should include a repository named {string}", (repoName) => {
  const repositoryExists = results.some((repo) => repo.name === repoName);
  expect(repositoryExists).to.be.true;
});

Then("the results should not include a repository named {string}", (repoName) => {
  const repositoryExists = results.some((repo) => repo.name === repoName);
  expect(repositoryExists).to.be.false;
});
```

<br>

#### Comparison with the code in Behat => [find-repo](https://github.com/primprum/find-repo/blob/master/features/bootstrap/FeatureContext.php)

**Approach:** <br> Behat uses array manipulation functions (`array_column` and `isset`) to determine repository existence, while Cypress uses array methods (`some`) to iterate through the array and check for repository existence.

<br>

### 4. Changing API State

This is the feature file:

```gherkin
Feature: Star and Unstar a repository

  Scenario: I want to star an important repository
    Given I am an authenticated user
    When I star my "get-issues" repository from username "primprum"
    Then my "get-issues" repository from username "primprum" will list me as a stargazer

  Scenario: I want to unstar an important repository
    Given I am an authenticated user
    When I unstar my "get-issues" repository from username "primprum"
    Then my "get-issues" repository from username "primprum" will not list me as a stargazer
```

Cypress code implementation:

```js
// Star and Un-starring repo
When("I star my {string} repository from username {string}", (repository, username) => {
  cy.request({
    method: "PUT",
    url: `https://api.github.com/user/starred/${username}/${repository}`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    // successfully processed, but there is no content (204) to return in the response body
    PageObject.checkResponseStatus(response, 204);
  });
});

When("I unstar my {string} repository from username {string}", (repository, username) => {
  cy.request({
    method: "DELETE",
    url: `https://api.github.com/user/starred/${username}/${repository}`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 204);
  });
});

Then("my {string} repository from username {string} will list me as a stargazer", (repository, username) => {
  cy.request({
    method: "GET",
    url: `https://api.github.com/repos/${username}/${repository}/stargazers`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 200);
    expect(response.body.map((stargazer) => stargazer.login)).to.include(`${username}`);
  });
});

Then("my {string} repository from username {string} will not list me as a stargazer", (repository, username) => {
  cy.request({
    method: "GET",
    url: `https://api.github.com/repos/${username}/${repository}/stargazers`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 200);
    expect(response.body.map((stargazer) => stargazer.login)).to.not.include(`${username}`);
  });
});
```

<br>

#### Comparison with the code in Behat => [star-unstar-repo](https://github.com/primprum/star-unstar-repo/blob/master/features/bootstrap/FeatureContext.php)

**Assertion:** <br> In Behat, it uses PHP's `array_column()` function to extract login names and PHP's associative array for efficient lookup, while in Cypress it uses JavaScript's `map()` function to extract login names and the `include()` function to check for the presence of the current user's username.

<br>

### 5. Create and Delete Repo

This is the feature file:

```gherkin
Feature: Create and delete a repository

  Scenario: I want to create a repository
    Given I am an authenticated user
    When I request a list of repositories from user "primprum"
    Then the results should not include a repository named "my-new-repo"
    When I create a repository called "my-new-repo" through username "primprum"
    And I request a list of repositories from user "primprum"
    Then the results should include a repository named "my-new-repo"

  Scenario: I want to delete a repository
    Given I am an authenticated user
    When I request a list of repositories from user "primprum"
    Then the results should include a repository named "my-new-repo"
    When I delete a repository called "my-new-repo" through username "primprum"
    And I request a list of repositories from user "primprum"
    Then the results should not include a repository named "my-new-repo"
```

Cypress code implementation:

```js
// Create and delete repo
When("I create a repository called {string} through username {string}", (repository) => {
  cy.request({
    method: "POST",
    url: "https://api.github.com/user/repos",
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
    body: {
      name: repository,
      description: "My newly created repository",
      homepage: "https://www.linkedin.com/in/prima-wirawan/",
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 201);
  });
});

When("I delete a repository called {string} through username {string}", (repository, username) => {
  cy.request({
    method: "DELETE",
    url: `https://api.github.com/repos/${username}/${repository}`,
    headers: {
      Authorization: `Bearer ${Cypress.env("GITHUB_TOKEN")}`,
    },
  }).then((response) => {
    PageObject.checkResponseStatus(response, 204);
  });
});
```

<br>

#### Comparison with the code in Behat => [create-del-repo](https://github.com/primprum/create-del-repo/blob/master/features/bootstrap/FeatureContext.php)

**Repo Creation & Deleteion** <br> In Behat, repo creation and deletion is merely by using function `create()` and `remove()` because of the use of Github library, meanwhile in Cypress, we have to specify it's method and it's url.

```js
// Repo Creation
method: "POST",
url: "https://api.github.com/user/repos",

// Repo Deletion
method: "DELETE",
url: `https://api.github.com/repos/${username}/${repository}`,
```

<br>

## Test implementation

Scripts in package.json:

```json
"scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run --spec \"cypress/e2e/features/*.feature\"",
    "report": "node cypress.report.js"
}
```

So, to run the test, we're going to do this:

```bash
npm run cy:open
```

Or, for headless mode:

```bash
npm run cy:run
```

<br>

## Test demo

[![Test Demo](https://img.youtube.com/vi/x8pgghr3ylk/maxresdefault.jpg)](https://www.youtube.com/embed/x8pgghr3ylk)

<br>

## License

This repository is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
