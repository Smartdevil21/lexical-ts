import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

type HEADING_TYPES = "h1" | "h2" | "h3" | "h4";

export const HeadingsToolbarPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const headingTasgArr: HEADING_TYPES[] = ["h1", "h2", "h3"];
  const onClick = (tag: HEADING_TYPES) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };
  return (
    <>
      {headingTasgArr.map((tag, index) => (
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
