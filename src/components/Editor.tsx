import React, { useEffect } from "react";
import Styles from "../styles/components/editor.module.scss";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary, {
  LexicalErrorBoundaryProps,
} from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const theme = {};

function onError(error: Error): void {
  console.log(error.message);
}

function onChnageFunc(editorState: EditorState) {
  console.log(editorState);
}

function MyOnChangePlugin(props: {
  onChnage: (editorState: EditorState) => void;
}): null {
  const { onChnage } = props;
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChnage(editorState);
    });
  }, [onChnage]);

  return null;
}

function Editor(): JSX.Element {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter your text here</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MyOnChangePlugin
        onChnage={(editorState: EditorState) => {
          console.log(editorState);
        }}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}

export default Editor;
