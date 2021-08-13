import React from "react";
import { useTextAlign } from "draft-js-rte";
import clsx from "clsx";

const TextAlignToggleButton = ({ className, value, ...other }) => {
  const { selected, ...textAlignProps } = useTextAlign(value);

  return (
    <span
      className={clsx(
        className,
        "RichEditor-styleButton",
        selected && "RichEditor-activeButton"
      )}
      {...other}
      {...textAlignProps}
    />
  );
};

export default TextAlignToggleButton;
