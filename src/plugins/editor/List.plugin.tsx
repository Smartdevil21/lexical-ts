import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

type LIST_TYPES = "ul" | "ol";

export const ListToolbarPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const listTagsArr: LIST_TYPES[] = ["ol", "ul"];
  const onClick = (tag: LIST_TYPES) => {
    editor.update(() => {
      if (tag === "ol") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    });
  };
  return (
    <>
      {listTagsArr.map((tag, index) => (
        <button
          key={index}
          onClick={() => {
            onClick(tag);
          }}
        >
          {tag.toUpperCase()}
        </button>
      ))}
    </>
  );
};
