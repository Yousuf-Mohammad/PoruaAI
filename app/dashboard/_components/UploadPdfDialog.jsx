"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon, Plus, UploadCloud } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import axios from "axios";
import { toast } from "sonner";

function UploadPdfDialog({ isMaxFile }) {
  const generateUploadUrl = useMutation(api.pdfStorage.generateUploadUrl);
  const InsertFileEntry = useMutation(api.pdfStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.pdfStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);

  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setFile(null);
    setFileName("");
  };

  const OnFileSelect = (e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected && !fileName) {
      setFileName(selected.name.replace(/\.pdf$/i, ""));
    }
  };

  const OnUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId });

      await InsertFileEntry({
        fileId,
        storageId,
        fileName: fileName.trim() || "Untitled document",
        fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      const ApiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);

      await embeddDocument({
        splitText: ApiResp.data.result,
        fileId: { fileId },
      });

      toast.success("Porua has read your document.", {
        description: "Open it and highlight a passage to ask about it.",
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("That document didn't go through.", {
        description: "Check the file is a readable PDF and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onOpenChange = (next) => {
    if (loading) return;
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-2" disabled={isMaxFile}>
          <Plus className="h-4 w-4" />
          Add a document
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a document</DialogTitle>
          <DialogDescription>
            Porua reads the PDF through once, so you can ask about any passage in
            it later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <label
              htmlFor="pdf-file"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-rule bg-paper px-6 py-8 text-center transition-colors hover:border-ink"
            >
              <UploadCloud
                className="h-5 w-5 text-ink-soft"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-sm font-medium text-ink">
                {file ? file.name : "Choose a PDF"}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
                {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "PDF only"}
              </span>
            </label>
            <input
              id="pdf-file"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={OnFileSelect}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pdf-name" className="block text-sm font-medium">
              Name it
            </label>
            <Input
              id="pdf-name"
              placeholder="Attention and memory"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={OnUpload} disabled={loading || !file}>
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Reading…
              </>
            ) : (
              "Add document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdfDialog;
