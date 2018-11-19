export const OPEN_POPOVER = 'OPEN_POPOVER';
export const CLOSE_POPOVER = 'CLOSE_POPOVER';

export const openPopover = function () {
  return {
    type: OPEN_POPOVER,
  };
};

export const closePopover = function () {
  return {
    type: CLOSE_POPOVER,
  };
};