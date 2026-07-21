import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGraphQLClient, VIEWER_DASHBOARD_QUERY, PUBLIC_USER_DASHBOARD_QUERY } from "@/lib/octokit";
import { MOCK_GITHUB_DATA } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken || process.env.GITHUB_TOKEN;

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // If token is available, perform GraphQL query
  if (token) {
    try {
      const client = getGraphQLClient(token);

      let data: any;
      if (username && username !== "peter-parker") {
        data = await client(PUBLIC_USER_DASHBOARD_QUERY, {
          username,
          from: oneYearAgo.toISOString(),
          to: now.toISOString(),
        });
        // Normalize user field to viewer structure
        if (data?.user) {
          data.viewer = data.user;
          delete data.user;
        }
      } else {
        data = await client(VIEWER_DASHBOARD_QUERY, {
          from: oneYearAgo.toISOString(),
          to: now.toISOString(),
        });
      }

      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    } catch (err: any) {
      console.warn("GitHub GraphQL query warning, falling back to mock dataset:", err.message);
    }
  }

  // Fallback to high-fidelity mock data if no token or API limit exceeded
  const responseData = { ...MOCK_GITHUB_DATA };
  if (username && username !== "peter-parker") {
    responseData.viewer = {
      ...responseData.viewer,
      login: username,
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} (Agent)`,
      bio: `Active GitHub operative & code contributor: @${username}`,
    };
  }

  return NextResponse.json(responseData, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
