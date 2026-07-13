"use client";
import React from "react";
import { useParams } from "next/navigation";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../_components/TextEditor";

function Workspace() {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.pdfStorage.getFileRecord, { fileId });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      <WorkspaceHeader fileName={fileInfo?.fileName} />

      {/* The desk: your notes on the left, the document on the right. */}
      <main className="grid min-h-0 flex-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <section
          aria-label="Notes"
          className="min-h-0 border-b border-rule md:border-b-0 md:border-r"
        >
          <TextEditor fileId={fileId} />
        </section>

        <section aria-label="Document" className="min-h-0">
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </section>
      </main>
    </div>
  );
}

export default Workspace;
