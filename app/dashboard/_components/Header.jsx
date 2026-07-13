"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Wordmark from "@/components/Wordmark";

const nav = [
  { href: "/dashboard", label: "Documents" },
  { href: "/dashboard/upgrade", label: "Upgrade" },
];

const Header = () => {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-rule bg-paper/85 px-6 backdrop-blur-sm md:justify-end md:px-8">
      <div className="flex items-center gap-6 md:hidden">
        <Link href="/dashboard">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-4">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              data-marked={path === href}
              className="mark-block mark-hover rounded px-1.5 py-0.5 text-[13px] text-ink-soft data-[marked=true]:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <UserButton
        appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-rule" } }}
      />
    </header>
  );
};

export default Header;
