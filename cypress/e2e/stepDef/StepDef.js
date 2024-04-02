import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PageObject from "../pageObject/PageObject";

let monkeyCount = 0;
let results = null;

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
