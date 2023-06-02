import Styles from "../../styles/components/editor.module.scss";
import { HeadingsToolbarPlugin } from "./Headings.plugin";
import { ListToolbarPlugin } from "./List.plugin";

export const ToolbarPlugin = (): JSX.Element => {
  return (
    <div className={Styles.toolbar}>
      <HeadingsToolbarPlugin />
      <ListToolbarPlugin />
    </div>
  );
};
