import React from "react";

const ToggleButtonGroup = ({ label, children }) => (
  <div className="RichEditor-toggleButtonGroup">
    <span className="RichEditor-toggleButtonGroup-span">{label}</span>
    <div>{children}</div>
  </div>
);

export default ToggleButtonGroup;
