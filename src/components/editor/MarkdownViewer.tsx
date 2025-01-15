import {
  BoldItalicUnderlineToggles, CodeToggle, CreateLink, diffSourcePlugin, DiffSourceToggleWrapper,
  headingsPlugin, imagePlugin, InsertImage, InsertTable, linkDialogPlugin, linkPlugin,
  listsPlugin, ListsToggle, markdownShortcutPlugin,
  MDXEditor, MDXEditorMethods,
  quotePlugin, setMarkdown$, tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin, UndoRedo
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import {useEffect, useRef, useState} from "react";

import "./editor.css"

interface MarkdownViewerProps {
  contents: string,
}

export default function MarkdownViewer({contents}: MarkdownViewerProps) {
  const mdxEditorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (mdxEditorRef.current === null) return;
    mdxEditorRef.current.setMarkdown(contents);
  }, [contents]);

  return (
    <MDXEditor markdown={contents} ref={mdxEditorRef} readOnly={true} plugins={
      [headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkDialogPlugin(),
        linkPlugin(), imagePlugin(), tablePlugin(), markdownShortcutPlugin(),
      ]}
    />
  );
}