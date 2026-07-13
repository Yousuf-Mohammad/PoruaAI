"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Heading } from "@tiptap/extension-heading";
import EditorExtension from "./EditorExtension";
import { PoruaNote } from "./PoruaNote";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function TextEditor({ fileId }) {
  const notes = useQuery(api.notes.getNotes, { fileId });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      PoruaNote,
      Placeholder.configure({
        placeholder: "Start a note, or highlight a line and ask Porua…",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Highlight.configure({ multicolor: true }),
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    editorProps: {
      attributes: {
        // Stretch the editable area so clicking the empty space below the last
        // paragraph still puts the caret in the note.
        class: "focus:outline-none min-h-[55vh]",
      },
    },
  });

  useEffect(() => {
    if (!editor || notes === undefined) return;
    editor.commands.setContent(notes?.length > 0 ? notes : "");
  }, [notes, editor]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-page">
      <EditorExtension editor={editor} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* A measure, not a full-bleed column — notes are read, so they get a
            reading width. */}
        <EditorContent
          editor={editor}
          className="mx-auto min-h-full max-w-[68ch] px-8 py-10"
        />
      </div>
    </div>
  );
}

export default TextEditor;
