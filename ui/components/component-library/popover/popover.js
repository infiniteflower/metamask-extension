import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PropTypes } from 'prop-types';
import { usePopper } from 'react-popper';
import classnames from 'classnames';
import { BorderRadius, Color } from '../../../helpers/constants/design-system';
import Box from '../../ui/box/box';
import { Button } from '..';
import { PopoverPosition } from '.';

export const Popover = ({
  children,
  // content,
  position = PopoverPosition.bottom,
  hasArrow = true,
  onClick = false,
  onHover = false,
  onFocus = false,
  matchWidth = false,
  preventOverflow = false,
  flip = false,
  className,
  ...props
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: position,
    modifiers: [
      {
        name: 'preventOverflow',
        enabled: position === 'auto' ? true : preventOverflow,
      },
      {
        name: 'flip',
        enabled: position === 'auto' ? true : flip,
      },
      {
        name: 'arrow',
        enabled: hasArrow,
        options: {
          element: arrowElement,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const contentStyle = {
    width: matchWidth ? referenceElement?.clientWidth : 'auto',
  };

  return (
    <>
      <div ref={setReferenceElement}>
        <Button onClick={() => setIsOpen(!isOpen)}>{children}</Button>
      </div>
      {
        // popperElement &&
        createPortal(
          <Box
            borderColor={Color.borderDefault}
            borderRadius={BorderRadius.XL}
            backgroundColor={Color.backgroundDefault}
            padding={4}
            className={classnames('popover', { 'popover--open': isOpen })}
            ref={setPopperElement}
            style={{ ...styles.popper, ...contentStyle }}
            {...attributes.popper}
          >
            {children} - This is the popper content
            {hasArrow && (
              <Box
                borderColor={Color.borderDefault}
                className={classnames('arrow')}
                ref={setArrowElement}
                style={styles.arrow}
                {...attributes.arrow}
              />
            )}
          </Box>,
          document.body,
        )
      }
    </>
  );
};

Popover.propTypes = {
  /**
   * The children to be rendered inside the Popover
   */
  children: PropTypes.node,
  /**
   * An additional className to apply to the Popover.
   */
  className: PropTypes.string,
  /**
   * Popover accepts all the props from Box
   */
  ...Box.propTypes,
};