"use client";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import {
  AlignCenter,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  ItalicIcon,
  ListCollapse,
  ListIcon,
  ListOrdered,
  ListTree,
  QuoteIcon,
  HighlighterIcon,
  UnderlineIcon,
  Heading1,
  Heading2,
  Sparkles,
  Check,
  Loader2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/AIMODEL";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const ToolButton = ({ active, label, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    title={label}
    data-marked={active}
    className={cn(
      "mark-block flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors",
      "hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-35",
      "data-[marked=true]:text-ink data-[marked=true]:hover:bg-transparent"
    )}
  >
    {children}
  </button>
);

const Divider = () => (
  <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-rule" />
);

/** Gemini wraps its answer in a ```html fence; take the fence off, not the prose. */
const stripCodeFence = (text) =>
  text
    .trim()
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

const EditorExtension = ({ editor }) => {
  const { fileId } = useParams();
  const searchAi = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.addNotes);
  const { user } = useUser();

  const [asking, setAsking] = useState(false);
  const [saveState, setSaveState] = useState("idle");

  const persist = () =>
    saveNotes({
      fileId,
      notes: editor.getHTML(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

  const onAiClick = async () => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    if (selectedText.trim().length === 0) {
      toast.error("Highlight a passage first.", {
        description: "Porua answers from the text you mark.",
      });
      return;
    }

    setAsking(true);
    const reading = toast.loading("Porua is reading the document…");

    try {
      const result = await searchAi({ query: selectedText, fileId });
      const passages = JSON.parse(result);

      const context = (passages ?? [])
        .map((item) => item.pageContent)
        .join(" ");

      const PROMPT = `For question: ${selectedText} and the answer is given ${context}   please give appropriate answer in HTML format. complete the answer if it is not completed in the given answer within 80 words.`;

      const AiModelResult = await chatSession.sendMessage(PROMPT);
      const answer = stripCodeFence(AiModelResult.response.text());

      // Porua's writing is set apart from yours — ruled off, labelled, in the
      // machine's own voice rather than blended into your notes.
      editor.commands.setContent(
        `${editor.getHTML()}<div class="porua-note">${answer}</div>`
      );

      await persist();
      toast.success("Answer added to your notes.", { id: reading });
    } catch (error) {
      console.error("Ask Porua failed:", error);
      toast.error("Porua couldn't answer that one.", {
        id: reading,
        description: "Try again, or highlight a shorter passage.",
      });
    } finally {
      setAsking(false);
    }
  };

  const noteSave = async () => {
    setSaveState("saving");
    try {
      await persist();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveState("idle");
      toast.error("Your notes didn't save.", {
        description: "Check your connection and save again.",
      });
    }
  };

  if (!editor) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-rule bg-page/90 px-4 py-2 backdrop-blur-sm">
      <div className="flex min-w-0 flex-1 items-center overflow-x-auto">
        <ToolButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => chain().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => chain().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => chain().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolButton>

        <Divider />

        <ToolButton
          label="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => chain().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => chain().toggleBlockquote().run()}
        >
          <QuoteIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => chain().toggleHighlight().run()}
        >
          <HighlighterIcon className="h-4 w-4" />
        </ToolButton>

        <Divider />

        <ToolButton
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => chain().setTextAlign("left").run()}
        >
          <AlignLeftIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => chain().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => chain().setTextAlign("right").run()}
        >
          <AlignRightIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => chain().setTextAlign("justify").run()}
        >
          <AlignJustifyIcon className="h-4 w-4" />
        </ToolButton>

        <Divider />

        <ToolButton
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => chain().toggleBulletList().run()}
        >
          <ListIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => chain().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Indent"
          onClick={() => chain().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
        >
          <ListTree className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Outdent"
          onClick={() => chain().liftListItem("listItem").run()}
          disabled={!editor.can().liftListItem("listItem")}
        >
          <ListCollapse className="h-4 w-4" />
        </ToolButton>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-2">
        <button
          type="button"
          onClick={noteSave}
          disabled={saveState === "saving"}
          className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
        >
          {saveState === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Saved
            </>
          ) : saveState === "saving" ? (
            <>
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
              Saving
            </>
          ) : (
            "Save"
          )}
        </button>

        <button
          type="button"
          onClick={onAiClick}
          disabled={asking}
          className="flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-[13px] font-medium text-page shadow-page transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {asking ? (
            <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          Ask Porua
        </button>
      </div>
    </div>
  );
};

export default EditorExtension;
