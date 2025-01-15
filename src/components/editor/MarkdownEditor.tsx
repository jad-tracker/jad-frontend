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

  useEffect(() => {
    if (mdxEditorRef.current === null) return;
    mdxEditorRef.current.setMarkdown(contents);
  }, [contents]);

  const handle = (currentValue: string) => setContents(currentValue);

  return (
    <MDXEditor markdown={contents} ref={mdxEditorRef} onChange={handle} autoFocus={true} plugins={
      [headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkDialogPlugin(),
        linkPlugin(), imagePlugin(), tablePlugin(), markdownShortcutPlugin(),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
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
            <InsertCodeBlock/>
            <CreateLink/>
            <InsertTable/>
            <InsertImage/>
          </DiffSourceToggleWrapper>
        )

      })]
    } />
  );
}