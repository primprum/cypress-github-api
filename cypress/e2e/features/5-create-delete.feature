Feature: (5) Create and delete a repository

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