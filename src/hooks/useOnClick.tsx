import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { eventTypes } from "../components/Toolbar/toolbarIcons";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  GridSelection,
  NodeSelection,
  REDO_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { useCallback, useEffect, useState } from "react";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import useModal from "./useModal";
import { InsertImageDialog } from "../plugings/imagePlugin/ImagePlugin";

type HEADING_TYPES = "h1" | "h2" | "h3";
const LowPriority = 1;

const useOnClick = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isLink, setIsLink] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [modal, showModal] = useModal();

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (val: HEADING_TYPES) => {
    if (blockType !== val) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(val));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
      // below code insert the new block but we only need to format the specific part of the text into code format
      //   editor.update(() => {
      //     const selection = $getSelection();

      //     if ($isRangeSelection(selection)) {
      //       $setBlocksType(selection, () => $createCodeNode());
      //     }
      //   });
    }
  };

  const implementUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const implementRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  // const formatList = (listType: LIST_TYPES) => {
  //   editor.update(() => {
  //     if (listType === "ul") {
  //       editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  //     } else {
  //       editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  //     }
  //   });
  // };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onClick = (event: string) => {
    switch (event) {
      case eventTypes.formatBold:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case eventTypes.formatItalic:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case eventTypes.formatUnderline:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case eventTypes.formatStrike:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case eventTypes.formatAlignLeft:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case eventTypes.formatAlignRight:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case eventTypes.formatAlignCenter:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case eventTypes.h1:
        formatHeading("h1");
        break;
      case eventTypes.h2:
        formatHeading("h2");
        break;
      case eventTypes.ul:
        formatBulletList();
        break;
      case eventTypes.ol:
        formatNumberedList();
        break;
      case eventTypes.paragraph:
        formatParagraph();
        break;
      case eventTypes.formatCode:
        formatCode();
        break;
      case eventTypes.formatUndo:
        implementUndo();
        break;
      case eventTypes.formatRedo:
        implementRedo();
        break;
      case eventTypes.quote:
        formatQuote();
        break;
      case eventTypes.formatInsertLink:
        insertLink();
        break;
      case eventTypes.insertImage:
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={editor} onClose={onClose} />
        ));
        break;
      default:
        break;
    }
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    let allSelectedEvents = [...selectedEventTypes];

    // Logic for selecting event type of selection.
    const pushInEventTypesState = (selectionFormat: boolean, event: never) => {
      if (selectionFormat) {
        if (selectedEventTypes.includes(event)) return;
        else allSelectedEvents.push(event);
      } else {
        allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
      }
    };

    // Logic for setting block type of selection
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          setBlockType(type);
        }
      }
    }

    if ($isRangeSelection(selection)) {
      pushInEventTypesState(
        selection.hasFormat("bold"),
        eventTypes.formatBold as unknown as never
      );
      pushInEventTypesState(
        selection.hasFormat("italic"),
        eventTypes.formatItalic as unknown as never
      );
      pushInEventTypesState(
        selection.hasFormat("underline"),
        eventTypes.formatUnderline as unknown as never
      );
      pushInEventTypesState(
        selection.hasFormat("strikethrough"),
        eventTypes.formatStrike as unknown as never
      );
      pushInEventTypesState(
        selection.hasFormat("code"),
        eventTypes.formatCode as unknown as never
      );
    }

    const node = getSelectedNode(selection);
    const parent = node?.getParent();
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      if (
        !allSelectedEvents.includes(
          eventTypes.formatInsertLink as unknown as never
        )
      )
        allSelectedEvents.push(eventTypes.formatInsertLink as unknown as never);
      setIsLink(true);
    } else {
      if (
        allSelectedEvents.includes(
          eventTypes.formatInsertLink as unknown as never
        )
      ) {
        allSelectedEvents = allSelectedEvents.filter(
          (ev) => ev !== eventTypes.formatCode
        );
      }
      setIsLink(false);
    }

    setSelectedEventTypes(allSelectedEvents);
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return { onClick, isLink, editor, modal };
};

export default useOnClick;

// Helper function to get the node where the cursor is currently is.
function getSelectedNode(
  selection: RangeSelection | NodeSelection | GridSelection | null
) {
  if ($isRangeSelection(selection)) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
  }
}
