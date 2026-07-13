"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Wordmark from "@/components/Wordmark";
import ThemeToggle from "@/components/ThemeToggle";

function WorkspaceHeader({ fileName }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-rule bg-page px-5">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/dashboard"
          aria-label="Back to documents"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </Link>
        <span className="hidden sm:block">
          <Wordmark />
        </span>
        <span aria-hidden className="hidden h-5 w-px bg-rule sm:block" />
        <h1 className="truncate font-display text-[17px] font-medium tracking-tight">
          {fileName ?? "Loading…"}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <UserButton
          appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-rule" } }}
        />
      </div>
    </header>
  );
}

export default WorkspaceHeader;
