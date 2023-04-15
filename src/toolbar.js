import React from "react";
import ProfileIcon from "../src/assets/profileIcon.svg";
import SettingsIcon from "../src/assets/settingsIcon.svg";
function Toolbar() {
  return (
    <div className="toolbar">
      <div>
        <img src={ProfileIcon} alt="svg" />
      </div>
      <div>
        <img src={SettingsIcon} alt="svg" />
      </div>
    </div>
  );
}

export default Toolbar;
