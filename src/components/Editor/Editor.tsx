import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import Styles from "../../styles/components/editor.module.scss";
import Toolbar from "../Toolbar/Toolbar";
import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import ImagesPlugin from "../../plugings/imagePlugin/ImagePlugin";
import { ImageNode } from "../../plugings/imagePlugin/nodes/ImageNodes";

const theme = {
  text: {
    bold: Styles.bold,
    underline: Styles.underline,
    italic: Styles.italic,
    linethrough: Styles.strikethrough,
    code: Styles.code,
  },
  quote: Styles.quote,
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

function onError(error: Error) {
  console.error(error);
}

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      QuoteNode,
      LinkNode,
      ImageNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className={Styles.editor} />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <LinkPlugin />
      <ImagesPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
