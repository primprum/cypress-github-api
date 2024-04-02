Feature: (2) Get a list of issues with variables

  Scenario: I want to get a list of the issues for the Symfony repository
    Given I am an authenticated user
    When I request a list of issues from user "torvalds" for the repository "linux"
    Then I should get at least 1 result