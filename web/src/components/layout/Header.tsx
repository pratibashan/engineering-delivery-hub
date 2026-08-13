import Link from "next/link";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          Engineering Delivery Hub
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-6">
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
