import {
  BoldItalicUnderlineToggles, codeMirrorPlugin, CodeToggle, CreateLink, diffSourcePlugin, DiffSourceToggleWrapper,
  headingsPlugin, imagePlugin, InsertCodeBlock, InsertImage, InsertTable, linkDialogPlugin, linkPlugin,
  listsPlugin, ListsToggle, markdownShortcutPlugin,
  MDXEditor, MDXEditorMethods,
  quotePlugin, tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin, UndoRedo
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import {useEffect, useRef} from "react";

import "./editor.css"

interface MarkdownEditorProps {
  contents: string,
  setContents: (currentValue: string) => void,
  diffRevision: string
}

export default function MarkdownEditor({contents, diffRevision, setContents}: MarkdownEditorProps) {
  const mdxEditorRef = useRef<MDXEditorMethods>(null);


  const handle = (currentValue: string) => {setContents(currentValue); }

  return (
    <MDXEditor markdown={contents} ref={mdxEditorRef} onChange={handle} autoFocus={false} plugins={
      [headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkDialogPlugin(),
        linkPlugin(), imagePlugin(), tablePlugin(), markdownShortcutPlugin(),
        diffSourcePlugin({
          diffMarkdown: diffRevision,
          readOnlyDiff: true,
        }),

      toolbarPlugin({
        toolbarContents: () => (
          <DiffSourceToggleWrapper>
            {' '}
            <UndoRedo />
            <ListsToggle/>
            <BoldItalicUnderlineToggles />
            <CodeToggle/>
            <CreateLink/>
            <InsertTable/>
            <InsertImage/>
          </DiffSourceToggleWrapper>
        )

      })]
    } />
  );
}