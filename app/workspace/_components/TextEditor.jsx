"use client"
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import {Underline} from '@tiptap/extension-underline'
import {Heading} from '@tiptap/extension-heading'
import EditorExtension from './EditorExtension'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
function TextEditor({fileId}) {

    const notes = useQuery(api.notes.getNotes,{fileId:fileId})
    
    const editor = useEditor({
        extensions: [StarterKit,Underline,
            Placeholder.configure({
                placeholder: 'Write your note here...',
                
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'], // Add the node types where text alignment is applicable
                alignments: ['left', 'center', 'right', 'justify'], // Supported alignments
            }),
            Highlight.configure({
                multicolor: true, // Optional: Allows multiple highlight colors
            }),
            Heading.configure({
                levels: [1, 2, 3],
        }),
                
        ],
       
        editorProps: {
            attributes: {
                class: 'p-5 h-screen focus:outline-none'
            },
            
        }
        
        })
    
        useEffect(() => {
            if (notes?.length > 0&&editor) {
                editor?.commands.setContent(notes);
            }
            else{
                editor?.commands.setContent(' ');
            }
        }, [notes&&editor])
    
  return (
    <div>
        <EditorExtension editor={editor}/>
        <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor