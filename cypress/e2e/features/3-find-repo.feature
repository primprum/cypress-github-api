Feature: (3) Get list of repositories

  Scenario: I want to check the availability of repository
    Given I am an authenticated user
    When I request a list of repositories from user "primprum"
    Then the results should include a repository named "get-issues"