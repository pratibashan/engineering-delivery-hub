import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const logoutUri = process.env.COGNITO_LOGOUT_URI;

  if (!domain || !clientId || !logoutUri) {
    return NextResponse.json(
      { message: "Cognito configuration is missing" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.delete("id_token");
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  const cognitoDomain = domain.includes(".amazoncognito.com")
    ? domain
    : `${domain}.auth.us-east-2.amazoncognito.com`;

  const logoutUrl = new URL(`https://${cognitoDomain}/logout`);

  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set("logout_uri", logoutUri);

  return NextResponse.redirect(logoutUrl);
}