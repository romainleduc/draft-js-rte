import React from "react";
import { Popover } from "react-tiny-popover";
import { useAtomicMedia } from "draft-js-rte";

const EmbeddedLinkPopover = ({ onClickOutside, toggleButton, ...other }) => {
  const { insertAtomicEmbeddedLink } = useAtomicMedia({ strict: true });

  const handleSubmit = (event) => {
    event.preventDefault();

    const { link, width, height } = event.target;

    insertAtomicEmbeddedLink(
      {
        src: link.value,
        width: width.value,
        height: height.value
      },
      onClickOutside
    );
  };

  return (
    <Popover
      positions={["bottom"]}
      onClickOutside={onClickOutside}
      align="start"
      padding={10}
      content={() => (
        <form onSubmit={handleSubmit}>
          <h2>Embedded Link</h2>
          <input name="link" type="text" placeholder="Enter link" required />
          <div>
            <input name="height" type="text" placeholder="Height" />
            <input
              className="DraftEditor-width"
              name="width"
              type="text"
              placeholder="Width"
            />
          </div>
          <button type="submit">Add</button>
        </form>
      )}
      {...other}
    >
      {toggleButton}
    </Popover>
  );
};

export default EmbeddedLinkPopover;
