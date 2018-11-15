export const SCROLLING = 'SCROLLING';

export const detectScroll = function (scrollTop) {
  return {
    type: SCROLLING,
    payload: scrollTop,
  };
};