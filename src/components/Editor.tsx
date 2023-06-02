import Styles from "../styles/components/editor.module.scss";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundry from "@lexical/react/LexicalErrorBoundary";

import { HeadingNode } from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { ToolbarPlugin } from "../plugins/editor/Toolbar.plugin";

const onError = (error: Error) => {
  console.log(error.message);
};

const theme = {
  text: {
    bold: Styles.bold,
    underline: Styles.underline,
    italic: Styles.italic,
    linethrough: Styles.strikethrough,
  },
  list: {
    ol: Styles.ol,
    ul: Styles.ul,
  },
  heading: {
    h1: Styles.h1,
    h2: Styles.h2,
    h3: Styles.h3,
  },
  paragraph: Styles.p,
};

function Editor() {
  const initialConfig: InitialConfigType = {
    namespace: "MyPracticeEditor",
    onError,
    theme,
    nodes: [HeadingNode, ListNode, ListItemNode],
  };

  return (
    <div className={Styles.editor_wrapper}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <ListPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className={Styles.editor} />}
          placeholder={
            <div className={Styles.placeholder}>Enter your Text here</div>
          }
          ErrorBoundary={LexicalErrorBoundry}
        />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
}

export default Editor;
