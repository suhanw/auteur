import React from 'react';
import FollowPopover from './follow_popover';


export const showPopover = function (componentContext, popoverState) {
  return function (event) {
    // console.log('mouseover', event.currentTarget);
    event.stopPropagation();
    const elPosY = event.currentTarget.getBoundingClientRect().top; // y coord measured from top of element
    const elPosX = event.currentTarget.getBoundingClientRect().left; // x coord measured from left of element
    const elHeight = event.currentTarget.clientHeight; // height of element
    const elWidth = event.currentTarget.clientWidth; // width of element
    const posY = elPosY + elHeight; // popover is position right below the hover link
    const posX = elPosX + (elWidth / 2) - 140; // width of popover is 280, this will center popover relative to hover link
    const paddingTop = 10; // so that visible part of popover looks below hover link
    let newState = {
      [popoverState]: {
        posY,
        posX,
        paddingTop
      }
    };
    componentContext.setState(newState);
  };
}

export const hidePopover = function (componentContext, popoverState) {
  return function (event) {

    event.stopPropagation();

    if (event.relatedTarget.className === 'follow-popover') return; // if cursor moves from link to popover, do nothing

    let newState = { [popoverState]: null };
    componentContext.setState(newState);
  }
};

export const renderFollowPopover = function (componentContext, blogId, popoverState) {
  const popover = componentContext.state[popoverState];
  // TODO: position popover so that it's always within viewport
  if (popover) {
    return (
      <FollowPopover blogId={blogId}
        popover={popover}
        hidePopover={hidePopover(componentContext, popoverState)} />
    );
  }
  return null; // render nothing if popoverState is false
}