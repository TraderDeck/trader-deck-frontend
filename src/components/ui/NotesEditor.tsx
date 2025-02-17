import React, { useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import UnderlineExtension from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-text-style";
import Text from "@tiptap/extension-text";
import { Bold, Italic, Underline, PaintBucket, List as ListIcon } from "lucide-react";

interface Props {
  initialContent?: string;
  onSave: (content: string) => void;
}

const NotesEditor = ({ initialContent, onSave }: Props) => {
  const [content, setContent] = useState(initialContent || "");
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, BulletList, ListItem, Text, Color, TextStyle, FontSize, UnderlineExtension],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none cursor-text",
      },
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  };

  const handleEditorClick = () => {

    const isSelectingText = window.getSelection()?.toString().length !== 0;
    if (isSelectingText) return; 

    if ( editor?.isEmpty) {
      editor.commands.focus("start");
    }
  };

  // const handleEditorClick = () => {
  //   const isSelectingText = window.getSelection()?.toString().length !== 0;
  
  //   if (!isSelectingText && !editor?.view.hasFocus()) {
  //     editor?.commands.focus();
  //   }
  // };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    //onBlur={() => setTimeout(() => setIsFocused(false), 200)}
    <div ref={editorRef} className=" pt-2 pl-4 pb-4 border rounded-lg w-full bg-white shadow-md" onFocus={() => setIsFocused(true)} onClick={handleEditorClick}>
      {isFocused && (
        <div className="border-b pb-1 mb-2 flex gap-3 items-center">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 hover:text-blue-500">
            <Bold size={16} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-2 hover:text-blue-500">
            <Italic size={16} />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-2 hover:text-blue-500">
            <Underline size={16} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-2 hover:text-blue-500">
            <ListIcon size={16} />
          </button>
          <select onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()} className="p-2 border rounded">
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value='18px'>18px</option>
            <option value="20px">20px</option>
          </select>
          <button onClick={() => editor.chain().focus().setMark("textStyle", { color: "#000000" }).run()} className="p-2">
            <PaintBucket size={16} color="#000000" className="hover:opacity-80" />
          </button>
          <button onClick={() => editor.chain().focus().setMark("textStyle", { color: "#ff5733" }).run()} className="p-2">
            <PaintBucket size={16} color="#ff5733" className="hover:opacity-80" />
          </button>
          <button onClick={() => editor.chain().focus().setMark("textStyle", { color: "#3385ff" }).run()} className="p-2">
            <PaintBucket size={16} color="#3385ff" className="hover:opacity-80" />
          </button>

        <button className="ml-10 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onSave(content)}>
          Save Notes
        </button>
        </div>

        
      )}
      <EditorContent editor={editor} className="rounded p-2 min-h-[200px] outline-none overflow-y-auto max-h-[200px]" />
    </div>
  );
};

export default NotesEditor;
