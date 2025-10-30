'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type Props = {
  value?: JSONContent | string;
  onChange?: (json: JSONContent) => void;
  className?: string;
};

export default function RichEditor({ value, onChange, className }: Props) {
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: value ?? '',
      onUpdate: ({ editor }) => {
        onChange?.(editor.getJSON());
      },
      // Prevent SSR hydration mismatches
      immediatelyRender: false,
    },
    []
  );

  useEffect(() => {
    if (!editor || value === undefined) return;

    try {
      const current = editor.getJSON();
      const incoming =
        typeof value === 'string' ? (JSON.parse(value) as JSONContent) : (value as JSONContent);

      if (JSON.stringify(current) !== JSON.stringify(incoming)) {
        // ✅ TipTap v2 types: pass options object instead of boolean
        editor.commands.setContent(incoming, { emitUpdate: false });
      }
    } catch {
      if (typeof value === 'string') {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  return (
    <div className={className ?? 'border rounded-2xl p-2'}>
      <EditorContent editor={editor} />
    </div>
  );
}
