import React from "react";
import pluginsList from "./toolbarIcons";
import Styles from "../../styles/components/toolbar.module.scss";
import useOnClick from "../../hooks/useOnClick";

function Toolbar() {
  const { onClick } = useOnClick();
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
    </div>
  );
}

export default Toolbar;
