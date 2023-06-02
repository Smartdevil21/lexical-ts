import React, { useEffect } from "react";
import Styles from "../styles/components/editor.module.scss";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary, {
  LexicalErrorBoundaryProps,
} from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $createTextNode, $getRoot, EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";

const theme = {
  text: {
    bold: Styles.bold,
  },
};

function MyHeadingPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const onClick = (e: React.MouseEvent): void => {
    editor.update(() => {
      const root = $getRoot();
      root.append(
        $createHeadingNode("h1").append($createTextNode("Enter Your Txt here!"))
      );
    });
  };
  return <button onClick={onClick}>Heading 1</button>;
}

function onError(error: Error): void {
  console.log(error.message);
}

function Editor(): JSX.Element {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MyHeadingPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className={Styles.editor} />}
        placeholder={<div>Enter your text here</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}

export default Editor;
