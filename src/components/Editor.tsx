import React from "react";
import Styles from "../styles/components/editor.module.scss";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";

type HEADING_TYPES = "h1" | "h2" | "h3";
type LIST_TYPES = "ol" | "ul";

const theme = {
  heading: {
    h1: Styles.h1,
    h2: Styles.h2,
    h3: Styles.h3,
  },
  text: {
    bold: Styles.bold,
  },
};

function HeadingToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const headingTypeArr: HEADING_TYPES[] = ["h1", "h2", "h3"];
  const onClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: HEADING_TYPES
  ): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(type));
      }
    });
  };
  return (
    <div className={Styles.heading_btns}>
      {headingTypeArr.map((tag, index) => {
        return (
          <button
            key={index}
            onClick={(e) => {
              onClick(e, tag);
            }}
          >
            {tag.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function ListToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const listTypeArr: LIST_TYPES[] = ["ul", "ol"];
  const onClick = (tag: LIST_TYPES): void => {
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };
  return (
    <div className={Styles.heading_btns}>
      {listTypeArr.map((tag, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              onClick(tag);
            }}
          >
            {tag.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function ToolbarPlugin(): JSX.Element {
  return (
    <div className={Styles.toolbar}>
      <HeadingToolbarPlugin />
      <ListToolbarPlugin />
    </div>
  );
}

function onError(error: Error): void {
  console.log(error.message);
}

function Editor(): JSX.Element {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <ListPlugin />
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
