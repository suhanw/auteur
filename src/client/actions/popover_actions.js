export const OPEN_POPOVER = 'OPEN_POPOVER';
export const CLOSE_POPOVER = 'CLOSE_POPOVER';

export const openPopover = function (popover) {
  return {
    type: OPEN_POPOVER,
    payload: popover,
  };
};

export const closePopover = function () {
  return {
    type: CLOSE_POPOVER,
  };
}