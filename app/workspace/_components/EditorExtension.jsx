"use client"
import { api } from '@/convex/_generated/api'
import { useAction, useMutation } from 'convex/react'
import { AlignCenter, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, Bold, ItalicIcon, ListCollapse, ListIcon, ListOrdered, ListTree, QuoteIcon, HighlighterIcon, UnderlineIcon, Heading1, Heading2, Heading3, Bot, Save } from 'lucide-react'
import React from 'react'
import { useParams } from 'next/navigation'
import { chatSession } from '@/configs/AIMODEL'
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs'
const EditorExtension = ({editor}) => {
    
    const {fileId} =useParams();
    const searchAi = useAction(api.myAction.search)
    const saveNotes = useMutation(api.notes.addNotes)
    const {user} = useUser();
    const onAiClick = async() =>{
        
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from, 
            editor.state.selection.to,
            " ");
            
        if(selectedText.length<=0){
            toast.error("Please select some text first.");
            return;
        }
        else{
            toast("Porua AI is working on your query...");
            const result = await searchAi({
                query:selectedText,
                fileId:fileId
            });
            const unformatedResult = JSON.parse(result);
            let AllUnformatedAnswer =' ';
            unformatedResult&&unformatedResult.forEach(item => {
                AllUnformatedAnswer += item.pageContent;
            });
            
            const PROMPT = "For question: " + selectedText + "and the answer is given "+AllUnformatedAnswer +"   please give appropriate answer in HTML format. complete the answer if it is not completed in the given answer within 80 words."; 
            console.log(PROMPT);
            const AiModelResult = await chatSession.sendMessage(PROMPT);
            const finalAnswer = AiModelResult.response.text().replace('```','').replace('html','').replace('```','');
            console.log(finalAnswer);
    
            const allText = editor.getHTML();
            editor.commands.setContent(allText+finalAnswer)

            saveNotes({
                fileId:fileId,
                notes:editor.getHTML(),
                createdBy:user?.primaryEmailAddress?.emailAddress

            })
        }
    }
    const noteSave =async ()=>{
         await saveNotes({
            fileId:fileId,
            notes:editor.getHTML(),
            createdBy:user?.primaryEmailAddress?.emailAddress

        })
        console.log("saved");
    }
    return editor && (
    <div className='p-5 my-5  mx-auto '>
        <div className="control-group fixed  p-2 z-10">
        <div className="button-group flex gap-2">
            
            <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
                <Bold/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <ItalicIcon/>
            </button>

            <button onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <UnderlineIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <Heading1/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <QuoteIcon/>
            </button>

            <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight',{ color: 'yellow' }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
           <HighlighterIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <AlignLeftIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <AlignCenter/>
            </button>
            <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <AlignRightIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <AlignJustifyIcon/>
            </button>
           
    
            <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded'}
            >
            <ListIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded '}
            >
            <ListOrdered/>
            </button>
            
            <button
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            className={editor.isActive('orderedList') ? ' bg-blue-500 p-2 rounded text-white' : 'bg-slate-300 p-2 rounded '}
            disabled={!editor.can().sinkListItem('listItem')}
            >
            <ListTree/>
            </button>
            <button
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            className={editor.isActive('orderedList') ? ' bg-blue-500 p-2 rounded text-white ' : 'bg-slate-300 p-2 rounded '}
            disabled={!editor.can().liftListItem('listItem')}
            >
            <ListCollapse/>
            </button>
            <button 
            onClick={()=>onAiClick()}
            className='bg-slate-300 p-2 rounded hover:bg-blue-500 hover:text-white'>
            <Bot/>
            </button>
            <button 
            onClick={()=>noteSave()}
            className='bg-slate-300 p-2 rounded hover:bg-blue-500 hover:text-white'>
            <Save/>
            </button>

            
        </div>
        </div>
        
    </div>
  )
}

export default EditorExtension