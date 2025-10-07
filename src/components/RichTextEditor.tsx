'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  LinkIcon,
  Undo,
  Redo,
} from '@/lib/icons';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input bg-transparent p-2">
      <Toggle
        size="sm"
        className="w-8"
        pressed={editor.isActive('paragraph')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <span className="font-bold">P</span>
      </Toggle>
      <Toggle
        size="sm"
        className="w-8"
        pressed={editor.isActive('heading', { level: 1 })}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <span className="font-bold">H1</span>
      </Toggle>
      <Toggle
        size="sm"
        className="w-8"
        pressed={editor.isActive('heading', { level: 2 })}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <span className="font-bold">H2</span>
      </Toggle>
      <Toggle
        size="sm"
        className="w-8"
        pressed={editor.isActive('heading', { level: 3 })}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <span className="font-bold">H3</span>
      </Toggle>

      <Separator orientation="vertical" className="h-8 w-[1px] mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('underline')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8 w-[1px] mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('link')}
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8 w-[1px] mx-1" />

      <Toggle
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onPressedChange={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  onBlur: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, onBlur }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'ProseMirror prose prose-sm max-w-none focus:outline-none p-4 min-h-[400px]',
          'dark:prose-invert'
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onBlur() {
      onBlur();
    },
  });

  return (
    <div className="rounded-md border border-input bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
