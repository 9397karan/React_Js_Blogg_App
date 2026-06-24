import { EditorContent, useEditor } from "@tiptap/react";
import './editor.css'
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEffect } from "react";

export default function RichTextEditor({ content, setContent,setWords }) {
  const editor = useEditor({
    extensions: [StarterKit],

    content,

    editorProps: {
      attributes: {
        class:
          "prose prose-invert min-h-[450px] p-6 outline-none text-white focus:outline-none",
      },
    },

    onUpdate({ editor }) {
      setContent(editor.getHTML());
      const plainText=editor.getText()
    
    },
  });
const calculateReadTime = (text) => {
  const words = text  
    .trim()
    .split(/\s+/)
    .filter(Boolean);
 
  return {time:Math.max(1, Math.ceil(words.length / 200)),
    words: words.length};
};
  if (!editor) return null;
  useEffect(()=>{
if(!editor) return
 setWords( calculateReadTime(editor.getText()))
  },[editor,content])


  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-zinc-800 bg-zinc-900">

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn btn-sm ${
            editor.isActive("bold") ? "btn-primary" : "btn-ghost"
          }`}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn btn-sm ${
            editor.isActive("italic") ? "btn-primary" : "btn-ghost"
          }`}
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`btn btn-sm ${
            editor.isActive("heading", { level: 1 })
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`btn btn-sm ${
            editor.isActive("heading", { level: 2 })
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-sm ${
            editor.isActive("bulletList")
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-sm ${
            editor.isActive("orderedList")
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <ListOrdered size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="btn btn-sm btn-ghost"
        >
          <Undo2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="btn btn-sm btn-ghost"
        >
          <Redo2 size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}