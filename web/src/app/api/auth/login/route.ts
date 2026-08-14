import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const redirectUri = process.env.COGNITO_REDIRECT_URI;

  if (!domain || !clientId || !redirectUri) {
    return NextResponse.json(
      { message: "Cognito configuration is missing" },
      { status: 500 },
    );
  }

  const loginUrl = new URL(
    `https://${domain}.auth.us-east-2.amazoncognito.com/oauth2/authorize`,
  );

  loginUrl.searchParams.set("client_id", clientId);
  loginUrl.searchParams.set("response_type", "code");
  loginUrl.searchParams.set("scope", "openid email");
  loginUrl.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(loginUrl);
}
