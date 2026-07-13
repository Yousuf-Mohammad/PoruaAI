"use client";
import { Layers, Sparkles } from "lucide-react";
import React from "react";
import UploadPdfDialog from "./UploadPdfDialog";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";

const FILE_LIMIT = 5;

const nav = [
  { href: "/dashboard", label: "Documents", icon: Layers },
  { href: "/dashboard/upgrade", label: "Upgrade", icon: Sparkles },
];

const SideBar = () => {
  const { user } = useUser();
  const path = usePathname();
  const fileList = useQuery(api.pdfStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const used = fileList?.length ?? 0;
  const atLimit = used >= FILE_LIMIT;

  return (
    <div className="flex h-full flex-col border-r border-rule bg-page px-5 py-6">
      <Link href="/dashboard" className="px-2">
        <Wordmark showSubtitle />
      </Link>

      <div className="mt-8">
        <UploadPdfDialog isMaxFile={atLimit} />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              data-marked={active}
              className="mark-block mark-hover flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:text-on-marker data-[marked=true]:font-medium data-[marked=true]:text-on-marker"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Storage</span>
          <span className="font-mono text-[11px] text-ink-soft">
            {used}/{FILE_LIMIT}
          </span>
        </div>

        {/* The meter is the marker again — a stroke filling a ruled line. */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-marker-deep transition-[width] duration-500"
            style={{ width: `${Math.min((used / FILE_LIMIT) * 100, 100)}%` }}
          />
        </div>

        <p className="mt-3 text-[13px] leading-snug text-ink-soft">
          {atLimit ? (
            <>
              You&apos;ve filled the free plan.{" "}
              <Link href="/dashboard/upgrade" className="text-ink underline underline-offset-2">
                Upgrade
              </Link>{" "}
              to add more.
            </>
          ) : (
            `${FILE_LIMIT - used} more document${FILE_LIMIT - used === 1 ? "" : "s"} on the free plan.`
          )}
        </p>
      </div>
    </div>
  );
};

export default SideBar;
