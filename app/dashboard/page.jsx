"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import UploadPdfDialog from "./_components/UploadPdfDialog";
import { cn } from "@/lib/utils";

const FILE_LIMIT = 5;

/* Lines of a page, one of them marked. The card shows what the document
   becomes here rather than a generic PDF icon. */
const lineWidths = ["w-full", "w-[92%]", "w-[70%]", "w-full", "w-[60%]"];

const DocumentCard = ({ file }) => (
  <Link
    href={"/workspace/" + file.fileId}
    className="group flex flex-col rounded-xl border border-rule bg-page p-5 shadow-page transition-all hover:-translate-y-0.5 hover:shadow-lift"
  >
    <span aria-hidden className="mb-6 flex flex-col gap-[7px]">
      {lineWidths.map((w, i) => (
        <span
          key={i}
          className={cn(
            "h-[3px] rounded-full",
            w,
            i === 2 ? "bg-marker" : "bg-rule"
          )}
        />
      ))}
    </span>

    <h2 className="mark-block mark-group self-start rounded px-1 font-display text-[17px] font-medium leading-snug text-ink transition-colors group-hover:text-on-marker">
      {file.fileName}
    </h2>
    <p className="mt-2 px-1 font-mono text-[11px] uppercase tracking-label text-ink-soft">
      PDF
    </p>
  </Link>
);

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.pdfStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const loading = fileList === undefined;
  const empty = !loading && fileList.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your shelf</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
            Documents
          </h1>
        </div>
        <div className="w-full sm:w-auto md:hidden">
          <UploadPdfDialog isMaxFile={(fileList?.length ?? 0) >= FILE_LIMIT} />
        </div>
      </div>

      <div className="mt-10">
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[186px] animate-pulse rounded-xl border border-rule bg-page/60"
              />
            ))}
          </div>
        )}

        {empty && (
          <div className="rounded-xl border border-dashed border-rule px-8 py-16 text-center">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Nothing on the shelf yet.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Add a PDF and Porua will read it through. After that, highlight any
              passage to ask about it.
            </p>
          </div>
        )}

        {!loading && !empty && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fileList.map((file) => (
              <DocumentCard key={file.fileId} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
