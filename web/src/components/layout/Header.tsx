import Link from "next/link";
import { cookies } from "next/headers";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
];

export default async function Header() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("id_token"));

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-lg font-bold leading-tight sm:whitespace-nowrap"
          >
            Engineering Delivery Hub
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap items-center gap-3 sm:gap-6">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                {isAuthenticated ? (
                  <a
                    href="/api/auth/logout"
                    className="inline-flex whitespace-nowrap rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Sign out
                  </a>
                ) : (
                  <a
                    href="/api/auth/login"
                    className="inline-flex whitespace-nowrap rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Sign in
                  </a>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
