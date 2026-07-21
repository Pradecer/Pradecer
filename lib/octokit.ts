import { graphql } from "@octokit/graphql";

export function getGraphQLClient(token: string) {
  return graphql.defaults({
    headers: { authorization: `token ${token}` },
  });
}

export const VIEWER_DASHBOARD_QUERY = /* GraphQL */ `
  query DashboardData($from: DateTime!, $to: DateTime!) {
    viewer {
      login
      name
      avatarUrl
      bio
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: 30
        orderBy: { field: UPDATED_AT, direction: DESC }
        ownerAffiliations: OWNER
      ) {
        totalCount
        nodes {
          id
          name
          description
          stargazerCount
          forkCount
          url
          primaryLanguage {
            name
            color
          }
          pushedAt
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  totalCount
                }
              }
            }
          }
          pullRequests(states: OPEN, first: 5) {
            totalCount
            nodes {
              title
              createdAt
              url
            }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
    rateLimit {
      limit
      remaining
      resetAt
    }
  }
`;

export const PUBLIC_USER_DASHBOARD_QUERY = /* GraphQL */ `
  query PublicUserData($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      name
      avatarUrl
      bio
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: 30
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          id
          name
          description
          stargazerCount
          forkCount
          url
          primaryLanguage {
            name
            color
          }
          pushedAt
          pullRequests(states: OPEN, first: 5) {
            totalCount
            nodes {
              title
              createdAt
              url
            }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
    rateLimit {
      limit
      remaining
      resetAt
    }
  }
`;
