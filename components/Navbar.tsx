"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <h1 className="font-bold text-lg">Poker Society</h1>
      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`hover:text-yellow-400 ${
              pathname === item.href ? "text-yellow-300 font-semibold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
