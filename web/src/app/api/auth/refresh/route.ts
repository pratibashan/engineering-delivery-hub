import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    return NextResponse.json(
      { message: "Cognito configuration is missing" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh token is missing" },
      { status: 401 },
    );
  }

  const tokenUrl = `https://${domain}.auth.us-east-2.amazoncognito.com/oauth2/token`;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    console.error("Cognito token refresh failed:", await response.text());

    return NextResponse.json(
      { message: "Unable to refresh session" },
      { status: 401 },
    );
  }

  const tokens = await response.json();

  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  if (tokens.id_token) {
    cookieStore.set("id_token", tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  if (tokens.refresh_token) {
    cookieStore.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });
  }

  return NextResponse.json({
    refreshed: true,
  });
}
