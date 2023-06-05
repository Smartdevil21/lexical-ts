import pluginsList from "./toolbarIcons";
import Styles from "../../styles/components/toolbar.module.scss";
import useOnClick from "../../hooks/useOnClick";
import { createPortal } from "react-dom";
import FloatingLinkEditor from "../../plugings/floatingLinkEditor/FloatingLinkEditor";

function Toolbar() {
  const { onClick, isLink, editor, modal } = useOnClick();
  return (
    <div className={Styles.toolbar}>
      {pluginsList.map((plugin, index) => (
        <plugin.Icon
          key={index}
          onClick={() => {
            onClick(plugin.event);
          }}
        />
      ))}
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      {modal}
    </div>
  );
}

export default Toolbar;
