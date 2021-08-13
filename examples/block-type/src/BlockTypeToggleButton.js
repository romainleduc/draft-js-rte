import React from "react";
import { useBlockType } from "draft-js-rte";
import clsx from "clsx";

const BlockTypeToggleButton = ({ className, value, ...other }) => {
  const { selected, ...blockTypeProps } = useBlockType(value);

  return (
    <span
      className={clsx(
        className,
        "RichEditor-styleButton",
        selected && "RichEditor-activeButton"
      )}
      {...other}
      {...blockTypeProps}
    />
  );
};

export default BlockTypeToggleButton;
