import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Authorization code is missing" },
      { status: 400 },
    );
  }

  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const redirectUri = process.env.COGNITO_REDIRECT_URI;

  if (!domain || !clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { message: "Cognito configuration is missing" },
      { status: 500 },
    );
  }

  const tokenUrl = `https://${domain}.auth.us-east-2.amazoncognito.com/oauth2/token`;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();

    console.error("Cognito token exchange failed:", error);

    return NextResponse.json(
      { message: "Unable to complete login" },
      { status: 500 },
    );
  }

  const tokens = await tokenResponse.json();

  console.log("Cognito token exchange succeeded");

  const cookieStore = await cookies();

  cookieStore.set("id_token", tokens.id_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  if (tokens.refresh_token) {
    cookieStore.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
