"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichEditor({
	value,
	onChange,
}: {
	value?: any;
	onChange?: (json: any) => void;
}) {
	const editor = useEditor({
		extensions: [StarterKit],
		content: value || "",
		onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
	});
	return (
		<div className="border rounded-2xl p-2">
			<EditorContent editor={editor} />
		</div>
	);
}
