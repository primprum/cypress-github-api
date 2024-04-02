Feature: (4) Star and Unstar a repository

  Scenario: I want to star an important repository
    Given I am an authenticated user
    When I star my "get-issues" repository from username "primprum"
    Then my "get-issues" repository from username "primprum" will list me as a stargazer

  Scenario: I want to unstar an important repository
    Given I am an authenticated user
    When I unstar my "get-issues" repository from username "primprum"
    Then my "get-issues" repository from username "primprum" will not list me as a stargazer