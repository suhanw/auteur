import React from 'react';
import FollowPopover from '../components/follows/follow_popover';

export const showPopover = function (componentContext, popoverState) {
  return function (event) {
    event.stopPropagation();
    let newState = { [popoverState]: true };
    componentContext.setState(newState);
  };
}

export const hidePopover = function (componentContext, hoverLink = true, popoverState) {
  return function (event) {
    event.stopPropagation();
    const elPosY = event.currentTarget.getBoundingClientRect().top; // y coord measured from top of element
    const elPosX = event.currentTarget.getBoundingClientRect().left; // x coord measured from left of element
    const elHeight = event.currentTarget.clientHeight; // height of element
    const elWidth = event.currentTarget.clientWidth; // width of element
    const cursorPosY = event.clientY; // y coord of cursor
    const cursorPosX = event.clientX; // x coord of cursor

    if (hoverLink && cursorPosY >= elPosY + elHeight) {
      return; // do nothing if cursor moves below the hover link
    } else if (!hoverLink) { // when hoverlink=false, this is the handler for the popover
      // cursor is within the currentTarget's area (parent element that represents entire popover area)
      if (cursorPosY <= elPosY + elHeight && // bottom bound of currentTarget
        cursorPosY >= (elPosY - 5) && // top bound of currentTarget
        cursorPosX >= elPosX && // left bound
        cursorPosX <= elPosX + elWidth) { // right bound
        return; // do nothing
      }
    }

    let newState = { [popoverState]: false };
    componentContext.setState(newState);
  }
};

export const renderFollowPopover = function (componentContext, blogId, popoverState) {
  const popover = componentContext.state[popoverState];
  // FIX: position popover so that it's always within viewport
  if (popover === true) {
    return (
      <FollowPopover blogId={blogId}
        hidePopover={hidePopover(componentContext, false, popoverState)} />
    );
  }
  return null; // render nothing if popoverState is false
}